import { Request, Response } from 'express'
import { TokenPayload } from '~/models/request/user.request'
import { searchService } from '~/services/search.services'

export const searchUserController = async (req: Request, res: Response) => {
  const { q, page, limit } = req.query
  if (!q || typeof q !== 'string' || q.trim().length === 0) {
    return res.status(400).json({ message: 'Query parameter "q" is required and must be a non-empty string.' })
  }
  const pageNum = parseInt(page as string) || 1
  const limitNum = parseInt(limit as string) || 6
  const result = await searchService.searchUser(q, pageNum, limitNum)
  return res.json({
    result
  })
}

export const searchHistoryController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await searchService.getSearchHistory(user_id)
  return res.json({
    result
  })
}

export const saveSearchHistoryController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { searchUserId } = req.body
  const result = await searchService.saveSearchHistory(user_id, searchUserId)
  return res.json({
    result
  })
}
