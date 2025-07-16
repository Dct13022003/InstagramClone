import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { useRef } from 'react'
import { usePostModal } from '../../store/usePostModal.store'
import { ImagePlay } from 'lucide-react'

export function Modal() {
  const { isOpen, close } = usePostModal()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className=' w-[90vw] sm:w-[360px] md:w-[420px] lg:w-[480px] max-w-[855px] min-w-[320px] h-auto max-h-[90vh] min-h-[391px] rounded-xl text-center p-0'>
        <DialogHeader className='border-b flex items-center justify-center max-h-15 min-h-10'>
          <DialogTitle className='text-lg font-semibold text-center'>Tạo bài viết mới</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col items-center justify-center gap-4 py-6'>
          <div className='text-6xl text-gray-500'>
            <ImagePlay strokeWidth={1} absoluteStrokeWidth className='w-24 h-24 ' />
          </div>
          <p className='text-base font-medium text-gray-700'>Kéo ảnh và video vào đây</p>
          <button
            onClick={handleFileClick}
            className='bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded'
          >
            Chọn từ máy tính
          </button>

          <input
            type='file'
            accept='image/*,video/*'
            className='hidden'
            ref={fileInputRef}
            multiple
            onChange={(e) => {
              const files = e.target.files
              if (files?.length) {
                console.log('Selected files:', files)
              }
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
