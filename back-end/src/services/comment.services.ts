import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import { Comment } from '~/models/comment.models'
import { Notification } from '~/models/notification.models'
import { Post } from '~/models/post.models'

import { CommentRequestBody } from '~/models/request/comment.request'

class CommentService {
  async createComment(user_id: string, postId: string, body: CommentRequestBody) {
    const session = await mongoose.startSession()

    try {
      let comment: any = null
      let post_author: string = ''

      await session.withTransaction(async () => {
        const parentId = body.parent_id ? new ObjectId(body.parent_id) : null
        const post = await Post.findById(postId).session(session)
        if (!post) {
          throw new Error('Post not found')
        }
        const [createdComment] = await Comment.create(
          [
            {
              post_id: new ObjectId(postId),
              text: body.text,
              mentions: body.mentions,
              likes: [],
              author: new ObjectId(user_id),
              parent_id: parentId
            }
          ],
          { session }
        )

        await Post.updateOne({ _id: new ObjectId(postId) }, { $inc: { commentsCount: 1 } }, { session })
        if (parentId) await Comment.updateOne({ _id: parentId }, { $inc: { repliesCount: 1 } }, { session })
        if (parentId)
          await Notification.create(
            [
              {
                senderId: new ObjectId(user_id),
                entityId: createdComment._id,
                type: 'COMMENT_REPLY',
                content: 'đã phản hồi bình luận của bạn',
                receiverId: post.author
              }
            ],
            { session }
          )
        else
          await Notification.create(
            [
              {
                senderId: new ObjectId(user_id),
                entityId: createdComment._id,
                type: 'COMMENT',
                content: 'đã bình luận bài viết của bạn',
                receiverId: post.author
              }
            ],
            { session }
          )

        comment = createdComment
        post_author = post.author.toString()
      })

      return { comment, post_author }
    } finally {
      session.endSession()
    }
  }

  async deleteComment(comment_id: string, user_id: string) {
    await Promise.all([
      Comment.findByIdAndUpdate(new ObjectId(comment_id), {
        isDelete: true
      }),
      Notification.deleteOne({ entityId: new ObjectId(comment_id), senderId: new ObjectId(user_id) })
    ])
  }

  // async getAllCommentParentInPost({
  //   post_id,
  //   limit,
  //   page,
  //   user_id
  // }: {
  //   post_id: string
  //   limit: number
  //   page: number
  //   user_id: string
  // }) {
  //   const comments = await Comment.aggregate([
  //     {
  //       $match: {
  //         post_id: new ObjectId(post_id),
  //         parent_id: null,
  //         isDelete: false
  //       }
  //     },
  //     {
  //       $lookup: {
  //         from: 'users',
  //         localField: 'author',
  //         foreignField: '_id',
  //         as: 'author'
  //       }
  //     },
  //     {
  //       $unwind: '$author'
  //     },
  //     {
  //       $project: {
  //         text: 1,
  //         createdAt: 1,
  //         likes: 1,
  //         'author._id': 1,
  //         'author.username': 1,
  //         'author.profilePicture': 1
  //       }
  //     },
  //     {
  //       $lookup: {
  //         from: 'users',
  //         localField: 'mentions',
  //         foreignField: '_id',
  //         as: 'mentions'
  //       }
  //     },
  //     {
  //       $addFields: {
  //         mentions: {
  //           $map: {
  //             input: '$mentions',
  //             as: 'mention',
  //             in: {
  //               _id: '$$mention._id',
  //               username: '$$mention.username'
  //             }
  //           }
  //         }
  //       }
  //     },
  //     {
  //       $lookup: {
  //         from: 'comments',
  //         localField: '_id',
  //         foreignField: 'parent_id',
  //         as: 'replies'
  //       }
  //     },
  //     {
  //       $addFields: {
  //         likes: {
  //           $size: { $ifNull: ['$likes', []] }
  //         },
  //         replies: {
  //           $size: '$replies'
  //         },
  //         isLiked: { $in: [new ObjectId(user_id), { $ifNull: ['$likes', []] }] }
  //       }
  //     },
  //     {
  //       $skip: limit * (page - 1)
  //     },
  //     {
  //       $limit: limit
  //     }
  //   ])
  //   const total = await Comment.countDocuments({ post_id: new ObjectId(post_id), parent_id: null })
  //   const hasNextPage = page * limit < total
  //   if (comments.length === 0) return { comments: [], hasNextPage: null }
  //   return {
  //     comments,
  //     hasNextPage,
  //     nextPage: hasNextPage ? page + 1 : null
  //   }
  // }
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
    const skip = limit * (page - 1)
    const userIdObj = user_id ? new ObjectId(user_id) : null

    const comments = await Comment.aggregate([
      {
        $match: {
          post_id: new ObjectId(post_id),
          parent_id: null,
          isDelete: false
        }
      },
      { $sort: { createdAt: -1 } }, // 1. Thêm sắp xếp
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          pipeline: [{ $project: { username: 1, profilePicture: 1 } }], // Project sớm để nhẹ memory
          as: 'author'
        }
      },
      { $unwind: '$author' },
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ['$likes', []] } },
          // isLiked chỉ tính nếu có userId
          isLiked: userIdObj ? { $in: [userIdObj, { $ifNull: ['$likes', []] }] } : false
          // Giả sử bạn đã áp dụng counter cho reply_count, nếu chưa thì giữ lookup cũ
          // replyCount: '$reply_count'
        }
      },
      // Bạn nên bỏ $lookup cho replies ở đây nếu đã có trường reply_count
      {
        $project: { likes: 0 } // Ẩn mảng likes đi cho nhẹ kết quả trả về
      }
    ])

    const total = await Comment.countDocuments({
      post_id: new ObjectId(post_id),
      parent_id: null,
      isDelete: false
    })

    const hasNextPage = page * limit < total

    return {
      comments,
      hasNextPage,
      nextPage: hasNextPage ? page + 1 : null,
      total // Nên trả về total để FE hiển thị tổng số comment
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
