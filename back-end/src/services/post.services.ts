import { Post } from '~/models/post.models'
import { PostRequestBody } from '~/models/request/post.request'
import { ObjectId } from 'mongodb'
import { Hashtag } from '~/models/hashtag.models'
import { followService } from './follow.services'
import { Like } from '~/models/like.models'
import { interleave } from '~/utils/interleave'

class PostService {
  async checkAndCreateHashtag(hashtags: string[]) {
    const hashtagDocuments = await Promise.all(
      hashtags.map((hashtag) => {
        return Hashtag.findOneAndUpdate(
          {
            name: hashtag
          },
          { $setOnInsert: { name: hashtag } },
          {
            upsert: true,
            returnDocument: 'after'
          }
        )
      })
    )
    return hashtagDocuments.map((hashtagDocument) => hashtagDocument._id)
  }
  async createPost(user_id: string, body: PostRequestBody) {
    let mentionObjectIds: ObjectId[] = []
    if (body.hashtags.length > 0) {
      mentionObjectIds = body.mentions.map((id) => new ObjectId(id))
    }
    const hashtags = await this.checkAndCreateHashtag(body.hashtags)
    Post.create({
      caption: body.caption,
      images: body.imageUrl,
      hashtags: hashtags,
      mentions: mentionObjectIds,
      likesCount: 0,
      commentsCount: 0,
      author: new ObjectId(user_id)
    })
  }

  async getPostDetail(post_id: string, user_id: string) {
    const post = await Post.aggregate([
      {
        $match: {
          _id: new ObjectId(post_id)
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $unwind: {
          path: '$author'
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
        $project: {
          author: {
            profilePicture: 1,
            username: 1
          },
          caption: 1,
          images: 1,
          hashtags: 1,
          mentions: 1,
          likesCount: 1,
          commentsCount: 1,
          createdAt: 1
        }
      }
    ])
    const isLiked = await Like.exists({ user_id, post_id })
    return { ...post[0], isLiked: !!isLiked }
  }

  async getNewFeeds({ user_id, limit, decodedCursor }: { user_id: string; limit: number; decodedCursor: any }) {
    const FOLLOW_LIMIT = limit
    const RATIO = 3
    const limitPlusOne = FOLLOW_LIMIT + 1

    const followingUsers = await followService.getAllFollowing(user_id)
    const followIds = followingUsers.map((item) => item.following)

    const excludeAuthorIds = [...followIds, new ObjectId(user_id)]
    const cursorCondition = decodedCursor
      ? {
          $or: [
            { createdAt: { $lt: new Date(decodedCursor.createdAt) } },
            {
              createdAt: new Date(decodedCursor.createdAt),
              _id: { $lt: new ObjectId(decodedCursor._id) }
            }
          ]
        }
      : {}

    const followPosts = followIds.length
      ? await Post.aggregate([
          {
            $match: {
              author: { $in: excludeAuthorIds },
              ...cursorCondition,
              isDeleted: { $ne: true }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'author',
              foreignField: '_id',
              as: 'author'
            }
          },
          { $unwind: '$author' },

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
                    username: '$$mention.username'
                  }
                }
              }
            }
          },
          {
            $lookup: {
              from: 'likes',
              let: { postId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ['$post_id', '$$postId'] }, { $eq: ['$user_id', new ObjectId(user_id)] }]
                    }
                  }
                }
              ],
              as: 'liked'
            }
          },
          {
            $addFields: {
              isLiked: { $gt: [{ $size: '$liked' }, 0] }
            }
          },
          {
            $project: {
              author: { username: 1, profilePicture: 1, _id: 1 },
              caption: 1,
              images: 1,
              hashtags: 1,
              mentions: 1,
              likesCount: 1,
              commentsCount: 1,
              createdAt: 1,
              isLiked: 1
            }
          },
          { $sort: { createdAt: -1, _id: -1 } },
          { $limit: limitPlusOne }
        ])
      : []
    const randomCount = followPosts.length === 0 ? FOLLOW_LIMIT : Math.floor(followPosts.length / RATIO)

    const randomPosts =
      randomCount > 0
        ? await Post.aggregate([
            {
              $match: {
                author: { $nin: excludeAuthorIds },
                _id: { $nin: followPosts.map((p) => p._id) },
                isDeleted: { $ne: true }
              }
            },
            {
              $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author'
              }
            },
            { $unwind: '$author' },

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
                      username: '$$mention.username'
                    }
                  }
                }
              }
            },
            {
              $lookup: {
                from: 'likes',
                let: { postId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $eq: ['$post_id', '$$postId'] }, { $eq: ['$user_id', new ObjectId(user_id)] }]
                      }
                    }
                  }
                ],
                as: 'liked'
              }
            },
            {
              $addFields: {
                isLiked: { $gt: [{ $size: '$liked' }, 0] }
              }
            },
            {
              $project: {
                author: { username: 1, profilePicture: 1, _id: 1 },
                caption: 1,
                images: 1,
                hashtags: 1,
                mentions: 1,
                likesCount: 1,
                commentsCount: 1,
                createdAt: 1,
                isLiked: 1
              }
            },
            { $sort: { likesCount: -1, commentsCount: -1, createdAt: -1 } },
            { $limit: randomCount }
          ])
        : []

    let nextCursor: string | null = null

    if (followPosts.length > FOLLOW_LIMIT) {
      const lastPost = followPosts.pop()

      nextCursor = Buffer.from(
        JSON.stringify({
          createdAt: lastPost.createdAt,
          _id: lastPost._id
        })
      ).toString('base64')
    }

    const posts = interleave(followPosts, randomPosts, RATIO)
    return {
      posts,
      nextCursor
    }
  }
}
export const postService = new PostService()
