import { Outlet, useLocation } from 'react-router-dom'
import AppSidebar from '../../components/App-sidebar'
import { SidebarProvider } from '../../components/ui/sidebar'
import { useMemo } from 'react'

export default function MainLayout() {
  const pathname = useLocation().pathname
  const defaultOpen = useMemo(() => !pathname.startsWith('/chat'), [])
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className='flex-1 flex'>
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
