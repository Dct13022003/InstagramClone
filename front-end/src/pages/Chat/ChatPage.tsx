import { useConversations } from '../../hooks/useMessages'
import ConversationList from '../../components/Chat/ConversationList'
import { Outlet, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { connectSocket, disconnectSocket } from '../../utils/socket'

export default function ChatPage() {
  const currentUser = '67e9852e8ee27de0cfad14ad'
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
  console.log('conversationId', conversationId)

  const { data: conversations } = useConversations()
  console.log('render render')

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
