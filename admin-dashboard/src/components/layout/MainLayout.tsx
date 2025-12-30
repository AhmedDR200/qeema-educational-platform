/**
 * Main Layout Component for Admin Dashboard
 * Sidebar + Header + Content layout
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex transition-colors duration-300">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <Header onMenuToggle={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        <footer className="border-t border-secondary-100 dark:border-secondary-700 bg-white/50 dark:bg-secondary-800/50 py-4 px-6 transition-colors duration-300">
          <p className="text-sm text-secondary-500 dark:text-secondary-400 text-center">
            Qeema Academy Admin Dashboard v1.0
          </p>
        </footer>
      </div>
    </div>
  );
}

