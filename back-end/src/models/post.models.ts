import mongoose, { Document, ObjectId, Schema, Types } from 'mongoose'
export interface IPost extends Document {
  caption: string
  images: string[]
  author: ObjectId
  hashtags: ObjectId[]
  mentions: ObjectId[]
  likesCount: number
  commentsCount: number
}
const postSchema = new Schema<IPost>(
  {
    caption: { type: String, default: '' },
    images: [{ type: String, required: true }],
    author: { type: Types.ObjectId, required: true, ref: 'User' },
    hashtags: [{ type: Types.ObjectId, ref: 'Hashtag' }],
    mentions: [{ type: Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 }
  },
  { timestamps: true, collection: 'posts' }
)

export const Post = mongoose.model<IPost>('Post', postSchema)
