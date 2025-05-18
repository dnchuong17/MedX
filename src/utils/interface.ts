export interface RegisterByEmailInput {
  email: string
  password: string
  name: string
}

export interface RegisterByPhoneInput {
  phone: string
  password: string
  name: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface VerifyOtpInput {
  email: string
  otp: string
}

export interface User {
  id: string
  email: string
  name: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface VerifyOtpResponse {
  message: string
}

export interface ApiError {
  message: string
  status?: number
  data?: unknown
}

export interface LoginWalletInput {
  wallet_address: string
  message: string
  signature: string
}

export interface RegisterWalletInput {
  wallet_address: string
  message: string
  signature: string
}
