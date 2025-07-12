import apiClient from '@/lib/axios';

/**
 * Product Service
 * Handles all product-related API operations
 */
export const productService = {
  /**
   * Get all products with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {string} params.category - Category filter
   * @param {string} params.search - Search term
   * @param {number} params.limit - Items per page
   * @returns {Promise<Object>} Products data with pagination
   */
  async getAll(params = {}) {
    try {
      const response = await apiClient.get('/products', { params });
      return {
        success: true,
        data: response.data.data,
        meta: response.data.meta || response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  },

  /**
   * Get single product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Product data
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  },

  /**
   * Create new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product data
   */
  async create(productData) {
    try {
      const response = await apiClient.post('/products', productData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create product');
    }
  },

  /**
   * Update existing product
   * @param {number} id - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise<Object>} Updated product data
   */
  async update(id, productData) {
    try {
      const response = await apiClient.put(`/products/${id}`, productData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  },

  /**
   * Delete product
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Delete result
   */
  async delete(id) {
    try {
      await apiClient.delete(`/products/${id}`);
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  },

  /**
   * Upload product image
   * @param {File} file - Image file
   * @param {number} productId - Product ID (optional)
   * @returns {Promise<Object>} Upload result with image URL
   */
  async uploadImage(file, productId = null) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      if (productId) {
        formData.append('product_id', productId);
      }

      const response = await apiClient.post('/products/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  }
};