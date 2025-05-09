import { User } from '../types/user.type'

export const getAccessTokenFromLS = () => {
  return localStorage.getItem('access_token')
}

export const getRefreshTokenFromLS = () => {
  return localStorage.getItem('refresh_token')
}

export const setTokensToLS = (access_token: string, refresh_token: string) => {
  localStorage.setItem('access_token', access_token)
  localStorage.setItem('refresh_token', refresh_token)
}

export const removeTokensFromLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export const getProfileLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}

export const removeProfileLS = () => {
  localStorage.removeItem('profile')
}
