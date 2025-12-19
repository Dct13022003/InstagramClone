import { Outlet, useLocation } from 'react-router-dom'
import AppSidebar from '../../components/App-sidebar'
import { SidebarProvider, useSidebar } from '../../components/ui/sidebar'
import { useEffect, useState } from 'react'
import { SearchContext } from './SearchContext'
import SearchOpen from './component/SearchOpen'

function SidebarAutoCollapse({ searchOpen }: { searchOpen: boolean }) {
  const { pathname } = useLocation()
  const { setOpen } = useSidebar()

  useEffect(() => {
    if (searchOpen) {
      setOpen(false)
      return
    }

    if (pathname.startsWith('/chat')) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, [pathname, searchOpen])

  return null
}

export default function MainLayout() {
  const { pathname } = useLocation()
  const isChatPage = pathname.startsWith('/chat')
  const [searchOpen, setSearchOpen] = useState(false)
  return (
    <SearchContext.Provider value={{ searchOpen, setSearchOpen }}>
      <SidebarProvider sidebar={<AppSidebar />} isChatPage={isChatPage}>
        <SidebarAutoCollapse searchOpen={searchOpen} />
        <Outlet />
        <SearchOpen />
      </SidebarProvider>
    </SearchContext.Provider>
  )
}
