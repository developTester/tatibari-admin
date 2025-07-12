import apiClient from '@/lib/axios';

/**
 * Category Service
 * Handles all category-related API operations
 */
export const categoryService = {
  /**
   * Get all categories with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {string} params.search - Search term
   * @param {number} params.limit - Items per page
   * @returns {Promise<Object>} Categories data with pagination
   */
  async getAll(params = {}) {
    try {
      const response = await apiClient.get('/categories', { params });
      return {
        success: true,
        data: response.data.data || response.data,
        meta: response.data.meta || {}
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  },

  /**
   * Get single category by ID
   * @param {number} id - Category ID
   * @returns {Promise<Object>} Category data
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/categories/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch category');
    }
  },

  /**
   * Create new category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Created category data
   */
  async create(categoryData) {
    try {
      const response = await apiClient.post('/categories', categoryData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create category');
    }
  },

  /**
   * Update existing category
   * @param {number} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise<Object>} Updated category data
   */
  async update(id, categoryData) {
    try {
      const response = await apiClient.put(`/categories/${id}`, categoryData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update category');
    }
  },

  /**
   * Delete category
   * @param {number} id - Category ID
   * @returns {Promise<Object>} Delete result
   */
  async delete(id) {
    try {
      await apiClient.delete(`/categories/${id}`);
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
  }
};