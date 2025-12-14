import { useOutletContext, useParams } from 'react-router-dom'
import MessageInput from './MessageInput'
import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Conversation, Message } from '../../../types/chat.type'

import { AppContext } from '../../../context/app.context'
import { groupMessagesByTime } from '../../../utils/time'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { CircleAlertIcon, Copy, EllipsisVertical, RefreshCcw, Reply, RotateCcw, Send, Smile } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover'
import { Button } from '../../../components/ui/button'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../../../components/ui/alert-dialog'
import {
  useConversationSocket,
  useLastSeen,
  useMessages,
  useSeenMessage,
  useUpdateStatusConversation
} from '../hook/useConversationSocket'
import { useDeleteConversation, useMessageActions } from '../hook/useMessageActions'

type OutletContextType = {
  convo: Conversation
  mode: { mode: 'normal' | 'request' } | undefined
}

export default function MessageList() {
  const { profile } = useContext(AppContext)
  const currentUser = profile?._id
  const { conversationId } = useParams()
  const { mode, convo } = useOutletContext<OutletContextType>()
  const { data, fetchNextPage } = useMessages(conversationId || '')
  const messages = data?.pages.flatMap((page) => page.messages) ?? []
  const messagesToRender = useMemo(() => {
    if (!data) return []
    return groupMessagesByTime([...messages].reverse()).reverse()
  }, [messages])
  const hasMore = data?.pages[data.pages.length - 1]?.hasNextPage ?? false
  const bottomRef = useRef<HTMLDivElement>(null)
  const { typingUsers } = useConversationSocket(conversationId || '', currentUser, profile, mode)
  const lastMessage = messages[0]
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const scrollDep = data?.pages[0]
  const {
    handleSendMessage,
    handleDeleteMessage,
    handleTyping,
    handleReply,
    handleCancelReply,
    optimisticUi,
    replyingToMessage
  } = useMessageActions({ conversationId, currentUser, profile })
  const updateStatus = useUpdateStatusConversation()
  const deleteConversation = useDeleteConversation()
  const { getSeenUsersForMessage, isLastMessageSeenBy } = useLastSeen()
  const otherUser = convo?.participants.map((p) => p.user).find((u) => u._id !== currentUser)
  const isSeen =
    convo?.type === 'private'
      ? isLastMessageSeenBy(conversationId as string, otherUser._id as string, lastMessage?._id as string)
      : getSeenUsersForMessage(conversationId as string, lastMessage?._id as string)
  useLayoutEffect(() => {
    if (shouldAutoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [scrollDep, shouldAutoScroll])

  const isAtBottom = () => {
    const el = scrollContainerRef.current
    if (!el) return false

    return Math.abs(el.scrollTop) < 1
  }

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return

    const handleScroll = () => {
      setShouldAutoScroll(isAtBottom())
    }

    el.addEventListener('scroll', handleScroll)

    setShouldAutoScroll(isAtBottom())

    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  useSeenMessage({
    conversationId,
    lastMessage,
    isScrolledToBottom: isAtBottom,
    userId: currentUser,
    mode
  })

  const wrappedHandleSendMessage = (args: any) => {
    handleSendMessage(args)
    setShouldAutoScroll(true)
  }

  return (
    <div className='flex-1 flex flex-col'>
      <div className='flex flex-col h-screen'>
        {/* Header */}
        <div className='p-4 border-b flex items-center bg-white sticky top-0 z-10 h-1/10'>
          <Avatar>
            <AvatarImage className='object-cover' src={convo?.displayAvatar} />
            <AvatarFallback content='aaaa' />
          </Avatar>
          <div className='ml-3'>
            <h3 className='font-semibold'>{convo?.displayName}</h3>
          </div>
        </div>

        {/* Messages area */}
        <div className='flex-1 overflow-y-auto bg-white py-2'>
          <div
            id='scrollableDiv'
            ref={scrollContainerRef}
            className='h-full w-full overflow-auto flex flex-col-reverse'
          >
            <div ref={bottomRef} />
            {isSeen && (
              <div className='flex justify-end text-sm text-gray-500 mb-1 mr-5'>
                <p>Đã xem </p>
              </div>
            )}
            {typingUsers.length > 0 &&
              typingUsers.map((userTyping) => (
                <div key={userTyping._id} className='flex justify-start mb-1'>
                  <Avatar>
                    <AvatarImage className='object-cover' src={userTyping.profilePicture} />
                    <AvatarFallback content='aaaa' />
                  </Avatar>
                  <div className='flex items-center'>
                    <span className='rounded-lg px-4 py-2 max-w-xs bg-gray-100 text-gray-900 ml-5 italic'>
                      Đang nhập tin nhắn...
                    </span>
                  </div>
                </div>
              ))}
            {/*Put the scroll bar always on the bottom*/}
            <InfiniteScroll
              dataLength={messages.length}
              next={fetchNextPage}
              style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
              inverse={true}
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
                          className={`flex relative ${isCurrentUser ? 'justify-end mr-5' : 'justify-start  pl-4'} mb-1`}
                        >
                          <div className='flex items-center'>
                            {!isCurrentUser && (
                              <Avatar>
                                <AvatarImage className='object-cover' src={message.sender?.profilePicture} />
                                <AvatarFallback content='aaaa' />
                              </Avatar>
                            )}
                            <div className='flex-col flex gap-1'>
                              {message.replyTo && (
                                <>
                                  <span
                                    className={`text-base text-gray-500 pt-2.5 ${isCurrentUser ? ' self-end mr-3' : ' self-start ml-3'}  `}
                                  >
                                    Đang trả lời{' '}
                                    {message.replyTo._id === profile?._id
                                      ? 'chính mình'
                                      : message.replyTo.sender?.fullname}
                                  </span>
                                  <div
                                    className={` mb-2  border-gray-200 ${isCurrentUser ? 'pr-2 border-r-4 self-end' : 'pl-2 border-l-4 self-start ml-2'}`}
                                  >
                                    <span className='text-sm text-gray-600 italic'>
                                      {message.replyTo.type == 'text' ? (
                                        <span className='rounded-lg px-4 py-2 max-w-xs bg-gray-200 text-gray-900'>
                                          {message.replyTo.content}
                                        </span>
                                      ) : (
                                        <div
                                          className={`max-w-[40%] overflow-hidden rounded-2xl ${isCurrentUser ? 'ml-auto' : 'mr-auto'}`}
                                        >
                                          <img
                                            src={message.replyTo.media?.url}
                                            className='w-full h-auto max-h-[300px] object-cover rounded-2xl'
                                          ></img>
                                        </div>
                                      )}
                                    </span>
                                  </div>
                                </>
                              )}
                              <div
                                className={`flex group gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start flex-row-reverse '}`}
                              >
                                {message?.status == 'failed' ? (
                                  <div className={`flex items-center gap-1 `}>
                                    <RefreshCcw
                                      onClick={() => {
                                        wrappedHandleSendMessage({
                                          temp_id: message._id,
                                          content: message.content,
                                          type: message.type
                                        })
                                      }}
                                      className='w-4 h-4 hover:text-gray-500 hover:cursor-pointer'
                                    />
                                  </div>
                                ) : (
                                  <div
                                    className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isCurrentUser ? '' : 'flex-row-reverse '}`}
                                  >
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <EllipsisVertical className='w-4 h-4 hover:cursor-pointer' />
                                      </PopoverTrigger>
                                      <PopoverContent
                                        side='left'
                                        align='end'
                                        sideOffset={8}
                                        className='w-50 rounded-xl p-0 shadow-xl'
                                      >
                                        <div className='flex-col flex'>
                                          <div className=' border-b p-2 pl-5'>
                                            <span className='text-xs font-medium text-gray-400'>23:27 T4</span>
                                          </div>
                                          <div className='flex flex-col gap-1 p-2 '>
                                            <Button className='bg-white text-black font-normal shadow-none border-0 hover:bg-gray-200 flex justify-between'>
                                              <span>Chuyển tiếp </span>
                                              <Send />
                                            </Button>

                                            <Button className='bg-white text-black font-normal shadow-none border-0 hover:bg-gray-200 flex justify-between'>
                                              <span>Sao chép</span>
                                              <Copy />
                                            </Button>
                                          </div>
                                          <div className=' border-t p-2'>
                                            <AlertDialog>
                                              <AlertDialogTrigger asChild>
                                                <Button className='w-full bg-white hover:bg-gray-200 shadow-none text-red-600 font-normal flex justify-between'>
                                                  <span>Thu hồi</span>
                                                  <RotateCcw />
                                                </Button>
                                              </AlertDialogTrigger>
                                              <AlertDialogContent>
                                                <AlertDialogHeader className='pb-7'>
                                                  <AlertDialogTitle className='text-center text-2xl font-semibold'>
                                                    Thu hồi tin nhắn ?
                                                  </AlertDialogTitle>
                                                  <AlertDialogDescription className='text-center'>
                                                    Thao tác này sẽ gỡ tin nhắn đối với mọi người, nhưng họ có thể đã
                                                    xem tin nhắn đó rồi. Nếu cuộc trò chuyện bị báo cáo thì có thể tin
                                                    nhắn bị thu hồi vẫn sẽ được đưa vào báo cáo đó.
                                                  </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className='flex-col'>
                                                  <AlertDialogAction
                                                    onClick={() => handleDeleteMessage(message._id as string)}
                                                    className='text-red-500 hover:text-none'
                                                  >
                                                    Thu hồi
                                                  </AlertDialogAction>
                                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                </AlertDialogFooter>
                                              </AlertDialogContent>
                                            </AlertDialog>
                                          </div>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                    <Reply
                                      onClick={() => handleReply(message)}
                                      className='w-4 h-4 hover:cursor-pointer'
                                    />
                                    <Smile className='w-4 h-4 hover:cursor-pointer' />
                                  </div>
                                )}
                                {message.type == 'text' ? (
                                  <span
                                    className={`rounded-lg px-4 py-2 max-w-xs ${
                                      isCurrentUser ? 'bg-blue-500 text-white ' : 'bg-gray-100 text-gray-900 ml-2'
                                    }`}
                                  >
                                    {message.content}
                                  </span>
                                ) : (
                                  <div
                                    className={`max-w-[60%] overflow-hidden rounded-2xl ${isCurrentUser ? '' : 'ml-2'}`}
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

                          {message.status === 'pending' && (
                            <div>
                              <span className='absolute -right-4.5 bottom-1 text-xs text-gray-500'>
                                <Send className='w-4 h-4' />
                              </span>
                            </div>
                          )}
                          {message.status === 'failed' && (
                            <span className='absolute -right-4.5 bottom-1 text-xs bg-red-400 text-white border rounded-2xl'>
                              <CircleAlertIcon className='w-4 h-4' />
                            </span>
                          )}
                        </div>
                      </>
                    )
                  }
                })}
              <div className='flex flex-col items-center my-9'>
                <Avatar>
                  <AvatarImage className='object-cover' />
                  <AvatarFallback content='aaaa' />
                </Avatar>
                <p className='text-gray-500'>{convo?.displayName}· Instagram</p>
                <button className='mt-3 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition'>
                  Xem trang cá nhân
                </button>
              </div>
            </InfiniteScroll>
          </div>
        </div>

        {mode?.mode === 'normal' && (
          <MessageInput
            onTypingChange={handleTyping}
            onSend={wrappedHandleSendMessage}
            optimisticUi={optimisticUi}
            onReply={replyingToMessage}
            onCancelReply={handleCancelReply}
          />
        )}
        {mode?.mode === 'request' && (
          <div className='border-t-2'>
            <div className='p-3'>
              <p className='text-center text-base'>
                <span>
                  Accept message request from <strong>Lê Quang Huy (lequanghuy560)?</strong>
                </span>
              </p>
              <p className='text-center text-sm text-gray-500'>
                <span>
                  Nếu bạn chấp nhận, họ cũng có thể gọi cho bạn và xem được những thông tin như trạng thái hoạt động,
                  cũng như thời điểm bạn đọc tin nhắn.
                </span>
              </p>
            </div>

            <div className='flex gap-4 border-t-1 p-3'>
              <Button variant={'ghost'} className='flex-1 hover:cursor-pointer hover:underline'>
                Chặn
              </Button>
              <Button
                variant={'ghost'}
                onClick={() => (conversationId ? deleteConversation.mutate(conversationId) : undefined)}
                className='flex-1 text-red-500 hover:text-red-400 hover:cursor-pointer hover:underline'
              >
                Xóa
              </Button>
              <Button
                onClick={() =>
                  conversationId ? updateStatus.mutate({ newStatus: 'accepted', conversationId }) : undefined
                }
                variant={'ghost'}
                className='flex-1 hover:cursor-pointer hover:underline'
              >
                Accept
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
