/**
 * Header Component
 * Main navigation header for the student portal
 * NO ICONS - Uses text-based navigation
 */

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

const navLinks = [
  { path: '/lessons', label: 'Lessons' },
  { path: '/favorites', label: 'Favorites' },
  { path: '/profile', label: 'Profile' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-md border-b border-secondary-100 dark:border-secondary-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link
            to="/lessons"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </span>
            <span className="text-lg font-semibold text-secondary-900 dark:text-white hidden sm:block">
              Qeema Academy
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-white'
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Menu & Theme Toggle */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 text-xs font-semibold rounded-full border-2 transition-all duration-300
                bg-secondary-100 dark:bg-secondary-700 
                border-secondary-200 dark:border-secondary-600
                text-secondary-600 dark:text-secondary-300
                hover:bg-secondary-200 dark:hover:bg-secondary-600"
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? 'Light' : 'Dark'}
            </button>

            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-secondary-900 dark:text-white truncate max-w-[150px]">
                {user?.student?.fullName || user?.email}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">Student</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                  ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700'
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

