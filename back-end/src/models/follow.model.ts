import mongoose, { Document, Schema, Types } from 'mongoose'
export interface IFollow extends Document {
  follower: Types.ObjectId
  following: Types.ObjectId
}
const followSchema = new Schema<IFollow>(
  {
    follower: { type: Schema.Types.ObjectId, ref: 'User' },
    following: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
)
export const Follow = mongoose.model<IFollow>('Follow', followSchema)
