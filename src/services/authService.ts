import apiClient from './api'

export interface RequestOtpData {
  telephone: string
}

export interface VerifyOtpData {
  telephone: string
  otp: string
}

export interface LoginData {
  email: string
  password: string
}

export interface ChangePasswordData {
  ancien_mot_de_passe: string
  nouveau_mot_de_passe: string
  nouveau_mot_de_passe_confirmation: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    access_token?: string
    token_type?: string
    expires_in?: number
    user?: any
  }
}

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Request OTP code for phone login
   */
  async requestOtp(data: RequestOtpData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/request-otp', data)
    return response.data
  }

  /**
   * Verify OTP code and authenticate user
   */
  async verifyOtp(data: VerifyOtpData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/verify-otp', data)
    return response.data
  }

  /**
   * Login with email and password (alternative method)
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', data)
    return response.data
  }

  /**
   * Get current authenticated user
   */
  async me(): Promise<any> {
    const response = await apiClient.get('/auth/me')
    return response.data
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  }

  /**
   * Change password
   */
  async changerMotDePasse(data: ChangePasswordData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/changerMotDePasse', data)
    return response.data
  }
}

export default new AuthService()
