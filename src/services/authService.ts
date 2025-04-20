import api from './api';
import { User, ApiResponse } from '@/types';

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  // Organizer login
  organizerLogin: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
      email,
      password,
    });
    return response.data.data as LoginResponse;
  },

  // Voter login
  voterLogin: async (cnic: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/voter-login', {
      cnic,
      password,
    });
    return response.data.data as LoginResponse;
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data as User;
  },

  // Register as an organizer
  register: async (name: string, email: string, password: string): Promise<void> => {
    await api.post<ApiResponse<void>>('/auth/signup', {
      name,
      email,
      password,
    });
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.get<ApiResponse<void>>('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
};