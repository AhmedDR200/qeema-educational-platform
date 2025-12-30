/**
 * Alert Component
 * Displays feedback messages with different severity levels
 * NO ICONS - Uses colors and typography for visual distinction
 */

import { ReactNode } from 'react';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant: AlertVariant;
  children: ReactNode;
  title?: string;
  className?: string;
  onDismiss?: () => void;
}

const variantStyles: Record<AlertVariant, { container: string; title: string }> = {
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    title: 'text-green-900',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    title: 'text-red-900',
  },
  warning: {
    container: 'bg-amber-50 border-amber-200 text-amber-800',
    title: 'text-amber-900',
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    title: 'text-blue-900',
  },
};

export default function Alert({
  variant,
  children,
  title,
  className = '',
  onDismiss,
}: AlertProps) {
  const styles = variantStyles[variant];

  return (
    <div
      role="alert"
      className={`
        relative px-4 py-3 rounded-lg border
        ${styles.container}
        ${className}
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          {title && (
            <p className={`font-semibold mb-1 ${styles.title}`}>{title}</p>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 text-current opacity-70 hover:opacity-100 transition-opacity font-medium"
            aria-label="Dismiss"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}

