import { User } from './user.type'

export type Story = {
  _id: string
  author: User
  mediaUrl: string
  mediaType: string
  duration: number
  createdAt: string
  updatedAt: string
}

export type StoryResponse = {
  stories: Story[]
}

export type StoryBar = {
  _id: string
  lastStoryAt: string
  storyCount: number
  hasUnseen: number
  author: User
}

export type StoryGroup = {
  author: {
    _id: string
    username: string
    avatar: string
  }
  stories: Story[]
}
