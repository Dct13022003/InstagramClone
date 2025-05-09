import * as yup from 'yup'

// Extend yup to include the custom method in its type definitions
declare module 'yup' {
  interface StringSchema {
    emailExists(message: string): this
  }
}

yup.addMethod(yup.string, 'emailExists', function (message) {
  return this.test('email-exists', message, async function (value) {
    const { path, createError } = this

    if (!value) return true // để tránh lỗi khi field rỗng (có thể thêm .required() riêng)

    try {
      const res = await fetch(`/api/check-email?email=${value}`)
      const data = await res.json()

      if (data.exists) {
        return createError({ path, message })
      }

      return true
    } catch (err) {
      return createError({ path, message: 'Email đã tồn tại' })
    }
  })
})
export const schema = yup.object({
  email: yup.string().required('Email không đúng định dạng').email('Email không đúng định dạng'),
  // .emailExists('Email đã tồn tại'),
  password: yup
    .string()
    .required('Mật khẩu phải tối thiểu 6 kí tự')
    .min(6, 'Mật khẩu phải tối thiểu 6 kí tự')
    .max(20, 'Mật khẩu phải tối đa 20 kí tự'),
  confirm_password: yup
    .string()
    .required('Mật khẩu phải tối thiểu 6 kí tự')
    .min(6, 'Mật khẩu phải tối thiểu 6 kí tự')
    .max(20, 'Mật khẩu phải tối đa 20 kí tự')
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
  username: yup.string().required('Phải nhập tên người dùng'),
  fullname: yup.string().required('Phải nhập tên người dùng')
})
