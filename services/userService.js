import apiClient from '@/lib/axios';

/**
 * User Service
 * Handles all user-related API operations
 */
export const userService = {
  /**
   * Get all users with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {string} params.search - Search term
   * @param {number} params.limit - Items per page
   * @returns {Promise<Object>} Users data with pagination
   */
  async getAll(params = {}) {
    try {
      const response = await apiClient.get('/users', { params });
      return {
        success: true,
        data: response.data.data,
        meta: response.data.meta || response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  /**
   * Get single user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} User data
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user data
   */
  async create(userData) {
    try {
      const response = await apiClient.post('/users', userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  /**
   * Update existing user
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user data
   */
  async update(id, userData) {
    try {
      const response = await apiClient.put(`/users/${id}`, userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise<Object>} Delete result
   */
  async delete(id) {
    try {
      await apiClient.delete(`/users/${id}`);
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  /**
   * Get user statistics
   * @returns {Promise<Object>} User statistics
   */
  async getStats() {
    try {
      const response = await apiClient.get('/users/stats');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user statistics');
    }
  }
};