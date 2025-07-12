// Updated API functions to use Laravel backend services
import { orderService } from '@/services/orderService';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { userService } from '@/services/userService';
import { mediaService } from '@/services/mediaService';
import { notificationService } from '@/services/notificationService';
import { analyticsService } from '@/services/analyticsService';
import { settingsService } from '@/services/settingsService';

export const api = {
  // Orders API
  orders: {
    getAll: orderService.getAll,
    getById: orderService.getById,
    updateStatus: orderService.updateStatus,
    delete: orderService.delete,
    getStats: orderService.getStats
  },
  
  // Products API
  products: {
    getAll: productService.getAll,
    getById: productService.getById,
    create: productService.create,
    update: productService.update,
    delete: productService.delete,
    uploadImage: productService.uploadImage
  },
  
  // Categories API
  categories: {
    getAll: categoryService.getAll,
    getById: categoryService.getById,
    create: categoryService.create,
    update: categoryService.update,
    delete: categoryService.delete
  },

  // Users API
  users: {
    getAll: userService.getAll,
    getById: userService.getById,
    create: userService.create,
    update: userService.update,
    delete: userService.delete,
    getStats: userService.getStats
  },
  
  // Media API
  media: {
    getAll: mediaService.getAll,
    upload: mediaService.upload,
    delete: mediaService.delete,
    rename: mediaService.rename
  },

  // Notifications API
  notifications: {
    getAll: notificationService.getAll,
    getLatest: notificationService.getLatest,
    markAsRead: notificationService.markAsRead,
    markAllAsRead: notificationService.markAllAsRead,
    delete: notificationService.delete
  },

  // Analytics API
  analytics: {
    getDashboardStats: analyticsService.getDashboardStats,
    getSalesData: analyticsService.getSalesData,
    getActivityLogs: analyticsService.getActivityLogs
  },

  // Settings API
  settings: {
    getAll: settingsService.getAll,
    update: settingsService.update,
    getByKey: settingsService.getByKey,
    updateByKey: settingsService.updateByKey
  }
};