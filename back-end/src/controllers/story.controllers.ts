import { Request, Response, NextFunction } from 'express'
import { STORY_MESSAGES } from '~/constants/message'
import { TokenPayload } from '~/models/request/user.request'
import { storyService } from '~/services/story.services'

export const createStory = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { mediaUrl, mediaType, duration } = req.body
  const story = await storyService.createStory({ user_id, mediaUrl, mediaType, duration })
  return res.json({
    message: STORY_MESSAGES.CREATE_STORY_SUCCESS,
    story
  })
}

export const getStoryUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params
  try {
    const result = await storyService.getStoryUser(username)
    return res.json({
      message: STORY_MESSAGES.GET_STORY_FEED_SUCCESS,
      result
    })
  } catch (err) {
    next(err)
  }
}

export const getStoryBar = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await storyService.getStoryBar(user_id)
  return res.json({
    message: STORY_MESSAGES.GET_STORY_FEED_SUCCESS,
    result
  })
}

export const getStoryFeed = async (req: Request, res: Response) => {
  const { userIds } = req.query as { userIds: string[] }
  const result = await storyService.getStoryFeed(userIds)
  return res.json({
    message: STORY_MESSAGES.GET_STORY_FEED_SUCCESS,
    result
  })
}
