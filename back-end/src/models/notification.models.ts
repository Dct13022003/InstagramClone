import mongoose, { Schema } from 'mongoose'

export interface INotification extends Document {
  receiverId: mongoose.Types.ObjectId
  senderId: mongoose.Types.ObjectId
  type: string
  entityId: mongoose.Types.ObjectId
  content: string
  isSeen: boolean
  createdAt: Date
  updatedAt: Date
}

const notificationSchema = new Schema<INotification>(
  {
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId },
    content: { type: String },
    isSeen: { type: Boolean, default: false }
  },
  { timestamps: true }
)

export const Notification = mongoose.model<INotification>('Notification', notificationSchema)
