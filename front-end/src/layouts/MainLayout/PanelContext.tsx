import { createContext, useContext } from 'react'

export const PanelContext = createContext<{
  searchOpen: boolean
  setSearchOpen: (v: boolean) => void
  notificationOpen: boolean
  setNotificationOpen: (v: boolean) => void
} | null>(null)

export const usePanelContext = () => {
  const ctx = useContext(PanelContext)
  if (!ctx) throw new Error('useSearch must be used inside SearchProvider')
  return ctx
}
