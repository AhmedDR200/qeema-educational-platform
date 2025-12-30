/**
 * Sidebar Component
 * Navigation sidebar for admin dashboard
 * NO ICONS - Uses text-based navigation
 */

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navLinks = [
  { path: '/dashboard', label: 'Dashboard', description: 'Overview & Stats' },
  { path: '/students', label: 'Students', description: 'Manage Students' },
  { path: '/lessons', label: 'Lessons', description: 'Manage Content' },
  { path: '/school', label: 'School', description: 'School Profile' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-secondary-900/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white dark:bg-secondary-800 border-r border-secondary-100 dark:border-secondary-700
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-secondary-100 dark:border-secondary-700">
            <Link to="/dashboard" className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </span>
              <div>
                <span className="font-semibold text-secondary-900 dark:text-white block">
                  Qeema Admin
                </span>
                <span className="text-xs text-secondary-500 dark:text-secondary-400">Dashboard</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className={`
                    block px-4 py-3 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-white'
                    }
                  `}
                >
                  <span className={`font-medium ${isActive ? '' : ''}`}>
                    {link.label}
                  </span>
                  <span
                    className={`block text-xs mt-0.5 ${
                      isActive ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-400 dark:text-secondary-500'
                    }`}
                  >
                    {link.description}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-secondary-100 dark:border-secondary-700">
            <div className="px-4 py-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg mb-3">
              <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                {user?.email}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">Administrator</p>
            </div>
            <button
              onClick={logout}
              className="w-full px-4 py-2 text-sm font-medium text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors text-left"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

