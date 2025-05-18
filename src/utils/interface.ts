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

// export interface User {
//   id: string
//   email: string
//   name: string
// }

export interface User {
  id: number;
  email: string;
  password?: string; // optional nếu user dùng OAuth/wallet
  name?: string;
  phone?: string;
  is_verified: boolean;
  otp?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | string; // có thể thay bằng enum
  weight?: number;
  height?: number;
  wallet_address?: string;
  encrypted_key?: string;
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

// interfaces.ts - Add these types to your existing interface file

export interface UpdateUserInput {
  age?: string | number;
  gender?: string;
  height?: string | number;
  weight?: string | number;
  [key: string]: any;
}

export interface UpdateUserResponse {
  id: string;
  email?: string;
  name?: string;
  age?: string | number;
  gender?: string;
  height?: string | number;
  weight?: string | number;
  [key: string]: any;
}