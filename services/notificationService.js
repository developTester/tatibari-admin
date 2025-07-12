import apiClient from '@/lib/axios';

/**
 * Notification Service
 * Handles all notification-related API operations
 */
export const notificationService = {
  /**
   * Get all notifications with pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise<Object>} Notifications data with pagination
   */
  async getAll(params = {}) {
    try {
      const response = await apiClient.get('/notifications', { params });
      return {
        success: true,
        data: response.data.data,
        meta: response.data.meta || response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  },

  /**
   * Get latest notifications
   * @param {number} limit - Number of notifications to fetch
   * @returns {Promise<Object>} Latest notifications
   */
  async getLatest(limit = 3) {
    try {
      const response = await apiClient.get(`/notifications/latest?limit=${limit}`);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch latest notifications');
    }
  },

  /**
   * Mark notification as read
   * @param {number} id - Notification ID
   * @returns {Promise<Object>} Update result
   */
  async markAsRead(id) {
    try {
      const response = await apiClient.patch(`/notifications/${id}/read`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
    }
  },

  /**
   * Mark all notifications as read
   * @returns {Promise<Object>} Update result
   */
  async markAllAsRead() {
    try {
      const response = await apiClient.patch('/notifications/mark-all-read');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  },

  /**
   * Delete notification
   * @param {number} id - Notification ID
   * @returns {Promise<Object>} Delete result
   */
  async delete(id) {
    try {
      await apiClient.delete(`/notifications/${id}`);
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete notification');
    }
  }
};