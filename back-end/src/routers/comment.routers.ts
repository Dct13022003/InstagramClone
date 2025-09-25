import { Router } from 'express'
import {
  createCommentController,
  getCommentController,
  getCommentRepliesController,
  likeCommentController,
  unlikeCommentController
} from '~/controllers/comment.controller'
import { postValidator } from '~/middlewares/post.middlewares'
import { accessTokenValidator } from '~/middlewares/user.middlewares'
import { wrapAsync } from '~/utils/handler'
const commentsRouter = Router()
/**
 * Description. Create comment
 * Route: /:post_id
 * Method: POST
 * Headers: {Authorization: Bearer <access_token>}
 * Body: {text: string, mentions: User[], post_id: string, parent_id: string}
 */
commentsRouter.post('/:post_id', accessTokenValidator, postValidator, wrapAsync(createCommentController))
/**
 * Description. Get all comments in post
 * Route: /:post_id
 * Method: GET
 * Headers: {Authorization: Bearer <access_token>}
 * Query: {post_id: string, limit: number, page: number}
 */
commentsRouter.get('/:post_id', accessTokenValidator, wrapAsync(getCommentController))
/**
 * Description. Like comments in post
 * Route: /:comment_id/like
 * Method: GET
 * Headers: {Authorization: Bearer <access_token>}
 *
 */
commentsRouter.post('/:comment_id/like', accessTokenValidator, wrapAsync(likeCommentController))
/**
 * Description. Unlike comments in post
 * Route: /:comment_id/unlike
 * Method: GET
 * Headers: {Authorization: Bearer <access_token>}
 *
 */
commentsRouter.post('/:comment_id/unlike', accessTokenValidator, wrapAsync(unlikeCommentController))
/**
 * Description. Get comment reply
 * Route: /:comment_id/unlike
 * Method: GET
 * Headers: {Authorization: Bearer <access_token>}
 *
 */
commentsRouter.get('/:comment_id/replies', accessTokenValidator, wrapAsync(getCommentRepliesController))
export default commentsRouter
