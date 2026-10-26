import React, { useCallback } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { returnBook } from '../features/books/booksSlice';
import { removeBorrow } from '../features/borrow/borrowSlice';
import BookCard from './BookCard/BookCard';
import { WarningIcon, BookIcon, CheckIcon } from './Icons';
import type { Book } from '../types';

const BORROW_MAX = 3;

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

  const handleBorrow = useCallback((_id: string) => {}, []);

  if (borrowedBooks.length === 0 && !limitWarning) return null;

  const remainingSlots = Math.max(0, BORROW_MAX - borrowedBooks.length);

  return (
    <section className="borrowed-section" aria-labelledby="borrowed-heading">
      <div className="borrowed-section__header">
        <div className="borrowed-header-left">
          <div className="borrowed-title-group">
            <h2 id="borrowed-heading" className="section-title">
              Sách đang mượn
            </h2>
            <span
              className={`borrow-badge ${
                borrowedBooks.length >= BORROW_MAX ? 'borrow-badge--max' : ''
              }`}
              title="Hạn ngạch mượn sách của bạn"
            >
              {borrowedBooks.length} / {BORROW_MAX} cuốn
            </span>
          </div>
          <p className="borrowed-subtitle">
            Hạn ngạch mượn tối đa 3 cuốn cùng lúc. {remainingSlots > 0 ? `Bạn còn có thể mượn thêm ${remainingSlots} cuốn.` : 'Bạn đã đạt giới hạn tối đa.'}
          </p>
        </div>

        {/* Visual Borrow Quota Tracker */}
        <div className="quota-tracker" aria-label="Hạn mức mượn sách">
          {[0, 1, 2].map((index) => {
            const isFilled = index < borrowedBooks.length;
            const bookAtSlot = borrowedBooks[index];

            return (
              <div
                key={index}
                className={`quota-slot ${isFilled ? 'quota-slot--filled' : 'quota-slot--empty'}`}
                title={isFilled ? `Cuốn ${index + 1}: ${bookAtSlot?.title}` : `Ô ${index + 1}: Còn trống`}
              >
                {isFilled ? <CheckIcon size={13} /> : <BookIcon size={13} />}
                <span>Cuốn {index + 1}</span>
              </div>
            );
          })}
        </div>
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
