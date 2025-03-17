import mongoose, { Document, Schema, Types } from 'mongoose'
export interface IFollow extends Document {
  _id: Types.ObjectId
  follower: Types.ObjectId
  following: Types.ObjectId
}
const followSchema = new Schema<IFollow>(
  {
    _id: Types.ObjectId,
    follower: { type: Schema.Types.ObjectId, ref: 'User' },
    following: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
)
export const Follow = mongoose.model<IFollow>('Follow', followSchema)
