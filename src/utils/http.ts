import { BASE_URL } from '@/features/auth/constants'
import axios, { AxiosInstance } from 'axios'
import { enqueueSnackbar } from 'notistack'
import { clearLocalStorage } from '.'

class Http {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: BASE_URL
    })

    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Cach 1:
          // localStorage.removeItem('access_token')
          // window.location.href = '/login'

          // Cach 2:
          clearLocalStorage()
          enqueueSnackbar('Please login again!!', {
            variant: 'warning',
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            }
          })
        }

        if (error.response?.status === 400) {
          enqueueSnackbar(error.response.data.message, {
            variant: 'error',
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right'
            }
          })
        }

        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
