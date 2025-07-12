export const initializeMockData = () => {
  if (typeof window === 'undefined') return;

  // Initialize orders with new statuses
  const orders = localStorage.getItem('tataibari_orders');
  if (!orders) {
    const mockOrders = [
      {
        id: 1,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '+1234567890',
        total: 299.99,
        status: 'processing',
        paymentId: 'QR12345678',
        items: [
          { id: 1, name: 'Premium Laptop', price: 299.99, quantity: 1 }
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 2,
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '+1987654321',
        total: 59.99,
        status: 'delivered',
        paymentId: 'QR87654321',
        items: [
          { id: 2, name: 'Wireless Mouse', price: 29.99, quantity: 2 }
        ],
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 3,
        customerName: 'Bob Johnson',
        customerEmail: 'bob@example.com',
        customerPhone: '+1555666777',
        total: 149.99,
        status: 'shipped',
        paymentId: 'QR11223344',
        items: [
          { id: 3, name: 'Bluetooth Headphones', price: 149.99, quantity: 1 }
        ],
        createdAt: new Date(Date.now() - 259200000).toISOString()
      },
      {
        id: 4,
        customerName: 'Alice Brown',
        customerEmail: 'alice@example.com',
        customerPhone: '+1444555666',
        total: 79.99,
        status: 'received',
        paymentId: 'QR55667788',
        items: [
          { id: 4, name: 'USB Cable', price: 19.99, quantity: 4 }
        ],
        createdAt: new Date(Date.now() - 345600000).toISOString()
      }
    ];
    localStorage.setItem('tataibari_orders', JSON.stringify(mockOrders));
  }

  // Initialize products with SEO fields
  const products = localStorage.getItem('tataibari_products');
  if (!products) {
    const mockProducts = [
      {
        id: 1,
        name: 'Premium Laptop',
        description: 'High-performance laptop for professionals with latest Intel processor and 16GB RAM',
        price: 299.99,
        stock: 15,
        category: 'Electronics',
        image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
        metaTitle: 'Premium Laptop - High Performance Computing',
        metaDescription: 'Professional laptop with Intel processor, 16GB RAM, perfect for work and gaming',
        metaKeywords: 'laptop, computer, intel, professional, gaming',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with long battery life and precision tracking',
        price: 29.99,
        stock: 50,
        category: 'Electronics',
        image: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=800',
        metaTitle: 'Wireless Mouse - Ergonomic Design',
        metaDescription: 'Comfortable wireless mouse with precision tracking and long battery life',
        metaKeywords: 'mouse, wireless, ergonomic, computer accessory',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Bluetooth Headphones',
        description: 'Premium noise-cancelling Bluetooth headphones with superior sound quality',
        price: 149.99,
        stock: 25,
        category: 'Electronics',
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
        metaTitle: 'Bluetooth Headphones - Premium Audio',
        metaDescription: 'Noise-cancelling Bluetooth headphones with superior sound quality and comfort',
        metaKeywords: 'headphones, bluetooth, noise-cancelling, audio',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('tataibari_products', JSON.stringify(mockProducts));
  }

  // Initialize categories with SEO fields
  const categories = localStorage.getItem('tataibari_categories');
  if (!categories) {
    const mockCategories = [
      { 
        id: 1, 
        name: 'Electronics', 
        description: 'Electronic devices and accessories',
        metaTitle: 'Electronics - Latest Tech Gadgets',
        metaDescription: 'Discover the latest electronic devices and tech accessories',
        metaKeywords: 'electronics, gadgets, technology, devices',
        createdAt: new Date().toISOString()
      },
      { 
        id: 2, 
        name: 'Clothing', 
        description: 'Fashion and apparel',
        metaTitle: 'Clothing - Fashion & Apparel',
        metaDescription: 'Trendy clothing and fashion accessories for all occasions',
        metaKeywords: 'clothing, fashion, apparel, style',
        createdAt: new Date().toISOString()
      },
      { 
        id: 3, 
        name: 'Home & Garden', 
        description: 'Home improvement and garden supplies',
        metaTitle: 'Home & Garden - Improve Your Space',
        metaDescription: 'Quality home improvement and garden supplies for your space',
        metaKeywords: 'home, garden, improvement, supplies',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('tataibari_categories', JSON.stringify(mockCategories));
  }

  // Initialize users
  const users = localStorage.getItem('tataibari_users');
  if (!users) {
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        orderCount: 3,
        totalSpent: 599.97,
        createdAt: new Date(Date.now() - 2592000000).toISOString()
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1987654321',
        orderCount: 1,
        totalSpent: 59.99,
        createdAt: new Date(Date.now() - 1728000000).toISOString()
      }
    ];
    localStorage.setItem('tataibari_users', JSON.stringify(mockUsers));
  }

  // Initialize logs
  const logs = localStorage.getItem('tataibari_logs');
  if (!logs) {
    const mockLogs = [
      {
        id: 1,
        ip: '192.168.1.100',
        page: '/admin/dashboard',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 2,
        ip: '192.168.1.101',
        page: '/admin/products',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 3,
        ip: '192.168.1.102',
        page: '/admin/orders',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 10800000).toISOString()
      }
    ];
    localStorage.setItem('tataibari_logs', JSON.stringify(mockLogs));
  }

  // Initialize media library with proper data structure
  const media = localStorage.getItem('tataibari_media');
  if (!media) {
    const mockMedia = [
      {
        id: 1,
        name: 'laptop-hero.jpg',
        originalName: 'laptop-hero.jpg',
        size: 245760,
        type: 'image/jpeg',
        folder: 'products',
        url: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'mouse-wireless.jpg',
        originalName: 'mouse-wireless.jpg',
        size: 189440,
        type: 'image/jpeg',
        folder: 'products',
        url: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=800',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'headphones-premium.jpg',
        originalName: 'headphones-premium.jpg',
        size: 312580,
        type: 'image/jpeg',
        folder: 'products',
        url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('tataibari_media', JSON.stringify(mockMedia));
  }

  // Initialize settings
  const settings = localStorage.getItem('tataibari_settings');
  if (!settings) {
    const mockSettings = {
      storeName: 'Tataibari Store',
      supportEmail: 'support@tataibari.com',
      supportPhone: '+1-800-TATAIBARI',
      qrCodeImage: '',
      paymentInstructions: 'Scan QR code and complete payment. Share transaction ID.',
      deliveryCharge: 5.99,
      maintenanceMode: false
    };
    localStorage.setItem('tataibari_settings', JSON.stringify(mockSettings));
  }

  // Initialize notifications
  const notifications = localStorage.getItem('tataibari_notifications');
  if (!notifications) {
    const mockNotifications = [
      {
        id: 1,
        title: 'New Order Received',
        message: 'Order #1001 has been placed by John Doe',
        type: 'order',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 2,
        title: 'Low Stock Alert',
        message: 'Wireless Mouse is running low on stock (5 units remaining)',
        type: 'stock',
        read: false,
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 3,
        title: 'Payment Received',
        message: 'Payment for Order #1000 has been confirmed',
        type: 'payment',
        read: true,
        createdAt: new Date(Date.now() - 10800000).toISOString()
      },
      {
        id: 4,
        title: 'New User Registration',
        message: 'Jane Smith has registered as a new user',
        type: 'user',
        read: true,
        createdAt: new Date(Date.now() - 14400000).toISOString()
      },
      {
        id: 5,
        title: 'Product Review',
        message: 'Premium Laptop received a 5-star review',
        type: 'review',
        read: true,
        createdAt: new Date(Date.now() - 18000000).toISOString()
      }
    ];
    localStorage.setItem('tataibari_notifications', JSON.stringify(mockNotifications));
  }

  // Initialize pages
  const pages = localStorage.getItem('tataibari_pages');
  if (!pages) {
    const mockPages = [
      {
        id: 1,
        title: 'About Us',
        slug: 'about-us',
        content: '<h1>About Tataibari Store</h1><p>We are a leading online retailer...</p>',
        metaTitle: 'About Us - Tataibari Store',
        metaDescription: 'Learn more about Tataibari Store and our mission',
        published: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        content: '<h1>Privacy Policy</h1><p>Your privacy is important to us...</p>',
        metaTitle: 'Privacy Policy - Tataibari Store',
        metaDescription: 'Read our privacy policy and data protection practices',
        published: true,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('tataibari_pages', JSON.stringify(mockPages));
  }
};