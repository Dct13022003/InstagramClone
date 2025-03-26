import { Router } from 'express'
import { bookmarkController, unBookmarkController } from '~/controllers/bookmark.controllers'
import { accessTokenValidator } from '~/middlewares/user.middlewares'
import { wrapAsync } from '~/utils/handler'
const bookmarkRouter = Router()

/**
 * Description. Bookmark route
 * Route: /
 * Method: POST
 * Headers: {Authorization: Bearer <access_token>}
 * Body: {refresh_token: string}
 */
bookmarkRouter.post('/', accessTokenValidator, wrapAsync(bookmarkController))

/**
 * Description. unbookmark route
 * Route: /posts/:post_id
 * Method: DELETE
 * Headers: {Authorization: Bearer <access_token>}
 */
bookmarkRouter.delete('/posts/:post_id', accessTokenValidator, wrapAsync(unBookmarkController))
export default bookmarkRouter
