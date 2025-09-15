import { Outlet, useLocation } from 'react-router-dom'
import AppSidebar from '../../components/App-sidebar'
import { SidebarProvider, useSidebar } from '../../components/ui/sidebar'
import { useEffect, useState } from 'react'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)

  const handleSearchClick = () => {
    setSearchOpen(true)
    setSidebarOpen(false) // Thu gọn Sidebar khi mở Search
  }

  const handleCloseSearch = () => {
    setSearchOpen(false)
    setSidebarOpen(true) // Mở lại Sidebar khi đóng Search
  }
  function SidebarAutoCollapse() {
    const { setOpen } = useSidebar()
    const pathname = useLocation().pathname
    useEffect(() => {
      setOpen(!pathname.startsWith('/chat'))
    }, [pathname, setOpen])

    return null
  }
  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SidebarAutoCollapse />
      <AppSidebar />
      <main className='flex-1 flex'>
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
