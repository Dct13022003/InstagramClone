import { ObjectId } from 'mongodb'
import { USER_MESSAGES } from '~/constants/message'
import { Follow } from '~/models/follow.models'
import { User } from '~/models/user.models'

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

  async suggestFollow(user_id: string) {
    const userId = new ObjectId(user_id)
    const following = await Follow.find({ follower: userId }).distinct('following')
    let suggestions = []

    //  CASE 1: Người dùng đã follow ít nhất 1 người
    if (following.length > 0) {
      suggestions = await Follow.aggregate([
        { $match: { follower: { $in: following } } }, // bạn của tôi đang follow ai
        {
          $group: {
            _id: '$following', // người được follow
            mutualFollowers: { $addToSet: '$follower' }, // danh sách bạn của tôi follow người này
            mutualCount: { $sum: 1 } // số lượng bạn chung
          }
        },
        { $match: { _id: { $nin: [...following, userId] } } }, // bỏ người đã follow & chính mình
        { $sort: { mutualCount: -1 } },
        { $limit: 20 },
        { $sample: { size: 5 } },

        // Lấy thông tin của người được gợi ý
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },

        // Lấy thông tin của mutual followers (bạn bè chung)
        {
          $lookup: {
            from: 'users',
            localField: 'mutualFollowers',
            foreignField: '_id',
            as: 'mutualFollowerUsers'
          }
        },

        {
          $project: {
            _id: 0,
            username: '$user.username',
            fullName: '$user.fullName',
            profilePicture: '$user.profilePicture',
            mutualFollowers: {
              $map: {
                input: '$mutualFollowerUsers',
                as: 'mf',
                in: {
                  username: '$$mf.username'
                }
              }
            }
          }
        }
      ])
    }

    // CASE 2: Người dùng chưa follow ai
    if (following.length === 0) {
      suggestions = await Follow.aggregate([
        { $match: { follower: { $ne: userId } } },
        { $group: { _id: '$following', followerCount: { $sum: 1 } } },
        { $sort: { followerCount: -1 } },
        { $limit: 20 },
        { $sample: { size: 5 } }, // random nhẹ
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 0,
            user: {
              username: 1,
              profilePicture: 1,
              fullName: 1
            },
            followerCount: 1
          }
        }
      ])
    }

    // CASE 3: Nếu vẫn không có ai → fallback 5 người mới đăng ký
    if (suggestions.length === 0) {
      suggestions = await User.find({ _id: { $ne: userId } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('username profilePicture fullName')
    }

    return suggestions
  }
}

export const followService = new FollowService()
