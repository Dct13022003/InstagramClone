import { users } from './state'
import { Conversation } from '~/models/conversation.models'
import { Server } from 'socket.io'

export const broadcastOnlineStatus = async (io: Server) => {
  for (const uid in users) {
    const conversations = await Conversation.find({
      type: 'private',
      participants: {
        $elemMatch: { user: uid, status: 'accepted' }
      }
    })

    const acceptedMembers = conversations.flatMap((conv) =>
      conv.participants
        .filter((p) => p.user.toString() !== uid && p.status === 'accepted')
        .map((p) => p.user.toString())
    )

    const activeOnlineUsers = [...new Set(acceptedMembers)].filter((id) => users[id]?.isActiveChat)

    users[uid].sockets.forEach((sockId) => {
      io.to(sockId).emit('online-users', activeOnlineUsers)
    })
  }
}
