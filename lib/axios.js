import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('tataibari_admin_auth');
      if (authData) {
        try {
          const { token } = JSON.parse(authData);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error parsing auth data:', error);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tataibari_admin_auth');
        window.location.href = '/admin/login';
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;