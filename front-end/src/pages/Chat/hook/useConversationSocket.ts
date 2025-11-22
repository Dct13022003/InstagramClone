import { useContext, useEffect, useState } from 'react'
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AppContext } from '../../../context/app.context'
import { Conversation, GetMessagesResponse, Message } from '../../../types/chat.type'
import {
  fetchConversations,
  fetchMessages,
  fetchPendingConversations,
  updateStatusParticipant
} from '../../../apis/chat.api'
import { useNavigate } from 'react-router-dom'

type TypingUser = {
  _id: string
  profilePicture: string
  profileUsername: string
}
export function useConversationSocket(conversationId, currentUser, profile) {
  const queryClient = useQueryClient()
  const { socket } = useContext(AppContext)
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])

  useEffect(() => {
    if (!socket) return

    const handleConnect = () => {
      console.log('Socket connected!')
      socket.emit('join-conversation', conversationId)
    }

    const handleIncomingMessage = (msg: Message) => {
      if (msg.conversation === conversationId) {
        queryClient.setQueryData(['messages', conversationId], (old: InfiniteData<GetMessagesResponse> | undefined) => {
          if (!old) return old
          return {
            ...old,
            pages: [
              {
                ...old.pages[0],
                messages: old.pages[0].messages.map((m, i) => (i === 0 ? msg : m))
              },
              ...old.pages.slice(1)
            ]
          }
        })
      }
    }

    const handleRecallMessage = (msg: Message) => {
      if (msg.conversation == conversationId) {
        queryClient.setQueryData(['messages', conversationId], (old: InfiniteData<GetMessagesResponse> | undefined) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              messages: page.messages.filter((m) => m._id !== msg._id)
            }))
          }
        })
      }
    }

    socket.emit('join-conversation', conversationId)
    socket.on('message-deleted', handleRecallMessage)
    socket.on('new-message', handleIncomingMessage)
    socket.on('connect', handleConnect)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('message-deleted', handleRecallMessage)
      socket.off('new-message', handleIncomingMessage)
      socket.emit('leave-conversation', conversationId)
    }
  }, [socket, conversationId])

  useEffect(() => {
    if (!socket) return

    const handleDisplayTyping = ({
      senderUser,
      isTyping,
      roomId
    }: {
      senderUser: TypingUser
      isTyping: boolean
      roomId: string
    }) => {
      if (roomId === conversationId && senderUser._id !== currentUser) {
        setTypingUsers((prev) => {
          if (isTyping) {
            const exists = prev.some((u) => u._id === senderUser._id)
            if (!exists) {
              return [...prev, senderUser]
            }
            return prev
          } else {
            return prev.filter((u) => u._id !== senderUser._id)
          }
        })
      }
    }

    socket.on('display_typing', handleDisplayTyping)
    return () => {
      socket.off('display_typing', handleDisplayTyping)
    }
  }, [socket, conversationId])
  return { typingUsers }
}

export const useConversations = (mode: { mode: 'normal' | 'request' } | undefined) => {
  return useQuery<Conversation[]>({
    queryKey: ['conversations', mode?.mode],
    queryFn: () => (mode && mode.mode === 'request' ? fetchPendingConversations() : fetchConversations())
  })
}

export const useUpdateStatusConversation = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: ({ newStatus, conversationId }: { newStatus: string; conversationId: string }) =>
      updateStatusParticipant(conversationId, newStatus),
    onSuccess: (_data, variables) => {
      if (variables?.conversationId) {
        navigate(`/chat/${variables.conversationId}`)
      }
    }
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
