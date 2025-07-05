import axios, { AxiosError } from 'axios'
import { HttpStatusCode } from '../constants/httpstatuscode.enum'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}
export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status == HttpStatusCode.UnprocessableEntity
}
export function isAxiosUnAuthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status == HttpStatusCode.Unauthorized
}
export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosUnAuthorizedError<{ message: string }>(error) && error.response?.data.message === 'jwt expired'
}
