import { Post } from '~/models/post.models'
import { PostRequestBody } from '~/models/request/post.request'
import { ObjectId } from 'mongodb'
import { Hashtag } from '~/models/hashtag.models'

class PostService {
  async checkAndCreateHashtag(hashtags: string[]) {
    const hashtagDocuments = await Promise.all(
      hashtags.map((hashtag) => {
        return Hashtag.findOneAndUpdate(
          {
            name: hashtag
          },
          { $setOnInsert: { name: hashtag } },
          {
            upsert: true,
            returnDocument: 'after'
          }
        )
      })
    )
    return hashtagDocuments.map((hashtagDocument) => hashtagDocument._id)
  }
  async createPost(user_id: string, body: PostRequestBody) {
    const mentionObjectIds = body.mentions.map((id) => new ObjectId(id))
    const hashtags = await this.checkAndCreateHashtag(body.hashtags)
    Post.create({
      caption: body.caption,
      images: [],
      hashtags: hashtags,
      mentions: mentionObjectIds,
      likes: body.likes,
      author: new ObjectId(user_id)
    })
  }
}
export const postService = new PostService()
