export interface RegisterRequest {
  fullname: string
  email: string
  username: string
  password: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  new_password: string
  token: string
}

export interface LoginResponse {
  access_token: string
}

export interface RegisterResponse {
  access_token: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface IProfile {
  id: string
  fullname: string
  email: string
  username: string
}
