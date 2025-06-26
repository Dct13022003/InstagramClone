import { Input } from '../../components/ui/input'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { registerUser } from '../../apis/auth.api'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from '../../utils/rules'
import InputForm from '../../components/InputForm'
import { useNavigate } from 'react-router-dom'
import { isAxiosErrorUnprocessableEntityError } from '../../utils/utils'
import { ErrorResponse } from '../../types/utils.type'
import { Button } from '../../components/ui/button'
type FormValues = {
  email: string
  password: string
  confirm_password: string
  username: string
  fullname: string
}
export default function Register() {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors }
  } = useForm<FormValues>({ resolver: yupResolver(schema), mode: 'onChange' })
  const navigate = useNavigate()
  const [trackPassword, trackConfirm_password] = watch(['password', 'confirm_password'])
  const registerMutation = useMutation({
    mutationFn: (body: FormValues) => registerUser(body)
  })
  const onSubmit = handleSubmit((data: FormValues) => {
    console.log(data)
    registerMutation.mutate(data, {
      onSuccess: () => {
        navigate('/login')
      },
      onError: (error) => {
        console.log(error)
        if (isAxiosErrorUnprocessableEntityError<ErrorResponse<FormValues>>(error)) {
          const formError = error.response?.data.errors

          if (formError) {
            Object.keys(formError).forEach((key) => {
              const value = formError[key as keyof FormValues]
              if (typeof value === 'string') {
                setError(key as keyof FormValues, {
                  message: value,
                  type: 'server'
                })

                // Nếu là object có msg
              } else if (value && typeof value === 'object' && 'msg' in value) {
                setError(key as keyof FormValues, {
                  message: value.msg,
                  type: 'server'
                })
              }
            })
          }
        }
      }
    })
  })
  return (
    <div className='flex justify-center min-h-screen bg-gray-50 p-4'>
      <div className='w-full max-w-lg'>
        <div className='bg-gray-50 border border-gray-300 px-12 py-6'>
          <h1 className='text-4xl font-logo text-center my-4'>Instagram</h1>
          <p className='text-center text-gray-500 text-2xl mb-4'>Đăng ký để xem ảnh và video từ bạn bè.</p>
          <button className='w-full bg-blue-500 text-white py-2 rounded font-medium mb-4'>
            Đăng nhập bằng Facebook
          </button>
          <div className='flex items-center justify-center mb-4'>
            <span className='w-full border-t border-gray-300'></span>
            <span className='px-2 text-sm text-gray-400'>HOẶC</span>
            <span className='w-full border-t border-gray-300'></span>
          </div>
          <form className='space-y-3' onSubmit={onSubmit}>
            <InputForm
              name='email'
              type='text'
              classNameError=''
              classNameInput=''
              register={register}
              placeholder='Nhập mật email'
              errorMessage={errors.email?.message}
            />

            <InputForm
              name='password'
              type='password'
              classNameError=''
              classNameInput=''
              trackPassword={trackPassword}
              register={register}
              placeholder='Nhập mật khẩu của bạn'
              autoComplete='on'
              errorMessage={errors.password?.message}
            />
            <InputForm
              name='confirm_password'
              type='password'
              classNameError=''
              classNameInput=''
              trackPassword={trackConfirm_password}
              register={register}
              placeholder='Nhập lại mật khẩu của bạn'
              autoComplete='on'
              errorMessage={errors.confirm_password?.message}
            />
            <Input
              type='text'
              placeholder='Tên đầy đủ'
              {...register('fullname')}
              className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
            <Input
              type='text'
              placeholder='Tên người dùng'
              {...register('username')}
              className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
            <Button className='w-full mt-4 bg-blue-500 text-white text-xl px-4 py-6'>Đăng ký</Button>
          </form>
          <p className='text-xs text-center text-gray-500 mt-4'>
            Bằng cách đăng ký, bạn đồng ý với Điều khoản, Chính sách quyền riêng tư và Chính sách cookie của chúng tôi.
          </p>
        </div>
        <div className='bg-gray-50 border border-gray-300 px-12 py-6 flex items-center justify-center my-4'>
          <div className='text-center'>
            <p>Bạn có tài khoản?</p>
            <a href='#' className='text-blue-500 font-semibold'>
              Đăng nhập
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
