import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchConversations, fetchMessages, sendMessage } from '../apis/chat.api'
import { Conversation, Message } from '../types/chat.type'

export const useConversations = () => {
  return useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: () => fetchConversations(1, 2)
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
      queryClient.setQueryData<Message[]>(['messages', variables.conversation], (oldMessages = []) => [
        ...oldMessages,
        newMessage
      ])
    }
  })
}
