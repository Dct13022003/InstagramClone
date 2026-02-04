import { Post } from './post.type'
import { User } from './user.type'

export interface Comment {
  _id: string
  text: string
  author: User
  post_id: string | Post
  parent_id?: Comment | string
  mentions?: User[] | null
  likes?: number
  replies?: number
  isDelete: boolean
  createdAt: string
  repliesCount: number
  updatedAt?: string
}
export interface CommentForm {
  postId: string
  content: string
  parentId?: string
  mentions?: string[]
  imageUrl?: string[]
}

export interface CommentResponse {
  comments: (Comment & { isLiked: boolean })[]
  hasNextPage: boolean | null
  nextPage: number | null
}
