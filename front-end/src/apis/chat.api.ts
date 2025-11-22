import { Conversation, GetMessagesResponse, Message } from '../types/chat.type'
import http from '../utils/http'
import { SuccessResponse } from '../types/utils.type'

const API_URL = 'conversations'

export const fetchConversations = async (page?: number, limit?: number): Promise<Conversation[]> => {
  const { data } = await http.get<SuccessResponse<Conversation[]>>(`${API_URL}/`, {
    params: {
      page: page || 1,
      limit
    }
  })
  return data.result
}

export const fetchPendingConversations = async (page?: number, limit?: number): Promise<Conversation[]> => {
  const { data } = await http.get<SuccessResponse<Conversation[]>>(`${API_URL}/pending`, {
    params: {
      page: page || 1,
      limit
    }
  })
  return data.result
}

export const fetchMessages = async ({
  conversationId,
  page
}: {
  conversationId: string
  page?: number
}): Promise<GetMessagesResponse> => {
  const { data } = await http.get<SuccessResponse<GetMessagesResponse>>(`${API_URL}/${conversationId}/messages`, {
    params: {
      page: page || 1
    }
  })
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

export const deleteMessage = async (messageId: string): Promise<Message> => {
  const { data } = await http.delete<SuccessResponse<Message>>(`${API_URL}/messages`, {
    data: {
      messageId
    }
  })
  return data.result
}

export const createConversation = async (recipientId: string): Promise<Conversation> => {
  const { data } = await http.post<SuccessResponse<Conversation>>(`${API_URL}/create`, {
    recipientId
  })
  return data.result
}

export const updateStatusParticipant = async (conversationId: string, newStatus: string) => {
  const { data } = await http.patch<SuccessResponse<Conversation>>(`${API_URL}/updateStatusParticipant`, {
    conversationId,
    newStatus
  })
  return data
}

export const deleteConversation = async (conversationId: string) => {
  const { data } = await http.patch<SuccessResponse<Conversation>>(`${API_URL}/delete/:${conversationId}`)
  return data
}
