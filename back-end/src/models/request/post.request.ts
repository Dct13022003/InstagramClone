export interface PostRequestBody {
  caption: string
  hashtags: string[]
  mentions: string[]
  likes: string[]
  imageUrl: string[]
}

export interface PostParam {
  post_id: string
  comment_id: string
}

export interface Pagination {
  limit: string
  page: string
}
