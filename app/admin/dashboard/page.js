'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaShoppingCart, FaDollarSign, FaClock, FaEye } from 'react-icons/fa';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';


export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load dashboard statistics
      const statsResponse = await api.analytics.getDashboardStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Load recent orders
      const ordersResponse = await api.orders.getAll({ limit: 5 });
      if (ordersResponse.success) {
        setRecentOrders(ordersResponse.data);
      }

      // Load top products
      const productsResponse = await api.products.getAll({ limit: 5 });
      if (productsResponse.success) {
        setTopProducts(productsResponse.data);
      }

      // Load sales data
      const salesResponse = await api.analytics.getSalesData({ period: 'month' });
      if (salesResponse.success) {
        setSalesData(salesResponse.data);
      }
    } catch (error) {
      console.error('Dashboard data error:', error);
      showToast.error('Failed to load dashboard data');
      
      // Fallback to default data if API fails
      setStats({
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        totalProducts: 0
      });
      setSalesData([
        { name: 'Jan', sales: 4000 },
        { name: 'Feb', sales: 3000 },
        { name: 'Mar', sales: 5000 },
        { name: 'Apr', sales: 4500 },
        { name: 'May', sales: 6000 },
        { name: 'Jun', sales: 5500 },
      ]);
    } finally {
      setLoading(false);
    }
  };
  const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500'
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className={`${colorClasses[color]} p-3 rounded-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={FaShoppingCart}
          color="blue"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats.totalRevenue || 0).toFixed(2)}`}
          icon={FaDollarSign}
          color="green"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={FaClock}
          color="yellow"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={FaEye}
          color="purple"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-4">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center space-x-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">${product.price}</p>
                </div>
                <div className="text-sm text-gray-500">
                  Stock: {product.stock}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'delivered' 
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}
    </div>
  );
}