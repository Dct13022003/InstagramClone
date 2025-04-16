import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { SearchQuery } from '~/models/request/search.request'
import { searchService } from '~/services/search.services'

export const searchController = async (req: Request<ParamsDictionary, any, any, SearchQuery>, res: Response) => {
  const queryParam = req.query.queryParam
  const result = await searchService.search(queryParam)
  return res.json({
    result
  })
}
