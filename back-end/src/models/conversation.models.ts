import mongoose from 'mongoose'

const participantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['accepted', 'pending', 'blocked'],
    default: 'accepted'
  },
  role: {
    type: String,
    enum: ['creator', 'member'],
    default: 'member'
  },
  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date, default: null },
  last_seen_at: { type: Date, default: null }
})

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['private', 'group'],
      default: 'private'
    },
    participants: [participantSchema],
    name: { type: String, default: null },
    last_message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
  },
  {
    timestamps: true
  }
)
conversationSchema.index({ 'participants.user': 1, type: 1 }, { unique: false })

export const Conversation = mongoose.model('Conversation', conversationSchema)
