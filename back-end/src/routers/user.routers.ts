import { Router } from 'express'
import {
  emailVerifyController,
  forgotPasswordController,
  forgotPasswordVerifyController,
  loginController,
  registerController,
  resendEmailVerifyController
} from '~/controllers/user.controller'
import {
  EmailVerifyTokenValidator,
  forgotPasswordTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  RefreshTokenValidator,
  registerValidator
} from '~/middlewares/user.middlewares'
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
/**
 * Description. Verify-email route
 * Route: /verify-email
 * Method: POST
 * Body: {email_verify_token: string}
 */
userRouter.post('/verify-email', EmailVerifyTokenValidator, wrapAsync(emailVerifyController))

/**
 * Description. Resend verify email when user click on the link
 * Route: /resend-verify-email
 * Method: POST
 * Headers: {Authorization: Bearer <access_token>}
 * Body: {}
 */
userRouter.post('/resend-verify-email', AccessTokenValidator, wrapAsync(resendEmailVerifyController))
/**
 * Description.  verify email when user click on the link
 * Route: /forgot-password
 * Method: POST
 * Body: {email: string}
 */
userRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))
/**
 * Description.  verify email when user click on the link
 * Route: /forgot-password
 * Method: POST
 * Body: {forgot_password_token: string}
 */
userRouter.post('/verify-forgot-password', forgotPasswordTokenValidator, wrapAsync(forgotPasswordVerifyController))
export default userRouter
