import { ObjectId } from 'mongodb'
import { Comment } from '~/models/comment.models'

import { CommentRequestBody } from '~/models/request/comment.request'

class CommentService {
  async createComment(user_id: string, body: CommentRequestBody) {
    Comment.create({
      text: body.text,
      mentions: body.mentions,
      likes: body.likes,
      author: new ObjectId(user_id)
    })
  }
}
export const commentService = new CommentService()
