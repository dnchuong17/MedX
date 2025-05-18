import axios from "axios";
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
} from "./interface";

// Tạo Axios instance
export const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

// Thiết lập Authorization header
export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
}

// ✅ Khôi phục token từ localStorage nếu có (khi reload page)
const token = localStorage.getItem("accessToken");
if (token) {
  setAuthToken(token);
}

// Đăng ký bằng email
export async function registerByEmail(data: RegisterByEmailInput): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  } catch (error) {
    console.error("Error registering by email:", error);
    throw error;
  }
}

// Đăng ký bằng ví
export async function registerWallet(data: RegisterWalletInput): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/register-wallet", data);
    return response.data;
  } catch (error) {
    console.error("Error registering by wallet:", error);
    throw error;
  }
}

// Đăng ký bằng số điện thoại
export async function registerByPhone(data: RegisterByPhoneInput): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/phone", data);
    return response.data;
  } catch (error) {
    console.error("Error registering by phone:", error);
    throw error;
  }
}

// Gán email sau khi đăng ký bằng số điện thoại
export async function setEmailAfterPhone(phone: string, email: string): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/set-email", { phone, email });
    return response.data;
  } catch (error) {
    console.error("Error setting email after phone:", error);
    throw error;
  }
}

// Đăng nhập bằng số điện thoại
export async function loginByPhone(phone: string, password: string): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/login-phone", { phone, password });
    return response.data;
  } catch (error) {
    console.error("Error logging in by phone:", error);
    throw error;
  }
}

// Xác minh OTP
export async function verifyOtp(data: VerifyOtpInput): Promise<VerifyOtpResponse> {
  try {
    const response = await apiClient.post<VerifyOtpResponse>("/auth/email-verify", data);
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
}

export async function loginUser(data: LoginInput): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<string | AuthResponse>("/auth/login", data);

    // Check if response exists
    if (!response.data) {
      throw new Error("Empty response received from server");
    }

    let token: string;

    // Handle both string token and object with token property formats
    if (typeof response.data === 'string') {
      // The API returned the token directly as a string
      token = response.data;
      console.log("Received direct token string");
    } else if (response.data.token) {
      // The API returned an object with a token property
      token = response.data.token;
      console.log("Received token from object property");
    } else {
      // More detailed error message for debugging
      throw new Error(`Token not found in response. Response data: ${JSON.stringify(response.data)}`);
    }

    // Store the token and set auth header
    localStorage.setItem("accessToken", token);
    setAuthToken(token);

    console.log("Login token:", token);
    console.log("Token in localStorage:", localStorage.getItem("accessToken"));

    // Return a proper AuthResponse
    return typeof response.data === 'string'
        ? { token, user: null } // If string, create a minimal AuthResponse
        : response.data;        // If object, return as is
  } catch (error) {
    console.error("Error logging in:", error);

    // Check if it's an Axios error with a response
    if (axios.isAxiosError(error) && error.response) {
      console.error("API response error:", error.response.data);
      throw new Error(error.response.data?.message || "Authentication failed");
    }

    throw error;
  }
}

export async function loginWallet(data: LoginWalletInput): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/login-wallet", data);
    const token = response.data.token;

    localStorage.setItem("accessToken", token);
    setAuthToken(token);

    console.log("Wallet login token:", token);
    console.log("Token in localStorage:", localStorage.getItem("accessToken"));

    return response.data;
  } catch (error) {
    console.error("Error logging in with wallet:", error);
    throw error;
  }
}


export async function getCurrentUser(): Promise<User> {
  try {
    // Check if token exists before making request
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Ensure token is set in headers
    setAuthToken(token);

    const response = await apiClient.get<User>("/user/me");
    console.log("Current user data retrieved:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);

    // Handle unauthorized errors
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem("accessToken");
      setAuthToken(null);
      throw new Error("Your session has expired. Please log in again.");
    }

    throw error;
  }
}

// Cập nhật profile user
// Update user profile
export async function updateUserProfile(
    userId: string,
    profileData: UpdateUserInput
): Promise<UpdateUserResponse> {
  try {
    // Check if token exists before making request
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Ensure token is set in headers
    setAuthToken(token);

    console.log(`Updating user ${userId} with data:`, profileData);
    const response = await apiClient.put<UpdateUserResponse>(`/user/${userId}`, profileData);
    console.log("Profile update successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating user profile:", error?.response?.data || error.message);

    // Handle unauthorized errors
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem("accessToken");
      setAuthToken(null);
    }

    throw error;
  }
}
