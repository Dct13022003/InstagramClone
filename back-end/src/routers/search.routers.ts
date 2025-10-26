import { Router } from 'express'
import { saveSearchHistoryController, searchHistoryController, searchUserController } from '~/controllers/search.controllers'
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

/**
 * Description. history search
 * Route: /history
 * Method: GET
 * Headers: {Authorization: Bearer <access_token>}
 * Query : {query: string}
 */
searchRouter.get('/history', accessTokenValidator, wrapAsync(searchHistoryController))

/**
 * Description. history search
 * Route: /history
 * Method: post
 * Headers: {Authorization: Bearer <access_token>}
 * Query : {query: string}
 */
searchRouter.post('/history', accessTokenValidator, wrapAsync(saveSearchHistoryController))

export default searchRouter
