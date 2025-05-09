import { JwtPayload } from 'jsonwebtoken'
import { tokenType } from '~/constants/enum'

export interface RegisterReqBody {
  username: string
  email: string
  password: string
  confirm_password: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: tokenType
  verify?: string
}

export interface UpdateProfile {
  bio: string
  gender: string
  profilePicture: string
}
