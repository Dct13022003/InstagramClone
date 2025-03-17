import { JwtPayload } from 'jsonwebtoken'
import { tokenType } from '~/constants/enum'

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: tokenType
}

export interface UpdateProfile {
  bio: string
  gender: string
  profilePicture: string
}
