import { Router } from 'express'
import { searchUserController } from '~/controllers/search.controllers'
import { accessTokenValidator } from '~/middlewares/user.middlewares'
import { wrapAsync } from '~/utils/handler'

const searchRouter = Router()
/**
 * Description. search by username
 * Route: /
 * Method: GET
 * Headers: {Authorization: Bearer <access_token>}
 * Query : {query: string}
 */
searchRouter.get('/', accessTokenValidator, wrapAsync(searchUserController))

export default searchRouter
