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
export interface PostProfile extends Post {
  likesCount: number
  commentsCount: number
}
export interface PostsPageProfile {
  posts: PostProfile[]
  hasNextPage: boolean
  nextPage?: number | null
}
