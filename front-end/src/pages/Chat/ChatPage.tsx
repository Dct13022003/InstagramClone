import { useConversations } from '../../hooks/useMessages'
import ConversationList from '../../components/Chat/ConversationList'
import { Outlet, useParams } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { connectSocket, disconnectSocket } from '../../utils/socket'
import { AppContext } from '../../context/app.context'

export default function ChatPage() {
  const { profile } = useContext(AppContext)
  const currentUser = profile?._id as string
  useEffect(() => {
    const socket: Socket = connectSocket(currentUser)

    socket.on('connect', () => {
      console.log('✅ Socket connected')
    })

    return () => {
      disconnectSocket()
    }
  }, [currentUser])
  const { conversationId } = useParams()

  const { data: conversations } = useConversations()

  return (
    <div className='flex h-screen w-screen bg-white'>
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
