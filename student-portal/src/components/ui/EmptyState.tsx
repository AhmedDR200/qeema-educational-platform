/**
 * Empty State Component
 * Displays when no data is available
 * NO ICONS - Uses typography and spacing
 */

import { ReactNode } from 'react';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      {/* Decorative element - geometric shape instead of icon */}
      <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary-100 to-secondary-200 flex items-center justify-center">
        <div className="w-8 h-8 rounded-lg bg-secondary-300 opacity-60" />
      </div>
      
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
      
      {description && (
        <p className="text-secondary-500 mb-6 max-w-sm mx-auto">{description}</p>
      )}
      
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
      
      {children}
    </div>
  );
}

