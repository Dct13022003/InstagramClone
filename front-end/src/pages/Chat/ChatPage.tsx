import { Outlet, useLocation, useParams } from 'react-router-dom'
import ConversationList from './components/ConversationList'
import { ChatProvider } from './context/ChatContext'
import { ModalCreateMessage } from './components/ModalCreateChat'
import { useConversations, useOnlineUsers } from './hook/useConversationSocket'
import { useQueryClient } from '@tanstack/react-query'
import { Conversation } from '../../types/chat.type'
import { useIsMobile } from '../../hooks/use-mobile'

export default function ChatPage() {
  const { conversationId } = useParams()
  const location = useLocation()
  const onlineUsers = useOnlineUsers()

  const mode = (location.state as { mode: 'normal' | 'request' } | undefined) || { mode: 'normal' }

  if (location.pathname === '/chat/request') {
    mode.mode = 'request'
  }

  const { data: conversations } = useConversations(mode)
  const queryClient = useQueryClient()

  const cached = queryClient.getQueryData<Conversation[]>(['conversations', mode?.mode])
  const convo = cached?.find((c) => c._id === conversationId)

  const isMobile = useIsMobile()

  const showSidebar = !isMobile || !conversationId
  const showChat = !isMobile || !!conversationId

  return (
    <ChatProvider>
      <div className='flex flex-1 h-screen bg-white'>
        {/* SIDEBAR */}
        {showSidebar && conversations && (
          <ConversationList conversations={conversations} mode={mode} onlineUsers={onlineUsers} />
        )}

        {/* CHAT WINDOW */}
        {showChat && (
          <div className='flex-1 flex flex-col'>
            {conversationId ? (
              <Outlet context={{ mode, convo }} />
            ) : (
              <div className='flex-1 flex items-center justify-center'>
                {mode?.mode === 'normal' && (
                  <div className='text-center space-y-3'>
                    <h2 className='text-2xl font-semibold text-gray-700'>Chọn một cuộc trò chuyện</h2>
                    <p className='text-gray-500'>Bắt đầu trò chuyện với bạn bè</p>
                    <ModalCreateMessage />
                  </div>
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
        )}
      </div>
    </ChatProvider>
  )
}
