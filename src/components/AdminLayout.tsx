"use client";

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ProtectedRoute from './ProtectedRoute';

interface Props {
  children: React.ReactNode;
}

/**
 * Layout component that wraps protected admin pages with a sidebar and header.
 */
const AdminLayout: React.FC<Props> = ({ children }) => {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 p-4 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;