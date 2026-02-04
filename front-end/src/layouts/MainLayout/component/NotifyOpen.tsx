import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { fetchNotifications } from '../../../apis/notification.api'
import { Skeleton } from '../../../components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { usePanelContext } from '../PanelContext'
import { useSidebar } from '../../../components/ui/sidebar'
import { formatInstagramTime } from '../../../utils/time'

export default function NotifyOpen() {
  const { notificationOpen } = usePanelContext()
  const { open } = useSidebar()
  const notifications = useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetchNotifications(),
    enabled: notificationOpen
  })

  return (
    <div
      className={`hidden md:block
          fixed top-0 h-full z-20
           bg-white w-[450px]
          transform transition-transform duration-500 ease-out rounded-br-lg rounded-tr-lg
           ${notificationOpen ? 'translate-x-2' : '-translate-x-full'}
        `}
      style={{
        left: open ? '0' : '64px',
        boxShadow: '0 0 10px 8px rgba(0, 0, 0, 0.15)'
      }}
    >
      <div className='p-6'>
        <h2 className='text-2xl font-semibold my-2 pb-9'>Thông báo</h2>
      </div>
      {notifications.isLoading && (
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-12 w-12 rounded-full' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-[250px]' />
            <Skeleton className='h-4 w-[200px]' />
          </div>
        </div>
      )}
      {notifications.data ? (
        <>
          <div className='space-y-2 pt-0'>
            {Array.isArray(notifications.data) &&
              notifications.data.map((notifi) => (
                <div key={notifi._id} className='flex items-center rounded-2xl justify-between hover:bg-gray-100 px-6 '>
                  <div className='flex items-center space-x-4'>
                    <Avatar className='my-2 w-13 h-13'>
                      <AvatarImage className='object-cover' src={notifi.senderId.profilePicture} />
                      <AvatarFallback />
                    </Avatar>
                    <div className='flex gap-2'>
                      <span className='font-semibold text-base'>{notifi.senderId.username}</span>
                      <span>{notifi.content}</span>
                      <span> {formatInstagramTime(notifi?.createdAt?.toString())}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <>
          <div className='border-t'></div>
          <>
            <div className='flex items-center justify-between mb-4 px-6 pt-6'>
              <h3 className='font-semibold text-gray-800'>Mới đây</h3>
              <button className='text-blue-600 text-sm font-medium hover:underline'>Xem tất cả</button>
            </div>
          </>
        </>
      )}
    </div>
  )
}
