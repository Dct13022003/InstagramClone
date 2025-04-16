import { User } from './user.type'

export interface Conversations {
  id?: string
  limit?: number
  page?: number
}

export interface Message {
  _id?: string
  sender_id: string
  receiver_id: string
  content: string
  conversation_id: string
  created_at?: string
  updated_at?: string
}

export interface Conversation {
  _id: string
  participants_info?: User[]
  last_message?: Message
  messages?: Message[]
  updated_at: string
  other_participant?: User
}
