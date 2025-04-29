import axios, { type AxiosInstance } from 'axios'
import { AuthResponse } from '../types/auth.type'
import { getAccessTokenFromLS } from './auth'
class Http {
  instance: AxiosInstance
  private access_token: string
  constructor() {
    this.access_token = getAccessTokenFromLS() as string
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
          config.headers.Authorization = `Bearer ${access_token}`
          return config
        }
        return config
      },

      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use((response) => {
      const URL = response.config.url
      if (URL === 'users/login' || URL === 'users/register') {
        console.log('response:', response)
        this.access_token = (response.data as AuthResponse).result.access_token
        localStorage.setItem('access_token', this.access_token)
      }
      return response
    })
  }
}
const http = new Http().instance
export default http
