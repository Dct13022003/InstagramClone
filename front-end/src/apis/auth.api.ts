import { AuthResponse } from '../types/auth.type'
import http from '../utils/http'

const API_URL = 'users/login'
export const login = (body: { email: string; password: string }) => http.post<AuthResponse>(API_URL, body)
export const register = (body: { email: string; password: string; confirm_password: string }) =>
  http.post<AuthResponse>(API_URL, body)
