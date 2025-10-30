import { useOutletContext, useParams } from 'react-router-dom'
import MessageInput from './MessageInput'
import { useContext, useEffect, useRef, useState } from 'react'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Conversation, GetMessagesResponse, Message } from '../../../types/chat.type'
import { useMessages } from '../../../hooks/useMessages'
import { AppContext } from '../../../context/app.context'
import { groupMessagesByTime } from '../../../utils/time'
import { getSocket } from '../../../utils/socket'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { EllipsisVertical, Reply, Smile } from 'lucide-react'

type OutletContextType = {
  currentUser: string
  conversations: Conversation[]
}

type TypingUser = {
  _id: string
  profilePicture: string
  profileUsername: string
}

export default function MessageList() {
  const { profile } = useContext(AppContext)
  const { conversationId } = useParams()
  const { currentUser } = useOutletContext<OutletContextType>()
  const { data, fetchNextPage } = useMessages(conversationId || '')
  const { socket } = useContext(AppContext)
  const [isTypingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const bottomRef = useRef<any>(null)
  const queryClient = useQueryClient()
  const messages = data?.pages.flatMap((page) => page.messages) ?? []
  const messagesToRender = data ? groupMessagesByTime([...messages].reverse()).reverse() : []
  const hasMore = data?.pages[data.pages.length - 1]?.hasNextPage ?? false

  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
                messages: [msg, ...old.pages[0].messages]
              },
              ...old.pages.slice(1)
            ]
          }
        })
      }
    }
    socket.emit('join-conversation', conversationId)
    socket.on('new-message', handleIncomingMessage)

    return () => {
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

  const optimisticUi = (payload: { content?: string; type: 'text' | 'image' | 'video' | 'file'; url?: string }) => {
    const { content, type, url } = payload
    const tempMessage: Message = {
      _id: `temp-${Date.now()}`,
      conversation: conversationId,
      sender: { _id: currentUser },
      media: { url },
      content,
      type,
      createdAt: new Date().toISOString(),
      status: 'pending'
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
  }

  const handleSendMessage = (payload: {
    content?: string
    type: 'text' | 'image' | 'video' | 'file'
    url?: string
  }) => {
    const { content, type, url } = payload
    if (!conversationId || !currentUser) return
    const socket = getSocket()
    if (!socket) return

    socket.emit('send-message', {
      conversation: conversationId,
      sender: currentUser,
      content,
      media: { url },
      profilePicture: profile?.profilePicture,
      type
    })
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
        <div id='scrollableDiv' className='h-full w-full overflow-auto flex flex-col-reverse'>
          {/*Put the scroll bar always on the bottom*/}
          <InfiniteScroll
            dataLength={messages.length}
            next={fetchNextPage}
            style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
            inverse={true} //
            hasMore={hasMore}
            loader={<h4></h4>}
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
                  const message = item.message as Message
                  const isCurrentUser = message.sender?._id === currentUser
                  return (
                    <>
                      <div
                        key={message._id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start  pl-4'} mb-1`}
                      >
                        <div className={`group flex gap-3 ${isCurrentUser ? '' : 'flex-row-reverse'} mb-1`}>
                          <div
                            className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isCurrentUser ? '' : 'flex-row-reverse '}`}
                          >
                            <EllipsisVertical className='w-4 h-4' />
                            <Reply className='w-4 h-4' />
                            <Smile className='w-4 h-4' />
                          </div>
                          <div className='flex items-center'>
                            {!isCurrentUser && (
                              <Avatar>
                                <AvatarImage className='object-cover' src={message.sender?.profilePicture} />
                                <AvatarFallback content='aaaa' />
                              </Avatar>
                            )}
                            <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                              {message.type == 'text' ? (
                                <span
                                  className={`rounded-lg px-4 py-2 max-w-xs ${
                                    isCurrentUser ? 'bg-blue-500 text-white mr-5' : 'bg-gray-100 text-gray-900 ml-2'
                                  }`}
                                >
                                  {message.content}
                                </span>
                              ) : (
                                <div
                                  className={`max-w-[60%] overflow-hidden rounded-2xl ${isCurrentUser ? 'mr-5' : 'ml-2'}`}
                                >
                                  <img
                                    src={message.media?.url}
                                    className='w-full h-auto max-h-[400px] object-cover rounded-2xl'
                                  ></img>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                }
              })}

            <div className='flex flex-col items-center my-9'>
              <img src='https://i.imgur.com/6VBx3io.png' alt='avatar' className='w-32 h-32 rounded-full object-cover' />
              <h1 className='text-xl font-semibold mt-4'>Phan Thành Lộc</h1>
              <p className='text-gray-500'>loccc27 · Instagram</p>
              <button className='mt-3 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition'>
                Xem trang cá nhân
              </button>
            </div>
          </InfiniteScroll>
        </div>
        {isTypingUsers.length > 0 &&
          isTypingUsers.map((userTyping) => (
            <div key={userTyping._id} className='flex justify-start mb-1'>
              <Avatar>
                <AvatarImage className='object-cover' src={userTyping.profilePicture} />
                <AvatarFallback content='aaaa' />
              </Avatar>
              {/* <div className='rounded-lg px-4 py-2 max-w-xs bg-gray-100 text-gray-900 ml-5 italic'>
                Đang nhập tin nhắn...
              </div> */}
              <div className='flex items-center'>
                <span className='rounded-lg px-4 py-2 max-w-xs bg-gray-100 text-gray-900 ml-5 italic'>
                  Đang nhập tin nhắn...
                </span>
              </div>
            </div>
          ))}
        <div ref={bottomRef} />
      </div>

      <MessageInput onTypingChange={handleTyping} onSend={handleSendMessage} optimisticUi={optimisticUi} />
    </div>
  )
}
