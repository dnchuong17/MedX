import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const registerByEmail = async (data: {
    email: string;
    password: string;
    name: string
}) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
    const response = await axios.post(`${API_BASE_URL}/auth/email-verify`, data);
    return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
    return response.data;
};
