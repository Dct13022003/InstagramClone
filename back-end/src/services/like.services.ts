import { ObjectId } from 'mongodb'
import { Like } from '~/models/like.models'
import { Post } from '~/models/post.models'

class LikeService {
  async createLike(user_id: string, post_id: string) {
    await Like.findOneAndUpdate(
      { user_id: new ObjectId(user_id), post_id: new ObjectId(post_id) },
      {
        $setOnInsert: { user_id: new ObjectId(user_id), post_id: new ObjectId(post_id) }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    await Post.findOneAndUpdate(
      { _id: new ObjectId(post_id) },
      { $inc: { likesCount: 1 } },
      { returnDocument: 'after' }
    )
    return
  }

  async unLike(user_id: string, post_id: string) {
    await Like.findOneAndDelete({ user_id: new ObjectId(user_id), post_id: new ObjectId(post_id) })
    await Post.findOneAndUpdate(
      { _id: new ObjectId(post_id) },
      { $inc: { likesCount: -1 } },
      { returnDocument: 'after' }
    )
    return
  }
}
export const likeService = new LikeService()
