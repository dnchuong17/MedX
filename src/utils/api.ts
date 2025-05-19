import axios from "axios"
import {
  RegisterByEmailInput,
  LoginInput,
  VerifyOtpInput,
  AuthResponse,
  VerifyOtpResponse,
  LoginWalletInput,
  RegisterWalletInput,
  UpdateUserInput,
  UpdateUserResponse,
  User,
  RegisterByPhoneInput,
} from "./interface"

// Safe localStorage access utility
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key)
    }
    return null
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value)
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key)
    }
  },
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Enable sending cookies in cross-origin requests
})

// Add request interceptor for error handling
apiClient.interceptors.request.use(
  (config) => {
    const token = safeLocalStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      safeLocalStorage.removeItem("accessToken")
      // Optionally redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login"
      }
    }
    return Promise.reject(error)
  }
)

export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common["Authorization"]
  }
}

const token = safeLocalStorage.getItem("accessToken")
if (token) {
  setAuthToken(token)
}

export async function registerByEmail(
  data: RegisterByEmailInput
): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/register", data)
    return response.data
  } catch (error) {
    console.error("Error registering by email:", error)
    throw error
  }
}

export async function registerWallet(
  data: RegisterWalletInput
): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register-wallet",
      data
    )
    return response.data
  } catch (error) {
    console.error("Error registering by wallet:", error)
    throw error
  }
}

export async function registerByPhone(
  data: RegisterByPhoneInput
): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/phone", data)
    return response.data
  } catch (error) {
    console.error("Error registering by phone:", error)
    throw error
  }
}

export async function setEmailAfterPhone(
  phone: string,
  email: string
): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/set-email", {
      phone,
      email,
    })
    return response.data
  } catch (error) {
    console.error("Error setting email after phone:", error)
    throw error
  }
}

export async function loginByPhone(
  phone: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<string | AuthResponse>(
      "/auth/login-phone",
      {
        phone,
        password,
      }
    )

    if (!response.data) {
      throw new Error("Empty response received from server")
    }

    let token: string

    if (typeof response.data === "string") {
      token = response.data
      console.log("Received direct token string from phone login")
    } else if (response.data.token) {
      token = response.data.token
      console.log("Received token from phone login response object")
    } else {
      throw new Error(
        `Token not found in response. Response data: ${JSON.stringify(
          response.data
        )}`
      )
    }

    safeLocalStorage.setItem("accessToken", token)
    setAuthToken(token)

    console.log("Phone login token:", token)
    console.log(
      "Token in localStorage:",
      safeLocalStorage.getItem("accessToken")
    )

    return typeof response.data === "string" ? { token } : response.data
  } catch (error) {
    console.error("Error logging in by phone:", error)

    if (axios.isAxiosError(error) && error.response) {
      console.error("API response error:", error.response.data)
      throw new Error(error.response.data?.message || "Authentication failed")
    }

    throw error
  }
}

export async function verifyOtp(
  data: VerifyOtpInput
): Promise<VerifyOtpResponse> {
  try {
    const response = await apiClient.post<VerifyOtpResponse>(
      "/auth/email-verify",
      data
    )
    return response.data
  } catch (error) {
    console.error("Error verifying OTP:", error)
    throw error
  }
}

export async function loginUser(data: LoginInput): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/login", data)

    if (!response.data) {
      throw new Error("Empty response received from server")
    }

    const token =
      typeof response.data === "string" ? response.data : response.data.token
    if (!token) {
      throw new Error("No token received from server")
    }

    safeLocalStorage.setItem("accessToken", token)
    setAuthToken(token)

    return { token }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("Invalid email or password")
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      if (error.message) {
        throw new Error(error.message)
      }
    }
    throw new Error("An error occurred during login. Please try again.")
  }
}

export async function loginWallet(
  data: LoginWalletInput
): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<string | AuthResponse>(
      "/auth/login-wallet",
      data
    )

    if (!response.data) {
      throw new Error("Empty response received from server")
    }

    let token: string

    if (typeof response.data === "string") {
      token = response.data
      console.log("Received direct token string (wallet login)")
    } else if (response.data.token) {
      token = response.data.token
      console.log("Received token from object property (wallet login)")
    } else {
      throw new Error(
        `Token not found in response. Response data: ${JSON.stringify(
          response.data
        )}`
      )
    }

    safeLocalStorage.setItem("accessToken", token)
    setAuthToken(token)

    console.log("Wallet login token:", token)
    console.log(
      "Token in localStorage:",
      safeLocalStorage.getItem("accessToken")
    )

    return typeof response.data === "string" ? { token } : response.data
  } catch (error) {
    console.error("Error logging in with wallet:", error)

    if (axios.isAxiosError(error) && error.response) {
      console.error("API response error:", error.response.data)
      throw new Error(
        error.response.data?.message || "Wallet authentication failed"
      )
    }

    throw error
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    const token = safeLocalStorage.getItem("accessToken")
    if (!token) {
      throw new Error("No authentication token found")
    }

    setAuthToken(token)

    const response = await apiClient.get<User>("/user/me")
    console.log("Current user data retrieved:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching current user:", error)

    // Handle unauthorized errors
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Clear invalid token
      safeLocalStorage.removeItem("accessToken")
      setAuthToken(null)
      throw new Error("Your session has expired. Please log in again.")
    }

    throw error
  }
}

export async function updateUserProfile(
  userId: string,
  profileData: UpdateUserInput
): Promise<UpdateUserResponse> {
  try {
    const token = safeLocalStorage.getItem("accessToken")
    if (!token) {
      throw new Error("No authentication token found")
    }

    setAuthToken(token)

    console.log(`Updating user ${userId} with data:`, profileData)
    const response = await apiClient.put<UpdateUserResponse>(
      `/user/${userId}`,
      profileData
    )
    console.log("Profile update successful:", response.data)
    return response.data
  } catch (error: unknown) {
    console.error(
      "Error updating user profile:",
      error instanceof Error ? error.message : "Unknown error"
    )

    if (axios.isAxiosError(error) && error.response?.status === 401) {
      safeLocalStorage.removeItem("accessToken")
      setAuthToken(null)
    }

    throw error
  }
}

export async function getUserByEmail(email: string): Promise<User> {
  try {
    const token = safeLocalStorage.getItem("accessToken")
    if (!token) {
      throw new Error("No authentication token found")
    }

    setAuthToken(token)

    const response = await apiClient.get<User>(`/user`, {
      params: { email },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching user by email:", error)

    if (axios.isAxiosError(error) && error.response?.status === 401) {
      safeLocalStorage.removeItem("accessToken")
      setAuthToken(null)
      throw new Error("Your session has expired. Please log in again.")
    }

    throw error
  }
}
