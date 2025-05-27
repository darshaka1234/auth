import axios from "axios";
import { User, AuthResponse } from "@/types/user";
import "../config/envConfig";

const API_URL = process.env.API_URL;
console.log(API_URL);

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await api.post<AuthResponse>("/auth/refresh-token", {
          refreshToken,
        });

        const { token, refreshToken: newRefreshToken } = response.data;

        // Update tokens in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Update the failed request's authorization header
        originalRequest.headers.Authorization = `Bearer ${token}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, clear tokens and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  // Register new user
  register: async (credentials: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      "/auth/register",
      credentials
    );
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }
    return response.data;
  },

  // Login user
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },

  // Logout user
  logout: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      await api.post("/auth/logout", { refreshToken });
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },
};
