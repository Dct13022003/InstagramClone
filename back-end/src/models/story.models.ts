import mongoose, { Document, ObjectId, Schema, Types } from 'mongoose'
export interface IStory extends Document {
  mediaUrl: string
  author: ObjectId
  mediaType: string
  viewedBy?: ObjectId[]
  duration?: number
  expiresAt?: Date
}
const storySchema = new Schema<IStory>(
  {
    mediaUrl: { type: String, required: true },
    author: { type: Types.ObjectId, required: true, ref: 'User' },
    mediaType: { type: String, required: true },
    viewedBy: [{ type: Types.ObjectId, ref: 'User', default: [] }],
    duration: { type: Number, default: 5000 },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) }
  },
  { timestamps: true, collection: 'stories' }
)

storySchema.index({ author: 1, expiresAt: 1 })

export const Story = mongoose.model<IStory>('Story', storySchema)
