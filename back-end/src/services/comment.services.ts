import { ObjectId } from 'mongodb'
import { Comment } from '~/models/comment.models'
import { Post } from '~/models/post.models'

import { CommentRequestBody } from '~/models/request/comment.request'

class CommentService {
  async createComment(user_id: string, postId: string, body: CommentRequestBody) {
    await Comment.create({
      post_id: new ObjectId(postId),
      text: body.text,
      mentions: body.mentions,
      likes: [],
      author: new ObjectId(user_id),
      parent_id: new ObjectId(body.parent_id)
    })
    await Post.updateOne({ _id: new ObjectId(postId) }, { $inc: { commentsCount: 1 } })
  }
  async getAllCommentParentInPost({
    post_id,
    limit,
    page,
    user_id
  }: {
    post_id: string
    limit: number
    page: number
    user_id: string
  }) {
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
        $unwind: '$author'
      },
      {
        $project: {
          text: 1,
          createdAt: 1,
          likes: 1,
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
        $addFields: {
          likes: {
            $size: { $ifNull: ['$likes', []] }
          },
          replies: {
            $size: '$replies'
          },
          isLiked: { $in: [new ObjectId(user_id), { $ifNull: ['$likes', []] }] }
        }
      },
      {
        $skip: limit * (page - 1)
      },
      {
        $limit: limit
      }
    ])
    const total = await Comment.countDocuments({ post_id: new ObjectId(post_id), parent_id: null })
    const hasNextPage = page * limit < total
    if (comments.length === 0) return { comments: [], hasNextPage: null }
    return {
      comments,
      hasNextPage,
      nextPage: hasNextPage ? page + 1 : null
    }
  }

  async getCommentReplies(comment_id: string, limit: number, page: number, user_id: string) {
    const comments = await Comment.aggregate([
      {
        $match: {
          parent_id: new ObjectId(comment_id)
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
        $unwind: '$author'
      },
      {
        $project: {
          text: 1,
          createdAt: 1,
          likes: 1,
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
        $addFields: {
          likes: {
            $size: { $ifNull: ['$likes', []] }
          },
          isLiked: { $in: [new ObjectId(user_id), { $ifNull: ['$likes', []] }] }
        }
      },
      {
        $skip: limit * (page - 1)
      },
      {
        $limit: limit
      }
    ])
    const total = await Comment.countDocuments({ parent_id: new ObjectId(comment_id) })
    const hasNextPage = page * limit < total
    if (comments.length === 0) return { comments: [], hasNextPage: null }
    return {
      comments,
      hasNextPage,
      nextPage: hasNextPage ? page + 1 : null
    }
  }

  async likeComment(user_id: string, comment_id: string) {
    await Comment.updateOne({ _id: new ObjectId(comment_id) }, { $addToSet: { likes: new ObjectId(user_id) } })
  }
  async unlikeComment(user_id: string, comment_id: string) {
    await Comment.updateOne({ _id: new ObjectId(comment_id) }, { $pull: { likes: new ObjectId(user_id) } })
  }
}
export const commentService = new CommentService()
