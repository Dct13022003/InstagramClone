import { Router } from 'express'
import { createCommentController } from '~/controllers/comment.controller'
import { createPostController, getNewFeedsController, getPostDetailController } from '~/controllers/post.controller'
import { checkPageAndLimit } from '~/middlewares/common.middlewares'
import { postValidator } from '~/middlewares/post.middlewares'
import { accessTokenValidator } from '~/middlewares/user.middlewares'
import { wrapAsync } from '~/utils/handler'
const postsRouter = Router()
/**
 * Description. Create Post
 * Route: /
 * Method: POST
 * Headers: {Authorization: Bearer <access_token>}
 * Body:{caption?: string, hashtag?:string[],mention?:string[], media?:Media[]}
 */
postsRouter.post('/', accessTokenValidator, wrapAsync(createPostController))
/**
 * Description. Get detail post
 * Route: /:post_id
 * Method: GET
 * Headers: {Authorization: Bearer <access_token>}
 */
postsRouter.get('/:post_id', accessTokenValidator, postValidator, wrapAsync(getPostDetailController))
/**
 * Description. Get new feeds
 * Route: /
 * Method: GET
 * Headers: {Authorization: Bearer <access_token>}
 */
postsRouter.get('/', accessTokenValidator, checkPageAndLimit, wrapAsync(getNewFeedsController))
/**
 * Description: Post comment
 * Route: /:post_id/comments/
 * Method: POST
 * Headers: {Authorization: Bearer <access_token>}
 * Body:{caption?: string, hashtag?:string[],mention?:string[], media?:Media[]}
 */
postsRouter.post(
  '/:post_id/comments/',
  accessTokenValidator,
  // checkPageAndLimit,
  // postValidator,
  wrapAsync(createCommentController)
)
export default postsRouter
