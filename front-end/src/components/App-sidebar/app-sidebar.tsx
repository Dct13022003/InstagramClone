import { BadgePlus, ChevronUp, Film, Heart, Home, Search, User2 } from 'lucide-react'
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
import { NavLink, useLocation } from 'react-router-dom'
import { useRef, useState } from 'react'
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON } from '../ui/sidebar'
import SearchOpen from '../../layouts/MainLayout/component/SearchOpen'
import { Explore, Message } from '../Icons/Icons'
import { usePostModalCreatePost } from '../../store/useCreatePostModal.store'

const items = [
  {
    title: 'Trang chủ',
    url: '/',
    icon: Home,
    isActive: true
  },
  {
    title: 'Tìm kiếm',
    url: '#',
    icon: Search,
    isActive: false
  },
  {
    title: 'Khám phá',
    url: '#',
    icon: Explore,
    isActive: false
  },
  {
    title: 'Reels',
    url: '/',
    icon: Film,
    isActive: false
  },
  {
    title: 'Tin nhắn',
    url: '/chat',
    icon: Message,
    isActive: false
  },
  {
    title: 'Thông báo',
    url: '#',
    icon: Heart,
    isActive: true
  },
  {
    title: 'Tạo',
    url: '#',
    icon: BadgePlus,
    isActive: true
  }
]
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { open, setOpen } = useSidebar()
  const { open: openModal } = usePostModalCreatePost()
  const pathname = useLocation().pathname
  const handleSearchClick = () => {
    if (searchOpen) {
      if (pathname.startsWith('/chat')) {
        setOpen(false)
      } else setOpen(true)
      setSearchOpen(false)
    } else {
      setSearchOpen(true)
      setOpen(false)
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }
  return (
    <div
      style={{
        paddingRight: open ? 0 : `calc(${SIDEBAR_WIDTH} - ${SIDEBAR_WIDTH_ICON})`
      }}
    >
      <Sidebar collapsible='icon' {...props}>
        <SidebarContent>
          <SidebarGroup className='h-full justify-between '>
            <SidebarGroupLabel className='text-xl mb-5'>Application</SidebarGroupLabel>
            <SidebarMenu className='h-full gap-2'>
              {items.map((item) => (
                <Collapsible key={item.title} asChild defaultOpen={item.isActive} className='group/collapsible'>
                  <SidebarMenuItem className='h-1/8 flex items-center '>
                    <CollapsibleTrigger asChild>
                      {item.title === 'Tìm kiếm' ? (
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
                          onClick={() => {
                            if (open === false) {
                              setSearchOpen(false)
                            }
                            if (item.title === 'Tạo') {
                              openModal()
                            }
                          }}
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
      <SearchOpen searchOpen={searchOpen} open={open} />
    </div>
  )
}
