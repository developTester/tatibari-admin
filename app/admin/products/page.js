'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';
import Pagination from '@/components/ui/Pagination';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  
  // Filters and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [meta, setMeta] = useState({});

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [currentPage, searchTerm, categoryFilter]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await api.products.getAll({
        page: currentPage,
        category: categoryFilter,
        search: searchTerm,
        limit: 10
      });
      
      if (response.success) {
        setProducts(response.data);
        setMeta(response.meta);
      }
    } catch (error) {
      console.error('Products loading error:', error);
      showToast.error('Failed to load products');
      setProducts([]);
      setMeta({});
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.categories.getAll();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Categories loading error:', error);
      showToast.error('Failed to load categories');
      setCategories([]);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await api.products.delete(productId);
      if (response.success) {
        showToast.success('Product deleted successfully');
        loadProducts();
      }
    } catch (error) {
      console.error('Product deletion error:', error);
      showToast.error('Failed to delete product');
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your product inventory
          </p>
        </div>
        <Button 
          onClick={() => router.push('/admin/products/add')}
          className="flex items-center space-x-2"
        >
          <FaPlus className="h-4 w-4" />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.image || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800'}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock > 10 
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewProduct(product)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Product"
                          >
                            <FaEye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit Product"
                          >
                            <FaEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Product"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={meta.last_page || 1}
              onPageChange={handlePageChange}
              meta={meta}
            />
          </>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || categoryFilter !== 'all' ? 'No products found' : 'No products yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Get started by adding your first product.'}
            </p>
            <Button onClick={() => router.push('/admin/products/add')}>
              Add Product
            </Button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <Modal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        title="Product Details"
        maxWidth="max-w-2xl"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedProduct.image || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">{selectedProduct.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <p className="text-lg font-bold text-green-600">${selectedProduct.price}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <p className="text-lg font-semibold">{selectedProduct.stock}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="text-sm text-gray-900">{selectedProduct.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedProduct.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            {/* SEO Information */}
            {(selectedProduct.metaTitle || selectedProduct.metaDescription || selectedProduct.metaKeywords) && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">SEO Information</h4>
                <div className="space-y-2 text-sm">
                  {selectedProduct.metaTitle && (
                    <p><span className="font-medium">Meta Title:</span> {selectedProduct.metaTitle}</p>
                  )}
                  {selectedProduct.metaDescription && (
                    <p><span className="font-medium">Meta Description:</span> {selectedProduct.metaDescription}</p>
                  )}
                  {selectedProduct.metaKeywords && (
                    <p><span className="font-medium">Keywords:</span> {selectedProduct.metaKeywords}</p>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowProductModal(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setShowProductModal(false);
                router.push(`/admin/products/edit/${selectedProduct.id}`);
              }}>
                Edit Product
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}