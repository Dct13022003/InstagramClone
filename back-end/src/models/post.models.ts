import mongoose, { Document, ObjectId, Schema, Types } from 'mongoose'
export interface IPost extends Document {
  caption: string
  images: string[]
  isDeleted?: boolean
  author: ObjectId
  hashtags: ObjectId[]
  mentions: ObjectId[]
  likesCount: number
  commentsCount: number
  createdAt: Date
  updatedAt: Date
}
const postSchema = new Schema<IPost>(
  {
    caption: { type: String, default: '' },
    images: [{ type: String, required: true }],
    author: { type: Types.ObjectId, required: true, ref: 'User' },
    hashtags: [{ type: Types.ObjectId, ref: 'Hashtag' }],
    isDeleted: { type: Boolean, default: false },
    mentions: [{ type: Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 }
  },
  { timestamps: true, collection: 'posts' }
)

postSchema.index({ createdAt: -1 })
postSchema.index({ author: 1, createdAt: -1 })
postSchema.index({ likesCount: -1, commentsCount: -1, createdAt: -1 })
export const Post = mongoose.model<IPost>('Post', postSchema)
