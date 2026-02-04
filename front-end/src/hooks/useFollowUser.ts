import { useMutation } from '@tanstack/react-query'
import { followUser } from '../apis/follow.api'

export function useFollowUser() {
  return useMutation({
    mutationFn: (userFollowId: string) => followUser(userFollowId)
  })
}
