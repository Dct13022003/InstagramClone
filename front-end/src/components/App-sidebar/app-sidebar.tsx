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
import { AnimatePresence, motion } from 'framer-motion'

import { NavLink } from 'react-router-dom'
import { useContext, useRef } from 'react'
import { Explore, Message } from '../Icons/Icons'
import { usePostModalCreatePost } from '../../store/useCreatePostModal.store'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { AppContext } from '../../context/app.context'
import { useSearchContext } from '../../layouts/MainLayout/SearchContext'

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
  const { state, isMobile } = useSidebar()
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
      <Sidebar collapsible='icon' {...props} variant='sidebar'>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu className='pl-2 pt-7'>
              <SidebarGroupLabel className={` mb-5  ${isMobile ? 'hidden' : ''}`}>
                <motion.div layout>
                  <AnimatePresence mode='wait'>
                    {state === 'collapsed' ? (
                      <motion.div
                        key='icon'
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      >
                        <img src='/instagram-svgrepo-com.svg' alt='logo' className='w-10' />
                      </motion.div>
                    ) : (
                      <motion.div
                        key='logo'
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <img src='/Instagram_logo.svg.png' alt='logo' className='w-30' />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </SidebarGroupLabel>
              {!isMobile &&
                items.map((item) => (
                  <SidebarMenuItem className='flex items-center h-12 p-1'>
                    {item.title === 'Tìm kiếm' ? (
                      <SidebarMenuButton
                        ref={searchButtonRef}
                        tooltip={item.title}
                        className='w-full  hover:cursor-pointer '
                        asChild
                        size={'lg'}
                        onClick={handleSearchClick}
                      >
                        <button type='button'>
                          {item.icon && <item.icon className='!w-7 !h-7' />}
                          <span className={`ml-3 text-base truncate ${isMobile ? 'hidden' : ''}`}>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        tooltip={item.title}
                        className='w-full '
                        asChild
                        size={'lg'}
                        onClick={() => {
                          setSearchOpen(false)
                          if (item.title === 'Tạo') {
                            openModal()
                          }
                        }}
                      >
                        <NavLink to={item.url}>
                          {item.icon && <item.icon className='!w-7 !h-7' />}
                          <span className={`ml-3 text-base truncate `}>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              {isMobile &&
                items.map((item) => (
                  <>
                    {item.title !== 'Tìm kiếm' && item.title !== 'Thông báo' && (
                      <SidebarMenuItem className='flex items-center h-12 justify-center'>
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
              <SidebarMenuItem className='flex-1 h-12 flex items-center'>
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
                      {!isMobile && <span className='ml-1 text-base'>Trang cá nhân</span>}
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
