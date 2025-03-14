import mongoose, { Document, Schema, Types } from 'mongoose'
import { IRefreshToken } from './refreshToken.model'
export interface IUser extends Document {
  _id: Types.ObjectId
  username: string
  email: string
  password: string
  day_of_birth?: Date
  profilePicture?: string
  bio?: string
  gender?: 'male' | 'female'
  email_verify_token: string
  forgot_password_token: string
  verify?: 'Unverified' | 'Verified' | 'Banned'
  followers: IUser[]
  following: IUser[]
  posts: string[]
  bookmarks: string[]
  refresh_token: IRefreshToken[]
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    day_of_birth: { type: Date, default: '' },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    gender: { type: String, enum: ['male', 'female'] },
    email_verify_token: { type: String, default: '' },
    forgot_password_token: { type: String, default: '' },
    verify: { type: String, enum: ['Unverified', 'Verified', 'Banned'], default: 'Unverified' },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    refresh_token: [{ type: Schema.Types.ObjectId, ref: 'RefreshToken' }]
  },
  { timestamps: true }
)
export const User = mongoose.model<IUser>('User', userSchema)
