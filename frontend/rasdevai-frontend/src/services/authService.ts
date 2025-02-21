import axiosInstance from "./axiosInstance";
import { API_BASE_URL } from "../configs/apiConfig";
import { SignInData, SignUpData, AuthResponse } from "../types/Auth";

export const signIn = async (data: SignInData): Promise<AuthResponse> => {
    const response = await axiosInstance.post(
        `${API_BASE_URL}/auth/login`,
        data
    );
    return response.data;
};

export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
    const response = await axiosInstance.post(
        `${API_BASE_URL}/auth/register`,
        data
    );
    return response.data;
};
