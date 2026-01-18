import { Router } from 'express'
import { createStory, getStoryBar, getStoryFeed, getStoryUser } from '~/controllers/story.controllers'
import { accessTokenValidator } from '~/middlewares/user.middlewares'
import { wrapAsync } from '~/utils/handler'
const storyRouter = Router()

/**
 * Description. create story route
 * Route: /stories
 * Method: POST
 * Headers: {Authorization: Bearer <access_token>}
 */
storyRouter.post('/', accessTokenValidator, wrapAsync(createStory))

/**
 * Description. get stories feed route
 * Route: /getStoryBar
 * Method: GET
 * Headers: {Authorization: Bearer <access_token>}
 */

storyRouter.get('/getStoryBar', accessTokenValidator, wrapAsync(getStoryBar))
/**
 * Description: get stories feed route
 * Route: /getStoryFeed
 * Method: GET
 * Params: {userIds:string[]}
 * Headers: {Authorization: Bearer <access_token>}
 */
storyRouter.get('/getStoryFeed', accessTokenValidator, wrapAsync(getStoryFeed))
/**
 * Description: get stories feed route
 * Route: /getStoryUser
 * Method: GET
 * Params : {username : string}
 * Headers: {Authorization: Bearer <access_token>}
 */
storyRouter.get('/:username', accessTokenValidator, wrapAsync(getStoryUser))


export default storyRouter
