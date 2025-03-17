import bcrypt from 'bcrypt'
import { tokenType } from '~/constants/enum'
import { User } from '~/models/user.models'
import { RefreshToken } from '~/models/refreshToken.model'
import { signToken } from '~/utils/jwt'
import dotenv from 'dotenv'
import { ObjectId } from 'mongodb'
import { Follow } from '~/models/follow.model'
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
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.RefreshToken
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
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken(user_id)])
  }
  async register(payload: { email: string; password: string; username: string }) {
    const { email, password, username } = payload
    const hash_password = await bcrypt.hash(password, 10)
    const user_id = new ObjectId()
    const emailVerifyToken = await this.signEmailVerifyToken(user_id.toString())
    await User.create({
      _id: user_id,
      username,
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
    await RefreshToken.create({ user_id, token: refresh_token })
    return { access_token, refresh_token }
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
    await Promise.all([
      this.signAccessAndRefreshToken(user_id, 'Verified'),
      User.findByIdAndUpdate(
        user_id,
        { email_verify_token: '', verify: 'Verified' },
        { new: true, runValidators: true }
      )
    ])
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

  async getProfile(user_id: string) {
    const user = await User.findById(user_id, {
      password: 0,
      email_verify_token: 0,
      forgot_password_token: 0
    })
    return user
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

  async follow(user_id: string, user_id_follow: string) {
    await Follow.create({
      follower: user_id,
      following: user_id_follow
    })
  }
}
const userService = new UserService()
export default userService
