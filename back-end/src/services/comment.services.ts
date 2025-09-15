import { ObjectId } from 'mongodb'
import { Comment } from '~/models/comment.models'

import { CommentRequestBody } from '~/models/request/comment.request'

class CommentService {
  async createComment(user_id: string, postId: string, body: CommentRequestBody) {
    await Comment.create({
      post_id: new ObjectId(postId),
      text: body.text,
      mentions: body.mentions,
      likes: body.likes,
      author: new ObjectId(user_id)
    })
  }
  async getAllCommentInPost({ post_id, limit, page }: { post_id: string; limit: number; page: number }) {
    const comments = await Comment.aggregate([
      {
        $match: {
          post_id: new ObjectId(post_id),
          parent_id: null
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
        $unwind: '$author' // vì mỗi post chỉ có 1 author → bỏ mảng
      },
      {
        $project: {
          text: 1,
          createdAt: 1,
          'author._id': 1,
          'author.username': 1,
          'author.profilePicture': 1
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
          from: 'comments',
          localField: '_id',
          foreignField: 'parent_id',
          as: 'replies'
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
          replies: {
            $size: '$replies'
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
    return comments
  }
}
export const commentService = new CommentService()
