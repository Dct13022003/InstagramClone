import mongoose, { Schema } from 'mongoose'

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId
  sender?: mongoose.Types.ObjectId
  type: 'text' | 'image' | 'video' | 'file' | 'system'
  content?: string
  media?: {
    url: string
    publicId?: string
    thumbnail?: string
  }
  replyTo?: mongoose.Types.ObjectId
  reactions?: {
    user: mongoose.Types.ObjectId
    emoji: string
  }[]
  seenBy?: mongoose.Types.ObjectId[]
  deletedBy?: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const messageSchema = new Schema<IMessage>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'file', 'system'],
      required: true
    },
    content: { type: String },
    media: {
      url: { type: String },
      publicId: { type: String },
      thumbnail: { type: String }
    },
    replyTo: { type: Schema.Types.ObjectId, ref: 'Message' },
    reactions: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        emoji: { type: String }
      }
    ],
    seenBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    deletedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
)

export const Message = mongoose.model<IMessage>('Message', messageSchema)
