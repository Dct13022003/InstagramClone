import { Ellipsis, Flag, LinkIcon, MessageCircleOff, Pencil, Send, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '.././components/ui/dropdown-menu'
type PostMoreMenuProps = {
  isFollowing?: boolean
  isOwner: boolean
  onEdit?: () => void
  onDelete?: () => void
  onCopyLink?: () => void
  onReport?: () => void
}
export function SecondActionPost({ isOwner, isFollowing, onEdit, onDelete, onCopyLink, onReport }: PostMoreMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          className='flex h-8 w-8 items-center justify-center
            rounded-full
            text-muted-foreground
            transition
            hover:bg-muted hover:text-foreground
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-ring'
        >
          <Ellipsis className='w-5 h-5 hover:cursor-pointer ' />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        sideOffset={8}
        className='
          w-52
          rounded-xl
          border
          bg-popover
          p-1
          shadow-lg
          animate-in
          fade-in-0
          zoom-in-95
        '
      >
        <DropdownMenuItem
          onClick={onReport}
          className='gap-2 rounded-md px-3 py-2  text-red-500
                focus:text-red-500
                focus:bg-red-50'
        >
          <Flag className='h-4 w-4 text-red-500' fill='red'  />
          <span>Report</span>
        </DropdownMenuItem>
        {isOwner ? (
          <>
            <DropdownMenuItem
              onClick={onDelete}
              className='
                gap-2 rounded-md px-3 py-2
                text-red-500
                focus:text-red-500
                focus:bg-red-50
              '
            >
              <Trash2 className='h-4 w-4' />
              <span>Delete</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit} className='gap-2 rounded-md px-3 py-2'>
              <Pencil className='h-4 w-4' />
              <span>Edit caption</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onDelete} className='gap-2 rounded-md px-3 py-2'>
              <MessageCircleOff />
              <span>Tắt tính năng bình luận</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            {isFollowing ? (
              <>
                <DropdownMenuItem onClick={onDelete}>Unfollow</DropdownMenuItem>

                {/* <DropdownMenuItem className='gap-2 rounded-md px-3 py-2'>
                  <Pencil className='h-4 w-4' />
                  <span>Edit caption</span>
                </DropdownMenuItem> */}
              </>
            ) : (
              <DropdownMenuItem onClick={onEdit}>Không quan tâm bài viết</DropdownMenuItem>
            )}
          </>
        )}
        <DropdownMenuItem onClick={onCopyLink} className='gap-2 rounded-md px-3 py-2'>
          <LinkIcon className='h-4 w-4' />
          <span>Copy link</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onDelete} className='gap-2 rounded-md px-3 py-2'>
          <Send />
          <span>Chia sẻ lên...</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
