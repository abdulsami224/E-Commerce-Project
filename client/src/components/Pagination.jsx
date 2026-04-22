import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // always show first
    pages.push(1);

    if (currentPage > 3) pages.push('...');

    // show pages around current
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push('...');

    // always show last
    pages.push(totalPages);

    return pages;
  };

  const btnBase = "flex items-center justify-center h-9 min-w-[36px] rounded-xl text-sm font-medium transition-all duration-200 px-3";
  const activeCls = "bg-red-500 text-white shadow-md shadow-red-200 dark:shadow-red-900/30";
  const inactiveCls = "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-400 hover:text-red-500 dark:hover:border-red-500 dark:hover:text-red-400";
  const disabledCls = "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed";

  return (
    <div className="flex flex-col items-center gap-3 mt-10">

      {/* Page info */}
      <p className="text-xs text-gray-400 dark:text-gray-500">
        Page <span className="text-gray-600 dark:text-gray-300 font-medium">{currentPage}</span> of{' '}
        <span className="text-gray-600 dark:text-gray-300 font-medium">{totalPages}</span>
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-1.5">

        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${btnBase} ${currentPage === 1 ? disabledCls : inactiveCls}`}
        >
          <ChevronLeft size={15} />
        </button>

        {/* Page numbers */}
        {getPages().map((page, i) =>
          page === '...' ? (
            <span
              key={`dots-${i}`}
              className="flex items-center justify-center h-9 w-9 text-gray-400"
            >
              <MoreHorizontal size={15} />
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`${btnBase} ${page === currentPage ? activeCls : inactiveCls}`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${btnBase} ${currentPage === totalPages ? disabledCls : inactiveCls}`}
        >
          <ChevronRight size={15} />
        </button>

      </div>
    </div>
  );
};

export default Pagination;