import { BadgePlus, Film, Heart, Home, Search } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '../ui/sidebar'
import { Collapsible, CollapsibleTrigger } from '../ui/collapsible'
import { NavLink } from 'react-router-dom'
import { useContext, useRef } from 'react'
import { Explore, Message } from '../Icons/Icons'
import { usePostModalCreatePost } from '../../store/useCreatePostModal.store'
import { useIsMobile } from '../../hooks/use-mobile'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { AppContext } from '../../context/app.context'
import { useSearchContext } from '../../layouts/MainLayout/SearchContext'
import SearchOpen from '../../layouts/MainLayout/component/SearchOpen'

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
    isActive: true
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
  const { setSearchOpen } = useSearchContext()
  const { setOpen } = useSidebar()
  const { profile } = useContext(AppContext)
  const { open: openModal } = usePostModalCreatePost()
  const isMobile = useIsMobile()
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const handleSearchClick = () => {
    setSearchOpen((prev) => {
      const next = !prev
      setOpen(!next)
      return next
    })
  }

  return (
    <div>
      <Sidebar collapsible='icon' {...props}>
        <SidebarContent>
          <SidebarGroup className='h-full justify-around items-center'>
            <SidebarMenu className={`h-full gap-2 `}>
              <SidebarGroupLabel className={`text-xl mb-5 ${isMobile ? 'hidden' : ''}`}>Application</SidebarGroupLabel>
              {!isMobile &&
                items.map((item) => (
                  <Collapsible key={item.title} defaultOpen={item.isActive} className='group/collapsible' asChild>
                    <SidebarMenuItem className='h-1/8 flex flex-1 items-center '>
                      <CollapsibleTrigger asChild>
                        {item.title === 'Tìm kiếm' ? (
                          <SidebarMenuButton
                            ref={searchButtonRef}
                            tooltip={item.title}
                            className={`w-full h-10 group-data-[collapsible=icon]:size-12!`}
                            asChild
                            onClick={handleSearchClick}
                          >
                            <button type='button'>
                              {item.icon && <item.icon className='!w-7 !h-7' />}
                              <span className={`ml-3 text-xl truncate ${isMobile ? 'hidden' : ''}`}>{item.title}</span>
                            </button>
                          </SidebarMenuButton>
                        ) : (
                          <SidebarMenuButton
                            tooltip={item.title}
                            className='w-full h-10 group-data-[collapsible=icon]:size-12!'
                            asChild
                            onClick={() => {
                              setSearchOpen(false)
                              if (item.title === 'Tạo') {
                                openModal()
                              }
                            }}
                          >
                            <NavLink to={item.url}>
                              {item.icon && <item.icon className='!w-7 !h-7' />}
                              <span className={`ml-3 text-xl truncate `}>{item.title}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        )}
                      </CollapsibleTrigger>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              {isMobile &&
                items.map((item) => (
                  <>
                    {item.title !== 'Tìm kiếm' && item.title !== 'Thông báo' && (
                      <SidebarMenuItem className='h-1/8 flex flex-1 items-center '>
                        <SidebarMenuButton
                          tooltip={item.title}
                          className='w-full h-10 group-data-[collapsible=icon]:size-12! justify-center'
                          asChild
                          onClick={() => {
                            if (item.title === 'Tạo') {
                              openModal()
                            }
                          }}
                        >
                          <NavLink to={item.url}>{item.icon && <item.icon className='!w-6 !h-6' />}</NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </>
                ))}
              <SidebarMenuItem className='flex-1'>
                <SidebarMenuButton
                  className={`w-full h-10 group-data-[collapsible=icon]:size-12!`}
                  asChild
                  onClick={handleSearchClick}
                >
                  <button type='button'>
                    <NavLink to='/' className='flex items-center gap-3'>
                      <Avatar>
                        <AvatarImage width={1} height={1} className='object-cover' src={profile?.profilePicture} />
                        <AvatarFallback />
                      </Avatar>
                      {!isMobile && <span className='ml-1 text-xl'>Trang cá nhân</span>}
                    </NavLink>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      
    </div>
  )
}
