
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/app.context'
import ConversationList from './components/ConversationList'
import { ChatProvider } from './context/ChatContext'
import { ModalCreateMessage } from './components/ModalCreateChat'
import { useConversations } from './hook/useConversationSocket'

export default function ChatPage() {
  const { profile } = useContext(AppContext)
  const currentUser = profile?._id as string
  const { conversationId } = useParams()
  const location = useLocation()
  const mode = (location.state as { mode: 'normal' | 'request' } | undefined) || { mode: 'normal' }
  if (location.pathname === '/chat/request') {
    mode.mode = 'request'
  }
  const { data: conversations } = useConversations(mode)

  return (
    <ChatProvider>
      <div className='flex flex-1 h-screen bg-white'>
        {conversations && <ConversationList conversations={conversations} mode={mode} />}

        <div className='flex-1 flex flex-col'>
          {conversationId ? (
            <>
              <Outlet context={{ currentUser, mode }} />
            </>
          ) : (
            <div className='flex-1 flex items-center justify-center'>
              {mode?.mode === 'normal' && (
                <>
                  <div className='text-center space-y-3'>
                    <h2 className='text-2xl font-semibold text-gray-700'>Chọn một cuộc trò chuyện</h2>
                    <p className='text-gray-500'>Bắt đầu trò chuyện với bạn bè</p>
                    <ModalCreateMessage />
                  </div>
                </>
              )}
              {mode?.mode === 'request' && (
                <div className='text-center'>
                  <h2 className='text-2xl font-semibold text-gray-700'>Danh sách yêu cầu trò chuyện</h2>
                  <p className='text-gray-500'>Xem và quản lý các yêu cầu trò chuyện của bạn</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ChatProvider>
  )
}
