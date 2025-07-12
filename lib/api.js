// Mock API functions to simulate Laravel backend
const API_BASE = '/api';

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
export const api = {
  // Orders API
  orders: {
    async getAll(params = {}) {
      await delay();
      const { page = 1, status = 'all', search = '', limit = 10 } = params;
      
      let orders = JSON.parse(localStorage.getItem('tataibari_orders') || '[]');
      
      // Filter by status
      if (status !== 'all') {
        orders = orders.filter(order => order.status === status);
      }
      
      // Search by order ID or customer name
      if (search) {
        orders = orders.filter(order => 
          order.id.toString().includes(search) ||
          order.customerName.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Sort by created date (newest first)
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedOrders = orders.slice(startIndex, endIndex);
      
      return {
        data: paginatedOrders,
        meta: {
          current_page: parseInt(page),
          per_page: limit,
          total: orders.length,
          last_page: Math.ceil(orders.length / limit),
          from: startIndex + 1,
          to: Math.min(endIndex, orders.length)
        }
      };
    },
    
    async updateStatus(id, status) {
      await delay(300);
      const orders = JSON.parse(localStorage.getItem('tataibari_orders') || '[]');
      const orderIndex = orders.findIndex(order => order.id === parseInt(id));
      
      if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        orders[orderIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('tataibari_orders', JSON.stringify(orders));
        return { success: true, data: orders[orderIndex] };
      }
      
      throw new Error('Order not found');
    }
  },
  
  // Products API
  products: {
    async getAll(params = {}) {
      await delay();
      const { page = 1, category = 'all', search = '', limit = 10 } = params;
      
      let products = JSON.parse(localStorage.getItem('tataibari_products') || '[]');
      
      // Filter by category
      if (category !== 'all') {
        products = products.filter(product => product.category === category);
      }
      
      // Search by name or description
      if (search) {
        products = products.filter(product => 
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Sort by created date (newest first)
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = products.slice(startIndex, endIndex);
      
      return {
        data: paginatedProducts,
        meta: {
          current_page: parseInt(page),
          per_page: limit,
          total: products.length,
          last_page: Math.ceil(products.length / limit),
          from: startIndex + 1,
          to: Math.min(endIndex, products.length)
        }
      };
    },
    
    async create(productData) {
      await delay();
      const products = JSON.parse(localStorage.getItem('tataibari_products') || '[]');
      const newProduct = {
        ...productData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      products.push(newProduct);
      localStorage.setItem('tataibari_products', JSON.stringify(products));
      return { success: true, data: newProduct };
    },
    
    async update(id, productData) {
      await delay();
      const products = JSON.parse(localStorage.getItem('tataibari_products') || '[]');
      const productIndex = products.findIndex(product => product.id === parseInt(id));
      
      if (productIndex !== -1) {
        products[productIndex] = {
          ...products[productIndex],
          ...productData,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('tataibari_products', JSON.stringify(products));
        return { success: true, data: products[productIndex] };
      }
      
      throw new Error('Product not found');
    },
    
    async delete(id) {
      await delay();
      const products = JSON.parse(localStorage.getItem('tataibari_products') || '[]');
      const filteredProducts = products.filter(product => product.id !== parseInt(id));
      localStorage.setItem('tataibari_products', JSON.stringify(filteredProducts));
      return { success: true };
    }
  },
  
  // Categories API
  categories: {
    async getAll(params = {}) {
      await delay();
      const { page = 1, search = '', limit = 50 } = params;
      
      let categories = JSON.parse(localStorage.getItem('tataibari_categories') || '[]');
      
      // Search by name or description
      if (search) {
        categories = categories.filter(category => 
          category.name.toLowerCase().includes(search.toLowerCase()) ||
          category.description.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Sort by created date (newest first)
      categories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // For categories, we usually don't need pagination, but support it
      if (limit !== 'all') {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        categories = categories.slice(startIndex, endIndex);
      }
      
      return { 
        data: categories,
        meta: {
          current_page: parseInt(page),
          per_page: limit,
          total: categories.length,
          last_page: Math.ceil(categories.length / limit)
        }
      };
    },
    
    async create(categoryData) {
      await delay();
      const categories = JSON.parse(localStorage.getItem('tataibari_categories') || '[]');
      const newCategory = {
        ...categoryData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      categories.push(newCategory);
      localStorage.setItem('tataibari_categories', JSON.stringify(categories));
      return { success: true, data: newCategory };
    },
    
    async update(id, categoryData) {
      await delay();
      const categories = JSON.parse(localStorage.getItem('tataibari_categories') || '[]');
      const categoryIndex = categories.findIndex(category => category.id === parseInt(id));
      
      if (categoryIndex !== -1) {
        categories[categoryIndex] = {
          ...categories[categoryIndex],
          ...categoryData,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('tataibari_categories', JSON.stringify(categories));
        return { success: true, data: categories[categoryIndex] };
      }
      
      throw new Error('Category not found');
    },
    
    async delete(id) {
      await delay();
      const categories = JSON.parse(localStorage.getItem('tataibari_categories') || '[]');
      const filteredCategories = categories.filter(category => category.id !== parseInt(id));
      localStorage.setItem('tataibari_categories', JSON.stringify(filteredCategories));
      return { success: true };
    }
  },
  
  // Media API
  media: {
    async getAll(folder = '') {
      await delay();
      const media = JSON.parse(localStorage.getItem('tataibari_media') || '[]');
      
      // Filter by folder if specified
      const filteredMedia = folder 
        ? media.filter(item => item.folder === folder)
        : media;
      
      // Get unique folders
      const folders = [...new Set(media.map(item => item.folder).filter(Boolean))];
      
      return {
        data: filteredMedia.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        folders: folders
      };
    },
    
    async upload(file, folder = '') {
      await delay(1000); // Simulate upload time
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }
      
      // Create a proper URL for the uploaded file using FileReader
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = function(e) {
          const fileData = {
            id: Date.now() + Math.random(), // Ensure unique ID
            name: file.name,
            originalName: file.name,
            size: file.size,
            type: file.type,
            folder: folder,
            url: e.target.result, // Use base64 data URL for proper display
            createdAt: new Date().toISOString()
          };
          
          const media = JSON.parse(localStorage.getItem('tataibari_media') || '[]');
          media.push(fileData);
          localStorage.setItem('tataibari_media', JSON.stringify(media));
          
          resolve({ success: true, data: fileData });
        };
        
        reader.onerror = function() {
          reject(new Error('Failed to read file'));
        };
        
        reader.readAsDataURL(file);
      });
    },
    
    async delete(id) {
      await delay();
      const media = JSON.parse(localStorage.getItem('tataibari_media') || '[]');
      const filteredMedia = media.filter(item => item.id !== id);
      localStorage.setItem('tataibari_media', JSON.stringify(filteredMedia));
      return { success: true };
    },
    
    async rename(id, newName) {
      await delay();
      const media = JSON.parse(localStorage.getItem('tataibari_media') || '[]');
      const mediaIndex = media.findIndex(item => item.id === id);
      
      if (mediaIndex !== -1) {
        media[mediaIndex].name = newName;
        media[mediaIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('tataibari_media', JSON.stringify(media));
        return { success: true, data: media[mediaIndex] };
      }
      
      throw new Error('Media not found');
    }
  },

  // Notifications API
  notifications: {
    async getLatest(limit = 3) {
      await delay(200);
      const notifications = JSON.parse(localStorage.getItem('tataibari_notifications') || '[]');
      return {
        data: notifications
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, limit)
      };
    },

    async getAll(params = {}) {
      await delay();
      const { page = 1, limit = 10 } = params;
      
      const notifications = JSON.parse(localStorage.getItem('tataibari_notifications') || '[]');
      
      // Sort by created date (newest first)
      const sortedNotifications = notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedNotifications = sortedNotifications.slice(startIndex, endIndex);
      
      return {
        data: paginatedNotifications,
        meta: {
          current_page: parseInt(page),
          per_page: limit,
          total: notifications.length,
          last_page: Math.ceil(notifications.length / limit),
          from: startIndex + 1,
          to: Math.min(endIndex, notifications.length)
        }
      };
    }
  }
};