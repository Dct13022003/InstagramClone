import { Router } from 'express'
import { createPostController, getPostDetailController } from '~/controllers/post.controller'
import { createPostValidator, postValidator } from '~/middlewares/post.middlewares'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/user.middlewares'
import { wrapAsync } from '~/utils/handler'
const postsRouter = Router()
/**
 * Description. Create Post
 * Route: /
 * Method: POST
 * Headers: {Authorization: Bearer <access_token>}
 * Body:{caption?: string, hashtag?:string[],mention?:string[], media?:Media[]}
 */
postsRouter.post('/', accessTokenValidator, verifyUserValidator, createPostValidator, wrapAsync(createPostController))
/**
 * Description. Get detail post
 * Route: /:post_id
 * Method: GET
 * Headers: {Authorization: Bearer <access_token>}
 */
postsRouter.get('/:post_id', accessTokenValidator, postValidator, wrapAsync(getPostDetailController))
export default postsRouter
