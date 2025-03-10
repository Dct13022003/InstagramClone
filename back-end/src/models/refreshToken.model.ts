import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IRefreshToken extends Document {
  _id: Types.ObjectId
  user_id: Types.ObjectId
  token: string
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true }
  },
  { timestamps: true }
)

export const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema)
