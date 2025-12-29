import { httpStatus } from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/error/error'
import { Follow } from '~/models/follow.models'
import { Story } from '~/models/stories.models'
import { User } from '~/models/user.models'

class StoryService {
  async createStory({
    user_id,
    mediaUrl,
    mediaType,
    duration
  }: {
    user_id: string
    mediaUrl: string
    mediaType: string
    duration: number
  }) {
    await Story.create({
      author: user_id,
      mediaUrl,
      mediaType,
      duration
    })
    return {}
  }
  async getStoryUser(username: string) {
    const user = await User.findOne({ username }).select('_id')

    if (!user) {
      throw new ErrorWithStatus({ message: 'User not found', status: httpStatus.NOT_FOUND })
    }

    const stories = await Story.find({
      author: user,
      expiresAt: { $gt: new Date() }
    })
      .populate({
        path: 'author',
        select: 'username profilePicture'
      })
      .sort({ created_at: 1 })
      .lean()

    return stories
  }

  async getStoryFeed(user_id: string) {
    const followings = await Follow.find({ follower: user_id }).select('following').lean()
    const followingIds = followings.map((follow) => follow.following)
    const stories = await Story.aggregate([
      {
        $match: {
          author: { $in: followingIds },
          expiresAt: { $gt: new Date() }
        }
      },

      // xác định story này user đã xem chưa
      {
        $addFields: {
          isViewed: {
            $in: [user_id, '$viewedBy']
          }
        }
      },

      // group theo author (1 bubble = 1 user)
      {
        $group: {
          _id: '$author',
          latestStoryAt: { $max: '$created_at' },
          storyCount: { $sum: 1 },

          // nếu tồn tại story isViewed = false → hasUnseen = true
          hasUnseen: {
            $max: {
              $cond: [{ $eq: ['$isViewed', false] }, 1, 0]
            }
          }
        }
      },

      // join user
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },

      // chỉ trả field cần cho bubble
      {
        $project: {
          author: {
            _id: 1,
            username: 1,
            profilePicture: 1
          },
          latestStoryAt: 1,
          storyCount: 1,
          hasUnseen: 1
        }
      },

      // sort giống Instagram
      {
        $sort: {
          hasUnseen: -1,
          latestStoryAt: -1
        }
      }
    ])

    return stories
  }
}
export const storyService = new StoryService()
