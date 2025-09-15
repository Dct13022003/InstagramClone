import { Request, Response } from 'express'
import { httpStatus } from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/message'
import { TokenPayload } from '~/models/request/user.request'
import { User, IUser } from '~/models/user.models'
import { mediaService } from '~/services/media.services'
import userService from '~/services/user.services'

export const registerController = async (req: Request, res: Response) => {
  const {
    username,
    email,
    password,
    fullname
  }: { username: string; email: string; password: string; fullname: string } = req.body
  const result = await userService.register({ email, password, username, fullname })
  res.status(httpStatus.CREATED).json({
    message: USER_MESSAGES.REGISTER_SUCCESS,
    result
  })
}
export const loginController = async (req: Request, res: Response) => {
  const user = req.user as IUser
  const user_id = user._id
  const user_verify = user.verify as string
  const result = await userService.login(user_id.toString(), user_verify)
  res.status(httpStatus.OK).json({
    message: USER_MESSAGES.LOGIN_SUCCESS,
    result
  })
}
export const logoutController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body
  await userService.logout(refresh_token)
  return res.status(httpStatus.OK).json({ message: USER_MESSAGES.LOGOUT_SUCCESS })
}

export const refreshTokenController = async (req: Request, res: Response) => {
  const { user_id, verify } = req.decode_refresh_token as TokenPayload
  const { refresh_token } = req.body
  const result = await userService.refreshToken(user_id, verify as string, refresh_token)
  return res.json({ result })
}

export const emailVerifyController = async (req: Request, res: Response) => {
  const user_id = req.decode_email_verify_token?.user_id as string
  const user = await User.findById(user_id)
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({ message: USER_MESSAGES.USER_NOT_FOUND, success: false })
  }
  if (user?.email_verify_token === '') {
    return res.json({ message: USER_MESSAGES.EMAIL_IS_VERIFY_BEFORE, success: true })
  }
  await userService.emailVerify(user_id)
  return res.status(httpStatus.OK).json({ message: USER_MESSAGES.EMAIL_VERIFY_SUCCESS, success: true })
}
export const resendEmailVerifyController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const user = await User.findById(user_id)
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }
  if (user.email_verify_token === '') {
    return res.json({
      message: USER_MESSAGES.EMAIL_IS_VERIFY_BEFORE
    })
  }
  await userService.resendEmailVerify(user_id)
  return res.status(httpStatus.OK).json({
    message: USER_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
  })
}
export const forgotPasswordController = async (req: Request, res: Response) => {
  const user = req.user as IUser
  const user_id = user._id
  await userService.forgotPassword(user_id.toString())
  return res.json({
    message: USER_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
  })
}
export const forgotPasswordVerifyController = async (req: Request, res: Response) => {
  return res.json({
    message: USER_MESSAGES.VERIFY_PASSWORD_SUCCESS
  })
}

export const resetPasswordController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_forgot_password_token as TokenPayload
  const password = req.body.password
  await userService.resetPassword(user_id, password)
  return res.json({ message: USER_MESSAGES.RESET_PASSWORD_SUCCESS })
}

export const getProfileController = async (req: Request, res: Response) => {
  const { user_name } = req.params
  const result = await userService.getProfile(user_name)
  return res.json({
    result
  })
}

export const updateProfileController = async (req: Request, res: Response) => {
  const { body } = req
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await userService.updateProfile(user_id, body)
  res.json({ message: USER_MESSAGES.UPDATE_PROFILE_SUCCESS, result })
}

export const followController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { user_id_follow } = req.body
  const result = await userService.follow(user_id, user_id_follow)
  return res.json({ result })
}

export const unFollowController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { user_id_unfollow } = req.params
  const result = await userService.unFollow(user_id, user_id_unfollow)
  return res.json({ result })
}
export const changePasswordController = async (req: Request, res: Response) => {
  const { password } = req.body
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await userService.changePassword(password, user_id)
  return res.json({
    message: USER_MESSAGES.CHANGE_PASSWORD_SUCCESS,
    result
  })
}

export const checkEmailExist = async (req: Request, res: Response) => {
  const { email } = req.body
  const result = await userService.checkEmail(email)
  if (result) {
    res.json({
      message: USER_MESSAGES.EMAIL_ALREADY_EXISTS
    })
  }
}

export const uploadAvatarController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const avatar = await mediaService.upLoadImage(req)
  const result = await userService.updateProfile(user_id, { profilePicture: avatar[0].url })
  return res.json({
    message: USER_MESSAGES.UPLOAD_AVATAR_SUCCESS,
    result
  })
}

export const getAllUserPostController = async (req: Request, res: Response) => {
  const { user_name } = req.params
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 6
  const result = await userService.getAllPostByUser(user_name, page, limit)
  return res.json({
    result
  })
}
