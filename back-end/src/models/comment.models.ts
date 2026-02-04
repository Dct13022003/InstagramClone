import mongoose, { ObjectId, Schema } from 'mongoose'

export interface IComment extends Document {
  text: string
  author: ObjectId
  post_id: ObjectId
  parent_id: ObjectId
  mentions: ObjectId[]
  likes: ObjectId[]
  isDelete: boolean
  repliesCount: number
}

const commentSchema = new Schema<IComment>(
  {
    text: { type: String, require: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post_id: { type: Schema.Types.ObjectId, ref: ' Post', required: true },
    parent_id: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isDelete: { type: Boolean, default: false },
    repliesCount: { type: Number, default: 0 }
  },
  { timestamps: true }
)

export const Comment = mongoose.model<IComment>('Comment', commentSchema)
