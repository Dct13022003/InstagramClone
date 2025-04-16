export interface User {
  _id?: string
  username?: string
  email?: string
  password?: string
  profilePicture?: string
  bio?: string
  gender?: 'male' | 'female'
  email_verify_token?: string
  forgot_password_token?: string
}
