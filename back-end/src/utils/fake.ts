import { faker } from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'
import { PostRequestBody } from '~/models/request/post.request'
import { RegisterReqBody } from '~/models/request/user.request'
import { User } from '~/models/user.models'
import { Follow } from '~/models/follow.models'
import { postService } from '~/services/post.services'
const PASSWORD = 'Admin123'
const MYID = new ObjectId('67e9852e8ee27de0cfad14ad')

const USER_COUNT = 50
const createRandomUser = () => {
  const user: RegisterReqBody = {
    username: faker.internet.displayName(),
    email: faker.internet.email(),
    password: PASSWORD,
    confirm_password: PASSWORD
  }
  return user
}

const createRandomPost = () => {
  const post: PostRequestBody = {
    caption: faker.lorem.paragraph({
      min: 10,
      max: 160
    }),
    hashtags: [],
    mentions: [],
    likes: []
  }
  return post
}

const users: RegisterReqBody[] = faker.helpers.multiple(createRandomUser, {
  count: USER_COUNT
})

const inserMutipleUsers = async (users: RegisterReqBody[]) => {
  const result = await Promise.all(
    users.map(async (user) => {
      const user_id = new ObjectId()
      const hash_password = await bcrypt.hash(user.password, 10)
      await User.create({
        _id: user_id,
        username: user.username,
        email: user.email,
        password: hash_password,
        verify: 'Verified'
      })
      return user_id
    })
  )
  return result
}

const followMutipleUsers = async (follower_id: ObjectId, following_ids: ObjectId[]) => {
  const result = await Promise.all(
    following_ids.map((following_id) => {
      Follow.create({
        follower: follower_id,
        following: new ObjectId(following_id)
      })
    })
  )
  return result
}
const insertMutiplePosts = async (ids: ObjectId[]) => {
  let count = 0
  const result = await Promise.all(
    ids.map(async (id, index) => {
      await Promise.all([
        postService.createPost(id.toString(), createRandomPost()),
        postService.createPost(id.toString(), createRandomPost())
      ])
      count += 2
    })
  )
  return result
}

inserMutipleUsers(users).then((ids) => {
  followMutipleUsers(new ObjectId(MYID), ids)
  insertMutiplePosts(ids)
})
