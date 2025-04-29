import { useOutletContext, useParams } from 'react-router-dom'
import { Conversation, Message } from '../../types/chat.type'
import { format } from 'date-fns'
import { useMessages } from '../../hooks/useMessages'
import MessageInput from './MessageInput'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getSocket } from '../../utils/socket'

type OutletContextType = {
  currentUser: string
  conversations: Conversation[]
}

export default function MessageList() {
  const { conversationId } = useParams()
  const { currentUser, conversations } = useOutletContext<OutletContextType>()
  const { data: messages } = useMessages(conversationId || '')
  const queryClient = useQueryClient()
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return
    socket.on('new-message', (msg) => {
      if (msg.conversationId === conversationId) {
        queryClient.setQueryData<Message[]>(['messages', conversationId], (old = []) => [...old, msg])
      }
    })
    return () => {
      socket.off('new-message')
    }
  }, [conversationId])

  const handleSendMessage = (content: string) => {
    if (!conversationId) return
    const conversation = conversations?.find((c) => c._id === conversationId)

    const receiverId = conversation?.other_participants?.[0]._id

    if (receiverId) {
      const msg = {
        conversationId,
        senderId: currentUser,
        receiverId,
        content
      }
      console.log('msg', msg)
      const socket = getSocket()
      if (!socket) return
      socket.emit('send-message', msg) // gửi trực tiếp tới server
    }
  }

  return (
    <div className='flex flex-col h-full'>
      {/* Header */}
      <div className='p-4 border-b flex items-center bg-white sticky top-0 z-10'>
        <img src='/default-avatar.png' alt='Avatar' className='w-10 h-10 rounded-full object-cover' />
        <div className='ml-3'>
          <h3 className='font-semibold'>Đoàn Công Tài</h3>
        </div>
      </div>

      {/* Messages area */}
      <div className='flex-1 overflow-y-auto bg-gray-100 px-4 py-2'>
        {messages &&
          messages.map((message) => (
            <div
              key={message._id}
              className={`mb-4 flex ${message.senderId === currentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === currentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${message.senderId === currentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                  {/* {format(new Date(message.created_at as string), 'HH:mm')} */}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Input area */}
      <div className='border-t p-4 bg-white'>
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  )
}
