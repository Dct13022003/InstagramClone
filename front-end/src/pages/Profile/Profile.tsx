import { BookmarkIcon, CameraIcon, ContactIcon, Grid3x3Icon, Settings } from 'lucide-react'
import { Button } from '../../components/ui/button'

export default function Profile() {
  return (
    <div className='w-full pt-8 py-8 md:mx-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex flex-col md:flex-row items-center md:items-start gap-6'>
          <div className='flex-1 flex justify-center items-center relative h-48 overflow-hidden'>
            {/* Bubble */}
            <div className='absolute top-2 left-1/2 -translate-x-1/2 -translate-y-1'>
              <div className='relative bg-white text-sm px-3 py-1 rounded-2xl shadow'>
                Ghi chú...
                <div className='absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 bg-white rounded-full shadow'></div>
              </div>
            </div>
            {/* Avatar */}
            <div className='w-42 h-42 rounded-full bg-gray-400 flex items-center justify-center text-4xl text-white'>
              <CameraIcon size={49} />
            </div>
          </div>

          <div className='flex-2 space-y-5 text-center md:text-left'>
            <div className='flex flex-col md:flex-row md:items-center gap-4'>
              <h2 className='text-2xl font-semibold'>dt.130203</h2>
              <div className='flex gap-2'>
                <Button variant='outline' className='bg-gray-200'>
                  Chỉnh sửa trang cá nhân
                </Button>
                <Button variant='outline' className='bg-gray-200'>
                  Xem kho lưu trữ
                </Button>
                <Button variant='outline' className='outline-0' size='icon'>
                  <Settings size={18} />
                </Button>
              </div>
            </div>
            <div className='flex gap-4 justify-center md:justify-start text-lg text-gray-500'>
              <span>
                <strong className='text-gray-700'>0</strong> bài viết
              </span>
              <span>
                <strong className='text-gray-700'>2</strong> người theo dõi
              </span>
              <span>
                Đang theo dõi <strong className='text-gray-700'>6</strong> người dùng
              </span>
            </div>
            <p className='font-medium'>Đoàn Công Tài</p>
          </div>
        </div>
        <div className='mt-10 flex gap-4'>
          <div className='flex flex-col items-center'>
            <div className='w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center text-2xl text-gray-400'>
              +
            </div>
            <span className='text-sm mt-1'>Mới</span>
          </div>
        </div>
        <div className='mt-6 md:border-b-0 border-t border-b-2'>
          <div className='grid grid-cols-3 md:flex justify-center md:space-x-20 text-sm text-gray-500  font-medium'>
            <button className='border-t-2 border-black py-4 flex items-center md:gap-2 gap-0.5 '>
              <Grid3x3Icon className='w-10 md:w-4' />
              <span className='hidden md:inline'>BÀI VIẾT</span>
            </button>
            <button className='border-t-2 border-black py-4 flex items-center md:gap-2 gap-0.5 '>
              <BookmarkIcon className='w-10 md:w-4' />
              <span className='hidden md:inline'>ĐÃ LƯU</span>
            </button>
            <button className='border-t-2 border-black py-4 flex items-center md:gap-2 gap-0.5 '>
              <ContactIcon className='w-10 md:w-4' />
              <span className='hidden md:inline'>ĐƯỢC GẮN THẺ</span>
            </button>
          </div>
        </div>
        <div className='flex justify-center items-center h-64 text-center text-gray-500 flex-col'>
          <div className='w-14 h-14 border border-black rounded-full flex items-center justify-center'>
            <CameraIcon />
          </div>
          <p className='mt-4'>Chưa có bài viết nào</p>
        </div>

        <div className='fixed bottom-4 right-4 flex items-center gap-2 bg-white shadow-lg rounded-full px-4 py-2'>
          <span>💬</span>
          <span className='font-medium'>Tin nhắn</span>
          <div className='flex -space-x-2'>
            <img src='https://i.pravatar.cc/20?img=1' className='w-6 h-6 rounded-full border' />
            <img src='https://i.pravatar.cc/20?img=2' className='w-6 h-6 rounded-full border' />
          </div>
        </div>
      </div>
    </div>
  )
}
