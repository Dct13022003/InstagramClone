import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { useContext, useRef, useState } from 'react'
import { ArrowLeft, ImagePlay, XIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { AppContext } from '../../context/app.context'
import { createPost } from '../../apis/post.api'
import { useMutation } from '@tanstack/react-query'
import { uploadImages } from '../../apis/media.api'
import { usePostModalCreatePost } from '../../store/useCreatePostModal.store'

export function ModalCreatePost() {
  const { isOpen, close, images, setImages, reset } = usePostModalCreatePost()
  const [caption, setCaption] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [step, setStep] = useState<1 | 2>(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { profile } = useContext(AppContext)

  const useCreatePost = useMutation({
    mutationFn: createPost
  })
  const useUploadMedia = useMutation({
    mutationFn: uploadImages
  })

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setImages(files)
    const urls = files.map((file) => URL.createObjectURL(file))
    setPreviews(urls)
  }

  const handleClose = () => {
    setPreviews([])
    reset()
    setStep(1)
    setIsSubmitted(false)
    close()
  }

  const handleSubmitPost = async () => {
    const files = images
    if (!files || files.length === 0) return

    const formData = new FormData()
    files.forEach((file) => formData.append('image', file))

    try {
      const result = await useUploadMedia.mutateAsync(formData)
      const urls = result.map((item) => item.url)
      useCreatePost.mutate(
        { caption, imageUrl: urls, hashtags: [], mentions: [] },
        {
          onSuccess: () => {
            setIsSubmitted(true)
            setTimeout(() => {
              handleClose()
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

  const isPending = useCreatePost.isPending || useUploadMedia.isPending

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {isOpen && (
        <DialogClose asChild>
          <button className='absolute top-2 right-2 z-51 bg-white rounded-full p-2 shadow-md'>
            <XIcon size={20} />
          </button>
        </DialogClose>
      )}
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
              <DialogTitle className='text-lg font-semibold text-center'>
                {step === 1 ? 'Tạo bài viết' : 'Xem trước và thêm caption'}
              </DialogTitle>

              {previews.length > 0 &&
                (step === 1 ? (
                  <Button
                    onClick={() => setStep(2)}
                    className='fixed top-2.5 right-1 bg-white text-blue-600 text-lg hover:bg-transparent hover:text-inherit hover:shadow-none'
                  >
                    Tiếp
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmitPost}
                    className='fixed top-2.5 right-1 bg-white text-blue-600 text-lg hover:bg-transparent hover:text-inherit hover:shadow-none'
                  >
                    Chia sẻ
                  </Button>
                ))}

              {step === 2 && (
                <Button
                  onClick={() => setStep(1)}
                  className='fixed top-2.5 left-1 bg-white text-blue-600 text-lg hover:bg-transparent hover:text-inherit hover:shadow-none'
                >
                  <ArrowLeft />
                </Button>
              )}
            </DialogHeader>

            {step === 1 && (
              <div className='flex flex-col items-center justify-center gap-4'>
                {previews.length == 0 ? (
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
                      multiple
                      onChange={handleFileChange}
                    />
                  </>
                ) : (
                  <div className='w-full aspect-square'>
                    <Carousel className='w-full h-full '>
                      <CarouselContent className='-ml-0'>
                        {previews.map((src, idx) => (
                          <CarouselItem key={idx} className='aspect-square relative '>
                            <img
                              src={src}
                              className='absolute inset-0 w-full h-full object-cover rounded-br-xl rounded-bl-xl'
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className='absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full p-2' />
                      <CarouselNext className='absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full p-2' />
                    </Carousel>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className='flex gap-4'>
                {previews.length > 0 && (
                  <div className='sm:w-[360px] lg:w-[400px] aspect-square'>
                    <Carousel className='w-full h-full '>
                      <CarouselContent className='-ml-0'>
                        {previews.map((src, idx) => (
                          <CarouselItem key={idx} className='aspect-square relative '>
                            <img src={src} className='absolute inset-0 w-full h-full object-cover rounded-bl-xl' />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className='absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full p-2' />
                      <CarouselNext className='absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full p-2' />
                    </Carousel>
                  </div>
                )}
                <div
                  className={`lg:w-[320px] sm:w-[100px] h-full transition-all duration-300 ${
                    step === 2 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
                  }`}
                >
                  <div className='flex flex-col '>
                    <div className='flex items-center gap-3'>
                      <Avatar className='my-6'>
                        <AvatarImage className='object-cover' src={profile?.profilePicture} />
                        <AvatarFallback />
                      </Avatar>
                      <span className='font-medium'>{profile?.username}</span>
                    </div>
                    <textarea
                      rows={10}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className='my-2 border-none focus:outline-none focus:ring-0 resize-none'
                      placeholder='Viết caption...'
                    />
                    <input placeholder='Tag bạn bè...' />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
