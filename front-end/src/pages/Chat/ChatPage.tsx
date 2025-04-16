import { useState } from 'react'
import { useMessages } from '../../hooks/useMessages'
import ConversationList from '../../components/Chat/ConversationList'
import MessageList from '../../components/Chat/MessageList'
import MessageInput from '../../components/Chat/MessageInput'

export default function ChatPage() {
  const currentUser = '67e9852e8ee27de0cfad14ad' // Thay bằng ID người dùng thực tế
  const conversationId = '67fe83878563a41cef58ab78' // Thay bằng ID cuộc trò chuyện thực tế
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  // const { data: conversations } = useConversations(currentUser)
  const { data: messages } = useMessages(conversationId || '')

  // const { mutate: sendMessage } = useSendMessage()

  // const handleSendMessage = (text: string) => {
  //   if (!selectedConversation) return

  //   const receiverId = conversations
  //     ?.find((c) => c.id === selectedConversation)
  //     ?.participants.find((p) => p.id !== currentUser)?.id

  //   if (receiverId) {
  //     sendMessage({
  //       text,
  //       senderId: currentUser,
  //       receiverId,
  //       conversationId: selectedConversation
  //     })
  //   }
  // }

  return (
    <div className='flex h-screen bg-white'>
      {/* {conversations && (
        <ConversationList
          conversations={conversations}
          currentUser={currentUser}
          onSelectConversation={setSelectedConversation}
        />
      )} */}

      <div className='flex-1 flex flex-col'>
        {messages && <MessageList messages={messages} currentUser={currentUser} />}
        {/* <MessageInput onSend={handleSendMessage} /> */}

        {/* ) : (
          <div className='flex-1 flex items-center justify-center'>
            <div className='text-center'>
              <h2 className='text-2xl font-semibold text-gray-700'>Chọn một cuộc trò chuyện</h2>
              <p className='text-gray-500'>Bắt đầu trò chuyện với bạn bè</p>
            </div>
          </div>
        )} */}
      </div>
    </div>
  )
}
