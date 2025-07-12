import apiClient from '@/lib/axios';

/**
 * Order Service
 * Handles all order-related API operations
 */
export const orderService = {
  /**
   * Get all orders with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {string} params.status - Order status filter
   * @param {string} params.search - Search term
   * @param {number} params.limit - Items per page
   * @returns {Promise<Object>} Orders data with pagination
   */
  async getAll(params = {}) {
    try {
      const response = await apiClient.get('/orders', { params });
      return {
        success: true,
        data: response.data.data,
        meta: response.data.meta || response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  /**
   * Get single order by ID
   * @param {number} id - Order ID
   * @returns {Promise<Object>} Order data
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
  },

  /**
   * Update order status
   * @param {number} id - Order ID
   * @param {string} status - New status
   * @param {string} trackingNumber - Tracking number (optional)
   * @returns {Promise<Object>} Updated order data
   */
  async updateStatus(id, status, trackingNumber = null) {
    try {
      const data = { status };
      if (trackingNumber) {
        data.tracking_number = trackingNumber;
      }
      
      const response = await apiClient.patch(`/orders/${id}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
  },

  /**
   * Delete order
   * @param {number} id - Order ID
   * @returns {Promise<Object>} Delete result
   */
  async delete(id) {
    try {
      await apiClient.delete(`/orders/${id}`);
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete order');
    }
  },

  /**
   * Get order statistics
   * @returns {Promise<Object>} Order statistics
   */
  async getStats() {
    try {
      const response = await apiClient.get('/orders/stats');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order statistics');
    }
  }
};