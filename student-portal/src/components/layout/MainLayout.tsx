/**
 * Main Layout Component
 * Wraps all authenticated pages with header and footer
 */

import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-secondary-50 via-white to-primary-50/30">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-secondary-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-secondary-500">
              © 2025 Qeema Academy. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-sm text-secondary-400">Student Portal v1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

