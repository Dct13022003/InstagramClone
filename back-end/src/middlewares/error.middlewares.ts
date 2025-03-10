import { NextFunction, Response, Request } from 'express'
import { omit } from 'lodash'
import { httpStatus } from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/error/error'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    res.status(err.status).json(omit(err, 'status'))
    return
  }
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true }) // Ensure all properties are enumerable
  })
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message, errorInfo: omit(err, 'stack') })
}
