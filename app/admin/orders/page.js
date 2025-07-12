'use client';

import { useState, useEffect } from 'react';
import { FaEye, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';
import StatusBadge from '@/components/ui/StatusBadge';
import Pagination from '@/components/ui/Pagination';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

const ORDER_STATUSES = [
  { value: 'all', label: 'All Orders' },
  { value: 'received', label: 'Received' },
  { value: 'viewed', label: 'Viewed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  // Filters and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [meta, setMeta] = useState({});

  useEffect(() => {
    loadOrders();
  }, [currentPage, searchTerm, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await api.orders.getAll({
        page: currentPage,
        status: statusFilter,
        search: searchTerm,
        limit: 10
      });
      
      if (response.success) {
        setOrders(response.data);
        setMeta(response.meta);
      }
    } catch (error) {
      console.error('Orders loading error:', error);
      showToast.error('Failed to load orders');
      setOrders([]);
      setMeta({});
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await api.orders.updateStatus(orderId, newStatus);
      if (response.success) {
        showToast.success(`Order status updated to ${newStatus}`);
        loadOrders();
      }
    } catch (error) {
      console.error('Order status update error:', error);
      showToast.error('Failed to update order status');
    }
  };

  const viewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and track all customer orders
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Orders
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by Order ID or Customer name..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
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
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                          <div className="text-sm text-gray-500">{order.customerEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewOrder(order)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Order"
                          >
                            <FaEye className="h-4 w-4" />
                          </button>
                          
                          {/* Quick Status Updates */}
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="received">Received</option>
                            <option value="viewed">Viewed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
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
        {!loading && orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Orders will appear here as customers place them.'}
            </p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        title={`Order #${selectedOrder?.id}`}
        maxWidth="max-w-3xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</p>
                  <p><span className="font-medium">Phone:</span> {selectedOrder.customerPhone}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Order Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Payment ID:</span> {selectedOrder.paymentId}</p>
                  <p><span className="font-medium">Status:</span> <StatusBadge status={selectedOrder.status} /></p>
                  <p><span className="font-medium">Date:</span> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-right">
                <p className="text-lg font-semibold">Total: ${selectedOrder.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowOrderModal(false)}>
                Close
              </Button>
              <Button onClick={() => alert('PDF invoice generation would be implemented here')}>
                Generate Invoice PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}