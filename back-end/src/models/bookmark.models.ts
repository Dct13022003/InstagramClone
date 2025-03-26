import mongoose, { ObjectId, Schema, Types } from 'mongoose'
import { Document } from 'mongoose'

export interface IBookMark extends Document {
  user_id: ObjectId
  post_id: ObjectId
}

const bookmarkSchema = new Schema<IBookMark>(
  {
    user_id: { type: Types.ObjectId, required: true, ref: 'User' },
    post_id: { type: Types.ObjectId, required: true, ref: 'Post' }
  },
  { timestamps: true, collection: 'posts' }
)

export const Bookmark = mongoose.model<IBookMark>('Bookmark', bookmarkSchema)
