'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { getStorageData } from '@/lib/storage';
import ImageUploader from '@/components/ui/ImageUploader';
import Button from '@/components/ui/Button';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
    // SEO fields
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });

  useEffect(() => {
    loadCategories();
    loadProduct();
  }, [productId]);

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

  const loadProduct = async () => {
    try {
      const response = await api.products.getById(productId);
      if (response.success) {
        const foundProduct = response.data;
        setProduct(foundProduct);
        setFormData({
          name: foundProduct.name || '',
          description: foundProduct.description || '',
          price: foundProduct.price?.toString() || '',
          stock: foundProduct.stock?.toString() || '',
          category: foundProduct.category || '',
          image: foundProduct.image || '',
          metaTitle: foundProduct.metaTitle || '',
          metaDescription: foundProduct.metaDescription || '',
          metaKeywords: foundProduct.metaKeywords || ''
        });
      }
    } catch (error) {
      console.error('Product loading error:', error);
      showToast.error('Product not found');
      router.push('/admin/products');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      const response = await api.products.update(productId, productData);
      if (response.success) {
        showToast.success('Product updated successfully');
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Product update error:', error);
      showToast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  if (!product) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center space-x-2"
        >
          <FaArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
          <p className="mt-2 text-sm text-gray-700">
            Update product information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SEO Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SEO title for search engines"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 50-60 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description for search engines"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 150-160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    name="metaKeywords"
                    value={formData.metaKeywords}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate keywords with commas
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Image */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <ImageUploader
                value={formData.image}
                onChange={handleImageChange}
                label="Product Image"
              />
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="space-y-4">
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <FaSave className="h-4 w-4" />
                  <span>Update Product</span>
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/products')}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}