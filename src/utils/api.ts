import axios from "axios"
import {
  RegisterByEmailInput,
  LoginInput,
  VerifyOtpInput,
  AuthResponse,
  VerifyOtpResponse,
  LoginWalletInput,

  RegisterByPhoneInput,
} from "./interface"

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

export async function registerByEmail(
  data: RegisterByEmailInput
): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/register", data)
    if (response.status === 200 || response.status === 201) {
      return response.data
    }
    throw new Error(`Unexpected response code: ${response.status}`)
  } catch (error) {
    console.error("Error registering by email:", error)
    throw error
  }
}

export async function registerByPhone(
    data: RegisterByPhoneInput
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/phone", data);
  return response.data;
}

export async function setEmailAfterPhone(
    phone: string,
    email: string
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/set-email", { phone, email });
  return response.data;
}

export async function loginByPhone(
    phone: string,
    password: string
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/login-phone", { phone, password });
  return response.data;
}

export async function verifyOtp(
  data: VerifyOtpInput
): Promise<VerifyOtpResponse> {
  try {
    const response = await apiClient.post<VerifyOtpResponse>(
      "/auth/email-verify",
      data
    )
    if (response.status === 200 || response.status === 201) {
      return response.data
    }
    throw new Error(`Unexpected response code: ${response.status}`)
  } catch (error) {
    console.error("Error verifying OTP:", error)
    throw error
  }
}

export async function loginUser(data: LoginInput): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/login", data)
    if (response.status === 200 || response.status === 201) {
      return response.data
    }
    throw new Error(`Unexpected response code: ${response.status}`)
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}

export async function loginWallet(
  data: LoginWalletInput
): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login-wallet",
      data
    )
    if (response.status === 200 || response.status === 201) {
      return response.data
    }
    throw new Error(`Unexpected response code: ${response.status}`)
  } catch (error) {
    console.error("Error logging in with wallet:", error)
    throw error
  }
}