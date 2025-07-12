'use client';

import { useState, useEffect } from 'react';
import { FaBars, FaBell, FaUser, FaChevronDown } from 'react-icons/fa';
import { getAuthData, logout } from '@/lib/auth';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';
import Link from 'next/link';

export default function TopNavbar({ onMenuClick }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const authData = getAuthData();
    if (authData) {
      setUser(authData.user);
    }

    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await api.notifications.getLatest(3);
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      // Set empty array on error to avoid UI issues
      setNotifications([]);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      window.location.href = '/admin/login';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type) => {
    const icons = {
      order: '📦',
      stock: '⚠️',
      payment: '💰',
      user: '👤',
      review: '⭐'
    };
    return icons[type] || '📢';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <FaBars className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 relative"
            >
              <FaBell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">Recent Notifications</h3>
                  <Link
                    href="/admin/notifications"
                    className="text-xs text-blue-600 hover:text-blue-800"
                    onClick={() => setShowNotifications(false)}
                  >
                    View All
                  </Link>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-gray-500 text-center">
                      No notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <FaUser className="h-8 w-8 p-2 bg-gray-100 rounded-full text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {user?.name || 'Admin'}
              </span>
              <FaChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@tataibari.com'}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}