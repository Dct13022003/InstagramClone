import { AuthResponse } from '../types/auth.type'
import http from '../utils/http'

export const URL_LOGIN = '/users/login'
export const URL_REGISTER = '/users/register'
export const URL_LOGOUT = '/users/logout'
export const URL_REFRESH_TOKEN = '/users/refreshToken'
export const URL_EMAIL_VERIFY = '/users/verify-email'
export const login = (body: { email: string; password: string }) => http.post<AuthResponse>(URL_LOGIN, body)
export const registerUser = (body: {
  email: string
  password: string
  confirm_password: string
  username: string
  fullname: string
}) => http.post<AuthResponse>('/register', body)
export const logout = (body: { refresh_token: string }) => http.post<AuthResponse>(URL_LOGOUT, body)
export const refreshToken = (body: { refresh_token: string }) => http.post<AuthResponse>(URL_REFRESH_TOKEN, body)
export const emailVerify = (body: { email_verify_token: string }) => http.post<AuthResponse>(URL_EMAIL_VERIFY, body)
