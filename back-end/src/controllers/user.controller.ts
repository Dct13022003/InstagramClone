import { NextFunction, Request, Response } from 'express'
import { httpStatus } from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/message'
import { TokenPayload } from '~/models/request/user.request'
import { User, IUser } from '~/models/user.models'
import userService from '~/services/user.services'

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password }: { username: string; email: string; password: string } = req.body
  await userService.register({ email, password, username })
  res.status(201).json({
    message: 'Account create successfully',
    success: true
  })
}
export const loginController = async (req: Request, res: Response) => {
  const user = req.user as IUser
  const user_id = user._id
  const user_verify = user.verify as string
  const result = await userService.login(user_id.toString(), user_verify)
  res.status(200).json({
    message: 'Login successfully',
    success: true,
    result
  })
}
export const logoutController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body
  await userService.logout(refresh_token)
  return res.status(200).json({ message: 'Logout successfully', success: true })
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
  const { user_id } = req.decode_authorization as TokenPayload
  const user = await userService.getProfile(user_id)
  return res.json({
    user
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
  const user_follower_id = req.body
  await userService.follow(user_id, user_follower_id)
  return res.json({
    message: USER_MESSAGES.FOLLOW_SUCCESS
  })
}
