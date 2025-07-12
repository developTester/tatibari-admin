'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaGlobe, FaCode, FaImage } from 'react-icons/fa';
import { getStorageData, addStorageItem, updateStorageItem, deleteStorageItem } from '@/lib/storage';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function PagesPage() {
  const [pages, setPages] = useState([]);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showSEOModal, setShowSEOModal] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [activeTab, setActiveTab] = useState('pages');
  
  const [pageFormData, setPageFormData] = useState({
    title: '',
    slug: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    published: true
  });

  const [seoData, setSeoData] = useState({
    siteName: 'Tataibari Store',
    siteDescription: 'Your trusted online store',
    favicon: '',
    logo: '',
    googleAnalytics: '',
    customHead: ''
  });

  useEffect(() => {
    loadPages();
    loadSEOData();
  }, []);

  const loadPages = () => {
    const pagesData = getStorageData('tataibari_pages');
    setPages(pagesData);
  };

  const loadSEOData = () => {
    const settings = getStorageData('tataibari_settings');
    if (settings && settings.seo) {
      setSeoData(settings.seo);
    }
  };

  const handleAddPage = () => {
    setEditingPage(null);
    setPageFormData({
      title: '',
      slug: '',
      content: '',
      metaTitle: '',
      metaDescription: '',
      published: true
    });
    setShowAddEditModal(true);
  };

  const handleEditPage = (page) => {
    setEditingPage(page);
    setPageFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      metaTitle: page.metaTitle || '',
      metaDescription: page.metaDescription || '',
      published: page.published
    });
    setShowAddEditModal(true);
  };

  const handleDeletePage = (pageId) => {
    if (confirm('Are you sure you want to delete this page?')) {
      deleteStorageItem('tataibari_pages', pageId);
      loadPages();
    }
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    
    const pageData = {
      ...pageFormData,
      slug: pageFormData.slug || pageFormData.title.toLowerCase().replace(/\s+/g, '-')
    };

    if (editingPage) {
      updateStorageItem('tataibari_pages', editingPage.id, pageData);
    } else {
      addStorageItem('tataibari_pages', pageData);
    }

    setShowAddEditModal(false);
    loadPages();
  };

  const handleSEOSubmit = (e) => {
    e.preventDefault();
    
    const settings = getStorageData('tataibari_settings') || {};
    settings.seo = seoData;
    localStorage.setItem('tataibari_settings', JSON.stringify(settings));
    
    setShowSEOModal(false);
    alert('SEO settings saved successfully!');
  };

  const handlePageChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPageFormData({
      ...pageFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSEOChange = (e) => {
    setSeoData({
      ...seoData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Pages & SEO</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage custom pages and SEO settings
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('pages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaGlobe className="inline-block mr-2 h-4 w-4" />
              Custom Pages
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'seo'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaCode className="inline-block mr-2 h-4 w-4" />
              SEO Settings
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'pages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Custom Pages</h3>
                <Button onClick={handleAddPage} className="flex items-center space-x-2">
                  <FaPlus className="h-4 w-4" />
                  <span>Add Page</span>
                </Button>
              </div>

              {/* Pages List */}
              <div className="space-y-4">
                {pages.map((page) => (
                  <div key={page.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-lg font-medium text-gray-900">{page.title}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            page.published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {page.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">/{page.slug}</p>
                        {page.metaDescription && (
                          <p className="text-sm text-gray-500 mt-2">{page.metaDescription}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPage(page)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit Page"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePage(page.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Page"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {pages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📄</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No custom pages yet</h3>
                    <p className="text-gray-600 mb-4">Create custom pages for your store.</p>
                    <Button onClick={handleAddPage}>Add Your First Page</Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>
                <Button onClick={() => setShowSEOModal(true)} className="flex items-center space-x-2">
                  <FaCode className="h-4 w-4" />
                  <span>Edit SEO Settings</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Site Name</label>
                    <p className="mt-1 text-sm text-gray-900">{seoData.siteName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Site Description</label>
                    <p className="mt-1 text-sm text-gray-900">{seoData.siteDescription}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Google Analytics ID</label>
                    <p className="mt-1 text-sm text-gray-900">{seoData.googleAnalytics || 'Not configured'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Favicon URL</label>
                    <p className="mt-1 text-sm text-gray-900">{seoData.favicon || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                    <p className="mt-1 text-sm text-gray-900">{seoData.logo || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Custom Head Code</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {seoData.customHead ? 'Configured' : 'Not configured'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Page Modal */}
      <Modal
        isOpen={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        title={editingPage ? 'Edit Page' : 'Add New Page'}
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handlePageSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title *
              </label>
              <input
                type="text"
                name="title"
                value={pageFormData.title}
                onChange={handlePageChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter page title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                name="slug"
                value={pageFormData.slug}
                onChange={handlePageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="auto-generated-from-title"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Content *
            </label>
            <textarea
              name="content"
              value={pageFormData.content}
              onChange={handlePageChange}
              required
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter HTML content for the page"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                name="metaTitle"
                value={pageFormData.metaTitle}
                onChange={handlePageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="SEO title (optional)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <input
                type="text"
                name="metaDescription"
                value={pageFormData.metaDescription}
                onChange={handlePageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="SEO description (optional)"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="published"
              checked={pageFormData.published}
              onChange={handlePageChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Publish this page
            </label>
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
              {editingPage ? 'Update Page' : 'Create Page'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* SEO Settings Modal */}
      <Modal
        isOpen={showSEOModal}
        onClose={() => setShowSEOModal(false)}
        title="SEO Settings"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSEOSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                value={seoData.siteName}
                onChange={handleSEOChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Store Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Analytics ID
              </label>
              <input
                type="text"
                name="googleAnalytics"
                value={seoData.googleAnalytics}
                onChange={handleSEOChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="GA-XXXXXXXXX-X"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Description
            </label>
            <textarea
              name="siteDescription"
              value={seoData.siteDescription}
              onChange={handleSEOChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of your store"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Favicon URL
              </label>
              <input
                type="url"
                name="favicon"
                value={seoData.favicon}
                onChange={handleSEOChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/favicon.ico"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                name="logo"
                value={seoData.logo}
                onChange={handleSEOChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Head Code
            </label>
            <textarea
              name="customHead"
              value={seoData.customHead}
              onChange={handleSEOChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Custom HTML to inject into <head> section"
            />
            <p className="text-xs text-gray-500 mt-1">
              Add custom meta tags, tracking codes, or other HTML
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSEOModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Save SEO Settings
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}