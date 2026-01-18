import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarImage } from '../../../components/ui/avatar'
import { CircleChevronLeft, CircleChevronRight, Ellipsis, Pause, Play } from 'lucide-react'
import { StoryGroup } from '../../../types/story.type'

type PropsType = {
  onClose: () => void
  stories: StoryGroup[]
}

export default function StoryViewerA({ onClose, stories }: PropsType) {
  const [userIndex, setUserIndex] = useState(0)
  const [storyIndex, setStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const currentUser = stories[userIndex]
  const currentStory = currentUser?.stories[storyIndex]

  useEffect(() => {
    setProgress(0)
  }, [userIndex, storyIndex])

  useEffect(() => {
    if (isPaused || !currentStory) return

    const duration = 5000
    const step = 50
    const increment = (step / duration) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + increment >= 100) {
          clearInterval(timer)
          nextStory()
          return 0
        }
        return prev + increment
      })
    }, step)

    return () => clearInterval(timer)
  }, [userIndex, storyIndex, isPaused, currentStory.duration])

  function nextStory() {
    const isLastStory = storyIndex >= currentUser.stories.length - 1

    if (isLastStory) {
      nextUser()
    } else {
      setIsPaused(false)
      setStoryIndex((prev) => prev + 1)
    }
  }

  function prevStory() {
    if (storyIndex > 0) {
      setStoryIndex((prev) => prev - 1)
      setIsPaused(false)
    } else if (userIndex > 0) {
      const prevUser = stories[userIndex - 1]
      setUserIndex(userIndex - 1)
      setStoryIndex(prevUser.stories.length - 1)
      setIsPaused(false)
    }
  }

  function nextUser() {
    if (userIndex < stories.length - 1) {
      setIsPaused(false)
      setUserIndex((prev) => prev + 1)
      setStoryIndex(0)
    } else {
      onClose()
    }
  }

  /* ================= PAUSE WHEN TAB HIDDEN ================= */
  useEffect(() => {
    const onVisibilityChange = () => {
      setIsPaused(document.hidden)
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  /* ================= SYNC VIDEO PAUSE ================= */
  useEffect(() => {
    if (!videoRef.current) return
    if (isPaused) videoRef.current.pause()
    else videoRef.current.play().catch(() => {})
  }, [isPaused])

  if (!currentStory) return null

  return (
    <div className=' inset-0 bg-[#1a1a1a] z-50 flex items-center justify-center gap-3'>
      <div className='absolute top-4 left-4 text-white hidden sm:block'>INSTAGRAM</div>
      <button
        onClick={() => onClose()}
        className='absolute top-4 right-4 text-white text-2xl font-bold hover:cursor-pointer'
      >
        ✕
      </button>
      <div className='sm:hidden flex absolute inset-0  z-10'>
        <div className='w-1/2' onClick={prevStory} />
        <div className='w-1/2' onClick={nextStory} />
      </div>

      <CircleChevronLeft
        className='text-white sm:block hidden opacity-40 hover:cursor-pointer hover:opacity-100 '
        onClick={prevStory}
      />
      {/* Media */}
      <div className='relative h-full sm:aspect-[9/16] max-h-[90vh] sm:rounded-t-2xl overflow-hidden'>
        <div className='z-19'>
          {currentStory.type === 'image' ? (
            <img src={currentStory.mediaUrl} className='w-full h-full object-cover' />
          ) : (
            <video ref={videoRef} src={currentStory.mediaUrl} autoPlay muted className='w-full h-full object-cover' />
          )}
        </div>
        {/* Progress */}
        <div className='absolute top-1 left-4 right-4 gap-1 z-20 p-2'>
          <div className='top-1 left-4 right-4 flex gap-1 z-20'>
            {currentUser.stories.map((story, i) => (
              <div key={i} className='flex-1 h-1 bg-white/30'>
                <div
                  className='h-full bg-white transition-all'
                  style={{
                    width: i < storyIndex ? '100%' : i === storyIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>
          <div className='flex justify-between items-center gap-2 mt-2'>
            <div className='flex flex-1/2 gap-1 items-center'>
              <Avatar>
                <AvatarImage width={1} height={1} className='object-cover' src='https://i.pravatar.cc/150?img=2' />
              </Avatar>
              <span className='text-[rgb(255,255,255)]'>wyn.anh</span>
              <span className='text-[rgb(255,255,255)]'>5 giờ</span>
            </div>

            {isPaused ? (
              <Pause
                fill='rgb(255 255 255)'
                onClick={() => {
                  setIsPaused(false)
                }}
                height={20}
                width={20}
                className='text-[rgb(255,255,255)]'
              />
            ) : (
              <Play
                fill='rgb(255 255 255)'
                onClick={() => {
                  setIsPaused(true)
                }}
                height={20}
                width={20}
                className='text-[rgb(255,255,255)]'
              />
            )}

            <Ellipsis height={20} width={20} className='text-[rgb(255,255,255)]' />
          </div>
        </div>
      </div>
      <CircleChevronRight
        className='text-white sm:block hidden  opacity-40 hover:cursor-pointer hover:opacity-100'
        onClick={nextStory}
      />
    </div>
  )
}
