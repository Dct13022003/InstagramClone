import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { pick } from 'lodash'
import validate from '~/utils/validation'

type FilterKeys<T> = Array<keyof T>

export const filterMiddleware =
  <T>(filterKeys: FilterKeys<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filterKeys)
    next()
  }

export const checkPageAndLimit = validate(
  checkSchema({
    limit: {
      isNumeric: true,
      custom: {
        options: async (value) => {
          const num = Number(value)
          if (num > 100) {
            throw new Error('Maximum is 100')
          }
          return true
        }
      }
    },
    page: {
      isNumeric: true
    }
  })
)
