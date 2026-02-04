import { Outlet, useLocation } from 'react-router-dom'
import AppSidebar from '../../components/App-sidebar'
import { SidebarProvider, useSidebar } from '../../components/ui/sidebar'
import { useContext, useEffect, useState } from 'react'
import { PanelContext } from './PanelContext'
import SearchOpen from './component/SearchOpen'
import NotifyOpen from './component/NotifyOpen'
import { useNotificationStore } from '../../store/useNotificationStore'
import { AppContext } from '../../context/app.context'

function SidebarAutoCollapse({ searchOpen, notificationOpen }: { searchOpen: boolean; notificationOpen: boolean }) {
  const { pathname } = useLocation()
  const { setOpen } = useSidebar()

  useEffect(() => {
    if (searchOpen || notificationOpen) {
      setOpen(false)
      return
    }

    if (pathname.startsWith('/chat')) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, [pathname, searchOpen, notificationOpen])

  return null
}

export default function MainLayout() {
  const setUnread = useNotificationStore((s) => s.newUnread)
  const { socket } = useContext(AppContext)
  useEffect(() => {
    if (!socket) return

    const handler = () => {
      setUnread()
    }

    socket.on('new-notification', handler)

    return () => {
      socket.off('new-notification', handler)
    }
  }, [socket, setUnread])
  const { pathname } = useLocation()
  const isChatPage = pathname.startsWith('/chat')
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  return (
    <PanelContext.Provider value={{ searchOpen, setSearchOpen, notificationOpen, setNotificationOpen }}>
      <SidebarProvider sidebar={<AppSidebar />} isChatPage={isChatPage}>
        <SidebarAutoCollapse searchOpen={searchOpen} notificationOpen={notificationOpen} />
        <Outlet />
        <SearchOpen />
        <NotifyOpen />
      </SidebarProvider>
    </PanelContext.Provider>
  )
}
