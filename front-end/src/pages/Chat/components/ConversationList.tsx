import { NavLink, useNavigate } from 'react-router-dom'
import { Conversation } from '../../../types/chat.type'
import { useContext } from 'react'
import { AppContext } from '../../../context/app.context'
import { ArrowLeft, MessageCirclePlus } from 'lucide-react'
import { ChatContext } from '../context/ChatContext'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'

interface ConversationListProps {
  conversations: Conversation[]
  mode: { mode: 'normal' | 'request' } | undefined
  onlineUsers: Set<unknown>
}

export default function ConversationList(Props: ConversationListProps) {
  const { conversations, mode, onlineUsers } = Props
  const { profile } = useContext(AppContext)
  const navigate = useNavigate()
  const { setShowModal } = useContext(ChatContext)

  return (
    <>
      <div className='hidden lg:flex w-1/3 border-r border-gray-200 flex-col'>
        {mode?.mode === 'normal' && (
          <>
            <div className='flex items-center justify-between pt-8 px-6 pb-4'>
              <span className='font-bold text-2xl'>{profile?.username}</span>
              <MessageCirclePlus className='w-8 h-8 hover:cursor-pointer' onClick={() => setShowModal(true)} />
            </div>
            <div className='p-3'>
              <input
                type='text'
                placeholder='Tìm kiếm'
                className='w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none'
              />
            </div>
            <div className='flex justify-between p-3 px-6 text-base'>
              <span className=' font-bold'>Tin nhắn</span>
              <NavLink to='request' className=' text-gray-500 hover:underline'>
                Tin nhắn đang chờ
              </NavLink>
            </div>
          </>
        )}

        {mode?.mode === 'request' && (
          <div className='pt-8 px-6 pb-4'>
            <div className='flex items-center space-x-3 '>
              <ArrowLeft className='w-8 h-8 hover:cursor-pointer' onClick={() => navigate('/chat')} />
              <span className='font-semibold   text-2xl'>Tin nhắn đang chờ</span>
            </div>
            <p className='text-center text-sm text-gray-500 pt-8'>
              Mở đoạn chat để xem thêm thông tin về người đang nhắn tin cho bạn. Chỉ khi nào bạn chấp nhận thì họ mới
              biết là bạn đã xem.
            </p>
          </div>
        )}

        {/* Conversations */}
        <div className='flex-1 overflow-y-auto'>
          <ul>
            {conversations.map((conversation) => {
              const otherUser = conversation.participants.find((p) => p.user._id !== profile?._id)
              const isOnline = onlineUsers.has(otherUser?.user._id)
              return (
                <li>
                  <NavLink
                    to={`/chat/${conversation._id}`}
                    key={conversation._id}
                    state={{ mode: mode?.mode }}
                    className={({ isActive }) =>
                      `py-2 px-4 border-gray-200 flex items-center cursor-pointer ${isActive ? 'bg-gray-100' : ''} `
                    }
                  >
                    <div className='relative'>
                      {conversation.displayAvatar ? (
                        <Avatar className=' w-15 h-15'>
                          <AvatarImage className='object-cover' src={conversation.displayAvatar} />
                          <AvatarFallback />
                        </Avatar>
                      ) : (
                        <Avatar className=' w-15 h-15'>
                          <AvatarImage className='object-cover' src='' />
                          <AvatarFallback />
                        </Avatar>
                      )}
                      {isOnline && (
                        <span className='absolute bottom-0 right-0 block w-4 h-4 bg-green-500 rounded-full border-2 border-white'></span>
                      )}
                    </div>
                    <div
                      className={`ml-3 ${conversation.last_message?.sender._id !== profile?._id && !(conversation.last_message?.seenBy?.includes(profile?._id as string) ?? false) ? 'font-semibold' : ''}`}
                    >
                      <p className='mb-1'>{conversation.displayName}</p>
                      {conversation.last_message?.type === 'text' ? (
                        <p className='text-[10px] truncate w-40'>{conversation.last_message.content}</p>
                      ) : (
                        <p className='text-sm text-gray-500 italic'>
                          {conversation.last_message?.type === 'image' && 'Vừa gửi một ảnh'}
                          {conversation.last_message?.type === 'video' && 'Vừa gửi một video'}
                          {conversation.last_message?.type === 'file' && 'Vừa gửi một tệp'}
                        </p>
                      )}
                    </div>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </div>
        {conversations.length > 0 && mode?.mode === 'request' && (
          <div className='border-t-2 flex items-center justify-center p-3'>
            <span className='text-red-500 hover:cursor-pointer'>Delete all {conversations.length}</span>
          </div>
        )}
      </div>
      <div className='lg:hidden w-24 border-r-  2 border-gray-200 flex flex-col items-center py-4 space-y-4'>
        <button className='p-2 hover:bg-gray-100 rounded-lg'>✏️</button>
        {conversations.map((c) => (
          <NavLink
            to={`/chat/${c._id}`}
            key={c._id}
            state={{ mode: mode?.mode }}
            className={({ isActive }) => `p-2 hover:bg-gray-100 rounded-lg ${isActive ? 'bg-gray-100' : ''}`}
          >
            {c.displayAvatar ? (
              <img src={c.displayAvatar} alt={c.displayName} className='w-24 h-24 rounded-full object-cover' />
            ) : (
              <div className='w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center'>
                {/* <FiUser size={16} /> */}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </>
  )
}
