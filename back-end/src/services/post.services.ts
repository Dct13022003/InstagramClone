import { IPost, Post } from '~/models/post.models'
import { PostRequestBody } from '~/models/request/post.request'
import { ObjectId } from 'mongodb'
import { Hashtag } from '~/models/hashtag.models'
import { followService } from './follow.services'

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
    const mentionObjectIds = body.mentions.map((id) => new ObjectId(id))
    const hashtags = await this.checkAndCreateHashtag(body.hashtags)
    Post.create({
      caption: body.caption,
      images: [],
      hashtags: hashtags,
      mentions: mentionObjectIds,
      likes: body.likes,
      author: new ObjectId(user_id)
    })
  }
  async getNewFeeds({ user_id, limit, page }: { user_id: string; limit: number; page: number }) {
    const following_user_ids = await followService.getAllFollowing(user_id)
    const ids = following_user_ids.map((item) => item.following)
    ids.push(new ObjectId(user_id))
    const posts = await Post.aggregate<IPost>([
      {
        $match: {
          author: {
            $in: ids
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user'
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
      },
      {
        $project: {
          user: {
            password: 0,
            email_verify_token: 0,
            forgot_password_token: 0
          }
        }
      },
      {
        $skip: limit * (page - 1)
      },
      {
        $limit: limit
      }
    ])
    const total = await Post.countDocuments({
      author: {
        $in: ids
      }
    })

    return { posts, total }
  }
}
export const postService = new PostService()
