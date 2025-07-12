'use client';

import { useState, useEffect } from 'react';
import { FaGlobe, FaDesktop, FaClock, FaSearch, FaFilter } from 'react-icons/fa';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';
import Button from '@/components/ui/Button';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({});
  const logsPerPage = 20;

  useEffect(() => {
    loadLogs();
  }, [currentPage, searchTerm, dateFilter]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await api.analytics.getActivityLogs({
        page: currentPage,
        date: dateFilter,
        search: searchTerm,
        limit: logsPerPage
      });
      
      if (response.success) {
        setLogs(response.data);
        setMeta(response.meta);
      }
    } catch (error) {
      console.error('Logs loading error:', error);
      showToast.error('Failed to load activity logs');
      setLogs([]);
      setMeta({});
    } finally {
      setLoading(false);
    }
  };

  const getBrowserFromUserAgent = (userAgent) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  const getOSFromUserAgent = (userAgent) => {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  };

  // Pagination
  const totalPages = meta.last_page || 1;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Activity Logs</h1>
          <p className="mt-2 text-sm text-gray-700">
            Monitor visitor activity and system access
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Logs
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by IP, page, or user agent..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Date
            </label>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <FaGlobe className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Visits</p>
              <p className="text-lg font-semibold text-gray-900">{meta.total || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <FaDesktop className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Unique IPs</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Set(logs.map(log => log.ip)).size}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <FaClock className="h-8 w-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-lg font-semibold text-gray-900">
                {logs.filter(log => {
                  const today = new Date();
                  const logDate = new Date(log.timestamp);
                  return logDate.toDateString() === today.toDateString();
                }).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <FaGlobe className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-lg font-semibold text-gray-900">
                {logs.filter(log => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(log.timestamp) >= weekAgo;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
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
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page Visited
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Browser/OS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaGlobe className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{log.ip}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{log.page}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>{getBrowserFromUserAgent(log.userAgent)}</div>
                          <div className="text-xs text-gray-500">{getOSFromUserAgent(log.userAgent)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                          <div className="text-xs">{new Date(log.timestamp).toLocaleTimeString()}</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
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
              </div>
            )}
          </>
        )}
      </div>

      {/* Empty State */}
      {!loading && logs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || dateFilter !== 'all' ? 'No logs found' : 'No activity logs yet'}
          </h3>
          <p className="text-gray-600">
            {searchTerm || dateFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Activity logs will appear here as users visit your site.'}
          </p>
        </div>
      )}
    </div>
  );
}