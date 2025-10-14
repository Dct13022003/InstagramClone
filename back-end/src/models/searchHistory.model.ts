import mongoose, { Schema, Types } from 'mongoose'

const searchHistorySchema = new Schema(
  {
    user_id: { type: Types.ObjectId, required: true, ref: 'User' },
    searchUserId: { type: Types.ObjectId, ref: 'User', default: [] }
  },
  { timestamps: true, collection: 'search_histories' }
)

export const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema)
