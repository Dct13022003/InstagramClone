import { User } from './user.type'

export interface Message {
  _id?: string
  sender: User
  type: 'text' | 'image' | 'video' | 'file'
  content?: string
  conversation: string
  media?: any
  seenBy?: string[]
  replyTo?: Message
  createdAt?: string
  updatedAt?: string
}

export interface Conversation {
  _id: string
  type: 'private' | 'group'
  participants: User[]
  last_message?: Message
  createdAt: string
  updatedAt: string
  displayName: string
  displayAvatar: string
}

export interface GetMessagesResponse {
  messages: Message[]
  hasNextPage: boolean
}
