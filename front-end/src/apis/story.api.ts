import { Story, StoryFeed, StoryResponse } from '../types/story.type'
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

export const fetchStoryFeed = async (): Promise<StoryFeed[]> => {
  const response = await http.get<SuccessResponse<StoryFeed[]>>(`${API_URL}/getStoryFeed`)
  return response.data.result
}

export const fetchStoryUser = async (username: string): Promise<StoryResponse> => {
  const response = await http.get<SuccessResponse<StoryResponse>>(`${API_URL}/${username}`)
  return response.data.result
}
