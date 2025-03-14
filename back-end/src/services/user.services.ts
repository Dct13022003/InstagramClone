import bcrypt from 'bcrypt'
import { tokenType } from '~/constants/enum'
import { User } from '~/models/user.models'
import { RefreshToken } from '~/models/refreshToken.model'
import { signToken } from '~/utils/jwt'
import dotenv from 'dotenv'
import { ObjectId } from 'mongodb'
dotenv.config()
class UserService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.AccessToken
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
  signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
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
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id.toString())
    await RefreshToken.create({ user_id, token: refresh_token })
    return { access_token, refresh_token }
  }
  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
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
    await User.findByIdAndUpdate(
      user_id,
      { email_verify_token: '', verify: 'Verified' },
      { new: true, runValidators: true }
    )
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
}
const userService = new UserService()
export default userService
