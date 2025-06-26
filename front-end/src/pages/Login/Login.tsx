import instagram_banner from '../../assets/instagram_banner.png'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { login } from '../../apis/auth.api'
import { useContext } from 'react'
import { AppContext } from '../../context/app.context'
import { useNavigate } from 'react-router-dom'
import { getSocket } from '../../utils/socket'
type FormValues = {
  email: string
  password: string
}
export default function Login() {
  const { setIsAuthenticated, setProfile, setSocket } = useContext(AppContext)
  const { register, handleSubmit } = useForm<FormValues>()
  const navigate = useNavigate()
  const loginMutation = useMutation({
    mutationFn: (body: FormValues) => login(body)
  })
  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.result.user)
        const socket = getSocket()
        setSocket(socket)
        navigate('/chat')
      },
      onError: (error) => {
        console.error('Login failed:', error)
      }
    })
  })

  return (
    <main className='h-screen bg-white'>
      <div className='grid grid-cols-1 lg:grid-cols-8 lg:mx-44 lg:mt-32 items-center'>
        {/* Ảnh bên trái */}
        <div className='lg:col-span-5 hidden md:block'>
          <img src={instagram_banner} alt='ảnh ban' className='w-[90%] h-auto object-contain' />
        </div>

        {/* Form bên phải */}
        <div className='lg:col-span-3 mx-20'>
          <form onSubmit={onSubmit}>
            <h1 className='text-4xl font-logo text-center mb-6'>Instagram</h1>
            <Input
              type='text'
              className='mb-3'
              placeholder='Email người dùng'
              autoComplete='username'
              {...register('email')}
            />
            <Input type='password' placeholder='Mật khẩu' autoComplete='current-password' {...register('password')} />
            <Button className='w-full mt-4 bg-blue-500 text-white text-xl px-4 py-6'>Đăng nhập</Button>
          </form>

          <div className='relative p-4'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t'></span>
            </div>
            <div className='relative flex justify-center text-xl uppercase'>
              <span className='bg-card px-2 text-muted-foreground'>Hoặc</span>
            </div>
          </div>
          <div className='flex justify-center items-center'>
            <p className='text-center text-xl'>Bạn chưa có tài khoản ư?</p>
            <a href='' className='text-xl  text-blue-500'>
              Đăng kí
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
