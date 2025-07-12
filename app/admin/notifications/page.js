'use client';

import { useState, useEffect } from 'react';
import { FaBell, FaEye, FaTrash, FaCheck } from 'react-icons/fa';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({});
  const notificationsPerPage = 10;

  useEffect(() => {
    loadNotifications();
  }, [currentPage]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.notifications.getAll({
        page: currentPage,
        limit: notificationsPerPage
      });
      
      if (response.success) {
        setNotifications(response.data);
        setMeta(response.meta);
      }
    } catch (error) {
      console.error('Notifications loading error:', error);
      showToast.error('Failed to load notifications');
      setNotifications([]);
      setMeta({});
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await api.notifications.markAsRead(id);
      if (response.success) {
        showToast.success('Notification marked as read');
        loadNotifications();
      }
    } catch (error) {
      console.error('Mark as read error:', error);
      showToast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await api.notifications.markAllAsRead();
      if (response.success) {
        showToast.success('All notifications marked as read');
        loadNotifications();
      }
    } catch (error) {
      console.error('Mark all as read error:', error);
      showToast.error('Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (id) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;
    
    try {
      const response = await api.notifications.delete(id);
      if (response.success) {
        showToast.success('Notification deleted');
        loadNotifications();
      }
    } catch (error) {
      console.error('Notification deletion error:', error);
      showToast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      order: '📦',
      stock: '⚠️',
      payment: '💰',
      user: '👤',
      review: '⭐',
      system: '🔧'
    };
    return icons[type] || '📢';
  };

  const getNotificationColor = (type) => {
    const colors = {
      order: 'bg-blue-100 text-blue-800',
      stock: 'bg-yellow-100 text-yellow-800',
      payment: 'bg-green-100 text-green-800',
      user: 'bg-purple-100 text-purple-800',
      review: 'bg-orange-100 text-orange-800',
      system: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  // Pagination
  const totalPages = meta.last_page || 1;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your system notifications and alerts
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} className="flex items-center space-x-2">
            <FaCheck className="h-4 w-4" />
            <span>Mark All as Read ({unreadCount})</span>
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : currentNotifications.length > 0 ? (
          <>
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        !notification.read ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              getNotificationColor(notification.type)
                            }`}>
                              {notification.type}
                            </span>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Mark as Read"
                            >
                              <FaEye className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Notification"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                meta={meta}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <FaBell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}