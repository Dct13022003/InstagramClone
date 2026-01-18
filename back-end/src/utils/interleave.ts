type FeedItem<T> = {
  type: 'follow' | 'random'
  post: T
}

export function interleave<T>(followPosts: T[], randomPosts: T[], ratio: number): FeedItem<T>[] {
  // 🆕 User mới → toàn random
  if (followPosts.length === 0) {
    return randomPosts.map((post) => ({
      type: 'random',
      post
    }))
  }

  const result: FeedItem<T>[] = []
  let randomIndex = 0

  for (let i = 0; i < followPosts.length; i++) {
    // luôn push follow trước
    result.push({
      type: 'follow',
      post: followPosts[i]
    })

    // cứ mỗi `ratio` follow thì chèn 1 random
    if ((i + 1) % ratio === 0 && randomIndex < randomPosts.length) {
      result.push({
        type: 'random',
        post: randomPosts[randomIndex++]
      })
    }
  }

  return result
}
