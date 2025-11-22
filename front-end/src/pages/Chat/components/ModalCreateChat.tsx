import { useRef, useState } from 'react'
import { Button } from '../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../components/ui/dialog'
import { useSearch } from '../../../hooks/useSearch'
import { useChatContext } from '../context/ChatContext'
import { User } from '../../../types/user.type'
import { useMutation } from '@tanstack/react-query'
import { createConversation } from '../../../apis/chat.api'
import { useNavigate } from 'react-router-dom'

interface UserSelected {
  _id?: string
  fullname: string
}

export function ModalCreateMessage() {
  const { handleChange, searchUsersQuery, setQuery } = useSearch()
  const { showModal, setShowModal } = useChatContext()
  const [selectedUsers, setSelectedUsers] = useState<UserSelected[]>([])
  const inputReft = useRef<HTMLInputElement>(null)
  const users = searchUsersQuery.data || []
  const navigate = useNavigate()

  const { mutate } = useMutation({
    mutationKey: ['createConversation'],
    mutationFn: () => createConversation(selectedUsers[0]._id as string),
    onSuccess: (data) => {
      setShowModal(false)
      setSelectedUsers([])
      navigate(`/chat/:${data._id}`)
    }
  })

  const toggleUser = (user: User) => {
    const userSelected: UserSelected = {
      _id: user._id,
      fullname: user.fullname as string
    }

    setSelectedUsers((prev) =>
      prev.some((x) => x._id === userSelected._id)
        ? prev.filter((x) => x._id !== userSelected._id)
        : [...prev, userSelected]
    )
    // Clear input
    if (inputReft.current) {
      inputReft.current.value = ''
      setQuery('')
    }
  }
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <form>
        <DialogTrigger asChild>
          <Button variant='default' className='bg-[#4a5df9] text-white hover:bg-[#3c52f9] hover:cursor-pointer'>
            Gửi tin nhắn
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle className='flex justify-center'>Tin nhắn mới</DialogTitle>
          </DialogHeader>
          <div className='flex w-full border-b-1 border-t-1 pb-2 gap-5 justify-center'>
            <span>
              <p className='font-semibold text-lg mb-1'>Tới:</p>
            </span>
            <div className='flex flex-wrap items-center gap-2 w-full'>
              {/* Render tag */}
              {selectedUsers.map((user) => {
                return (
                  <div key={user._id} className='px-3 py-1 bg-gray-200 rounded-full flex items-center gap-1 max-w-full'>
                    <span className='text-sm truncate'>{user.fullname}</span>
                    <button type='button' onClick={() => toggleUser(user)} className='font-bold hover:text-black'>
                      ×
                    </button>
                  </div>
                )
              })}

              <input
                type='text'
                ref={inputReft}
                placeholder='Tìm kiếm...'
                className='border-none outline-0 flex-1 min-w-[150px]'
                onChange={(e) => handleChange(e.target.value)}
              />
            </div>
          </div>

          <div className='flex flex-col space-y-4'>
            <span>
              <p className='text-lg font-medium'>Gợi ý</p>
            </span>

            <div className='space-y-2'>
              {users.map((user) => (
                <label
                  key={user._id}
                  className='flex items-center justify-between p-2 rounded-lg border-none hover:bg-gray-50 cursor-pointer'
                >
                  <div className='flex items-center'>
                    <img src={user.profilePicture} alt='' className='w-8 h-8 rounded-full mr-3' />
                    <span>
                      <p className='font-medium'>{user.fullname}</p>
                      <p className='text-l'>{user.username}</p>
                    </span>
                  </div>
                  <input
                    type='checkbox'
                    checked={selectedUsers.some((u) => u._id === user._id)}
                    onChange={() => toggleUser(user)}
                    className=" appearance-none w-5 h-5 rounded-full border border-gray-400 cursor-pointer
                            checked:bg-blue-600 checked:border-blue-600 relative
                            checked:before:content-['✓'] checked:before:text-white
                            checked:before:absolute checked:before:top-1/2 checked:before:left-1/2
                            checked:before:-translate-x-1/2 checked:before:-translate-y-1/2
                            checked:before:text-sm"
                  />
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type='submit'
              className='bg-[#4a5df9] text-white hover:bg-[#3c52f9] hover:cursor-pointer'
              disabled={selectedUsers.length === 0}
              onClick={() => mutate()}
            >
              Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
