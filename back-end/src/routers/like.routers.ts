import { Router } from 'express'
import { likeController, unlikeController } from '~/controllers/like.controller'
import { accessTokenValidator } from '~/middlewares/user.middlewares'
import { wrapAsync } from '~/utils/handler'
const likeRouter = Router()

/**
 * Description. Bookmark route
 * Route: /
 * Method: POST
 * Headers: {Authorization: Bearer <access_token>}
 * Body: {refresh_token: string}
 */
likeRouter.post('/', accessTokenValidator, wrapAsync(likeController))

/**
 * Description. unlike route
 * Route: /posts/:post_id
 * Method: DELETE
 * Headers: {Authorization: Bearer <access_token>}
 */
likeRouter.delete('/posts/:post_id', accessTokenValidator, wrapAsync(unlikeController))
export default likeRouter
