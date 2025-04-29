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
