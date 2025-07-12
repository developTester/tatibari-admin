# Tataibari Admin Panel

A comprehensive e-commerce administration system built with Next.js, providing complete management capabilities for online stores including order processing, product management, customer data, and analytics.

## 📋 Overview

Tataibari Admin Panel is a full-featured e-commerce management dashboard that enables store administrators to efficiently manage their online business operations. The application provides intuitive interfaces for handling orders, managing product catalogs, organizing categories, monitoring user activity, and configuring store settings.

### 🎯 Main Features

- **Order Management** - Process and track customer orders with status updates
- **Product Catalog** - Add, edit, and organize products with SEO optimization
- **Category Management** - Create hierarchical product categories
- **Media Library** - Upload and manage product images and media files
- **User Management** - Monitor customer accounts and activity
- **Analytics Dashboard** - View sales metrics and performance data
- **Notification System** - Real-time alerts for important events
- **Activity Logging** - Track system access and user behavior
- **SEO Management** - Configure meta tags and search optimization
- **Settings Configuration** - Customize store settings and preferences

## 🖥️ Pages/Screens

### Authentication
- **Login Page** (`/admin/login`) - Secure admin authentication with demo credentials

### Core Management
- **Dashboard** (`/admin/dashboard`) - Overview with sales charts, recent orders, and key metrics
- **Orders** (`/admin/orders`) - Complete order management with status tracking and filtering
- **Products** (`/admin/products`) - Product listing with search, filters, and bulk operations
- **Add Product** (`/admin/products/add`) - Create new products with SEO fields and media upload
- **Edit Product** (`/admin/products/edit/[id]`) - Modify existing product information
- **Categories** (`/admin/categories`) - Manage product categories with hierarchical structure
- **Users** (`/admin/users`) - Customer account management and analytics

### Media & Content
- **Media Gallery** (`/admin/media`) - Upload, organize, and manage media files
- **Pages & SEO** (`/admin/pages`) - Create custom pages and configure SEO settings
- **Notifications** (`/admin/notifications`) - View and manage system notifications

### System
- **Activity Logs** (`/admin/logs`) - Monitor system access and user activity
- **Settings** (`/admin/settings`) - Configure store settings, payment, and delivery options

## 🔌 API Integrations

### Authentication APIs

#### Login
- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Description:** Authenticate admin user and return access token
- **Request Payload:**
  ```json
  {
    "email": "admin@tataibari.com",
    "password": "admin123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "email": "admin@tataibari.com",
      "name": "Admin User"
    },
    "token": "jwt-token-here"
  }
  ```

#### Logout
- **Method:** `POST`
- **Endpoint:** `/api/auth/logout`
- **Description:** Invalidate user session and clear authentication

### Order Management APIs

#### Get Orders
- **Method:** `GET`
- **Endpoint:** `/api/orders?page=1&status=processing&search=john`
- **Description:** Retrieve paginated list of orders with filtering
- **Query Parameters:**
  - `page` - Page number for pagination
  - `status` - Filter by order status (received, viewed, processing, shipped, delivered, cancelled)
  - `search` - Search by order ID or customer name
  - `limit` - Number of orders per page (default: 10)
- **Response:**
  ```json
  {
    "data": [
      {
        "id": 1,
        "customerName": "John Doe",
        "customerEmail": "john@example.com",
        "customerPhone": "+1234567890",
        "total": 299.99,
        "status": "processing",
        "paymentId": "QR12345678",
        "items": [
          {
            "id": 1,
            "name": "Premium Laptop",
            "price": 299.99,
            "quantity": 1
          }
        ],
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "per_page": 10,
      "total": 25,
      "last_page": 3
    }
  }
  ```

#### Update Order Status
- **Method:** `PATCH`
- **Endpoint:** `/api/orders/{id}`
- **Description:** Update order status and tracking information
- **Request Payload:**
  ```json
  {
    "status": "shipped",
    "tracking_number": "TRK123456789"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "status": "shipped",
      "updatedAt": "2024-01-15T14:30:00Z"
    }
  }
  ```

### Product Management APIs

#### Get Products
- **Method:** `GET`
- **Endpoint:** `/api/products?page=1&category=electronics&search=laptop`
- **Description:** Retrieve paginated product list with filtering
- **Query Parameters:**
  - `page` - Page number
  - `category` - Filter by category name
  - `search` - Search by product name or description
  - `limit` - Products per page (default: 10)
- **Response:**
  ```json
  {
    "data": [
      {
        "id": 1,
        "name": "Premium Laptop",
        "description": "High-performance laptop for professionals",
        "price": 299.99,
        "stock": 15,
        "category": "Electronics",
        "image": "https://example.com/laptop.jpg",
        "metaTitle": "Premium Laptop - High Performance",
        "metaDescription": "Professional laptop with Intel processor",
        "metaKeywords": "laptop, computer, intel",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "per_page": 10,
      "total": 50,
      "last_page": 5
    }
  }
  ```

#### Create Product
- **Method:** `POST`
- **Endpoint:** `/api/products`
- **Description:** Create new product with SEO optimization
- **Request Payload:**
  ```json
  {
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with precision tracking",
    "price": 29.99,
    "stock": 50,
    "category": "Electronics",
    "image": "https://example.com/mouse.jpg",
    "metaTitle": "Wireless Mouse - Ergonomic Design",
    "metaDescription": "Comfortable wireless mouse with precision tracking",
    "metaKeywords": "mouse, wireless, ergonomic"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "name": "Wireless Mouse",
      "createdAt": "2024-01-15T15:30:00Z"
    }
  }
  ```

#### Update Product
- **Method:** `PUT`
- **Endpoint:** `/api/products/{id}`
- **Description:** Update existing product information
- **Request Payload:** Same as create product
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "updatedAt": "2024-01-15T16:30:00Z"
    }
  }
  ```

#### Delete Product
- **Method:** `DELETE`
- **Endpoint:** `/api/products/{id}`
- **Description:** Remove product from catalog
- **Response:**
  ```json
  {
    "success": true,
    "message": "Product deleted successfully"
  }
  ```

### Category Management APIs

#### Get Categories
- **Method:** `GET`
- **Endpoint:** `/api/categories?page=1&search=electronics`
- **Description:** Retrieve hierarchical category structure
- **Response:**
  ```json
  {
    "data": [
      {
        "id": 1,
        "name": "Electronics",
        "description": "Electronic devices and accessories",
        "parentCategory": null,
        "metaTitle": "Electronics - Latest Tech Gadgets",
        "metaDescription": "Discover latest electronic devices",
        "metaKeywords": "electronics, gadgets, technology",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
  ```

#### Create Category
- **Method:** `POST`
- **Endpoint:** `/api/categories`
- **Description:** Create new product category with SEO fields
- **Request Payload:**
  ```json
  {
    "name": "Smartphones",
    "description": "Mobile phones and accessories",
    "parentCategory": "Electronics",
    "metaTitle": "Smartphones - Latest Mobile Devices",
    "metaDescription": "Browse latest smartphones and mobile accessories",
    "metaKeywords": "smartphones, mobile, phones"
  }
  ```

#### Update Category
- **Method:** `PUT`
- **Endpoint:** `/api/categories/{id}`
- **Description:** Update category information and hierarchy

#### Delete Category
- **Method:** `DELETE`
- **Endpoint:** `/api/categories/{id}`
- **Description:** Remove category (only if no products assigned)

### Media Management APIs

#### Get Media Files
- **Method:** `GET`
- **Endpoint:** `/api/media?page=1&folder=products`
- **Description:** Retrieve media library with folder organization
- **Query Parameters:**
  - `page` - Page number
  - `folder` - Filter by folder name
- **Response:**
  ```json
  {
    "data": [
      {
        "id": 1,
        "name": "laptop-hero.jpg",
        "originalName": "laptop-hero.jpg",
        "size": 245760,
        "type": "image/jpeg",
        "folder": "products",
        "url": "https://example.com/media/laptop-hero.jpg",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "folders": ["products", "categories", "banners"]
  }
  ```

#### Upload Media
- **Method:** `POST`
- **Endpoint:** `/api/media/upload`
- **Description:** Upload new media file with validation
- **Request:** Multipart form data with file and folder
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "name": "new-image.jpg",
      "url": "https://example.com/media/new-image.jpg"
    }
  }
  ```

#### Rename Media
- **Method:** `PATCH`
- **Endpoint:** `/api/media/{id}`
- **Description:** Rename media file
- **Request Payload:**
  ```json
  {
    "name": "updated-filename.jpg"
  }
  ```

#### Delete Media
- **Method:** `DELETE`
- **Endpoint:** `/api/media/{id}`
- **Description:** Remove media file from library

### User Management APIs

#### Get Users
- **Method:** `GET`
- **Endpoint:** `/api/users?page=1&search=john`
- **Description:** Retrieve customer accounts with analytics
- **Response:**
  ```json
  {
    "data": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "orderCount": 3,
        "totalSpent": 599.97,
        "createdAt": "2024-01-01T10:30:00Z"
      }
    ]
  }
  ```

### Notification APIs

#### Get Latest Notifications
- **Method:** `GET`
- **Endpoint:** `/api/notifications/latest?limit=3`
- **Description:** Retrieve recent notifications for topbar display
- **Response:**
  ```json
  {
    "data": [
      {
        "id": 1,
        "title": "New Order Received",
        "message": "Order #1001 has been placed by John Doe",
        "type": "order",
        "read": false,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
  ```

#### Get All Notifications
- **Method:** `GET`
- **Endpoint:** `/api/notifications?page=1`
- **Description:** Retrieve paginated notification history
- **Response:**
  ```json
  {
    "data": [
      {
        "id": 1,
        "title": "New Order Received",
        "message": "Order #1001 has been placed by John Doe",
        "type": "order",
        "read": false,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "per_page": 10,
      "total": 25,
      "last_page": 3
    }
  }
  ```

#### Mark Notification as Read
- **Method:** `PATCH`
- **Endpoint:** `/api/notifications/{id}/read`
- **Description:** Mark notification as read

### Analytics APIs

#### Get Dashboard Stats
- **Method:** `GET`
- **Endpoint:** `/api/analytics/dashboard`
- **Description:** Retrieve key metrics for dashboard
- **Response:**
  ```json
  {
    "totalOrders": 150,
    "totalRevenue": 15750.50,
    "pendingOrders": 12,
    "totalProducts": 85,
    "salesData": [
      {"name": "Jan", "sales": 4000},
      {"name": "Feb", "sales": 3000}
    ]
  }
  ```

#### Get Activity Logs
- **Method:** `GET`
- **Endpoint:** `/api/logs?page=1&date=today&search=192.168.1.100`
- **Description:** Retrieve system activity logs
- **Query Parameters:**
  - `page` - Page number
  - `date` - Filter by date (today, week, month, all)
  - `search` - Search by IP, page, or user agent
- **Response:**
  ```json
  {
    "data": [
      {
        "id": 1,
        "ip": "192.168.1.100",
        "page": "/admin/dashboard",
        "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ]
  }
  ```

### Settings APIs

#### Get Settings
- **Method:** `GET`
- **Endpoint:** `/api/settings`
- **Description:** Retrieve store configuration
- **Response:**
  ```json
  {
    "storeName": "Tataibari Store",
    "supportEmail": "support@tataibari.com",
    "supportPhone": "+1-800-TATAIBARI",
    "qrCodeImage": "https://example.com/qr-code.png",
    "paymentInstructions": "Scan QR code and complete payment",
    "deliveryCharge": 5.99,
    "maintenanceMode": false
  }
  ```

#### Update Settings
- **Method:** `PUT`
- **Endpoint:** `/api/settings`
- **Description:** Update store configuration
- **Request Payload:** Same structure as get settings response

## 🔐 Authentication

The application uses **JWT token-based authentication** with the following flow:

1. **Login Process:**
   - User submits credentials to `/api/auth/login`
   - Server validates credentials and returns JWT token
   - Token is stored in localStorage as `tataibari_admin_auth`
   - Token is included in Authorization header for subsequent requests

2. **Token Format:**
   ```
   Authorization: Bearer <jwt-token>
   ```

3. **Demo Credentials:**
   - **Email:** `admin@tataibari.com`
   - **Password:** `admin123`

4. **Session Management:**
   - Tokens are validated on each protected route
   - Automatic logout on token expiration
   - Manual logout clears stored token

5. **Route Protection:**
   - All `/admin/*` routes require authentication
   - Unauthenticated users are redirected to login
   - Login page redirects authenticated users to dashboard

## ⚠️ Error Handling

### Common HTTP Status Codes

- **200 OK** - Successful request
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data or parameters
- **401 Unauthorized** - Authentication required or invalid token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **422 Unprocessable Entity** - Validation errors
- **500 Internal Server Error** - Server-side error

### Error Response Format

```json
{
  "success": false,
  "error": "Error message description",
  "errors": {
    "field_name": ["Specific validation error"]
  },
  "code": "ERROR_CODE"
}
```

### Client-Side Error Handling

- **Toast Notifications** - User-friendly error messages using react-hot-toast
- **Form Validation** - Real-time validation with error highlighting
- **Network Errors** - Automatic retry mechanisms for failed requests
- **Loading States** - Visual feedback during API operations
- **Fallback UI** - Graceful degradation for missing data

### Specific Error Scenarios

- **File Upload Errors** - Size limits, file type validation
- **Authentication Errors** - Token expiration, invalid credentials
- **Validation Errors** - Required fields, format validation
- **Network Errors** - Connection timeouts, server unavailable

## 🛠️ Environment Setup

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- **Git** for version control

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-org/tataibari-admin.git
   cd tataibari-admin
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Application
   NEXT_PUBLIC_APP_NAME=Tataibari Admin Panel
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key
   
   # File Upload
   MAX_FILE_SIZE=10485760
   ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
   
   # External Services (Optional)
   GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX-X
   ```

4. **Development Server**
   ```bash
   npm run dev
   ```
   Application will be available at `http://localhost:3000`

5. **Production Build**
   ```bash
   npm run build
   npm start
   ```

### Development Tools

- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting (optional)
- **React Developer Tools** - Browser extension for debugging

### Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 📁 Folder Structure

```
tataibari-admin/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin panel routes
│   │   ├── categories/           # Category management
│   │   ├── dashboard/            # Main dashboard
│   │   ├── login/                # Authentication
│   │   ├── logs/                 # Activity logs
│   │   ├── media/                # Media gallery
│   │   ├── notifications/        # Notification center
│   │   ├── orders/               # Order management
│   │   ├── pages/                # Custom pages & SEO
│   │   ├── products/             # Product management
│   │   │   ├── add/              # Add product form
│   │   │   └── edit/[id]/        # Edit product form
│   │   ├── settings/             # Store settings
│   │   ├── users/                # User management
│   │   └── layout.js             # Admin layout wrapper
│   ├── globals.css               # Global styles
│   ├── layout.js                 # Root layout
│   └── page.js                   # Root redirect
├── components/                   # Reusable components
│   ├── layout/                   # Layout components
│   │   ├── LayoutWrapper.js      # Main layout logic
│   │   ├── Sidebar.js            # Navigation sidebar
│   │   └── TopNavbar.js          # Top navigation bar
│   └── ui/                       # UI components
│       ├── Button.js             # Button component
│       ├── ImageUploader.js      # Image upload component
│       ├── LoadingSpinner.js     # Loading indicator
│       ├── MediaGallery.js       # Media selection modal
│       ├── Modal.js              # Modal dialog
│       ├── Pagination.js         # Pagination controls
│       └── StatusBadge.js        # Status indicator
├── data/                         # Mock data and initialization
│   └── mockData.js               # Demo data setup
├── lib/                          # Utility libraries
│   ├── api.js                    # API client functions
│   ├── auth.js                   # Authentication utilities
│   ├── storage.js                # Local storage helpers
│   └── toast.js                  # Notification system
├── public/                       # Static assets
├── .env.local                    # Environment variables
├── .gitignore                    # Git ignore rules
├── jsconfig.json                 # JavaScript configuration
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.js             # PostCSS configuration
├── README.md                     # Project documentation
└── tailwind.config.js            # Tailwind CSS configuration
```

## 📚 Additional Notes

### Third-Party Libraries

- **Next.js 13.5** - React framework with App Router
- **React 18.2** - UI library with hooks
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Headless UI** - Unstyled accessible UI components
- **React Icons** - Icon library with Font Awesome icons
- **Recharts** - Chart library for analytics
- **React Hot Toast** - Toast notification system

### Key Features & Behaviors

1. **Mock Data System**
   - All data is stored in localStorage for demo purposes
   - Automatic initialization of sample data on first load
   - Simulated API delays for realistic user experience

2. **Responsive Design**
   - Mobile-first approach with Tailwind CSS
   - Collapsible sidebar for mobile devices
   - Touch-friendly interface elements

3. **Real-time Updates**
   - Automatic data refresh after CRUD operations
   - Live notification updates in topbar
   - Dynamic status badge updates

4. **SEO Optimization**
   - Meta tag management for products and categories
   - Custom page creation with SEO fields
   - Search engine friendly URL structure

5. **File Management**
   - Drag & drop file upload interface
   - Image preview and selection system
   - File type and size validation
   - Folder organization support

### Configuration Tips

1. **Performance Optimization**
   - Enable image optimization in production
   - Implement proper caching strategies
   - Use CDN for static assets

2. **Security Considerations**
   - Implement proper JWT token validation
   - Add CSRF protection for forms
   - Sanitize user inputs
   - Use HTTPS in production

3. **Deployment**
   - Build static assets: `npm run build`
   - Configure environment variables for production
   - Set up proper error monitoring
   - Implement backup strategies for data

4. **Customization**
   - Modify Tailwind config for brand colors
   - Update mock data structure as needed
   - Add custom validation rules
   - Extend API endpoints for additional features

### Development Workflow

1. **Local Development**
   - Use `npm run dev` for hot reloading
   - Check browser console for errors
   - Test responsive design on different screen sizes

2. **Code Quality**
   - Follow ESLint rules for consistent code style
   - Use meaningful component and variable names
   - Add comments for complex business logic

3. **Testing**
   - Test all CRUD operations thoroughly
   - Verify responsive design on mobile devices
   - Check error handling scenarios
   - Validate form submissions

This admin panel provides a solid foundation for e-commerce management with room for customization and extension based on specific business requirements.