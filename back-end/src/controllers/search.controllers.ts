import { Request, Response } from 'express'
import { searchService } from '~/services/search.services'

export const searchUserController = async (req: Request, res: Response) => {
  const q = req.params.q as string
  const page = parseInt(req.params.page as string) || 1
  const limit = parseInt(req.params.limit as string) || 6
  const result = await searchService.searchUser(q, page, limit)
  return res.json({
    result
  })
}
