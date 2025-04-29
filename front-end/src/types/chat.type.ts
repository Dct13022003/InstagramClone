import { User } from './user.type'

export interface Conversations {
  id?: string
  limit?: number
  page?: number
}

export interface Message {
  _id?: string
  senderId: string
  receiverId: string
  content: string
  conversation: string
  created_at?: string
  updated_at?: string
}

export interface Conversation {
  _id: string
  participants_info?: User[]
  last_message?: Message
  messages?: Message[]
  updated_at: string
  other_participants?: User[]
}
