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
  createdAt?: string
  updatedAt?: string
}

export interface Conversation {
  _id: string
  participants_info?: User[]
  last_message?: Message
  messages?: Message[]
  updated_at: string
  other_participants?: User[]
}

export interface GetMessagesResponse {
  messages: Message[]
  hasNextPage: boolean
}
