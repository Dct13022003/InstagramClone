export interface CommentRequestBody {
  text: string
  mentions: string[]
  likes: string[]
  parent_id: string
  // medias: Media[]
}
