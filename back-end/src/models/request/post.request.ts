export interface PostRequestBody {
  caption: string
  hashtags: string[]
  mentions: string[]
  likes: string[]
  // medias: Media[]
}

export interface PostParam {
  post_id: string
}

export interface Pagination {
  limit: string
  page: string
}
