import { Bookmark } from '~/models/bookmark.models'
import { ObjectId } from 'mongodb'

class BookmarkService {
  async createBookmark(user_id: string, post_id: string) {
    await Bookmark.findOneAndUpdate(
      { user_id: new ObjectId(user_id), post_id: new ObjectId(post_id) },
      {
        $setOnInsert: { user_id: new ObjectId(user_id), post_id: new ObjectId(post_id) }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return
  }

  async unBookmark(user_id: string, post_id: string) {
    await Bookmark.findOneAndDelete({ user_id: new ObjectId(user_id), post_id: new ObjectId(post_id) })
  }
}
export const bookmarkService = new BookmarkService()
