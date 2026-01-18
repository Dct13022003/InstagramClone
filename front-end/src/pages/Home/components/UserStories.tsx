import { useContext, useState } from 'react'
import { Avatar, AvatarImage } from '../../../components/ui/avatar'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../../../components/ui/carousel'
import { useStoriesBar } from '../hook/useStories'
import { AppContext } from '../../../context/app.context'
import { CirclePlus } from 'lucide-react'
import { ModalCreateStory } from './StoryModal'
import { Skeleton } from '../../../components/ui/skeleton'
import { useLocation, useNavigate } from 'react-router-dom'

export function UserStories() {
  const { profile } = useContext(AppContext)
  const { data: storiesBar, isLoading } = useStoriesBar()
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const openStory = (username: string) => {
    navigate(`/stories/${username}`, {
      state: { background: location }
    })
  }

  return (
    <>
      <Carousel className='w-full max-w-xl mt-5'>
        <CarouselContent className='-ml-1'>
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className='p-1'>
                  <Skeleton className='w-full aspect-square rounded-lg' />
                </div>
              </CarouselItem>
            ))}
          <CarouselItem className='relative pl-1 md:basis-1/4 lg:basis-1/6 hover:cursor-pointer'>
            <div className='flex items-center justify-center w-12 h-12 md:w-20 md:h-20 lg:w-22 lg:h-22 p-[3px] rounded-full'>
              <Avatar
                onClick={() => {
                  setIsOpen(true)
                }}
                className='w-full h-full'
              >
                <AvatarImage className='object-cover' src={profile?.profilePicture} />
              </Avatar>
            </div>
            <CirclePlus className='absolute bottom-1 right-1 text-white ' fill='black' />
          </CarouselItem>

          {storiesBar &&
            storiesBar.map((story) => (
              <CarouselItem
                key={story._id}
                onClick={() => openStory(story.author.username as string)}
                className='pl-1 md:basis-1/4 lg:basis-1/6 hover:cursor-pointer'
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 md:w-20 md:h-20 lg:w-22 lg:h-22 p-[3px] rounded-full ${story.hasUnseen ? ' bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600' : ''}`}
                >
                  <Avatar className='w-full h-full'>
                    <AvatarImage className='object-cover' src={story?.author.profilePicture} />
                  </Avatar>
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
        {storiesBar && storiesBar?.length > 5 && (
          <>
            <CarouselPrevious className='left-1' />
            <CarouselNext className='right-1' />
          </>
        )}
      </Carousel>
      <ModalCreateStory isOpen={isOpen} handleClose={() => setIsOpen(false)} />
    </>
  )
}
