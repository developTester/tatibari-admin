'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaStore, FaEnvelope, FaPhone, FaQrcode, FaTruck, FaCog } from 'react-icons/fa';
import { getStorageData } from '@/lib/storage';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    storeName: 'Tataibari Store',
    supportEmail: 'support@tataibari.com',
    supportPhone: '+1-800-TATAIBARI',
    qrCodeImage: '',
    paymentInstructions: 'Scan QR code and complete payment. Share transaction ID.',
    deliveryCharge: 5.99,
    maintenanceMode: false
  });

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const settingsData = getStorageData('tataibari_settings');
    if (settingsData && Object.keys(settingsData).length > 0) {
      setSettings({ ...settings, ...settingsData });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      localStorage.setItem('tataibari_settings', JSON.stringify(settings));
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Error saving settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const tabs = [
    { id: 'general', name: 'General', icon: FaStore },
    { id: 'payment', name: 'Payment', icon: FaQrcode },
    { id: 'delivery', name: 'Delivery', icon: FaTruck },
    { id: 'system', name: 'System', icon: FaCog }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-700">
          Configure your store settings and preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSave} className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaStore className="inline-block mr-2 h-4 w-4" />
                    Store Name
                  </label>
                  <input
                    type="text"
                    name="storeName"
                    value={settings.storeName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Store Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaEnvelope className="inline-block mr-2 h-4 w-4" />
                    Support Email
                  </label>
                  <input
                    type="email"
                    name="supportEmail"
                    value={settings.supportEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="support@yourstore.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="inline-block mr-2 h-4 w-4" />
                    Support Phone
                  </label>
                  <input
                    type="tel"
                    name="supportPhone"
                    value={settings.supportPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1-800-SUPPORT"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Payment Settings</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaQrcode className="inline-block mr-2 h-4 w-4" />
                  QR Code Image URL
                </label>
                <input
                  type="url"
                  name="qrCodeImage"
                  value={settings.qrCodeImage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/qr-code.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload your payment QR code image and paste the URL here
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Instructions
                </label>
                <textarea
                  name="paymentInstructions"
                  value={settings.paymentInstructions}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Instructions for customers on how to complete payment"
                />
              </div>

              {settings.qrCodeImage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    QR Code Preview
                  </label>
                  <img
                    src={settings.qrCodeImage}
                    alt="QR Code"
                    className="w-32 h-32 border border-gray-300 rounded-md"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Delivery Settings</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaTruck className="inline-block mr-2 h-4 w-4" />
                  Delivery Charge ($)
                </label>
                <input
                  type="number"
                  name="deliveryCharge"
                  value={settings.deliveryCharge}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Standard delivery charge applied to all orders
                </p>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  <FaCog className="inline-block mr-2 h-4 w-4" />
                  Enable Maintenance Mode
                </label>
              </div>
              <p className="text-xs text-gray-500 ml-6">
                When enabled, your store will show a maintenance message to visitors
              </p>

              {settings.maintenanceMode && (
                <div className="ml-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FaCog className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Maintenance Mode Active
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Your store is currently in maintenance mode. Visitors will see a maintenance message.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button
              type="submit"
              loading={loading}
              className="flex items-center space-x-2"
            >
              <FaSave className="h-4 w-4" />
              <span>Save Settings</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}