import { Request } from 'express'
import { IUser } from '~/models/user.models'
import { TokenPayload } from './models/request/user.request'
declare module 'express' {
  interface Request {
    user?: IUser
    decode_authorization?: TokenPayload
    decode_refresh_token?: TokenPayload
    decode_email_verify_token?: TokenPayload
    decode_forgot_password_token?: TokenPayload
  }
}
