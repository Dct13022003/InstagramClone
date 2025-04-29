import { useContext, useState } from 'react'
import { Input } from '../../components/ui/input'
import { AppContext } from '../../context/app.context'
import { useForm } from 'react-hook-form'
import { on } from 'events'
import { useMutation } from '@tanstack/react-query'
type FormValues = {
  email: string
  password: string
  confirm_password: string
}
export default function Register() {
  const { setIsAuthenticated } = useContext(AppContext)
  const { register, handleSubmit } = useForm<FormValues>()
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const  registerMutation = useMutation({
    mutationFn: (body: FormValues) => register(body)
  })
  const onSubmit = handleSubmit((data: FormValues) => {
    registerMutation.mutate(data, {
      onSuccess: () => {setIsAuthenticated(true)},
      onError: (error) => {
        console.error('Login failed:', error)
      }
    
    
  })
  return (
    <div className='flex justify-center min-h-screen bg-gray-100 p-4'>
      <div className='w-full max-w-sm bg-white border border-gray-300 p-6'>
        <h1 className='text-4xl font-logo text-center mb-4'>Instagram</h1>
        <p className='text-center text-gray-500 text-lg mb-4'>Đăng ký để xem ảnh và video từ bạn bè.</p>
        <button className='w-full bg-blue-500 text-white py-2 rounded font-medium mb-4'>Đăng nhập bằng Facebook</button>
        <div className='flex items-center justify-center mb-4'>
          <span className='w-full border-t border-gray-300'></span>
          <span className='px-2 text-sm text-gray-400'>HOẶC</span>
          <span className='w-full border-t border-gray-300'></span>
        </div>
        <form className='space-y-3' onSubmit={onSubmit}>
          <Input
            type='text'
            placeholder='Số di động hoặc email'
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500'
          />
          <div className='relative'>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder='Mật khẩu'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full border px-4 py-2 rounded pr-10'
            />
            {password.length > 0 && (
              <div className='absolute right-1 top-1/2 -translate-y-1/2 flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-7'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                  />
                </svg>

                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className=' text-black  hover:text-gray-500 border-none'
                >
                  Hiển thị
                </button>
              </div>
            )}
          </div>
          <Input
            type='text'
            placeholder='Tên đầy đủ'
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500'
          />
          <Input
            type='text'
            placeholder='Tên người dùng'
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500'
          />
          <button type='submit' className='w-full bg-blue-500 text-white py-2 rounded font-medium mt-2'>
            Đăng ký
          </button>
        </form>
        <p className='text-xs text-center text-gray-500 mt-4'>
          Bằng cách đăng ký, bạn đồng ý với Điều khoản, Chính sách quyền riêng tư và Chính sách cookie của chúng tôi.
        </p>
      </div>
    </div>
  )
}
