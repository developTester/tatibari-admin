import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Tataibari Admin Panel',
  description: 'Complete ecommerce admin management system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
        <Toaster />
      </body>
    </html>
  );
}