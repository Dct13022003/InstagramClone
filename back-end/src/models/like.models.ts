import mongoose, { ObjectId, Schema, Types } from 'mongoose'
import { Document } from 'mongoose'

export interface ILike extends Document {
  user_id: ObjectId
  post_id: ObjectId
}

const likeSchema = new Schema<ILike>(
  {
    user_id: { type: Types.ObjectId, required: true, ref: 'User' },
    post_id: { type: Types.ObjectId, required: true, ref: 'Post' }
  },
  { timestamps: true, collection: 'posts' }
)

export const Like = mongoose.model<ILike>('Like', likeSchema)
