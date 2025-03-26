import { checkSchema } from 'express-validator'
import mongoose, { isValidObjectId } from 'mongoose'
import { httpStatus } from '~/constants/httpStatus'
import { POST_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/error/error'
import { IPost, Post } from '~/models/post.models'
import validate from '~/utils/validation'
import { Request } from 'express'

export const createPostValidator = validate(
  checkSchema({
    caption: {
      isString: {
        errorMessage: POST_MESSAGES.CAPTIONS_MUST_BE_STRING
      },
      isLength: {
        options: {
          min: 0,
          max: 2000
        },
        errorMessage: POST_MESSAGES.CAPTION_MUST_BE_BETWEEN_0_AND_2000_CHARACTERS
      }
    },
    hashtags: {
      isArray: true,
      custom: {
        options: async (value, { req }) => {
          if (!value.every((item: any) => typeof item === 'string'))
            throw new Error(POST_MESSAGES.HASHTAGS_MUST_BE_STRING)
        }
      }
    },
    mentions: {
      isArray: true,
      custom: {
        options: async (value, { req }) => {
          if (!value.every((item: any) => isValidObjectId(item)))
            throw new Error(POST_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID)
        }
      }
    }
  })
)

export const postValidator = validate(
  checkSchema(
    {
      post_id: {
        custom: {
          options: async (value, { req }) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                status: httpStatus.BAD_REQUEST,
                message: POST_MESSAGES.INVALID_POST_ID
              })
            }

            const [post] = await Post.aggregate<IPost>([
              {
                $match: {
                  _id: new mongoose.Types.ObjectId(value as string)
                }
              },
              {
                $lookup: {
                  from: 'hashtags',
                  localField: 'hashtags',
                  foreignField: '_id',
                  as: 'hashtags'
                }
              },
              {
                $lookup: {
                  from: 'users',
                  localField: 'mentions',
                  foreignField: '_id',
                  as: 'mentions'
                }
              },
              {
                $addFields: {
                  mentions: {
                    $map: {
                      input: '$mentions',
                      as: 'mention',
                      in: {
                        _id: '$$mention._id',
                        username: '$$mention.username',
                        email: '$$mention.email'
                      }
                    }
                  }
                }
              },
              {
                $lookup: {
                  from: 'comments',
                  localField: '_id',
                  foreignField: 'post_id',
                  as: 'comments'
                }
              },
              {
                $lookup: {
                  from: 'users',
                  localField: 'likes',
                  foreignField: '_id',
                  as: 'likes'
                }
              },
              {
                $addFields: {
                  likes: {
                    $size: '$likes'
                  },
                  comments: {
                    $size: '$comments'
                  }
                }
              }
            ])
            if (post === null) {
              throw new ErrorWithStatus({
                message: POST_MESSAGES.INVALID_POST_ID,
                status: httpStatus.NOT_FOUND
              })
            }
            // console.log(post)
            ;(req as Request).post = post
            return true
          }
        }
      }
    },
    ['params']
  )
)
