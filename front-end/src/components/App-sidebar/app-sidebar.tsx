import { Calendar, ChevronUp, Home, Inbox, Search, Settings, User2 } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '../ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Collapsible, CollapsibleTrigger } from '../ui/collapsible'
import { NavLink } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

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
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { setOpen } = useSidebar()
  const { toggleSidebar } = useSidebar()

  const handleSearchClick = () => {
    console.log(searchOpen)
    if (searchOpen) {
      // If search is open, close it and expand sidebar
      setSearchOpen(false)
      setOpen(true)
      console.log(setOpen)
      console.log('Search closed, sidebar expanded')
    } else {
      // If search is closed, open it and collapse sidebar
      setSearchOpen(true)
      setOpen(false)
      console.log(setOpen)
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setSearchOpen(false)
        setOpen(true) // Expand sidebar when closing search
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchInputRef, setOpen])
  return (
    <div className='relative flex'>
      <Sidebar collapsible='icon' {...props}>
        <SidebarContent>
          <SidebarGroup className='h-full justify-between '>
            <SidebarGroupLabel className='text-xl mb-5'>Application</SidebarGroupLabel>
            <SidebarMenu className='h-full gap-2'>
              {items.map((item) => (
                <Collapsible key={item.title} asChild defaultOpen={item.isActive} className='group/collapsible'>
                  <SidebarMenuItem className='h-1/8 flex items-center '>
                    <CollapsibleTrigger asChild>
                      {item.title === 'Search' ? (
                        <SidebarMenuButton
                          tooltip={item.title}
                          className='w-full h-12 group-data-[collapsible=icon]:size-12!'
                          asChild
                          onClick={handleSearchClick}
                        >
                          <button type='button'>
                            {item.icon && <item.icon className='!w-8 !h-8' />}
                            <span className='ml-3 text-xl truncate group-data-[state=collapsed]:hidden'>
                              {item.title}
                            </span>
                          </button>
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          tooltip={item.title}
                          className='w-full h-12 group-data-[collapsible=icon]:size-12!'
                          asChild
                        >
                          <NavLink to={item.url}>
                            {item.icon && <item.icon className='!w-8 !h-8' />}
                            <span className='ml-3 text-xl truncate group-data-[state=collapsed]:hidden'>
                              {item.title}
                            </span>
                          </NavLink>
                        </SidebarMenuButton>
                      )}
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
      <div
        className={`
          fixed top-0 h-full bg-white shadow-lg 
          transform transition-transform duration-300 ease-out
          ${searchOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ left: 'var(--sidebar-width,64px)' }}
      >
        <div className='w-[400px] h-full p-4'>
          <input
            ref={searchInputRef}
            type='text'
            placeholder='Tìm kiếm...'
            className='w-full border rounded px-3 py-2'
            autoFocus
          />
          <div className='mt-2'>
            <div className='py-2 px-3 hover:bg-gray-100 cursor-pointer'>Gợi ý 1</div>
            <div className='py-2 px-3 hover:bg-gray-100 cursor-pointer'>Gợi ý 2</div>
          </div>
        </div>
      </div>
    </div>
  )
}
