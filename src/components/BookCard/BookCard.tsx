import React, { useCallback } from 'react';
import type { Book } from '../../types';
import { BorrowIcon, ReturnIcon } from '../Icons';

interface BookCardProps {
  book: Book;
  isBorrowed: boolean;
  onBorrow: (id: string) => void;
  onReturn: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  CNTT: 'badge-cntt',
  'Kinh tế': 'badge-kinhte',
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
    <article className={`book-card ${isBorrowed ? 'book-card--borrowed' : ''}`}>
      <div className="book-card__meta">
        <span className={`badge ${categoryColors[book.category] ?? 'badge-default'}`}>
          {book.category}
        </span>
        <span className="book-card__year">{book.year}</span>
      </div>

      <div className="book-card__body">
        <h3 className="book-card__title" title={book.title}>
          {book.title}
        </h3>
        <p className="book-card__author">
          <span className="book-card__author-label">Tác giả:</span> {book.author}
        </p>
      </div>

      <div className="book-card__footer">
        <div className="book-card__stock">
          <div className="stock-info">
            <span className="stock-label">Tình trạng:</span>
            <span
              className={`stock-status ${
                book.available === 0 ? 'stock-status--empty' : 'stock-status--available'
              }`}
            >
              {book.available === 0 ? 'Hết bản' : `Còn ${book.available}/${book.total} bản`}
            </span>
          </div>
          <div className="stock-bar" aria-hidden="true">
            <div
              className={`stock-bar__fill ${book.available === 0 ? 'stock-bar__fill--empty' : ''}`}
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
    </article>
  );
};

export default React.memo(BookCard);
