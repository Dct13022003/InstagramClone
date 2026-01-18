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
  nextCursor: string | null
}

export type FeedItemType = 'follow' | 'random'

export type FeedItem = {
  type: FeedItemType
  post: PostDetail
}
export type FeedResponse = {
  posts: FeedItem[]
  nextCursors: string | null
}
