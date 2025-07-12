'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentCategory: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await api.categories.getAll();
      setCategories(response.data);
    } catch (error) {
      showToast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      parentCategory: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ''
    });
    setShowAddEditModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      parentCategory: category.parentCategory || '',
      metaTitle: category.metaTitle || '',
      metaDescription: category.metaDescription || '',
      metaKeywords: category.metaKeywords || ''
    });
    setShowAddEditModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await api.categories.delete(categoryId);
      showToast.success('Category deleted successfully');
      loadCategories();
    } catch (error) {
      showToast.error('Failed to delete category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await api.categories.update(editingCategory.id, formData);
        showToast.success('Category updated successfully');
      } else {
        await api.categories.create(formData);
        showToast.success('Category created successfully');
      }

      setShowAddEditModal(false);
      loadCategories();
    } catch (error) {
      showToast.error(`Failed to ${editingCategory ? 'update' : 'create'} category`);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Get parent categories for dropdown
  const parentCategories = categories.filter(cat => !cat.parentCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage product categories and their hierarchy
          </p>
        </div>
        <Button onClick={handleAddCategory} className="flex items-center space-x-2">
          <FaPlus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {categories.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                    {category.parentCategory && (
                      <p className="text-xs text-blue-600 mt-1">
                        Parent: {category.parentCategory}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Category"
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Category"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                
                {/* SEO Info */}
                {(category.metaTitle || category.metaDescription) && (
                  <div className="border-t pt-3 mt-3">
                    <p className="text-xs text-gray-500">SEO configured</p>
                    {category.metaTitle && (
                      <p className="text-xs text-gray-600 truncate">Title: {category.metaTitle}</p>
                    )}
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-3">
                  Created: {new Date(category.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📂</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first category.</p>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      <Modal
        isOpen={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Category
                </label>
                <select
                  name="parentCategory"
                  value={formData.parentCategory}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None (Top Level)</option>
                  {parentCategories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category description"
              />
            </div>
          </div>

          {/* SEO Information */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900">SEO Information</h3>
            
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddEditModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}