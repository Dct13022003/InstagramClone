import { useMutation, useQuery } from '@tanstack/react-query'
import { createStory, fetchStoryBar, fetchStoryFeed, fetchStoryUser } from '../../../apis/story.api'

export const useStoriesBar = () => {
  return useQuery({
    queryKey: ['storyBar'],
    queryFn: () => fetchStoryBar()
  })
}

export const useStoryCreate = () => {
  return useMutation({
    mutationFn: ({ mediaUrl, mediaType, duration }: { mediaUrl: string; mediaType: string; duration: number }) => {
      return createStory({ mediaUrl, mediaType, duration })
    }
  })
}

export const useStoriesUser = (username: string) => {
  return useQuery({
    queryKey: ['stories', username],
    queryFn: () => fetchStoryUser(username),
    staleTime: 1000 * 60
  })
}

export const useStoriesFeed = (userIds: string[]) => {
  return useQuery({
    queryKey: ['storyFeed', userIds],
    queryFn: () => fetchStoryFeed(userIds)
  })
}
