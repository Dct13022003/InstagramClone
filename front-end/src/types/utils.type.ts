export interface SuccessResponse<T> {
  message: string
  result: T
}

type FieldErrorDetail = {
  msg: string
  [key: string]: any
}
export interface ErrorResponse<T> {
  message: string
  errors: Partial<Record<keyof T, string | FieldErrorDetail>>
}
