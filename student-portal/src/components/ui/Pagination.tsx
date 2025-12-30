/**
 * Pagination Component
 * Text-based pagination controls without icons
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

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    // Calculate start and end of middle section
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    // Adjust if at the beginning or end
    if (currentPage <= 2) {
      end = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 1) {
      start = Math.max(2, totalPages - 3);
    }

    // Add ellipsis before middle section if needed
    if (start > 2) {
      pages.push('ellipsis');
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis after middle section if needed
    if (end < totalPages - 1) {
      pages.push('ellipsis');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      className={`flex items-center justify-center gap-1 ${className}`}
      aria-label="Pagination"
    >
      {/* Previous button */}
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
        aria-label="Previous page"
      >
        Previous
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-secondary-400"
            >
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
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next button */}
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
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}

