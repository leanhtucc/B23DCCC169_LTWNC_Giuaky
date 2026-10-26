import React, { useCallback } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { returnBook } from '../features/books/booksSlice';
import { removeBorrow } from '../features/borrow/borrowSlice';
import BookCard from './BookCard/BookCard';
import { WarningIcon } from './Icons';
import type { Book } from '../types';

const BorrowedSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const borrowedIds: string[] = useAppSelector((s) => s.borrow.borrowedIds);
  const allBooks: Book[] = useAppSelector((s) => s.books.items);
  const limitWarning: boolean = useAppSelector((s) => s.borrow.limitWarning);

  const borrowedBooks: Book[] = allBooks.filter((b: Book) => borrowedIds.includes(b.id));

  const handleReturn = useCallback(
    (id: string) => {
      dispatch(returnBook(id));
      dispatch(removeBorrow(id));
    },
    [dispatch]
  );

  // Dummy callback cho prop onBorrow vì sách mượn hiển thị nút Trả
  const handleBorrow = useCallback((_id: string) => {}, []);

  if (borrowedBooks.length === 0 && !limitWarning) return null;

  return (
    <section className="borrowed-section" aria-labelledby="borrowed-heading">
      <div className="borrowed-section__header">
        <div className="borrowed-title-group">
          <h2 id="borrowed-heading" className="section-title">
            Sách đang mượn
          </h2>
          <span className="borrow-badge" title="Số lượng sách bạn đang mượn">
            {borrowedBooks.length} / 3 cuốn
          </span>
        </div>
        <p className="borrowed-subtitle">
          Theo dõi và quản lý những cuốn sách bạn đã đăng ký mượn tại thư viện
        </p>
      </div>

      {limitWarning && (
        <div className="alert alert--warning" role="alert">
          <span className="alert__icon">
            <WarningIcon size={18} />
          </span>
          <div className="alert__content">
            <strong>Đã đạt giới hạn mượn:</strong> Mỗi sinh viên chỉ được mượn tối đa 3 cuốn cùng lúc. Vui lòng trả bớt sách trước khi mượn thêm cuốn mới.
          </div>
        </div>
      )}

      {borrowedBooks.length > 0 && (
        <div className="book-grid book-grid--borrowed">
          {borrowedBooks.map((book: Book) => (
            <BookCard
              key={book.id}
              book={book}
              isBorrowed={true}
              onBorrow={handleBorrow}
              onReturn={handleReturn}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default BorrowedSection;
