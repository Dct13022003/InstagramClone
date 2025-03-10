import express from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { httpStatus } from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/error/error'

const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // sequential processing, stops running validations chain if one fails.
    await validation.run(req)
    const result = validationResult(req)
    if (result.isEmpty()) {
      return next()
    }
    const errorsObject = result.mapped()
    const entityError = new EntityError({ errors: {} })
    for (const k in errorsObject) {
      const { msg } = errorsObject[k]
      if (msg instanceof ErrorWithStatus && msg.status != httpStatus.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      entityError.errors[k] = errorsObject[k]
    }
    next(entityError)
  }
}

export default validate
