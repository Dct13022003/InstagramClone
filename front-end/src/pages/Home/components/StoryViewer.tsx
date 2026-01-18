import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent } from '../../../components/ui/dialog'
import { useStoriesFeed } from '../hook/useStories'
import StoryViewerA from './test'
import { useQueryClient } from '@tanstack/react-query'
import { StoryBar } from '../../../types/story.type'

export default function StoryViewer() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const storyBars = queryClient.getQueryData<StoryBar[]>(['storyBar'])
  const userIds = storyBars?.map((storyBar) => storyBar._id)
  const { data: stories } = useStoriesFeed(userIds as string[])

  return (
    <Dialog open onOpenChange={() => navigate(-1)}>
      <DialogContent
        className='
        sm:max-w-screen
        max-w-screen
        h-screen
        p-0
        bg-[#1a1a1a]
        border-none
        rounded-none
      '
      >
        {stories && <StoryViewerA onClose={() => navigate(-1)} stories={stories} />}
      </DialogContent>
    </Dialog>
  )
}
