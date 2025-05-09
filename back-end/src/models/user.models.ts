import mongoose, { Document, Schema, Types } from 'mongoose'
export interface IUser extends Document {
  _id: Types.ObjectId
  username: string
  fullname: string
  email: string
  password: string
  profilePicture?: string
  bio?: string
  gender?: 'male' | 'female'
  email_verify_token: string
  forgot_password_token: string
  verify?: 'Unverified' | 'Verified' | 'Banned'
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    gender: { type: String, enum: ['male', 'female'] },
    email_verify_token: { type: String, default: '' },
    forgot_password_token: { type: String, default: '' },
    verify: { type: String, enum: ['Unverified', 'Verified', 'Banned'], default: 'Unverified' }
  },
  { timestamps: true }
)
export const User = mongoose.model<IUser>('User', userSchema)
