import { Dialog, DialogContent } from '../../../components/ui/dialog'
import DetailPost from '../../DetailPost'
import { useNavigate } from 'react-router-dom'

export default function ModalPostDetail() {
  const navigate = useNavigate()

  return (
    <Dialog open onOpenChange={() => navigate(-1)}>
      <DialogContent
        showCloseButton={true}
        className='w-[min(60vw,90vw)] p-0 sm:max-w-[90vw] max-h-[90vh] overflow-hidden '
      >
        <DetailPost layout='modal' />
      </DialogContent>
    </Dialog>
  )
}
