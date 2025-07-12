import apiClient from '@/lib/axios';

/**
 * Media Service
 * Handles all media-related API operations
 */
export const mediaService = {
  /**
   * Get all media files with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {string} params.folder - Folder filter
   * @param {number} params.limit - Items per page
   * @returns {Promise<Object>} Media data with pagination
   */
  async getAll(params = {}) {
    try {
      const response = await apiClient.get('/media', { params });
      return {
        success: true,
        data: response.data.data,
        folders: response.data.folders || [],
        meta: response.data.meta || response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch media');
    }
  },

  /**
   * Upload media file
   * @param {File} file - File to upload
   * @param {string} folder - Folder name (optional)
   * @returns {Promise<Object>} Upload result
   */
  async upload(file, folder = '') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (folder) {
        formData.append('folder', folder);
      }

      const response = await apiClient.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload file');
    }
  },

  /**
   * Delete media file
   * @param {number} id - Media ID
   * @returns {Promise<Object>} Delete result
   */
  async delete(id) {
    try {
      await apiClient.delete(`/media/${id}`);
      return { success: true };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete media');
    }
  },

  /**
   * Rename media file
   * @param {number} id - Media ID
   * @param {string} name - New name
   * @returns {Promise<Object>} Update result
   */
  async rename(id, name) {
    try {
      const response = await apiClient.patch(`/media/${id}`, { name });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to rename media');
    }
  }
};