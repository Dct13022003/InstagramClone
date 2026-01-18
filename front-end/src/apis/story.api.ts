import { Story, StoryBar, StoryGroup } from '../types/story.type'
import { SuccessResponse } from '../types/utils.type'
import http from '../utils/http'
const API_URL = 'stories'

export const createStory = async ({
  mediaUrl,
  mediaType,
  duration
}: {
  mediaUrl: string
  mediaType: string
  duration: number
}): Promise<Story> => {
  const response = await http.post<SuccessResponse<Story>>(`${API_URL}`, { mediaUrl, mediaType, duration })
  return response.data.result
}

export const fetchStoryBar = async (): Promise<StoryBar[]> => {
  const response = await http.get<SuccessResponse<StoryBar[]>>(`${API_URL}/getStoryBar`)
  return response.data.result
}

export const fetchStoryUser = async (username: string): Promise<StoryGroup> => {
  const response = await http.get<SuccessResponse<StoryGroup>>(`${API_URL}/${username}`)
  return response.data.result
}

export const fetchStoryFeed = async (userIds: string[]): Promise<StoryGroup[]> => {
  const response = await http.get<SuccessResponse<StoryGroup[]>>(`${API_URL}/getStoryFeed`, { params: { userIds } })
  return response.data.result
}
