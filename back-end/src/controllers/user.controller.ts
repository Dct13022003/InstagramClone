import { NextFunction, Request, Response } from 'express'
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
  const result = await userService.login(user_id.toString())
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

export const getProfile = async ({ req, res }: { req: Request; res: Response }) => {
  try {
    const userId: string = req.params.id
    const user = await User.findById(userId)
    return res.status(200).json({
      user,
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}
