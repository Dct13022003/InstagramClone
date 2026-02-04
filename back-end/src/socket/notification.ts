import { getIo } from '.'
import { users } from './state'

export const sendRealtimeNotification = (receiverId: string) => {
  const receiver = users[receiverId]
  const io = getIo()
  if (receiver && receiver.sockets.length > 0) {
    receiver.sockets.forEach((socketId) => {
      io.to(socketId).emit('new-notification')
    })
    return true
  }
  return false
}
