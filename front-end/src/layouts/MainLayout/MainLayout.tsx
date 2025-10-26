import { Outlet, useLocation } from 'react-router-dom'
import AppSidebar from '../../components/App-sidebar'
import { SidebarProvider, useSidebar } from '../../components/ui/sidebar'
import { useEffect } from 'react'

export default function MainLayout() {
  function SidebarAutoCollapse() {
    const { setOpen } = useSidebar()
    const pathname = useLocation().pathname
    useEffect(() => {
      if (pathname.startsWith('/chat')) {
        setOpen(false)
      } else {
        setOpen(true)
      }
      console.log('render')
    }, [pathname])

    return null
  }
  return (
    <SidebarProvider>
      <SidebarAutoCollapse />
      <AppSidebar />
      <Outlet />
    </SidebarProvider>
  )
}
