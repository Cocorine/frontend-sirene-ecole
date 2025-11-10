import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_CONFIG, AUTH_CONFIG } from '../config/api'
import router from '../router'

/**
 * Create Axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers
})

/**
 * Request interceptor to add authentication token
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(AUTH_CONFIG.tokenKey)

    if (token && config.headers) {
      config.headers.Authorization = `${AUTH_CONFIG.tokenPrefix} ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor to handle errors globally
 */
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      // Check if this is a config with skipAuthRedirect flag (for login flows)
      const config = error.config as InternalAxiosRequestConfig & { skipAuthRedirect?: boolean }

      if (!config?.skipAuthRedirect) {
        // Only clear auth and redirect if not during login flow
        const currentPath = router.currentRoute.value.path
        const isAuthRoute = currentPath.includes('/login') || currentPath.includes('/auth/otp')

        if (!isAuthRoute) {
          console.log('401 Error: Clearing auth and redirecting to login')
          localStorage.removeItem(AUTH_CONFIG.tokenKey)
          localStorage.removeItem(AUTH_CONFIG.userKey)
          router.push('/login')
        } else {
          console.log('401 Error during auth flow: Not clearing tokens')
        }
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data)
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data)
    }

    return Promise.reject(error)
  }
)

export default apiClient
