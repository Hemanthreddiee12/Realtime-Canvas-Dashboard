import '../globals.css'; // <-- Note: '../globals.css' for a nested file
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This just passes the children through.
  // It inherits the DataProvider from the root layout.
  return <>{children}</>;
}