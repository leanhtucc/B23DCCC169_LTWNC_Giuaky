import React, { useMemo, useCallback } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { borrowBook, returnBook } from '../features/books/booksSlice';
import { addBorrow, removeBorrow } from '../features/borrow/borrowSlice';
import { useFilterStore } from '../store/useFilterStore';
import BookCard from './BookCard/BookCard';
import { RefreshIcon } from './Icons';
import type { Book } from '../types';

const BookList: React.FC = () => {
  const dispatch = useAppDispatch();
  const books = useAppSelector((state) => state.books.items);
  const borrowedIds = useAppSelector((state) => state.borrow.borrowedIds);
  const keyword = useFilterStore((s) => s.keyword);
  const category = useFilterStore((s) => s.category);
  const setKeyword = useFilterStore((s) => s.setKeyword);
  const setCategory = useFilterStore((s) => s.setCategory);

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
  }, [setKeyword, setCategory]);

  if (filteredBooks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon-box">📭</div>
        <h3 className="empty-state__title">Không tìm thấy sách phù hợp</h3>
        <p className="empty-state__desc">
          Không có đầu sách nào khớp với từ khóa <strong>"{keyword}"</strong>{' '}
          {category !== 'Tất cả' && (
            <span>
              trong thể loại <strong>{category}</strong>
            </span>
          )}
          . Vui lòng kiểm tra lại chính tả hoặc xóa bộ lọc.
        </p>
        <button
          type="button"
          className="btn btn--secondary btn--sm"
          onClick={handleResetFilters}
        >
          <RefreshIcon size={14} />
          <span>Đặt lại bộ lọc</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="results-meta">
        <span className="results-count">
          Đang hiển thị <strong>{filteredBooks.length}</strong> / {books.length} đầu sách
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
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isBorrowed={borrowedIds.includes(book.id)}
            onBorrow={handleBorrow}
            onReturn={handleReturn}
          />
        ))}
      </div>
    </>
  );
};

export default BookList;
