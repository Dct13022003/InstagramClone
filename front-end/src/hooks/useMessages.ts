import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { fetchMessages, sendMessage } from '../apis/chat.api'
import { Conversation, Message } from '../types/chat.type'
import { SuccessResponse } from '../types/utils.type'

export const useConversations = (userId: string) => {
  return useQuery<Conversation[]>({
    queryKey: ['conversations', userId],
    queryFn: () => fetchConversations(userId)
  })
}

export const useMessages = (conversationId: string) => {
  return useQuery<Message[]>({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: !!conversationId
  })
}

export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (newMessage, variables) => {
      queryClient.setQueryData<Message[]>(['messages', variables.conversationId], (oldMessages = []) => [
        ...oldMessages,
        newMessage
      ])
    }
  })
}
