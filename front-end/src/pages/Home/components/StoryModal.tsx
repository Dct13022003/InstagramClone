import { ImagePlay, XIcon } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { uploadImages } from '../../../apis/media.api'
import { useCreateStory } from '../hook/useStories'

type ModalCreateStoryProps = {
  isOpen: boolean
  handleClose: () => void
}

export function ModalCreateStory({ isOpen, handleClose }: ModalCreateStoryProps) {
  const useUploadMedia = useMutation({
    mutationFn: uploadImages
  })
  const { mutate: mutateStory, isPending: createStoryPending } = useCreateStory()
  const [image, setImage] = useState<File>(null)
  const [preview, setPreview] = useState<string>(null)
  const [step] = useState<1 | 2>(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files
    if (!file) return
    setImage(file[0])
    const urls = URL.createObjectURL(file[0])
    setPreview(urls)
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }
  const handleSubmitPost = async () => {
    const file = image
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const result = await useUploadMedia.mutateAsync(formData)
      const duration = result[0].type === 'video' ? 15 : 5

      mutateStory(
        { mediaUrl: result[0].url, mediaType: result[0].type, duration },
        {
          onSuccess: () => {
            setIsSubmitted(true)
            setTimeout(() => {
              handleCloseModal()
            }, 2000)
          },
          onError: (error) => {
            console.error('Error creating post:', error)
            alert('Failed to create post. Please try again.')
          }
        }
      )
    } catch (error) {
      console.error('Error uploading media:', error)
      alert('Failed to upload media. Please try again.')
    }
  }

  const handleCloseModal = () => {
    if (preview) URL.revokeObjectURL(preview)
    setImage(null)
    setPreview(null)
    setIsSubmitted(false)
    handleClose()
  }
  const isPending = createStoryPending || useUploadMedia.isPending
  if (!isOpen) return null
  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      {
        <DialogClose asChild>
          <button
            className='absolute top-2 right-2 z-51 bg-white rounded-full p-2 shadow-md'
            onClick={handleCloseModal}
          >
            <XIcon size={20} />
          </button>
        </DialogClose>
      }
      <DialogContent
        showCloseButton={false}
        className={`${
          step === 1 ? 'sm:w-[360px] lg:w-[400px]' : 'sm:w-[480px] lg:w-[740px]'
        } sm:max-w-3xl min-w-[320px] h-auto max-h-[90vh] min-h-[391px] rounded-xl text-center p-0 gap-0 transition-all duration-300`}
      >
        {isSubmitted ? (
          <div className='flex flex-col items-center justify-center p-6 gap-4 h-full'>
            <div className='text-green-500'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-20 w-20'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
            </div>
            <p className='text-green-600 font-semibold'>Đăng bài thành công!</p>
          </div>
        ) : isPending ? (
          <>
            <DialogHeader className='border-b flex items-center justify-center max-h-15 min-h-13'>
              <DialogTitle className='text-lg font-semibold text-center'>Đang đăng bài...</DialogTitle>
            </DialogHeader>
            <div className='flex flex-col items-center justify-center p-6 gap-4 h-full'>
              <div className='w-20 h-20 rounded-full border-4 border-gray-300 border-t-blue-500 animate-spin' />
              <p className='text-gray-600'>Đang chia sẻ...</p>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className='border-b flex items-center justify-center max-h-15 min-h-13'>
              <DialogTitle className='text-lg font-semibold text-center'>Tạo tin mới</DialogTitle>
              {preview && (
                <Button
                  onClick={handleSubmitPost}
                  className='fixed top-2.5 right-1 bg-white text-blue-600 text-lg hover:bg-transparent hover:text-inherit hover:shadow-none'
                >
                  Tạo tin
                </Button>
              )}
            </DialogHeader>

            {step === 1 && (
              <div className='flex flex-col items-center justify-center gap-4'>
                {!preview ? (
                  <>
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
                      onChange={handleFileChange}
                    />
                  </>
                ) : (
                  <div className='w-full aspect-square'>
                    <img src={preview} className='inset-0 w-full h-full object-cover rounded-br-xl rounded-bl-xl' />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
