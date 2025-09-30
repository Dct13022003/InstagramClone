import { ObjectId } from 'mongodb'
import { USER_MESSAGES } from '~/constants/message'
import { Follow } from '~/models/follow.models'

class FollowService {
  async getAllFollowing(user_id: string) {
    const following_user_ids = await Follow.find({ follower: new ObjectId(user_id) }, { _id: 0, following: 1 })

    return following_user_ids
  }
  async follow(user_id: string, user_id_follow: string) {
    const user = await Follow.findOne({ follower: new ObjectId(user_id), following: new ObjectId(user_id_follow) })
    if (user === null) {
      await Follow.create({
        follower: new ObjectId(user_id),
        following: new ObjectId(user_id_follow)
      })
      return { message: USER_MESSAGES.FOLLOW_SUCCESS }
    }
    return { message: USER_MESSAGES.FOLLOWED }
  }

  async unFollow(user_id: string, user_id_unfollow: string) {
    const user = await Follow.findOne({ follower: new ObjectId(user_id), following: new ObjectId(user_id_unfollow) })
    if (user !== null) {
      await Follow.deleteOne({
        follower: new ObjectId(user_id),
        following: new ObjectId(user_id_unfollow)
      })
      return { message: USER_MESSAGES.UNFOLLOW_SUCCESS }
    }
    return { message: USER_MESSAGES.UNFOLLOW_FAIL }
  }
}
export const followService = new FollowService()
