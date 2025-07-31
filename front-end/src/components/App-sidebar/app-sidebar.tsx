import { Calendar, ChevronUp, Home, Inbox, Search, Settings, User2 } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '../ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Collapsible, CollapsibleTrigger } from '../ui/collapsible'
import { NavLink } from 'react-router-dom'

const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
    isActive: true
  },
  {
    title: 'Inbox',
    url: '/chat',
    icon: Inbox,
    isActive: false
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar,
    isActive: false
  },
  {
    title: 'Search',
    url: '#',
    icon: Search,
    isActive: false
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
    isActive: true
  }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarContent>
        <SidebarGroup className='h-full justify-between '>
          <SidebarGroupLabel className='text-xl mb-5'>Application</SidebarGroupLabel>
          <SidebarMenu className='h-full gap-2'>
            {items.map((item) => (
              <Collapsible key={item.title} asChild defaultOpen={item.isActive} className='group/collapsible'>
                <SidebarMenuItem className='h-1/8 flex items-center '>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className='w-full h-12 group-data-[collapsible=icon]:size-12!'
                      asChild
                    >
                      <NavLink to={item.url}>
                        {item.icon && <item.icon className='!w-8 !h-8' />}
                        <span className='ml-3 text-xl truncate group-data-[state=collapsed]:hidden'>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className='w-full'>
                      <User2 /> Xem thêm
                      <ChevronUp className='ml-auto' />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side='top' className='w-[--radix-popper-anchor-width]'>
                    <DropdownMenuItem>
                      <span>Account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
