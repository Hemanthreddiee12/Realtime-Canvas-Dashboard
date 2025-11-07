import './globals.css'; // <-- Note: './globals.css' for the root
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { DataProvider } from '@/components/providers/DataProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Performance Dashboard',
  description: 'High-performance data dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* The Provider MUST be here to wrap all pages */}
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}