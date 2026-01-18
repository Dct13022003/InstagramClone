import { httpStatus } from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/error/error'
import { Follow } from '~/models/follow.models'
import { Story } from '~/models/story.models'
import { User } from '~/models/user.models'
import { ObjectId } from 'mongodb'

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

    // const stories = await Story.find({
    //   author: user,
    //   expiresAt: { $gt: new Date() }
    // })
    //   .populate({
    //     path: 'author',
    //     select: 'username profilePicture'
    //   })
    //   .sort({ created_at: 1 })
    //   .lean()
    const stories = await Story.aggregate([
      // 1. Join user
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },

      // 2. Bung mảng author
      { $unwind: '$author' },

      // 3. Lọc theo username + chưa hết hạn
      {
        $match: {
          'author.username': username,
          expiresAt: { $gt: new Date() }
        }
      },

      // 4. Sort story
      { $sort: { created_at: 1 } },

      // 5. Group theo author
      {
        $group: {
          _id: '$author._id',
          author: {
            $first: {
              _id: '$author._id',
              username: '$author.username',
              avatar: '$author.profilePicture'
            }
          },
          stories: {
            $push: {
              _id: '$_id',
              mediaUrl: '$mediaUrl',
              type: '$mediaType',
              duration: '$duration',
              create_at: '$create_at'
            }
          }
        }
      },
      {
        $project: {
          _id: 0
        }
      }
    ])

    return stories
  }

  async getStoryBar(user_id: string) {
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
  async getStoryFeed(userIds: string[]) {
    if (!userIds.length) return []

    const objectIds = userIds.map((id) => new ObjectId(id))
    const now = new Date()

    const stories = await Story.aggregate([
      // 1️⃣ Lọc story theo userIds + chưa hết hạn
      {
        $match: {
          author: { $in: objectIds },
          expiresAt: { $gt: now }
        }
      },

      // 2️⃣ Join user
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },

      // 3️⃣ Sort story trong mỗi user
      {
        $sort: { created_at: 1 }
      },

      // 4️⃣ Group theo author
      {
        $group: {
          _id: '$author._id',
          author: {
            $first: {
              _id: '$author._id',
              username: '$author.username',
              avatar: '$author.profilePicture'
            }
          },
          stories: {
            $push: {
              _id: '$_id',
              mediaUrl: '$mediaUrl',
              type: '$mediaType',
              duration: '$duration',
              createdAt: '$created_at'
            }
          }
        }
      }
    ])

    // 5️⃣ GIỮ ĐÚNG THỨ TỰ userIds (CỰC KỲ QUAN TRỌNG)
    const storyMap = new Map(stories.map((item) => [item.author._id.toString(), item]))

    return userIds.map((id) => storyMap.get(id)).filter(Boolean)
  }
}
export const storyService = new StoryService()
