import apiClient from '@/lib/axios';

/**
 * Analytics Service
 * Handles all analytics and dashboard-related API operations
 */
export const analyticsService = {
  /**
   * Get dashboard statistics
   * @returns {Promise<Object>} Dashboard stats
   */
  async getDashboardStats() {
    try {
      const response = await apiClient.get('/analytics/dashboard');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard statistics');
    }
  },

  /**
   * Get sales data for charts
   * @param {Object} params - Query parameters
   * @param {string} params.period - Time period (week, month, year)
   * @returns {Promise<Object>} Sales data
   */
  async getSalesData(params = {}) {
    try {
      const response = await apiClient.get('/analytics/sales', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch sales data');
    }
  },

  /**
   * Get activity logs
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {string} params.date - Date filter
   * @param {string} params.search - Search term
   * @returns {Promise<Object>} Activity logs
   */
  async getActivityLogs(params = {}) {
    try {
      const response = await apiClient.get('/logs', { params });
      return {
        success: true,
        data: response.data.data,
        meta: response.data.meta || response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch activity logs');
    }
  }
};