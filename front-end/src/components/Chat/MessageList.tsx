import { useOutletContext, useParams } from 'react-router-dom'
import { Conversation, GetMessagesResponse, Message } from '../../types/chat.type'
import { useMessages } from '../../hooks/useMessages'
import MessageInput from './MessageInput'
import { useContext, useEffect, useRef } from 'react'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { getSocket } from '../../utils/socket'
import { AppContext } from '../../context/app.context'
import InfiniteScroll from 'react-infinite-scroll-component'
import { groupMessagesByTime } from '../../utils/time'

type OutletContextType = {
  currentUser: string
  conversations: Conversation[]
}

export default function MessageList() {
  const { conversationId } = useParams()
  const { currentUser, conversations } = useOutletContext<OutletContextType>()
  const { data, fetchNextPage } = useMessages(conversationId || '')
  const { socket } = useContext(AppContext)
  const bottomRef = useRef<any>(null)
  const queryClient = useQueryClient()
  console.log('data:', data)
  const messages = data?.pages.flatMap((page) => page.messages) ?? []
  const messagesToRender = data ? groupMessagesByTime(messages) : []
  console.log('messagesToRender:', messages)
  const hasMore = data?.pages[data.pages.length - 1]?.hasNextPage ?? false
  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  useEffect(() => {
    if (!socket) {
      console.log('Không có socket')
      return
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
                messages: [msg, ...old.pages[0].messages]
              },
              ...old.pages.slice(1)
            ]
          }
        })
      }
    }

    socket.on('resend-message', handleIncomingMessage)
    socket.on('new-message', handleIncomingMessage)

    return () => {
      socket.off('resend-message', handleIncomingMessage)
      socket.off('new-message', handleIncomingMessage)
    }
  }, [socket, conversationId, queryClient])

  const handleSendMessage = (content: string) => {
    if (!conversationId) return
    const conversation = conversations?.find((c) => c._id === conversationId)

    const receiverId = conversation?.other_participants?.[0]._id
    console.log(conversation)

    if (receiverId) {
      const msg = {
        conversation: conversationId,
        senderId: currentUser,
        receiverId,
        content
      }
      const socket = getSocket()
      if (!socket) return
      socket.emit('send-message', msg) // gửi trực tiếp tới server
    }
  }

  return (
    <div className='flex flex-col h-full'>
      {/* Header */}
      <div className='p-4 border-b flex items-center bg-white sticky top-0 z-10 h-1/10'>
        <img src='/default-avatar.png' alt='Avatar' className='w-10 h-10 rounded-full object-cover' />
        <div className='ml-3'>
          <h3 className='font-semibold'>Đoàn Công Tài</h3>
        </div>
      </div>

      {/* Messages area */}
      <div className='flex-1 overflow-y-auto bg-white py-2'>
        <div className=' flex flex-col items-center bg-white overflow-y-auto p-4'>{/* Header user info */}</div>
        <div id='scrollableDiv' className='h-full w-full overflow-auto flex flex-col-reverse'>
          {/*Put the scroll bar always on the bottom*/}
          <InfiniteScroll
            dataLength={messages.length}
            next={fetchNextPage}
            style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
            inverse={true} //
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            scrollableTarget='scrollableDiv'
          >
            {messagesToRender &&
              messagesToRender.map((item, index) => {
                if (item.type === 'timestamp') {
                  return (
                    <div key={`timestamp-${index}`} className='flex justify-center my-2'>
                      <span className='bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs'>{item.time}</span>
                    </div>
                  )
                } else {
                  // Assuming item has a 'message' property for message type
                  const message = item.message as Message
                  const isCurrentUser = message.senderId === currentUser
                  return (
                    <div key={message._id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>
                      <div
                        className={`rounded-lg px-4 py-2 max-w-xs ${
                          isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  )
                }
              })}

            <div className='flex flex-col items-center my-9'>
              <img
                src='https://i.imgur.com/6VBx3io.png' // thay bằng ảnh thật
                alt='avatar'
                className='w-32 h-32 rounded-full object-cover'
              />
              <h1 className='text-xl font-semibold mt-4'>Phan Thành Lộc</h1>
              <p className='text-gray-500'>loccc27 · Instagram</p>
              <button className='mt-3 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition'>
                Xem trang cá nhân
              </button>
            </div>
          </InfiniteScroll>
        </div>

        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={handleSendMessage} />
    </div>
  )
}
