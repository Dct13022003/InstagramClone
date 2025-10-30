import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { fetchConversations, fetchMessages } from '../apis/chat.api'
import { Conversation, GetMessagesResponse } from '../types/chat.type'

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
