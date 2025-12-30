/**
 * Header Component for Admin Dashboard
 * Top navigation bar with mobile menu toggle
 * NO ICONS - Uses text for menu toggle
 */

import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/students': 'Students Management',
  '/lessons': 'Lessons Management',
  '/school': 'School Profile',
};

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || 'Admin Dashboard';
  const { toggleTheme, isDark } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-md border-b border-secondary-100 dark:border-secondary-700 transition-colors duration-300">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden px-3 py-2 text-sm font-medium text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
          >
            Menu
          </button>

          {/* Page title */}
          <h1 className="text-lg font-semibold text-secondary-900 dark:text-white hidden sm:block">
            {pageTitle}
          </h1>

          {/* Right side - Theme toggle & date */}
          <div className="flex items-center gap-4">
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

            <span className="text-sm text-secondary-500 dark:text-secondary-400 hidden sm:block">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

