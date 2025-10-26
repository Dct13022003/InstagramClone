import { Dialog, DialogContent } from '../ui/dialog'
import DetailPost from '../../pages/DetailPost'
import { useState } from 'react'

export default function ModalPostDetail() {
  const [open, setOpen] = useState(true)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={true} className='w-[min(60vw,90vw)] p-0 sm:max-w-[90vw] max-h-[90vh] '>
        <DetailPost layout='modal' />
      </DialogContent>
    </Dialog>
  )
}
