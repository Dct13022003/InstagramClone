import instagram_banner from '../../assets/instagram_banner.png'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { login } from '../../apis/auth.api'
import { useContext } from 'react'
import { AppContext } from '../../context/app.context'
import { useNavigate } from 'react-router-dom'
type FormValues = {
  email: string
  password: string
}
export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
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
        navigate('/chat')
      },
      onError: (error) => {
        console.error('Login failed:', error)
      }
    })
  })

  return (
    <div className='h-screen bg-white '>
      <div className='grid grid-cols-1 lg:grid-cols-8 lg:mx-32 lg:mt-32 lg:my-12'>
        <div className='lg:col-start-1 lg:col-span-6'>
          <img src={instagram_banner} alt='' />
        </div>
        <div className='lg:col-start-7 lg:col-span-2 '>
          <form onSubmit={onSubmit}>
            <h1 className='text-4xl font-logo text-center mb-6'>Instagram</h1>
            <Input type='text' placeholder='Email người dùng' autoComplete='username' {...register('email')} />
            <Input type='password' placeholder='Mật khẩu' autoComplete='current-password' {...register('password')} />
            <Button className='w-full mt-4 bg-blue-500 text-black'>Đăng nhập</Button>
          </form>
          <div className='relative p-4'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t'></span>
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-card px-2 text-muted-foreground'>Hoặc</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
