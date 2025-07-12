import { authService } from '@/services/authService';

export const AUTH_KEY = 'tataibari_admin_auth';

export const login = async (credentials) => {
  return await authService.login(credentials);
};

export const register = async (userData) => {
  return await authService.register(userData);
};

export const logout = async () => {
  return await authService.logout();
};

export const getAuthData = () => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = () => {
  return getAuthData() !== null;
};