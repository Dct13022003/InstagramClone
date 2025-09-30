import bcrypt from 'bcrypt'
import { tokenType } from '~/constants/enum'
import { User } from '~/models/user.models'
import { RefreshToken } from '~/models/refreshToken.models'
import { signToken } from '~/utils/jwt'
import dotenv from 'dotenv'
import { ObjectId } from 'mongodb'
import { Follow } from '~/models/follow.models'
import { Post } from '~/models/post.models'
import { Comment } from '~/models/comment.models'
dotenv.config()
class UserService {
  private signAccessToken({ user_id, verify }: { user_id: string; verify: string }) {
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.AccessToken,
        verify
      },
      options: {
        expiresIn: '30m'
      }
    })
  }
  private signRefreshToken({ user_id, verify }: { user_id: string; verify: string }) {
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.RefreshToken,
        verify
      },
      options: {
        expiresIn: '100d'
      }
    })
  }
  private signEmailVerifyToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.EmailVerifyToken
      },
      privateKey: process.env.SECRET_KEY_EMAIL_VERIFICATION as string,
      options: {
        expiresIn: '100d'
      }
    })
  }
  private signForgotPasswordToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.ForgotToken
      },
      privateKey: process.env.SECRET_KEY_FORGOT_PASSWORD as string,
      options: {
        expiresIn: '2d'
      }
    })
  }
  signAccessAndRefreshToken(user_id: string, verify: string) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }
  async register(payload: { email: string; password: string; username: string; fullname: string }) {
    const { email, password, username, fullname } = payload
    const hash_password = await bcrypt.hash(password, 10)
    const user_id = new ObjectId()
    const emailVerifyToken = await this.signEmailVerifyToken(user_id.toString())
    await User.create({
      _id: user_id,
      username,
      fullname,
      email,
      email_verify_token: emailVerifyToken,
      password: hash_password
    })
    console.log(emailVerifyToken)
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id.toString(), 'Unverified')
    await RefreshToken.create({ user_id, token: refresh_token })
    return { access_token, refresh_token }
  }

  async login(user_id: string, verify: string) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id, verify)
    await RefreshToken.create({ user_id: new ObjectId(user_id), token: refresh_token })
    const user = await User.findById(user_id).select('-password -email_verify_token -forgot_password_token')

    return { access_token, refresh_token, user }
  }

  async checkEmail(email: string) {
    const user = await User.findOne({ email })
    if (user) {
      return Boolean(user)
    }
  }
  async logout(refresh_token: string) {
    await RefreshToken.deleteOne({
      token: refresh_token
    })
  }
  async emailVerify(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessAndRefreshToken(user_id, 'Verified'),
      User.findByIdAndUpdate(
        user_id,
        { email_verify_token: '', verify: 'Verified' },
        { new: true, runValidators: true }
      )
    ])
    const [, refresh_token] = token
    await RefreshToken.create({ user_id: new ObjectId(user_id), token: refresh_token })
  }
  async resendEmailVerify(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken(user_id)
    await User.findByIdAndUpdate(
      user_id,
      { email_verify_token: email_verify_token },
      { new: true, runValidators: true }
    )
  }
  async forgotPassword(user_id: string) {
    const forgot_password_token = await this.signForgotPasswordToken(user_id)
    await User.findByIdAndUpdate(
      user_id,
      {
        forgot_password_token: forgot_password_token
      },
      { new: true, runValidators: true }
    )
    console.log(forgot_password_token)
  }

  async resetPassword(user_id: string, password: string) {
    const hash_password = await bcrypt.hash(password, 10)
    await User.findByIdAndUpdate(
      user_id,
      {
        password: hash_password
      },
      { new: true, runValidators: true }
    )
  }

  async getProfile(username: string, currentUserId: string) {
    const user = await User.findOne({ username }, { password: 0, email_verify_token: 0, forgot_password_token: 0 })

    if (!user) {
      throw new Error('User not found')
    }

    const [followingCount, followerCount, isFollowed] = await Promise.all([
      Follow.countDocuments({ follower: user._id }),
      Follow.countDocuments({ following: user._id }),
      Follow.exists({ follower: currentUserId, following: user._id }) // check follow
    ])

    return {
      user,
      followingCount,
      followerCount,
      isFollowed: Boolean(isFollowed) // convert sang true/false
    }
  }

  async updateProfile(user_id: string, payload: any) {
    const user = await User.findByIdAndUpdate(
      user_id,
      {
        ...payload
      },
      {
        new: true,
        projection: {
          username: 1,
          email: 1,
          profilePicture: 1,
          bio: 1,
          gender: 1
        }
      }
    )
    return user
  }

  async changePassword(password: string, user_id: string) {
    const hash_password = await bcrypt.hash(password, 10)
    await User.findByIdAndUpdate(user_id, { password: hash_password }, { new: true, runValidators: true })
  }

  async refreshToken(user_id: string, verify: string, refresh_token: string) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify }),
      RefreshToken.findOneAndDelete({ token: refresh_token })
    ])
    await RefreshToken.create({ user_id: new ObjectId(user_id), token: new_refresh_token })
    return { new_access_token, new_refresh_token }
  }

  async uploadAvatar(user_id: string, avatar_url: string) {
    const avatar_user = await User.findByIdAndUpdate(
      user_id,
      {
        profilePicture: avatar_url
      },
      {
        new: true,
        projection: {
          profilePicture: 1
        }
      }
    )
    return avatar_user
  }
  async getAllPostByUser(user_name: string, page: number, limit: number) {
    const user = await User.findOne({ username: user_name }).select('_id')
    if (!user) throw new Error('User not found')

    const posts = await Post.find({ author: user._id })
      .select('-__v -author -updatedAt -hashtags -mentions -likes') // bỏ likes nếu muốn
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()

    const totalPosts = await Post.countDocuments({ author: user._id })
    const hasNextPage = page * limit < totalPosts

    if (posts.length === 0) return { posts: [], hasNextPage: null }

    return {
      posts: posts,
      hasNextPage,
      nextPage: hasNextPage ? page + 1 : null
    }
  }
}
const userService = new UserService()
export default userService
