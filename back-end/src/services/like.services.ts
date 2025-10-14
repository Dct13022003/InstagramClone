import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import { Like } from '~/models/like.models'
import { Post } from '~/models/post.models'

class LikeService {
  async createLike(user_id: string, post_id: string) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const result = await Like.updateOne(
        { user_id: new mongoose.Types.ObjectId(user_id), post_id: new mongoose.Types.ObjectId(post_id) },
        {
          $setOnInsert: {
            user_id: new mongoose.Types.ObjectId(user_id),
            post_id: new mongoose.Types.ObjectId(post_id)
          }
        },
        { upsert: true, session }
      )

      if (result.upsertedCount > 0) {
        await Post.updateOne({ _id: new mongoose.Types.ObjectId(post_id) }, { $inc: { likesCount: 1 } }, { session })
      }
      const likes = await Like.find()
      console.log('All likes:', likes)
      await session.commitTransaction()
    } catch (err) {
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
  }

  async unLike(user_id: string, post_id: string) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const result = await Like.findOneAndDelete(
        { user_id: new ObjectId(user_id), post_id: new ObjectId(post_id) },
        { session }
      )

      if (result) {
        await Post.findOneAndUpdate(
          { _id: new ObjectId(post_id), likesCount: { $gt: 0 } },
          { $inc: { likesCount: -1 } }
        )
      }

      await session.commitTransaction()
    } catch (err) {
      await session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
  }
}
export const likeService = new LikeService()
