import type { UseFormRegister, FieldValues, FieldPath } from 'react-hook-form'
import { Input } from '../ui/input'
import { InputHTMLAttributes, useState } from 'react'
interface Props<TFieldValues extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  trackPassword?: string
  errorMessage?: string
  classNameInput: string
  classNameError: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<TFieldValues>
  name: FieldPath<TFieldValues>
}
export default function InputForm<TFieldValues extends FieldValues = FieldValues>({
  trackPassword,
  errorMessage,
  className,
  name,
  register,
  classNameInput = 'w-full border px-4 py-2 rounded pr-10',
  classNameError,
  ...rest
}: Props<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false)
  const handleType = () => {
    if (rest.type === 'password') {
      return showPassword ? 'text' : 'password'
    }
    return rest.type
  }
  return (
    <div>
      <div className='relative'>
        <Input
          {...rest}
          className={errorMessage ? `${classNameInput} border border-red-500` : classNameInput}
          {...register(name)}
          type={handleType()}
        />
        {trackPassword && trackPassword.length > 0 && (
          <div className='absolute right-1 top-1/2 -translate-y-1/2 flex items-center'>
            {errorMessage ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-7 text-red-600'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                />
              </svg>
            )}

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

      {errorMessage ? <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errorMessage}</div> : ''}
    </div>
  )
}
