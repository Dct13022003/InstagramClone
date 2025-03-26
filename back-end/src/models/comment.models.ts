import mongoose, { ObjectId, Schema } from 'mongoose'

export interface IComment extends Document {
  text: string
  author: ObjectId
  post_id: ObjectId
  parent_id: ObjectId
  mentions: string[]
  likes: string[]
}

const commentSchema = new Schema<IComment>(
  {
    text: { type: String, require: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post_id: { type: Schema.Types.ObjectId, ref: ' Post', required: true },
    parent_id: { type: Schema.Types.ObjectId, ref: 'Comment', required: true },
    mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
)

export const Comment = mongoose.model<IComment>('Comment', commentSchema)
