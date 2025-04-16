import { Router } from 'express'
import { searchController } from '~/controllers/search.controllers'
import { accessTokenValidator } from '~/middlewares/user.middlewares'
import { wrapAsync } from '~/utils/handler'

const searchRouter = Router()
/**
 * Description. search by username or bio
 * Route: /
 * Method: GET
 * Headers: {Authorization: Bearer <access_token>}
 * Query : {query: string}
 */
searchRouter.get('/search/', accessTokenValidator, wrapAsync(searchController))
