import { BookmarkIcon, CameraIcon, ContactIcon, Grid3x3Icon, Settings } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { NavLink, Outlet, useParams } from 'react-router-dom'
import { useContext, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AppContext } from '../../context/app.context'
import { ProfileResponse } from '../../types/user.type'
import { getProfile, uploadAvatar } from '../../apis/profile.api'
import { setProfileToLS } from '../../utils/auth'
import { followUser, unfollowUser } from '../../apis/follow.api'

export default function Profile() {
  const { profile, setProfile } = useContext(AppContext)
  const queryClient = useQueryClient()
  const { username } = useParams()
  const { isPending: isAvatarPending, mutateAsync } = useMutation({
    mutationFn: uploadAvatar
  })

  const { data: profileData } = useQuery<ProfileResponse>({
    queryKey: ['profile', username],
    queryFn: () => getProfile(username as string)
  })

  const { mutate: mutateFollow } = useMutation({
    mutationFn: followUser,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['profile', username] })

      const prevProfile = queryClient.getQueryData<ProfileResponse>(['profile', username])
      if (prevProfile) {
        queryClient.setQueryData(['profile', username], {
          ...prevProfile,
          isFollowed: !prevProfile.isFollowed,
          followerCount: prevProfile.isFollowed ? prevProfile.followerCount - 1 : prevProfile.followerCount + 1
        })
      }
      return { prevProfile }
    },
    onError: (err, variables, context) => {
      if (context?.prevProfile) {
        queryClient.setQueryData(['profile', username], context.prevProfile)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] })
    }
  })

  const { mutate: mutateUnFollow } = useMutation({
    mutationFn: unfollowUser,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['profile', username] })
      const prevProfile = queryClient.getQueryData<ProfileResponse>(['profile', username])
      if (prevProfile) {
        queryClient.setQueryData(['profile', username], {
          ...prevProfile,
          isFollowed: !prevProfile.isFollowed,
          followerCount: prevProfile.isFollowed ? prevProfile.followerCount - 1 : prevProfile.followerCount + 1
        })
      }
      return { prevProfile }
    },
    onError: (err, variables, context) => {
      if (context?.prevProfile) {
        queryClient.setQueryData(['profile', username], context.prevProfile)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] })
    }
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const form = new FormData()
    form.append('image', file)

    try {
      const res = await mutateAsync(form)
      const avatarUrl = res.result
      setProfile(avatarUrl)
      setProfileToLS(avatarUrl)
    } catch (err) {
      console.error('Upload avatar failed:', err)
      alert('Upload thất bại!')
    }
  }

  const handleFollowUser = () => {
    if (profileData?.user._id) {
      mutateFollow(profileData?.user._id)
    }
  }

  const handleUnFollowUser = () => {
    if (profileData?.user._id) {
      mutateUnFollow(profileData?.user._id)
    }
  }

  return (
    <div className='w-full pt-8 py-8'>
      <div className='max-w-xl mx-auto'>
        <div className='flex flex-col md:flex-row items-center md:items-start gap-6'>
          {username != profile?.username ? (
            <>
              <div className='flex-1 flex justify-center items-center relative h-48 overflow-hidden'>
                <div className=' w-42 h-42 rounded-full overflow-hidden group'>
                  <img
                    src={profileData?.user.profilePicture}
                    alt='avatar'
                    className='w-full h-full object-cover transition'
                  />
                </div>
              </div>
              <div className='flex-2 space-y-1 text-center md:text-left'>
                <div className='flex flex-col md:flex-row md:items-center'>
                  <h2 className='text-2xl font-bold'>{profileData?.user.username}</h2>
                </div>
                <p className='text-base'>{profileData?.user?.fullname}</p>
                <div className='flex gap-4 justify-center md:justify-start text-base '>
                  <span>
                    <span className='text-black font-semibold'>0</span> bài viết
                  </span>
                  <span>
                    <span className='text-gray-800 font-semibold'>{profileData?.followerCount}</span> người theo dõi
                  </span>
                  <span>
                    Đang theo dõi <strong className='text-gray-700 font-semibold'>{profileData?.followingCount}</strong>{' '}
                    người dùng
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className='flex-1 flex justify-center items-center relative h-48 overflow-hidden'>
                <div className='absolute top-2 left-1/2 -translate-x-1/2 -translate-y-1 z-1'>
                  <div className='relative bg-white text-sm px-3 py-1 rounded-2xl shadow '>
                    Ghi chú...
                    <div className='absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 bg-white rounded-full shadow'></div>
                  </div>
                </div>
                <div className='relative w-42 h-42 rounded-full overflow-hidden group'>
                  <img
                    src={profile?.profilePicture}
                    alt='avatar'
                    className='w-full h-full object-cover transition group-hover:brightness-75'
                  />
                  {isAvatarPending ? (
                    <div className='absolute inset-0 flex items-center justify-center bg-opacity-30 z-10'>
                      <div className='w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin'></div>
                    </div>
                  ) : (
                    <>
                      <label
                        htmlFor='avatar-input'
                        className='absolute inset-0 cursor-pointer flex items-center justify-center bg-opacity-0 group-hover:bg-opacity-40 transition'
                      >
                        <CameraIcon size={48} className='text-white opacity-0 group-hover:opacity-100 transition' />
                      </label>
                      <input
                        id='avatar-input'
                        type='file'
                        className='hidden'
                        accept='.jpg,.jpeg,.png'
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                    </>
                  )}
                </div>
              </div>
              <div className='flex-2 space-y-1 text-center md:text-left'>
                <div className='flex flex-col md:flex-row md:items-center gap-4'>
                  <h2 className='text-xl font-bold'>{username}</h2>
                </div>
                <p className=' pb-2'>{profile?.fullname}</p>
                <div className='flex gap-4 justify-center md:justify-start text-lg text-gray-500'>
                  <span>
                    <strong className='text-gray-700'>0</strong> bài viết
                  </span>
                  <span>
                    <strong className='text-gray-700'>{profileData?.followingCount}</strong> người theo dõi
                  </span>
                  <span>
                    Đang theo dõi <strong className='text-gray-700'>{profileData?.followerCount}</strong> người dùng
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className='flex gap-2 justify-center w-full items-center mt-6 md:mt-4'>
          {username != profile?.username ? (
            <>
              {profileData &&
                (profileData.isFollowed ? (
                  <>
                    <Button variant='outline' onClick={handleUnFollowUser} className='bg-gray-200 text-black flex-1'>
                      Đang theo dõi
                    </Button>
                    <Button variant='outline' className='bg-gray-200 cursor-pointer flex-1'>
                      Nhắn tin
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleFollowUser} className='bg-[#0866ff] text-white hover:bg-blue-700 flex-1'>
                    Theo dõi
                  </Button>
                ))}
            </>
          ) : (
            <>
              <Button variant='outline' className='bg-gray-200  cursor-pointer flex-1'>
                Chỉnh sửa trang cá nhân
              </Button>
              <Button variant='outline' className='bg-gray-200  cursor-pointer flex-1'>
                Xem kho lưu trữ
              </Button>
            </>
          )}

          <Button variant='outline' className='outline-0 cursor-pointer' size='icon'>
            <Settings size={18} />
          </Button>
        </div>
        <div className='flex gap-2'></div>
        <div className='mt-10 flex gap-4'>
          <div className='flex flex-col items-center'>
            <div className='w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center text-2xl text-gray-400'>
              +
            </div>
            <span className='text-sm mt-1'>Mới</span>
          </div>
        </div>
      </div>
      <div className='md:max-w-xl lg:max-w-3xl mx-auto mt-10'>
        <div className='mt-6 md:border-b-0 border-t border-b-2'>
          <div className='grid grid-cols-3 md:flex justify-center md:space-x-20 text-sm text-gray-500  font-medium'>
            <NavLink end to='' className={({ isActive }) => (isActive ? 'tab-active border-t-2' : 'tab-inactive')}>
              <div className='border-black py-4 flex items-center justify-center md:gap-2 gap-0.5 '>
                <Grid3x3Icon className='w-10 md:w-4' />
                <span className='hidden md:inline'>BÀI VIẾT</span>
              </div>
            </NavLink>
            <NavLink to='saved' className={({ isActive }) => (isActive ? 'tab-active border-t-2' : 'tab-inactive')}>
              <div className=' border-black py-4 flex items-center justify-center md:gap-2 gap-0.5 '>
                <BookmarkIcon className='w-10 md:w-4' />
                <span className='hidden md:inline'>ĐÃ LƯU</span>
              </div>
            </NavLink>
            <NavLink to='tagged' className={({ isActive }) => (isActive ? 'tab-active border-t-2' : 'tab-inactive')}>
              <div className=' border-black py-4 flex items-center justify-center md:gap-2 gap-0.5 '>
                <ContactIcon className='w-10 md:w-4' />
                <span className='hidden md:inline'>ĐƯỢC GẮN THẺ</span>
              </div>
            </NavLink>
          </div>
        </div>
        <Outlet context={username} />
      </div>
    </div>
  )
}
