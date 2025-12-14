import { useContext, useState } from 'react'
import { AppContext } from '../../../context/app.context'
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'
import { GetMessagesResponse, Message } from '../../../types/chat.type'
import { getSocket } from '../../../utils/socket'
import { ChatContext } from '../context/ChatContext'
import { deleteConversation } from '../../../apis/chat.api'

type UseMessageActionsParams = {
  conversationId: string | undefined
  currentUser: string | undefined
  profile: { profilePicture?: string; username?: string } | null | undefined
}
export function useMessageActions({ conversationId, currentUser, profile }: UseMessageActionsParams) {
  const queryClient = useQueryClient()
  const { replyingToMessage, setReplyingToMessage } = useContext(ChatContext)
  const [pendingQueue, setPendingQueue] = useState<any[]>([])
  const { socket } = useContext(AppContext)

  const optimisticUi = (payload: {
    content?: string
    type: 'text' | 'image' | 'video' | 'file'
    url?: string
    replyTo?: Message
  }) => {
    const { content, type, url, replyTo } = payload
    const tempMessage: Message = {
      _id: `temp-${Date.now()}`,
      conversation: conversationId as string,
      sender: { _id: currentUser },
      media: { url },
      content,
      type,
      createdAt: new Date().toISOString(),
      status: 'pending',
      replyTo
    }

    queryClient.setQueryData(['messages', conversationId], (old: InfiniteData<GetMessagesResponse> | undefined) => {
      if (!old) return old
      return {
        ...old,
        pages: [
          {
            ...old.pages[0],
            messages: [tempMessage, ...old.pages[0].messages]
          },
          ...old.pages.slice(1)
        ]
      }
    })
    return tempMessage._id
  }

  const updateMessageStatus = (tempId: string, status: string) => {
    queryClient.setQueryData(['messages', conversationId], (old: InfiniteData<GetMessagesResponse> | undefined) => {
      if (!old) return old
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          messages: page.messages.map((m) => (m._id === tempId ? { ...m, status } : m))
        }))
      }
    })
  }

  const handleSendMessage = (payload: {
    temp_id: string
    content?: string
    type: 'text' | 'image' | 'video' | 'file'
    url?: string
    replyTo?: string
  }) => {
    const { content, type, url, temp_id, replyTo } = payload
    if (!conversationId || !currentUser) return
    const socket = getSocket()
    if (!socket) return

    socket.emit(
      'send-message',
      {
        temp_id,
        conversation: conversationId,
        sender: currentUser,
        content,
        media: { url },
        profilePicture: profile?.profilePicture,
        type,
        replyTo
      },
      (ack: { status?: string; data?: string }) => {
        if (ack?.status === 'error') {
          updateMessageStatus(temp_id, 'failed')
          if (pendingQueue.find((message) => message.temp_id === temp_id)) return
          setPendingQueue((prev) => [...prev, { ...payload, temp_id }])
        } else {
          const temp_id = ack.data as string
          updateMessageStatus(temp_id, 'sent')
        }
      }
    )
  }

  const handleDeleteMessage = (messageId: string) => {
    if (!conversationId || !currentUser) return
    const socket = getSocket()
    if (!socket) return
    socket.emit(
      'delete-message',
      {
        messageId,
        conversation: conversationId,
        sender: currentUser
      },
      (ack: { status?: string; data?: string }) => {
        if (ack?.status === 'error') {
          // Handle error if needed
        } else {
          // Optionally handle successful deletion acknowledgment
        }
      }
    )
  }

  const handleTyping = (isTyping: boolean) => {
    if (!socket || !currentUser || !conversationId) return
    socket.emit('typing', {
      roomId: conversationId,
      senderUser: {
        _id: currentUser,
        profilePicture: profile?.profilePicture,
        profileUsername: profile?.username
      },
      isTyping
    })
  }

  const handleReply = (message: Message) => {
    setReplyingToMessage(message)
  }

  const handleCancelReply = () => {
    setReplyingToMessage(null)
  }
  return {
    handleSendMessage,
    handleDeleteMessage,
    handleCancelReply,
    handleReply,
    handleTyping,
    replyingToMessage,
    pendingQueue,
    setPendingQueue,
    optimisticUi
  }
}

export const useDeleteConversation = () => {
  return useMutation({
    mutationFn: (conversationId: string) => deleteConversation(conversationId)
    // onSuccess(data)=>{
    // }
  })
}
