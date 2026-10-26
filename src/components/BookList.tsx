import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { borrowBook, returnBook } from '../features/books/booksSlice';
import { addBorrow, removeBorrow } from '../features/borrow/borrowSlice';
import { useFilterStore } from '../store/useFilterStore';
import BookCard from './BookCard/BookCard';
import Pagination from './Pagination';
import { RefreshIcon, SearchIcon } from './Icons';
import type { Book } from '../types';

const DEFAULT_PAGE_SIZE = 6;

const BookList: React.FC = () => {
  const dispatch = useAppDispatch();
  const books = useAppSelector((state) => state.books.items);
  const borrowedIds = useAppSelector((state) => state.borrow.borrowedIds);
  const keyword = useFilterStore((s) => s.keyword);
  const category = useFilterStore((s) => s.category);
  const setKeyword = useFilterStore((s) => s.setKeyword);
  const setCategory = useFilterStore((s) => s.setCategory);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  // useMemo: tính danh sách lọc chỉ khi books/keyword/category thay đổi
  const filteredBooks = useMemo<Book[]>(() => {
    const lowerKw = keyword.toLowerCase().trim();
    return books.filter((book) => {
      const matchesKeyword =
        !lowerKw ||
        book.title.toLowerCase().includes(lowerKw) ||
        book.author.toLowerCase().includes(lowerKw);
      const matchesCategory = category === 'Tất cả' || book.category === category;
      return matchesKeyword && matchesCategory;
    });
  }, [books, keyword, category]);

  // Reset trang về 1 khi từ khóa tìm kiếm hoặc thể loại thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, category]);

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / pageSize));

  // Đảm bảo currentPage không vượt quá totalPages khi danh sách bị thu hẹp
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Danh sách sách trên trang hiện tại
  const paginatedBooks = useMemo<Book[]>(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredBooks.slice(startIndex, startIndex + pageSize);
  }, [filteredBooks, currentPage, pageSize]);

  // useCallback: handler ổn định không recreate mỗi render
  const handleBorrow = useCallback(
    (id: string) => {
      dispatch(borrowBook(id));
      dispatch(addBorrow(id));
    },
    [dispatch]
  );

  const handleReturn = useCallback(
    (id: string) => {
      dispatch(returnBook(id));
      dispatch(removeBorrow(id));
    },
    [dispatch]
  );

  const handleResetFilters = useCallback(() => {
    setKeyword('');
    setCategory('Tất cả');
    setCurrentPage(1);
  }, [setKeyword, setCategory]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Cuộn nhẹ lên đầu danh mục khi chuyển trang
    const catalogElement = document.getElementById('catalog-heading');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  }, []);

  if (filteredBooks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon-box" aria-hidden="true">
          <SearchIcon size={28} />
        </div>
        <h3 className="empty-state__title">Không tìm thấy sách phù hợp</h3>
        <p className="empty-state__desc">
          Không có đầu sách nào khớp với từ khóa <strong>"{keyword}"</strong>{' '}
          {category !== 'Tất cả' && (
            <span>
              trong thể loại <strong>{category}</strong>
            </span>
          )}
          .
        </p>
        <div className="empty-state__tips">
          <span className="empty-state__tips-title">Gợi ý tìm kiếm:</span>
          <ul className="empty-state__tips-list">
            <li>Kiểm tra lại chính tả hoặc thử tìm bằng từ khóa ngắn gọn hơn</li>
            <li>Tìm kiếm theo tên tác giả (VD: <em>Robert</em>, <em>Nguyễn</em>, <em>Thomas</em>)</li>
            {category !== 'Tất cả' && (
              <li>
                Chuyển thể loại về{' '}
                <button
                  type="button"
                  className="inline-filter-link"
                  onClick={() => setCategory('Tất cả')}
                >
                  Tất cả
                </button>{' '}
                để tìm trong toàn bộ kho sách
              </li>
            )}
          </ul>
        </div>
        <button
          type="button"
          className="btn btn--secondary btn--sm"
          onClick={handleResetFilters}
        >
          <RefreshIcon size={14} />
          <span>Đặt lại tất cả bộ lọc</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="results-meta">
        <span className="results-count">
          Đang hiển thị <strong>{filteredBooks.length}</strong> / {books.length} đầu sách
          {totalPages > 1 && (
            <span className="results-page-tag">
              (Trang {currentPage} / {totalPages})
            </span>
          )}
        </span>
        {(keyword || category !== 'Tất cả') && (
          <button
            type="button"
            className="btn-link"
            onClick={handleResetFilters}
            title="Xóa bộ lọc hiện tại"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      <div className="book-grid">
        {paginatedBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isBorrowed={borrowedIds.includes(book.id)}
            onBorrow={handleBorrow}
            onReturn={handleReturn}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredBooks.length}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
};

export default BookList;
