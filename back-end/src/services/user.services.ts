import bcrypt from 'bcrypt'
import { tokenType } from '~/constants/enum'
import { User } from '~/models/user.models'
import { RefreshToken } from '~/models/refreshToken.model'
import { signToken } from '~/utils/jwt'

class UserService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.AccessToken
      }
    })
  }
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.RefreshToken
      }
    })
  }
  signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }
  async register(payload: { email: string; password: string; username: string }) {
    const { email, password, username } = payload
    const hashpassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      username,
      email,
      password: hashpassword
    })
    const user_id = user._id.toString()
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
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
}
const userService = new UserService()
export default userService
