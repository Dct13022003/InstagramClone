import { AuthResponse } from '../types/auth.type'
import http from '../utils/http'

const API_URL = 'users'
export const login = (body: { email: string; password: string }) => http.post<AuthResponse>(API_URL + '/login', body)
export const registerUser = (body: {
  email: string
  password: string
  confirm_password: string
  username: string
  fullname: string
}) => http.post<AuthResponse>(API_URL + '/register', body)
