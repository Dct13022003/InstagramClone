import { Router } from 'express'
import { createCommentController, getCommentController } from '~/controllers/comment.controller'
import { postValidator } from '~/middlewares/post.middlewares'
import { accessTokenValidator } from '~/middlewares/user.middlewares'
import { wrapAsync } from '~/utils/handler'
const commentsRouter = Router()
/**
 * Description. Create comment
 * Route: /
 * Method: POST
 * Headers: {Authorization: Bearer <access_token>}
 * Body: {text: string, mentions: User[], post_id: string, parent_id: string}
 */
commentsRouter.post('/', accessTokenValidator, postValidator, wrapAsync(createCommentController))
/**
 * Description. Get all comments in post
 * Route: /:post_id
 * Method: GET
 * Headers: {Authorization: Bearer <access_token>}
 * Query: {post_id: string, limit: number, page: number}
 */
commentsRouter.get('/:post_id', accessTokenValidator, wrapAsync(getCommentController))
export default commentsRouter
