import mongoose, { Schema } from 'mongoose'

export interface IHashtag extends Document {
  name: string
}
const hashtagSchema = new Schema<IHashtag>(
  {
    name: { type: String, required: true, unique: true }
  },
  {
    timestamps: true
  }
)
export const Hashtag = mongoose.model<IHashtag>('Hashtag', hashtagSchema)
