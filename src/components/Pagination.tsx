import React, { useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

const PAGE_SIZE_OPTIONS = [6, 9, 12];

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const pageNumbers = useMemo<(number | string)[]>(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [1];

    if (currentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1 && totalItems <= pageSize) {
    return null;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  return (
    <nav className="pagination-wrapper" aria-label="Điều hướng phân trang sách">
      
      <div className="pagination__summary">
        Hiển thị <strong>{startItem} – {endItem}</strong> trong <strong>{totalItems}</strong> cuốn sách
      </div>

      <div className="pagination__controls" role="group" aria-label="Chuyển trang">
        <button
          type="button"
          className="pagination__btn pagination__btn--prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Trang trước"
          title="Trang trước"
        >
          <ChevronLeftIcon size={15} />
          <span className="pagination__btn-text">Trước</span>
        </button>

        <div className="pagination__pages" role="tablist">
          {pageNumbers.map((page, index) => {
            if (typeof page === 'string') {
              return (
                <span key={`ellipsis-${index}`} className="pagination__ellipsis" aria-hidden="true">
                  •••
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <button
                key={page}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`pagination__page-pill ${isActive ? 'is-active' : ''}`}
                onClick={() => onPageChange(page)}
                aria-label={`Trang ${page}`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="pagination__btn pagination__btn--next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          aria-label="Trang sau"
          title="Trang sau"
        >
          <span className="pagination__btn-text">Sau</span>
          <ChevronRightIcon size={15} />
        </button>
      </div>

      {onPageSizeChange && (
        <div className="pagination__size-selector">
          <span className="size-label">Mỗi trang:</span>
          <div className="size-pill-group">
            {PAGE_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                type="button"
                className={`size-pill ${size === pageSize ? 'is-active' : ''}`}
                onClick={() => onPageSizeChange(size)}
                title={`Hiển thị ${size} cuốn trên mỗi trang`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default React.memo(Pagination);
