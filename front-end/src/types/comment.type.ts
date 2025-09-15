import { Post } from './post.type'
import { User } from './user.type'

export interface Comment {
  _id: string
  text: string
  author: User
  post_id: string | Post
  parent_id: Comment | null
  mentions: number
  likes: number
  replies?: number
  createdAt: string
  updatedAt?: string
}
export interface CommentForm {
  postId: string
  content: string
  parentId?: string
  mentions?: string[]
  imageUrl?: string[]
}
