import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { fetchConversations, fetchMessages, sendMessage } from '../apis/chat.api'
import { Conversation, GetMessagesResponse, Message } from '../types/chat.type'

export const useConversations = () => {
  return useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: () => fetchConversations(1, 2)
  })
}

export const useMessages = (conversationId: string) => {
  return useInfiniteQuery<GetMessagesResponse, Error>({
    queryKey: ['messages', conversationId],
    queryFn: ({ pageParam = 1 }) => fetchMessages({ conversationId, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Assuming fetchMessages returns an object like { messages: Message[], hasNextPage: boolean }
      // If not, adjust this logic based on your actual API response
      // For now, let's assume the API returns an array and we fetch until the array is empty
      return lastPage.messages.length === 10 ? allPages.length + 1 : undefined
    }
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
