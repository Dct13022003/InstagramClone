import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AppContext } from '../../../context/app.context'
import { Conversation, GetMessagesResponse, Message } from '../../../types/chat.type'
import {
  fetchConversations,
  fetchMessages,
  fetchPendingConversations,
  updateStatusParticipant
} from '../../../apis/chat.api'
import { useLocation, useNavigate } from 'react-router-dom'

type TypingUser = {
  _id: string
  profilePicture: string
  profileUsername: string
}

export function useConversationSocket(conversationId, currentUser, profile, mode) {
  const queryClient = useQueryClient()
  const { socket } = useContext(AppContext)
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [lastMessage, setLastMessage] = useState()

  useEffect(() => {
    if (!socket) return

    const handleConnect = () => {
      console.log('Socket connected!')
      socket.emit('join-conversation', conversationId)
    }

    const handleIncomingMessage = ({ msg, temp_id }: { msg: Message; temp_id: string }) => {
      if (msg.conversation === conversationId) {
        setLastMessage(msg)
        queryClient.setQueryData(['messages', conversationId], (old: InfiniteData<GetMessagesResponse> | undefined) => {
          if (!old) return old
          const existingIndex = old.pages[0].messages.findIndex((m) => m._id === temp_id)
          if (existingIndex !== -1) {
            // Thay thế tin nhắn đã tồn tại (đang optimistic)
            const newMessages = [...old.pages[0].messages]
            newMessages[existingIndex] = msg

            return {
              ...old,
              pages: [
                {
                  ...old.pages[0],
                  messages: newMessages
                },
                ...old.pages.slice(1)
              ]
            }
          } else {
            // Thêm tin nhắn mới vào đầu
            return {
              ...old,
              pages: [
                {
                  ...old.pages[0],
                  messages: [msg, ...old.pages[0].messages]
                },
                ...old.pages.slice(1)
              ]
            }
          }
        })
        queryClient.setQueryData(['conversations', mode.mode], (old: Conversation[] | undefined) => {
          if (!old) return old
          return old.map((conv) => {
            if (conv._id === conversationId) {
              return {
                ...conv,
                last_message: msg,
                updatedAt: msg.createdAt
              }
            }
            return conv
          })
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

    socket.emit('join-conversation', conversationId)
    socket.on('message-deleted', handleRecallMessage)
    socket.on('new-message', handleIncomingMessage)
    socket.on('display_typing', handleDisplayTyping)
    socket.on('connect', handleConnect)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('message-deleted', handleRecallMessage)
      socket.off('new-message', handleIncomingMessage)
      socket.off('display_typing', handleDisplayTyping)
      socket.emit('leave-conversation', conversationId)
    }
  }, [socket, conversationId])

  return { typingUsers, lastMessage }
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

export function useOnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const { socket } = useContext(AppContext)
  useEffect(() => {
    if (!socket) return
    socket.on('online-users', (onlineChattedUsers) => {
      setOnlineUsers(new Set(onlineChattedUsers))
    })

    return () => {
      socket.off('online-users')
    }
  }, [socket])

  return onlineUsers
}

export function useActiveChatStatus() {
  const { socket } = useContext(AppContext)
  const location = useLocation()

  useEffect(() => {
    if (!socket) return

    const isChat = location.pathname.startsWith('/chat')

    if (isChat) {
      socket.emit('active-in-chat')
    } else {
      socket.emit('off-active-in-chat')
    }
  }, [location.pathname, socket])
}

export function useSeenMessage({ conversationId, lastMessage, userId, isScrolledToBottom, mode }) {
  const lastSeenRef = useRef(null)
  const queryClient = useQueryClient()
  const { socket } = useContext(AppContext)
  const emitSeen = () => {
    if (lastMessage?.sender?._id === userId) return
    if (!conversationId || !lastMessage?._id) return
    if (!socket) return
    const messageId = lastMessage._id
    if (lastSeenRef.current === messageId) return
    if (!isScrolledToBottom()) return
    if (document.hidden) return
    queryClient.setQueryData(['conversations', mode.mode], (old: Conversation[] | undefined) => {
      if (!old) return old
      return old.map((conv) => {
        if (conv._id === conversationId) {
          return {
            ...conv,
            last_message: {
              ...conv.last_message,
              seenBy: [...(conv.last_message?.seenBy || []), userId]
            }
          }
        }
        return conv
      })
    })
    socket.emit('seen-message', {
      conversationId,
      messageId,
      userId
    })
    lastSeenRef.current = messageId
  }
  const requestSeenTrigger = () => {
    setTimeout(() => emitSeen(), 0)
  }

  // ================================================
  // CASE 1: Khi mở conversation
  // ================================================
  useEffect(() => {
    if (!conversationId || !lastMessage) return
    requestSeenTrigger()
  }, [conversationId, lastMessage?._id])

  // ================================================
  // CASE 2: Scroll đến đáy
  // ================================================
  useEffect(() => {
    if (isScrolledToBottom()) {
      requestSeenTrigger()
    }
  }, [isScrolledToBottom])

  // ================================================
  // CASE 3: Khi có tin nhắn mới đến
  // ================================================
  // useEffect(() => {
  //   if (!socket) return

  //   const handleNewMessage = ({ msg }: { msg: Message; temp_id: string }) => {
  //     if (msg.conversation === conversationId) {
  //       requestSeenTrigger()
  //     }
  //   }

  //   socket.on('new-message', handleNewMessage)
  //   return () => {
  //     socket.off('new-message', handleNewMessage)
  //   }
  // }, [socket, conversationId])

  // ================================================
  // CASE 4: Tab quay lại (focus)
  // ================================================
  useEffect(() => {
    const onFocus = () => requestSeenTrigger()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  // ================================================
  // CASE 5: visibilitychange (app/website foreground)
  // ================================================
  // useEffect(() => {
  //   const onVisible = () => {
  //     if (!document.hidden) requestSeenTrigger()
  //   }
  //   document.addEventListener('visibilitychange', onVisible)

  //   return () => {
  //     document.removeEventListener('visibilitychange', onVisible)
  //   }
  // }, [])
}

export function useLastSeen() {
  const { socket } = useContext(AppContext)
  const [seenLast, setSeenLast] = useState({})

  useEffect(() => {
    if (!socket) return
    const handleSeen = ({
      conversationId,
      userId,
      messageId
    }: {
      conversationId: string
      userId: string
      messageId: string
    }) => {
      setSeenLast((prev) => ({
        ...prev,
        [conversationId]: {
          ...(prev[conversationId] || {}),
          [userId]: messageId
        }
      }))
    }

    socket.on('message-seen', handleSeen)

    return () => {
      socket.off('message-seen', handleSeen)
    }
  }, [socket])
  useEffect(() => {
    if (!socket) return

    const handleNewSeenMessage = (msg) => {
      setSeenLast((prev) => {
        const next = { ...prev }
        delete next[msg.conversationId] // reset seen
        return next
      })
    }

    socket.on('new-message', handleNewSeenMessage)

    return () => {
      socket.off('new-message', handleNewSeenMessage)
    }
  }, [socket])

  // 🔍 Hàm kiểm tra: message cuối đã được xem bởi user nào?
  const getSeenUsersForMessage = useCallback(
    (conversationId: string, messageId: string) => {
      const info = seenLast[conversationId]
      if (!info) return []

      return Object.entries(info)
        .filter(([, seenMsgId]) => seenMsgId === messageId)
        .map(([uid]) => uid)
    },
    [seenLast]
  )

  // 🔍 Hàm kiểm tra: user kia đã xem message cuối chưa? (chat 1–1)
  const isLastMessageSeenBy = useCallback(
    (conversationId: string, userId: string, messageId: string) => {
      const info = seenLast[conversationId]
      if (!info) return false

      return info[userId] === messageId
    },
    [seenLast]
  )

  return {
    seenLast,
    getSeenUsersForMessage,
    isLastMessageSeenBy
  }
}
