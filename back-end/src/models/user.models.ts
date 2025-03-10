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
    verify: { type: String, enum: ['Unverified', 'Verified', 'Banned'] },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    refresh_token: [{ type: Schema.Types.ObjectId, ref: 'RefreshToken' }]
  },
  { timestamps: true }
)
export const User = mongoose.model<IUser>('User', userSchema)
