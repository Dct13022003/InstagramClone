import { Dialog, DialogContent } from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { Separator } from '../../../components/ui/separator'
import { Comment } from '../../../types/comment.type'
import { useContext } from 'react'
import { AppContext } from '../../../context/app.context'

type typeProps = {
  open: boolean
  selectedComment: Comment | null
  authorPost: string
  onClose: () => void
  onDelete: () => void
  onOpenChange: (open: boolean) => void
}

export default function CommentActionsModal({
  open,
  onClose,
  onDelete,
  selectedComment,
  authorPost,
  onOpenChange
}: typeProps) {
  const { profile } = useContext(AppContext)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='gap-0 p-0 rounded-3xl overflow-hidden'>
        {selectedComment?.author._id === profile?._id || authorPost === profile?._id ? (
          <Button
            onClick={onDelete}
            className='bg-[#fff] text-red-500 font-bold hover:bg-[#fff] hover:cursor-pointer p-2 box-content'
          >
            Xóa
          </Button>
        ) : (
          <Button
            onClick={onClose}
            className='bg-[#fff] text-red-500 font-bold hover:bg-[#fff] hover:cursor-pointer p-2 box-content'
          >
            Báo cáo
          </Button>
        )}

        <Separator />
        <Button onClick={onClose} className='bg-[#fff] text-black hover:bg-[#fff] hover:cursor-pointer p-2 box-content'>
          Hủy
        </Button>
      </DialogContent>
    </Dialog>
  )
}
