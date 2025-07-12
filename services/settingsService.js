import apiClient from '@/lib/axios';

/**
 * Settings Service
 * Handles all settings-related API operations
 */
export const settingsService = {
  /**
   * Get all settings
   * @returns {Promise<Object>} Settings data
   */
  async getAll() {
    try {
      const response = await apiClient.get('/settings');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch settings');
    }
  },

  /**
   * Update settings
   * @param {Object} settingsData - Settings data to update
   * @returns {Promise<Object>} Update result
   */
  async update(settingsData) {
    try {
      const response = await apiClient.put('/settings', settingsData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update settings');
    }
  },

  /**
   * Get specific setting by key
   * @param {string} key - Setting key
   * @returns {Promise<Object>} Setting value
   */
  async getByKey(key) {
    try {
      const response = await apiClient.get(`/settings/${key}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch setting');
    }
  },

  /**
   * Update specific setting by key
   * @param {string} key - Setting key
   * @param {any} value - Setting value
   * @returns {Promise<Object>} Update result
   */
  async updateByKey(key, value) {
    try {
      const response = await apiClient.put(`/settings/${key}`, { value });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update setting');
    }
  }
};