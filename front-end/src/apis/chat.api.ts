// src/api/messageApi.ts
import axios from 'axios'
import { Conversation, Message } from '../types/chat.type'
import http from '../utils/http'
import { SuccessResponse } from '../types/utils.type'

const API_URL = 'inbox'

// export const fetchConversations = async (
//   userId: string,
//   limit?: number
// ): Promise<{ conversations: Conversation[]; totalCount: number }> => {
//   const { data } = await axios.get(`${API_URL}/conversations`, {
//     params: {
//       userId,
//       limit
//     }
//   })
//   return data
// }

export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  const { data } = await http.get<SuccessResponse<Message[]>>(`${API_URL}/conversations/${conversationId}`)
  return data.data
}

export const sendMessage = async (message: {
  text: string
  senderId: string
  receiverId: string
}): Promise<Message> => {
  const { data } = await axios.post<Message>(`${API_URL}/messages`, message)
  return data
}
