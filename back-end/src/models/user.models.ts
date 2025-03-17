import mongoose, { Document, Schema, Types } from 'mongoose'
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
  posts: string[]
  bookmarks: string[]
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    gender: { type: String, enum: ['male', 'female'] },
    email_verify_token: { type: String, default: '' },
    forgot_password_token: { type: String, default: '' },
    verify: { type: String, enum: ['Unverified', 'Verified', 'Banned'], default: 'Unverified' },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
  },
  { timestamps: true }
)
export const User = mongoose.model<IUser>('User', userSchema)
