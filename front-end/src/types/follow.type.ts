import { User } from './user.type'

export interface SuggestedUser {
  _id: string
  username: string
  profilePicture: string
  isFollowed: boolean
  mutualFollowers: User[]
}
