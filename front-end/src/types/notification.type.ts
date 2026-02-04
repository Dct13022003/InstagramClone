export interface Notification {
  _id: string
  senderId: {
    _id: string
    username: string
    profilePicture: string
  }
  type: string
  entityId: { _id: string }
  content: string
  isSeen: boolean
  createdAt: Date
  updatedAt: Date
}
