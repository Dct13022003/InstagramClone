import { Conversation, Message } from '../types/chat.type'
import http from '../utils/http'
import { SuccessResponse } from '../types/utils.type'

const API_URL = 'inbox'

export const  fetchConversations = async (page?: number, limit?: number): Promise<Conversation[]> => {
  const { data } = await http.get<SuccessResponse<Conversation[]>>(`${API_URL}/`, {
    params: {
      page: page || 1,
      limit
    }
  })
  return data.result
}

export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  const { data } = await http.get<SuccessResponse<Message[]>>(`${API_URL}/conversations/${conversationId}`)
  return data.result
}

export const sendMessage = async (message: {
  content: string
  senderId: string
  receiverId: string
  conversation: string
}): Promise<Message> => {
  const { data } = await http.post<Message>(`${API_URL}/messages`, message)
  return data
}
