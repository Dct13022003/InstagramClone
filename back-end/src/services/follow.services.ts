import { ObjectId } from 'mongodb'
import { Follow } from '~/models/follow.models'

class FollowService {
  async getAllFollowing(user_id: string) {
    const following_user_ids = await Follow.find({ follower: new ObjectId(user_id) }, { _id: 0, following: 1 })

    return following_user_ids
  }
}
export const followService = new FollowService()
