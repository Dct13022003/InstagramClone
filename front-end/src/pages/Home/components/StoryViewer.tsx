import { useNavigate, useParams } from 'react-router-dom'
import { Dialog, DialogContent } from '../../../components/ui/dialog'
import { useStoryUser } from '../hook/useStories'
import StoryViewerA from './test'

export default function StoryViewer() {
  const { username } = useParams()
  const { data: stories } = useStoryUser(username as string)
  const navigate = useNavigate()

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
        {/* Header */}
        <div className='absolute top-4 left-4 text-white hidden sm:block'>INSTAGRAM</div>

        {/* Close */}
        <button onClick={() => navigate(-1)} className='absolute top-4 right-4 text-white text-xl'>
          ✕
        </button>

        {/* Media */}
        <div className='flex items-center justify-center h-full'>
          <StoryViewerA onClose={() => navigate(-1)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
