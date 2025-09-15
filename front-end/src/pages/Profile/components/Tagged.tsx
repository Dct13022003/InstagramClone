import { CameraIcon } from 'lucide-react'

export default function Tagged() {
  return (
    <div>
      <div className='w-14 h-14 border border-black rounded-full flex items-center justify-center'>
        <CameraIcon />
      </div>
      <span
        role='button'
        tabIndex={0}
        className='text-blue-500 hover:text-black cursor-pointer text-base font-semibold'
      >
        Chia sẻ ảnh đầu tiên của bạn
      </span>
    </div>
  )
}
