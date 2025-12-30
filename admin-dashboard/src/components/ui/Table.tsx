/**
 * Table Component
 * Data table with responsive design and hover states
 * NO ICONS
 */

import { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export default function Table<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 overflow-hidden transition-colors duration-300">
        <div className="animate-pulse">
          <div className="h-12 bg-secondary-100 dark:bg-secondary-700" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 border-t border-secondary-100 dark:border-secondary-700 bg-secondary-50/50 dark:bg-secondary-800/50"
            />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-12 text-center transition-colors duration-300">
        <div className="w-16 h-16 rounded-2xl bg-secondary-100 dark:bg-secondary-700 mx-auto mb-4 flex items-center justify-center">
          <div className="w-8 h-8 rounded-lg bg-secondary-200 dark:bg-secondary-600" />
        </div>
        <p className="text-secondary-500 dark:text-secondary-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 overflow-hidden transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary-50 dark:bg-secondary-700/50 border-b border-secondary-100 dark:border-secondary-700">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-semibold text-secondary-600 dark:text-secondary-300 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700">
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={`
                  hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 text-sm text-secondary-700 dark:text-secondary-300 ${column.className || ''}`}
                  >
                    {column.render
                      ? column.render(item)
                      : String((item as Record<string, unknown>)[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

