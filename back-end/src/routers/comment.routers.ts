import { Router } from 'express'
import { createCommentController } from '~/controllers/comment.controller'
import { postValidator } from '~/middlewares/post.middlewares'
import { accessTokenValidator } from '~/middlewares/user.middlewares'
import { wrapAsync } from '~/utils/handler'
const commentsRouter = Router()
/**
 * Description. Create comment
 * Route: /
 * Method: POST
 * Headers: {Authorization: Bearer <access_token>}
 * Body: {text: string, mentions}
 */
commentsRouter.post('/posts/', accessTokenValidator, postValidator, wrapAsync(createCommentController))
export default commentsRouter
