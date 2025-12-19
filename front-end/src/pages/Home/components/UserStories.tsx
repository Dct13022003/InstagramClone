import { Card, CardContent } from '../../../components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../../../components/ui/carousel'

export function UserStories() {
  return (
    <Carousel className='w-full max-w-xl mt-5'>
      <CarouselContent className='-ml-1'>
        {Array.from({ length: 10 }).map((_, index) => (
          <CarouselItem key={index} className='pl-1 md:basis-1/4 lg:basis-1/6'>
            <div className='w-12 h-12 md:w-20 md:h-20 lg:w-22 lg:h-22 p-[3px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'>
              <Card className='w-full h-full rounded-full '>
                <CardContent className='flex aspect-square items-center justify-center p-6'>
                  <span className='text-2xl font-semibold'>{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className='left-1' />
      <CarouselNext className='right-1' />
    </Carousel>
  )
}
