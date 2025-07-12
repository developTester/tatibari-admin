'use client';

import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaShoppingCart, FaDollarSign, FaSearch } from 'react-icons/fa';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';
import Button from '@/components/ui/Button';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({});
  const usersPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await api.users.getAll({
        page: currentPage,
        search: searchTerm,
        limit: usersPerPage
      });
      
      if (response.success) {
        setUsers(response.data);
        setMeta(response.meta);
      }
    } catch (error) {
      console.error('Users loading error:', error);
      showToast.error('Failed to load users');
      setUsers([]);
      setMeta({});
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const totalPages = meta.last_page || 1;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage customer accounts and information
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Users
          </label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaUser className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaEnvelope className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{user.phone}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <FaShoppingCart className="h-4 w-4 text-blue-600" />
                    <span className="text-lg font-semibold text-gray-900">{user.orderCount || 0}</span>
                  </div>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <FaDollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-semibold text-gray-900">{(user.totalSpent || 0).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500">Total Spent</p>
                </div>
              </div>
            </div>
          </div>
            )}
          </div>

          {/* Empty State */}
          {users.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No users found' : 'No users yet'}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms.' : 'Users will appear here as they register.'}
              </p>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-700">
            Showing {meta.from || 1} to {meta.to || 0} of {meta.total || 0} results
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}