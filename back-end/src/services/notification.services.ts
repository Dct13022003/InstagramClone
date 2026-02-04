import { Notification } from '~/models/notification.models'
import { ObjectId } from 'mongodb'
class NotificationService {
  async fetchNotifications(user_id: string) {
    const result = await Notification.find({ receiverId: new ObjectId(user_id) })
      .select('_id type content sender_id isSeen entityId createdAt')
      .populate({ path: 'senderId', select: 'username _id profilePicture' })
      .populate({ path: 'entityId', select: '_id ' })
      .lean()
      .sort({ createdAt: -1 })
    return result
  }
}

export const notificationService = new NotificationService()
