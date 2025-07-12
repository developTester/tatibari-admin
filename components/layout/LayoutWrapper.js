'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { initializeMockData } from '@/data/mockData';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function LayoutWrapper({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Initialize mock data
    initializeMockData();

    // Check authentication
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);

    // Handle routing based on auth status
    if (pathname === '/admin/login') {
      if (authenticated) {
        router.push('/admin/dashboard');
      } else {
        setIsLoading(false);
      }
    } else if (pathname.startsWith('/admin')) {
      if (!authenticated) {
        router.push('/admin/login');
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Login page layout
  if (pathname === '/admin/login') {
    return children;
  }

  // Admin panel layout
  if (pathname.startsWith('/admin') && isAuth) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <div className="container mx-auto px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return children;
}