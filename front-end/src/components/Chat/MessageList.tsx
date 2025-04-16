import { Message } from '../../types/chat.type'
import { format } from 'date-fns'

interface MessageListProps {
  messages: Message[]
  currentUser: string
}

export default function MessageList(Props: MessageListProps) {
  const { messages, currentUser } = Props
  console.log('messages', messages)
  return (
    <div className='flex-1 overflow-y-auto p-4'>
      {messages.map((message) => (
        <div
          key={message._id}
          className={`mb-4 flex ${message.sender_id === currentUser ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.sender_id === currentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            <p>{message.content}</p>
            <p className={`text-xs mt-1 ${message.sender_id === currentUser ? 'text-blue-100' : 'text-gray-500'}`}>
              {format(new Date(message.created_at as string), 'HH:mm')}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
