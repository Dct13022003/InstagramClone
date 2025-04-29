export interface SuccessResponse<T> {
  message: string
  result: T
}
export interface ErrorResponse {
  message: string
  error: string
}
