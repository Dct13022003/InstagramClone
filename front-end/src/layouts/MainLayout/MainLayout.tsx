import { Outlet } from 'react-router-dom'
import AppSidebar from '../../components/App-sidebar'
import { SidebarProvider, SidebarTrigger } from '../../components/ui/sidebar'

export default function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <main className='flex-1 flex'>
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
