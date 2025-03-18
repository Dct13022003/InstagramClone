import { Router } from 'express'
import {
  changePasswordController,
  emailVerifyController,
  followController,
  forgotPasswordController,
  forgotPasswordVerifyController,
  getProfileController,
  loginController,
  registerController,
  resendEmailVerifyController,
  resetPasswordController,
  unFollowController,
  updateProfileController
} from '~/controllers/user.controller'
import {
  emailVerifyTokenValidator,
  forgotPasswordTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  accessTokenValidator,
  verifyUserValidator,
  verifyUpdateUserValidator,
  followValidator,
  unFollowValidator,
  changePasswordValidator
} from '~/middlewares/user.middlewares'
import { logoutController } from '~/controllers/user.controller'
import { wrapAsync } from '~/utils/handler'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { UpdateProfile } from '~/models/request/user.request'
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
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))
/**
 * Description. Verify-email route
 * Route: /verify-email
 * Method: POST
 * Body: {email_verify_token: string}
 */
userRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyController))

/**
 * Description. Resend verify email when user click on the link
 * Route: /resend-verify-email
 * Method: POST
 * Headers: {Authorization: Bearer <access_token>}
 * Body: {}
 */
userRouter.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendEmailVerifyController))
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
/**
 * Description. reset password
 * Route: /reset-password
 * Method: POST
 * Body: {forgot_password_token: string, password:string, confirm_password:string}
 */
userRouter.post('/reset-password', resetPasswordValidator, wrapAsync(resetPasswordController))

/**
 * Description. get profile
 * Route: /get-profile
 * Method: GET
 * Headers: {Authorization: Bearer <access_token>}
 */
userRouter.get('/get-profile', accessTokenValidator, wrapAsync(getProfileController))

/**
 * Description. update profile
 * Route: /update-profile
 * Method: Patch
 * Headers: {Authorization: Bearer <access_token>}
 * Body: {bio:string,gender:string,profilePicture:string}
 */
userRouter.patch(
  '/update-profile',
  accessTokenValidator,
  filterMiddleware<UpdateProfile>(['bio', 'gender', 'profilePicture']),
  verifyUserValidator,
  verifyUpdateUserValidator,
  wrapAsync(updateProfileController)
)

/**
 * Description. follow someone
 * Route: /follow
 * Method: POST
 * Headers: {Authorization: Bearer <access_token>}
 * Body: {user_id_follow}
 */
userRouter.post('/follow', accessTokenValidator, verifyUserValidator, followValidator, wrapAsync(followController))

/**
 * Description. unfollow someone
 * Route: /follow/:user_id
 * Method: DELETE
 * Headers: {Authorization: Bearer <access_token>}
 */
userRouter.delete(
  '/follow/:user_id_unfollow',
  accessTokenValidator,
  verifyUserValidator,
  unFollowValidator,
  wrapAsync(unFollowController)
)

/**
 * Description. Change password
 * Route: /change-password
 * Method: PUT
 * Headers: {Authorization: Bearer <access_token>}
 */
userRouter.put(
  '/change-password',
  accessTokenValidator,
  verifyUserValidator,
  changePasswordValidator,
  wrapAsync(changePasswordController)
)
export default userRouter
