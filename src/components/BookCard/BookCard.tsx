import React, { useCallback } from 'react';
import type { Book } from '../../types';

interface BookCardProps {
  book: Book;
  isBorrowed: boolean;
  onBorrow: (id: string) => void;
  onReturn: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  CNTT: 'badge-cntt',
  'Kinh tế': 'badge-kinhtế',
  'Ngoại ngữ': 'badge-ngoaingu',
};

const BookCard: React.FC<BookCardProps> = ({ book, isBorrowed, onBorrow, onReturn }) => {
  const handleBorrow = useCallback(() => {
    onBorrow(book.id);
  }, [onBorrow, book.id]);

  const handleReturn = useCallback(() => {
    onReturn(book.id);
  }, [onReturn, book.id]);

  const isDisabled = book.available === 0 && !isBorrowed;
  const availablePercent = Math.round((book.available / book.total) * 100);

  return (
    <div className={`book-card ${isBorrowed ? 'book-card--borrowed' : ''}`}>
      <div className="book-card__header">
        <span className={`badge ${categoryColors[book.category] ?? 'badge-default'}`}>
          {book.category}
        </span>
        <span className="book-card__year">{book.year}</span>
      </div>

      <h3 className="book-card__title" title={book.title}>
        {book.title}
      </h3>
      <p className="book-card__author">✍️ {book.author}</p>

      <div className="book-card__availability">
        <div className="availability-bar">
          <div
            className="availability-bar__fill"
            style={{ width: `${availablePercent}%` }}
            aria-valuenow={book.available}
            aria-valuemax={book.total}
          />
        </div>
        <span className={`availability-text ${book.available === 0 ? 'availability-text--empty' : ''}`}>
          {book.available === 0 ? 'Hết bản' : `Còn ${book.available}/${book.total} bản`}
        </span>
      </div>

      <div className="book-card__actions">
        {isBorrowed ? (
          <button className="btn btn--return" onClick={handleReturn}>
            📤 Trả sách
          </button>
        ) : (
          <button
            className="btn btn--borrow"
            onClick={handleBorrow}
            disabled={isDisabled}
            aria-disabled={isDisabled}
          >
            {isDisabled ? '🚫 Hết bản' : '📥 Mượn sách'}
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(BookCard);
