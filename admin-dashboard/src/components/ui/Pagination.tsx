/**
 * Pagination Component
 */

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 2) {
      end = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 1) {
      start = Math.max(2, totalPages - 3);
    }

    if (start > 2) pages.push('ellipsis');

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push('ellipsis');

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      className={`flex items-center justify-center gap-1 ${className}`}
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          px-3 py-2 text-sm font-medium rounded-lg transition-colors
          ${
            currentPage === 1
              ? 'text-secondary-300 cursor-not-allowed'
              : 'text-secondary-600 hover:bg-secondary-100'
          }
        `}
      >
        Previous
      </button>

      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-secondary-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                min-w-[40px] h-10 text-sm font-medium rounded-lg transition-all
                ${
                  currentPage === page
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-secondary-600 hover:bg-secondary-100'
                }
              `}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          px-3 py-2 text-sm font-medium rounded-lg transition-colors
          ${
            currentPage === totalPages
              ? 'text-secondary-300 cursor-not-allowed'
              : 'text-secondary-600 hover:bg-secondary-100'
          }
        `}
      >
        Next
      </button>
    </nav>
  );
}

