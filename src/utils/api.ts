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
    const response = await apiClient.post<AuthResponse>("/auth/login", data);

    // Check if response.data exists
    if (!response.data) {
      throw new Error("Empty response received from server");
    }

    const token = response.data.token;

    // Log the response structure to debug
    console.log("Login response data:", JSON.stringify(response.data));

    if (!token) {
      // More detailed error message for debugging
      throw new Error(`Token not found in response. Response data: ${JSON.stringify(response.data)}`);
    }

    localStorage.setItem("accessToken", token);
    setAuthToken(token);

    console.log("Login token:", token);
    console.log("Token in localStorage:", localStorage.getItem("accessToken"));

    return response.data;
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


// Lấy thông tin user hiện tại
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await apiClient.get<User>("/user/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

// Cập nhật profile user
export async function updateUserProfile(
    userId: string,
    profileData: UpdateUserInput
): Promise<UpdateUserResponse> {
  try {
    const response = await apiClient.patch<UpdateUserResponse>(`/user/${userId}`, profileData);
    return response.data;
  } catch (error: any) {
    console.error("Error updating user profile:", error?.response?.data || error.message);
    throw error;
  }
}
