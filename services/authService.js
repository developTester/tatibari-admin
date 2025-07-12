import apiClient from '@/lib/axios';

/**
 * Authentication Service
 * Handles login, register, logout, and token management
 */
export const authService = {
  /**
   * Login user with email and password
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} User data and token
   */
  async login(credentials) {
    try {
      const response = await apiClient.post('/login', credentials);
      
      // Store auth data in localStorage
      const authData = {
        user: response.data.user,
        token: response.data.token,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('tataibari_admin_auth', JSON.stringify(authData));
      
      return {
        success: true,
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User name
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.password_confirmation - Password confirmation
   * @returns {Promise<Object>} Registration result
   */
  async register(userData) {
    try {
      const response = await apiClient.post('/register', userData);
      
      // Store auth data in localStorage
      const authData = {
        user: response.data.user,
        token: response.data.token,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('tataibari_admin_auth', JSON.stringify(authData));
      
      return {
        success: true,
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.',
        errors: error.response?.data?.errors || {}
      };
    }
  },

  /**
   * Logout user and clear auth data
   * @returns {Promise<Object>} Logout result
   */
  async logout() {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local auth data
      localStorage.removeItem('tataibari_admin_auth');
      return { success: true };
    }
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    try {
      const response = await apiClient.get('/user');
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user profile'
      };
    }
  },

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Update result
   */
  async updateProfile(userData) {
    try {
      const response = await apiClient.put('/user', userData);
      
      // Update stored user data
      const authData = JSON.parse(localStorage.getItem('tataibari_admin_auth') || '{}');
      if (authData.user) {
        authData.user = { ...authData.user, ...response.data };
        localStorage.setItem('tataibari_admin_auth', JSON.stringify(authData));
      }
      
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile',
        errors: error.response?.data?.errors || {}
      };
    }
  }
};