/**
 * Header Component for Admin Dashboard
 * Top navigation bar with mobile menu toggle
 * NO ICONS - Uses text for menu toggle
 */

import { useLocation } from 'react-router-dom';

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

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-secondary-100">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden px-3 py-2 text-sm font-medium text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            Menu
          </button>

          {/* Page title */}
          <h1 className="text-lg font-semibold text-secondary-900 hidden sm:block">
            {pageTitle}
          </h1>

          {/* Right side - date */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary-500">
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

