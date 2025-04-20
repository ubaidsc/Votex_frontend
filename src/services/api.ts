import axios from 'axios';
import { toast } from 'sonner';

// Base API URL - replace with your actual API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = 
      error.response?.data?.message || 
      error.message || 
      'An unexpected error occurred';
    
    // Show toast notification for errors unless it's a 401 error
    // (401 errors are handled by the auth interceptor)
    if (error.response?.status !== 401) {
      toast.error(message);
    }
    
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login only if not already on a login page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login')) {
        window.location.href = '/login/organizer';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;