import { checkSchema } from 'express-validator'
import { USER_MESSAGES } from '~/constants/message'
import { IUser, User } from '~/models/user.models'
import bcrypt from 'bcrypt'
import userService from '~/services/user.services'
import validate from '~/utils/validation'
import { verifyToken } from '~/utils/jwt'
import { ErrorWithStatus } from '~/models/error/error'
import { httpStatus } from '~/constants/httpStatus'
import { RefreshToken } from '~/models/refreshToken.model'
import { JsonWebTokenError } from 'jsonwebtoken'
import { Request } from 'express'

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
        },
        notEmpty: {
          errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user: IUser | null = await User.findOne({ email: value })
            if (user === null) throw new Error(USER_MESSAGES.USER_NOT_FOUND)
            else {
              const isMatch = await bcrypt.compare(req.body.password, user.password)
              if (!isMatch) throw new Error(USER_MESSAGES.PASS_IS_INCORRECT)
            }
            req.user = user
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGES.PASS_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGES.PASS_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 6,
            max: 20
          },
          errorMessage: USER_MESSAGES.PASS_MUST_BE_BETWEEN_6_AND_20_CHARACTERS
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minUppercase: 1,
            minSymbols: 0
          },
          errorMessage: USER_MESSAGES.PASS_MUST_BE_STRONG
        }
      }
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      username: {
        isLength: {
          options: {
            min: 1,
            max: 20
          },
          errorMessage: USER_MESSAGES.NAME_MUST_BE_BETWEEN_1_AND_20_CHARACTERS
        },
        notEmpty: {
          errorMessage: USER_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGES.NAME_MUST_BE_STRING
        },
        trim: true
      },
      email: {
        isEmail: {
          errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
        },
        notEmpty: {
          errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
        },
        trim: true,
        custom: {
          options: async (value) => {
            const result = await userService.checkEmail(value)
            if (result) throw new Error(USER_MESSAGES.EMAIL_ALREADY_EXISTS)
            return result
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USER_MESSAGES.PASS_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGES.PASS_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 6,
            max: 20
          },
          errorMessage: USER_MESSAGES.PASS_MUST_BE_BETWEEN_6_AND_20_CHARACTERS
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minUppercase: 1,
            minSymbols: 0
          },
          errorMessage: USER_MESSAGES.PASS_MUST_BE_STRONG
        }
      },
      confirm_password: {
        notEmpty: {
          errorMessage: USER_MESSAGES.CONFIRM_PASS_IS_REQUIRED
        },
        isString: {
          errorMessage: USER_MESSAGES.CONFIRM_PASS_MUST_BE_STRING
        },
        isLength: {
          options: {
            min: 6,
            max: 20
          },
          errorMessage: USER_MESSAGES.PASS_MUST_BE_BETWEEN_6_AND_20_CHARACTERS
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minUppercase: 1,
            minSymbols: 0
          },
          errorMessage: USER_MESSAGES.PASS_MUST_BE_STRONG
        }
      }
      // date_of_birth: {
      //   isISO8601: {
      //     options: {
      //       strict: true,
      //       strictSeparator: true
      //     }
      //   }
      // }
    },
    ['body']
  )
)

export const AccessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const access_token = (value || '').split(' ')[1]
            if (!access_token)
              throw new ErrorWithStatus({
                status: httpStatus.UNAUTHORIZED,
                message: USER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
              })
            const decode_authorization = await verifyToken({ token: access_token })
            ;(req as Request).decode_authorization = decode_authorization
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const RefreshTokenValidator = validate(
  checkSchema({
    refresh_token: {
      trim: true,
      custom: {
        options: async (value, { req }) => {
          if (!value) {
            throw new ErrorWithStatus({
              status: httpStatus.UNAUTHORIZED,
              message: USER_MESSAGES.REFRESH_TOKEN_IS_REQUIRED
            })
          }
          try {
            const [decode_refresh_token, refreshToken] = await Promise.all([
              verifyToken({ token: value }),
              RefreshToken.findOne({ token: value })
            ])
            ;(req as Request).decode_refresh_token = decode_refresh_token
            if (refreshToken === null) {
              throw new ErrorWithStatus({
                status: httpStatus.UNAUTHORIZED,
                message: USER_MESSAGES.REFRESH_TOKEN_NOT_FOUND
              })
            }
          } catch (error) {
            if (error instanceof JsonWebTokenError) {
              throw new ErrorWithStatus({
                status: httpStatus.UNAUTHORIZED,
                message: USER_MESSAGES.REFRESH_TOKEN_IN_VALID
              })
            } else throw error
          }
          return true
        }
      }
    }
  })
)
export const EmailVerifyTokenValidator = validate(
  checkSchema({
    email_verify_token: {
      trim: true,
      custom: {
        options: async (value, { req }) => {
          if (!value) {
            throw new ErrorWithStatus({
              status: httpStatus.UNAUTHORIZED,
              message: USER_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED
            })
          }

          const decode_email_verify_token = await verifyToken({
            token: value,
            SECRET_KEY: process.env.SECRET_KEY_EMAIL_VERIFICATION as string
          })
          ;(req as Request).decode_email_verify_token = decode_email_verify_token

          return true
        }
      }
    }
  })
)

export const forgotPasswordValidator = validate(
  checkSchema({
    email: {
      isEmail: {
        errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
      },
      notEmpty: {
        errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
      },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const user = await User.findOne({ email: value })
          if (!user) {
            throw new Error(USER_MESSAGES.USER_NOT_FOUND)
          }
          req.user = user
          return true
        }
      }
    }
  })
)
export const forgotPasswordTokenValidator = validate(
  checkSchema({
    forgot_password_token: {
      trim: true,
      custom: {
        options: async (value) => {
          if (!value) {
            throw new ErrorWithStatus({
              status: httpStatus.UNAUTHORIZED,
              message: USER_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED
            })
          }
          console.log(process.env.SECRET_KEY_FORGOT_PASSWORD)
          try {
            const decode_forgot_password_token = await verifyToken({
              token: value,
              SECRET_KEY: process.env.SECRET_KEY_FORGOT_PASSWORD as string
            })
            const { user_id } = decode_forgot_password_token
            const user = await User.findById(user_id)
            if (user === null) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.USER_NOT_FOUND,
                status: httpStatus.UNAUTHORIZED
              })
            }
            if (user.forgot_password_token != value) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.INVALID_FORGOT_PASSWORD,
                status: httpStatus.UNAUTHORIZED
              })
            }
          } catch (error) {
            if (error instanceof JsonWebTokenError) {
              throw new ErrorWithStatus({
                status: httpStatus.UNAUTHORIZED,
                message: USER_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_VALID
              })
            } else throw error
          }
          return true
        }
      }
    }
  })
)
