import React, { useCallback } from 'react';
import type { Book } from '../../types';
import { BorrowIcon, ReturnIcon, BookIcon, UserIcon, CalendarIcon } from '../Icons';

interface BookCardProps {
  book: Book;
  isBorrowed: boolean;
  onBorrow: (id: string) => void;
  onReturn: (id: string) => void;
}

const categoryStyles: Record<string, { badge: string; spine: string }> = {
  CNTT: { badge: 'badge-cntt', spine: 'book-spine--cntt' },
  'Kinh tế': { badge: 'badge-kinhte', spine: 'book-spine--kinhte' },
  'Ngoại ngữ': { badge: 'badge-ngoaingu', spine: 'book-spine--ngoaingu' },
};

const BookCard: React.FC<BookCardProps> = ({ book, isBorrowed, onBorrow, onReturn }) => {
  const handleBorrow = useCallback(() => {
    onBorrow(book.id);
  }, [onBorrow, book.id]);

  const handleReturn = useCallback(() => {
    onReturn(book.id);
  }, [onReturn, book.id]);

  const isDisabled = book.available === 0 && !isBorrowed;
  const isLowStock = book.available > 0 && book.available / book.total <= 0.4;
  const availablePercent = Math.round((book.available / book.total) * 100);
  const styleConfig = categoryStyles[book.category] ?? {
    badge: 'badge-default',
    spine: 'book-spine--default',
  };

  return (
    <article className={`book-card ${isBorrowed ? 'book-card--borrowed' : ''}`}>
      <div className={`book-card__spine ${styleConfig.spine}`} aria-hidden="true" />

      <div className="book-card__inner">
        <div className="book-card__meta">
          <span className={`badge ${styleConfig.badge}`}>{book.category}</span>
          <span className="book-card__year">
            <CalendarIcon size={12} className="meta-icon" />
            <span>{book.year}</span>
          </span>
        </div>

        <div className="book-card__body">
          <div className="book-card__cover-icon" aria-hidden="true">
            <BookIcon size={16} />
          </div>
          <h3 className="book-card__title" title={book.title}>
            {book.title}
          </h3>
          <p className="book-card__author">
            <UserIcon size={13} className="meta-icon" />
            <span className="book-card__author-label">Tác giả:</span> {book.author}
          </p>
        </div>

        <div className="book-card__footer">
          <div className="book-card__stock">
            <div className="stock-info">
              <span className="stock-label">Tình trạng:</span>
              <span
                className={`stock-status ${
                  book.available === 0
                    ? 'stock-status--empty'
                    : isLowStock
                    ? 'stock-status--low'
                    : 'stock-status--available'
                }`}
              >
                {book.available === 0 ? 'Hết bản' : `Còn ${book.available}/${book.total} bản`}
              </span>
            </div>
            <div className="stock-bar" aria-hidden="true">
              <div
                className={`stock-bar__fill ${
                  book.available === 0
                    ? 'stock-bar__fill--empty'
                    : isLowStock
                    ? 'stock-bar__fill--low'
                    : ''
                }`}
                style={{ width: `${availablePercent}%` }}
              />
            </div>
          </div>

          <div className="book-card__actions">
            {isBorrowed ? (
              <button
                type="button"
                className="btn btn--return"
                onClick={handleReturn}
                aria-label={`Trả sách ${book.title}`}
              >
                <ReturnIcon size={15} />
                <span>Trả sách</span>
              </button>
            ) : (
              <button
                type="button"
                className={`btn ${isDisabled ? 'btn--disabled' : 'btn--borrow'}`}
                onClick={handleBorrow}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                aria-label={isDisabled ? `Hết bản cuốn ${book.title}` : `Mượn sách ${book.title}`}
              >
                {!isDisabled && <BorrowIcon size={15} />}
                <span>{isDisabled ? 'Hết bản' : 'Mượn sách'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default React.memo(BookCard);
