import { NavLink } from 'react-router-dom'
import { Conversation } from '../../../types/chat.type'

interface ConversationListProps {
  conversations: Conversation[]
}

export default function ConversationList(Props: ConversationListProps) {
  const { conversations } = Props
  return (
    <>
      <div className='hidden md:flex w-1/3 border-r border-gray-200 flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b'>
          <span className='font-semibold'>dt.130203</span>
          <button className='text-gray-500 hover:text-black'>✏️</button>
        </div>

        {/* Search */}
        <div className='p-3'>
          <input
            type='text'
            placeholder='Tìm kiếm'
            className='w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none'
          />
        </div>

        {/* Conversations */}
        <div className='flex-1 overflow-y-auto'>
          <div className='p-3 text-sm text-gray-500 uppercase'>Tin nhắn</div>
          <ul >
            {conversations.map((conversation) => (
              <li>
                <NavLink
                  to={`/chat/${conversation._id}`}
                  key={conversation._id}
                  className={({ isActive }) =>
                    `p-4 border-b border-gray-200 flex items-center cursor-pointer ${isActive ? 'bg-gray-100' : ''} `
                  }
                >
                  <div>
                    {conversation.other_participants?.[0].profilePicture ? (
                      <div>
                        <img
                          src={conversation.other_participants?.[0].profilePicture}
                          alt={conversation.other_participants?.[0].username}
                          className='w-24 h-24 rounded-full object-cover'
                        />
                        <div className='flex flex-col'>
                          <p className='font-medium'>{conversation.other_participants?.[0].username}</p>
                          <p className='text-sm text-gray-500'>Bạn: XII SJJ</p>
                        </div>
                      </div>
                    ) : (
                      <div className='w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center'>
                        {/* <FiUser size={20} /> */}
                      </div>
                    )}
                    {/* {conversation.unreadCount > 0 && (
              <div className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                {conversation.unreadCount}
              </div>
            )} */}
                  </div>
                  <div className='ml-3'>
                    <h3 className='font-medium'>{conversation.other_participants?.[0].username}</h3>
                    <p className='text-sm text-gray-500 truncate w-40'>{conversation.last_message?.content}</p>
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='md:hidden w-24 border-r border-gray-200 flex flex-col items-center py-4 space-y-4'>
        <button className='p-2 hover:bg-gray-100 rounded-lg'>✏️</button>
        {conversations.map((c) => (
          <NavLink
            to={`/chat/${c._id}`}
            key={c._id}
            className={({ isActive }) => `p-2 hover:bg-gray-100 rounded-lg ${isActive ? 'bg-gray-100' : ''}`}
          >
            {c.other_participants?.[0].profilePicture ? (
              <img
                src={c.other_participants?.[0].profilePicture}
                alt={c.other_participants?.[0].username}
                className='w-24 h-24 rounded-full object-cover'
              />
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
