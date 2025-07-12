'use client';

import { useState, useEffect } from 'react';
import { FaUpload, FaEdit, FaTrash, FaImage, FaFolder } from 'react-icons/fa';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';

export default function MediaPage() {
  const [media, setMedia] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [newName, setNewName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    loadMedia();
  }, [selectedFolder]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const response = await api.media.getAll(selectedFolder);
      setMedia(response.data);
      setFolders(response.folders);
    } catch (error) {
      showToast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          await api.media.upload(file, selectedFolder || 'uploads');
        }
      }
      showToast.success(`${files.length} file(s) uploaded successfully`);
      loadMedia();
    } catch (error) {
      showToast.error('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleRename = async (id) => {
    if (!newName.trim()) return;
    
    try {
      await api.media.rename(id, newName);
      showToast.success('File renamed successfully');
      setEditingItem(null);
      setNewName('');
      loadMedia();
    } catch (error) {
      showToast.error('Failed to rename file');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      await api.media.delete(id);
      showToast.success('File deleted successfully');
      loadMedia();
    } catch (error) {
      showToast.error('Failed to delete file');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMedia = media.slice(startIndex, endIndex);
  const totalPages = Math.ceil(media.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Media Gallery</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your media files and images
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload new images
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <Button
                  type="button"
                  className="mt-2"
                  loading={uploading}
                >
                  <FaUpload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </label>
              <p className="mt-2 text-sm text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {folders.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-4">
            <FaFolder className="h-5 w-5 text-gray-400" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Folder
              </label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Files</option>
                {folders.map((folder) => (
                  <option key={folder} value={folder}>
                    {folder}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Media Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : currentMedia.length > 0 ? (
          <>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {currentMedia.map((item) => (
                  <div
                    key={item.id}
                    className="relative group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingItem(item.id);
                            setNewName(item.name);
                          }}
                          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                          title="Rename"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                          title="Delete"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* File Info */}
                    <div className="p-3 bg-white">
                      {editingItem === item.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleRename(item.id);
                              }
                            }}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleRename(item.id)}
                              className="flex-1 bg-green-600 text-white text-xs py-1 rounded hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingItem(null);
                                setNewName('');
                              }}
                              className="flex-1 bg-gray-600 text-white text-xs py-1 rounded hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(item.size)}
                          </p>
                          {item.folder && (
                            <p className="text-xs text-blue-600">
                              {item.folder}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                meta={{
                  from: startIndex + 1,
                  to: Math.min(endIndex, media.length),
                  total: media.length
                }}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <FaImage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload some images to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}