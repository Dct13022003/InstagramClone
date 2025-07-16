import axios, { AxiosError, type AxiosInstance } from 'axios'
import { AuthResponse, RefreshTokenResponse } from '../types/auth.type'
import { clearLS, getAccessTokenFromLS, setProfileToLS } from './auth'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from '../apis/auth.api'
import { isAxiosExpiredTokenError, isAxiosUnAuthorizedError } from './utils'
import { HttpStatusCode } from '../constants/httpstatuscode.enum'
class Http {
  instance: AxiosInstance
  private access_token: string
  private refresh_token: string
  private refresh_token_request: Promise<string> | null
  constructor() {
    this.access_token = getAccessTokenFromLS() as string
    this.refresh_token = localStorage.getItem('refresh_token') as string
    this.refresh_token_request = null
    this.instance = axios.create({
      baseURL: 'http://localhost:8000/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        const access_token = localStorage.getItem('access_token')
        if (access_token) {
          config.headers.authorization = `Bearer ${access_token}`
          return config
        }
        return config
      },

      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const URL = response.config.url
        console.log(URL)
        if (URL === URL_LOGIN || URL === URL_REGISTER) {
          console.log('response:', response)
          this.access_token = (response.data as AuthResponse).result.access_token
          this.refresh_token = (response.data as AuthResponse).result.refresh_token
          localStorage.setItem('access_token', this.access_token)
          localStorage.setItem('refresh_token', this.refresh_token)
          setProfileToLS((response.data as AuthResponse).result.user)
        } else if (URL === URL_LOGOUT) {
          this.access_token = ''
          this.refresh_token = ''
          clearLS()
        }
        return response
      },
      (error: AxiosError) => {
        // Chỉ toast lỗi không phải 422 và 401
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          // toast.error(message)
        }

        // Lỗi Unauthorized (401) có rất nhiều trường hợp
        // - Token không đúng
        // - Không truyền token
        // - Token hết hạn*

        // Nếu là lỗi 401
        if (isAxiosUnAuthorizedError(error)) {
          const config = error.response?.config || {}
          const { URL } = config
          if (URL !== URL_REFRESH_TOKEN && isAxiosExpiredTokenError(error)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            this.refresh_token_request
              ? this.refresh_token_request
              : this.handleRefreshToken().finally(() => {
                  setTimeout(() => {
                    this.refresh_token_request = null
                  }, 10000)
                })
            return this.refresh_token_request?.then((new_access_token) => {
              if (config.headers) config.headers.authorization = `Bearer ${new_access_token}`
              return this.instance({
                ...config,
                headers: { ...config.headers, authorization: `Bearer ${new_access_token}` }
              })
            })
          }
          clearLS()
          this.access_token = ''
          this.refresh_token = ''
        }
      }
    )
  }
  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenResponse>('/users/refreshToken', {
        refresh_token: this.refresh_token
      })
      .then((response) => {
        const new_access_token = response.data.result.new_access_token
        this.access_token = new_access_token
        this.refresh_token = response.data.result.new_refresh_token
        localStorage.setItem('access_token', this.access_token)
        localStorage.setItem('refresh_token', this.refresh_token)
        return new_access_token
      })
      .catch((error) => {
        clearLS()
        this.access_token = ''
        this.refresh_token = ''
        throw error
      })
  }
}
const http = new Http().instance
export default http
