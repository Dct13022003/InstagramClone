import { User } from './user.type'

export interface Post {
  _id: string
  caption: string
  images: string[]
  author: User
  hashtags: User[]
  mentions: User[]
  likes: User[]
  createdAt: Date
  updatedAt: Date
}
export interface PostDetail extends Post {
  likesCount: number
  commentsCount: number
  isLiked: boolean
}
export interface ListPostDetail {
  posts: PostDetail[]
  hasNextPage: boolean
  nextPage?: number | null
}
