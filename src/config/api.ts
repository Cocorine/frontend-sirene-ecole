/**
 * API Configuration
 */
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}

export const AUTH_CONFIG = {
  tokenKey: 'auth_token',
  userKey: 'auth_user',
  tokenPrefix: 'Bearer'
}
