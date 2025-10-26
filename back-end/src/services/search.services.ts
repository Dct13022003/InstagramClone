import { SearchHistory } from '~/models/searchHistory.model'
import { User } from '~/models/user.models'

class SearchService {
  async searchUser(q: string, page: number, limit: number) {
    const regex = new RegExp(q, 'i')
    const users = await User.find({ $or: [{ username: { $regex: regex } }, { fullname: { $regex: regex } }] })
      .select('_id username profilePicture fullname')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
    return users
  }

  async saveSearchHistory(userId: string, searchUserId: string) {
    const searchHistory = await SearchHistory.findOne({ user_id: userId, searchUserId })
    if (searchHistory) return
    await SearchHistory.create({ user_id: userId, searchUserId })
  }

  async getSearchHistory(userId: string) {
    const history = await SearchHistory.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('searchUserId', '_id username profilePicture fullname')
      .lean()
    return history.map((item) => item.searchUserId)
  }
}
export const searchService = new SearchService()
