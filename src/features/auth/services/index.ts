import http from '@/utils/http'
import {
  ForgotPasswordRequest,
  IProfile,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest
} from '../types'

export class Auth {
  static async login(payload: LoginRequest) {
    try {
      const response = await http.post<LoginResponse>('login', payload)

      return response.data
    } catch (error) {
      throw new Error(`Sai tài khoản hoặc mật khẩu`)
    }
  }

  static async register(payload: RegisterRequest) {
    try {
      const response = await http.post<RegisterResponse>('register', payload)

      return response.data
    } catch (error) {
      throw new Error(`Tạo tài khoản không thành công`)
    }
  }

  static async getProfile() {
    try {
      const response = await http.get<IProfile>('profile')

      return response.data
    } catch (error) {
      throw new Error(
        `lấy chi tiết tài khoản không thành công: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  static async logout() {
    try {
      const response = await http.post('logout')

      return response.data
    } catch (error) {
      throw new Error(`Thoát tài khoản không thành công`)
    }
  }

  static async forgotPassword(payload: ForgotPasswordRequest) {
    try {
      const response = await http.post('forgot-password', payload)

      return response.data
    } catch (error) {
      throw new Error(`reset mat khau khong thanh cong`)
    }
  }

  static async resetPassword(body: ResetPasswordRequest) {
    try {
      const response = await http.post(
        'reset-password',
        {
          new_password: body.new_password
        },
        { headers: { Authorization: `Bearer ${body.token}` } }
      )

      return response.data
    } catch (error) {
      throw new Error(`reset mat khau khong thanh cong`)
    }
  }
}

export const authLogin = (payload: LoginRequest) => Auth.login(payload)
export const authRegister = (payload: RegisterRequest) => Auth.register(payload)
export const getProfile = () => Auth.getProfile()
export const authLogout = () => Auth.logout()
export const forgotPassword = (payload: ForgotPasswordRequest) => Auth.forgotPassword(payload)
export const resetPassword = (payload: ResetPasswordRequest) => Auth.resetPassword(payload)
