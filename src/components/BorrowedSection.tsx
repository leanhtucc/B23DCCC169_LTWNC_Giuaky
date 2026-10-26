import React, { useCallback } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { returnBook } from '../features/books/booksSlice';
import { removeBorrow } from '../features/borrow/borrowSlice';
import BookCard from './BookCard/BookCard';
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

  // Dummy callback vì sách đang mượn hiển thị nút Trả
  const handleBorrow = useCallback((_id: string) => {}, []);

  if (borrowedBooks.length === 0 && !limitWarning) return null;

  return (
    <section className="borrowed-section">
      <div className="borrowed-section__header">
        <h2 className="section-title">
          📋 Sách đang mượn
          <span className="borrow-count">{borrowedBooks.length}/3</span>
        </h2>
      </div>

      {limitWarning && (
        <div className="alert alert--warning" role="alert">
          ⚠️ Bạn đã mượn tối đa <strong>3 cuốn</strong>! Hãy trả sách trước khi mượn thêm.
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
