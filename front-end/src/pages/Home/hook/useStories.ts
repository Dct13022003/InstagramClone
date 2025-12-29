import { useMutation, useQuery } from '@tanstack/react-query'
import { createStory, fetchStoryFeed, fetchStoryUser } from '../../../apis/story.api'

export const useStoryFeed = () => {
  return useQuery({
    queryKey: ['story', 'feed'],
    queryFn: () => fetchStoryFeed()
  })
}

export const useCreateStory = () => {
  return useMutation({
    mutationFn: ({ mediaUrl, mediaType, duration }: { mediaUrl: string; mediaType: string; duration: number }) => {
      return createStory({ mediaUrl, mediaType, duration })
    }
  })
}

export const useStoryUser = (username: string) => {
  return useQuery({
    queryKey: ['stories', username],
    queryFn: () => fetchStoryUser(username)
  })
}
