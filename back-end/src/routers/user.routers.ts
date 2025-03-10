import { Router } from 'express'
import { loginController, registerController } from '~/controllers/user.controller'
import { loginValidator, RefreshTokenValidator, registerValidator } from '~/middlewares/user.middlewares'
import { logoutController } from '~/controllers/user.controller'
import { AccessTokenValidator } from '~/middlewares/user.middlewares'
import { wrapAsync } from '~/utils/handler'
const userRouter = Router()
/**
 * Description. Login route
 * Route: /login
 * Method: POST
 * Body:{email: string, password: string}
 */
userRouter.post('/login', loginValidator, wrapAsync(loginController))
/**
 * Description. Register route
 * Route: /register
 * Method: POST
 * Body:{email: string, password: string, username: string}
 */
userRouter.post('/register', registerValidator, wrapAsync(registerController))
/**
 * Description. Logout route
 * Route: /logout
 * Method: POST
 * Headers: {Authorization: Bearer <access_token>}
 * Body: {refresh_token: string}
 */
userRouter.post('/logout', AccessTokenValidator, RefreshTokenValidator, wrapAsync(logoutController))

export default userRouter
