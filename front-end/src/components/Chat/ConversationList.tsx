import { Conversation } from '../../types/chat.type'

interface ConversationListProps {
  conversations: Conversation[]
  currentUser: string
  onSelectConversation: (conversationId: string) => void
}

export default function ConversationList(Props: ConversationListProps) {
  const { conversations, onSelectConversation } = Props
  return (
    <div className='w-1/3 border-r border-gray-200'>
      <div className='p-4 border-b border-gray-200'>
        <h2 className='text-xl font-semibold'>Tin nhắn</h2>
      </div>
      <div className='overflow-y-auto'>
        {conversations.map((conversation) => {
          return (
            <div
              key={conversation._id}
              className='p-4 border-b border-gray-200 flex items-center cursor-pointer hover:bg-gray-50'
              onClick={() => onSelectConversation(conversation._id)}
            >
              <div className='relative'>
                {conversation.other_participant?.profilePicture ? (
                  <img
                    src={conversation.other_participant.profilePicture}
                    alt={conversation.other_participant.username}
                    className='w-12 h-12 rounded-full object-cover'
                  />
                ) : (
                  <div className='w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center'>
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
                <h3 className='font-medium'>{conversation.other_participant?.username}</h3>
                <p className='text-sm text-gray-500 truncate w-40'>{conversation.last_message?.content}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
