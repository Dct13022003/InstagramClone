import { create } from 'zustand'
interface NotificationState {
  hasUnread: boolean
  newUnread: () => void
  reset: () => void
}
export const useNotificationStore = create<NotificationState>((set) => ({
  hasUnread: false,
  newUnread: () => set(() => ({ hasUnread: true })),
  reset: () => set({ hasUnread: false })
}))
