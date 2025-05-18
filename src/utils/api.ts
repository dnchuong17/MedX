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
    const token = response.data.token;

    console.log("Login token:", token); // <-- Thêm dòng này để hiển thị token

    localStorage.setItem("accessToken", token);
    setAuthToken(token);

    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}


export async function loginWallet(data: LoginWalletInput): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/login-wallet", data);
    const token = response.data.token;

    console.log("Wallet login token:", token); // <-- Thêm dòng này

    localStorage.setItem("accessToken", token);
    setAuthToken(token);

    return response.data;
  } catch (error) {
    console.error("Error logging in with wallet:", error);
    throw error;
  }
}


export async function getCurrentUser(): Promise<User> {
  try {
    const response = await apiClient.get<User>("/user/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

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
