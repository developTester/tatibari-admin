'use client';

import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { 
  FaTimes, FaChartLine, FaShoppingCart, FaBox, FaTags, 
  FaUsers, FaFileAlt, FaGlobe, FaCog, FaSignOutAlt, FaImage, FaBell
} from 'react-icons/fa';
import { logout } from '@/lib/auth';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: FaChartLine },
  { name: 'Orders', href: '/admin/orders', icon: FaShoppingCart },
  { name: 'Products', href: '/admin/products', icon: FaBox },
  { name: 'Categories', href: '/admin/categories', icon: FaTags },
  { name: 'Users', href: '/admin/users', icon: FaUsers },
  { name: 'Media', href: '/admin/media', icon: FaImage },
  { name: 'Notifications', href: '/admin/notifications', icon: FaBell },
  { name: 'Logs', href: '/admin/logs', icon: FaFileAlt },
  { name: 'Pages / SEO', href: '/admin/pages', icon: FaGlobe },
  { name: 'Settings', href: '/admin/settings', icon: FaCog },
];

function SidebarContent({ onClose }) {
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    window.location.href = '/admin/login';
  };

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Tataibari Admin</h1>
        <button
          onClick={onClose}
          className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
        >
          <FaTimes className="h-5 w-5" />
        </button>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <FaSignOutAlt className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <SidebarContent onClose={onClose} />
      </div>

      {/* Mobile Sidebar */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-50">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col">
                <SidebarContent onClose={onClose} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}