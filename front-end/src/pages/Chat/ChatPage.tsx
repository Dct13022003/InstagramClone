import { useConversations } from '../../hooks/useMessages'

import { Outlet, useParams } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/app.context'
import ConversationList from './components/ConversationList'

export default function ChatPage() {
  const { profile } = useContext(AppContext)
  const currentUser = profile?._id as string

  const { conversationId } = useParams()

  const { data: conversations } = useConversations()

  return (
    <div className='flex flex-1 h-screen bg-white'>
      {conversations && <ConversationList conversations={conversations} />}

      <div className='flex-1 flex flex-col'>
        {conversationId ? (
          <>
            <Outlet context={{ currentUser, conversations }} />
          </>
        ) : (
          <div className='flex-1 flex items-center justify-center'>
            <div className='text-center'>
              <h2 className='text-2xl font-semibold text-gray-700'>Chọn một cuộc trò chuyện</h2>
              <p className='text-gray-500'>Bắt đầu trò chuyện với bạn bè</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
