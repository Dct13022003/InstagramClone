import instagram_banner from '../../assets/instagram_banner.png'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { login } from '../../apis/auth.api'
import { useContext, useState } from 'react'
import { AppContext } from '../../context/app.context'
import { NavLink, useNavigate } from 'react-router-dom'
import { getSocket } from '../../utils/socket'
import InputForm from '../../components/InputForm'
import { AxiosResponse } from 'axios'
import { ErrorResponse } from '../../types/utils.type'
import { AuthResponse } from '../../types/auth.type'
type FormValues = {
  email: string
  password: string
}
export default function Login() {
  const { setIsAuthenticated, setProfile, setSocket } = useContext(AppContext)
  const { register, handleSubmit, watch } = useForm<FormValues>()
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [trackPassword] = watch(['password'])
  const loginMutation = useMutation<AxiosResponse<AuthResponse>, AxiosResponse<ErrorResponse<FormValues>>, FormValues>({
    mutationFn: (body: FormValues) => login(body)
  })
  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        console.log(data)
        setIsAuthenticated(true)
        setProfile(data.data.result.user)
        const socket = getSocket()
        setSocket(socket)
        navigate('/')
      },
      onError: (error) => {
        const status = error.status as number

        if (status === 401 || status === 422) {
          setError('Đăng nhập không thành công')
          return
        }

        setError('Có lỗi xảy ra, vui lòng thử lại')
      }
    })
  })

  return (
    <main className='h-screen bg-white'>
      <div className='grid grid-cols-1 lg:grid-cols-8 lg:mx-44 lg:mt-32 items-center h-full'>
        {/* Ảnh bên trái */}
        <div className='lg:col-span-5 hidden md:block'>
          <img src={instagram_banner} alt='ảnh ban' className='w-[90%] h-auto object-contain' />
        </div>

        {/* Form bên phải */}
        <div className='lg:col-span-3 mx-6'>
          <form onSubmit={onSubmit}>
            <h1 className='text-4xl font-logo text-center mb-6 hidden lg:block'>Instagram</h1>
            <img src='/instagram-svgrepo-com.svg' alt='Instagram Logo' className='mx-auto size-20 mb-6 lg:hidden' />

            <Input
              type='text'
              className='mb-3 rounded-2xl'
              placeholder='Email người dùng'
              autoComplete='username'
              {...register('email')}
            />
            {/* <Input
              type='password'
              className='rounded-2xl'
              placeholder='Mật khẩu'
              autoComplete='current-password'
              {...register('password')}
            /> */}
            <InputForm
              name='password'
              type='password'
              classNameError=''
              classNameInput='rounded-2xl'
              trackPassword={trackPassword}
              register={register}
              placeholder='Nhập mật khẩu của bạn'
              autoComplete='on'
            />
            <Button className='w-full mt-4 bg-[#0064e0] text-white text-xl px-4 py-6 rounded-3xl'>Đăng nhập</Button>
          </form>

          <div className='relative p-4'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t'></span>
            </div>
            <div className='relative flex justify-center text-base font-semibold uppercase'>
              <span className='bg-card px-2 text-muted-foreground'>Hoặc</span>
            </div>
          </div>
          {error && <div className='text-red-500 text-center mb-4'>{error}</div>}
          <div className='flex justify-center items-center'>
            <span className='text-center text-base'>Bạn chưa có tài khoản ư?</span>
            <NavLink to='/register' className='ml-2 text-blue-500 text-base'>
              Đăng ký
            </NavLink>
          </div>
        </div>
      </div>
    </main>
  )
}
