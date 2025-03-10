import { Request } from 'express'
import { IUser } from '~/models/user.models'
declare module 'express' {
  interface Request {
    user?: IUser
  }
}
