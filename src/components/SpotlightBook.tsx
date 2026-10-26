import React, { useCallback } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { borrowBook, returnBook } from '../features/books/booksSlice';
import { addBorrow, removeBorrow } from '../features/borrow/borrowSlice';
import { SparklesIcon, BookIcon, UserIcon, CalendarIcon, BorrowIcon, ReturnIcon } from './Icons';
import type { Book } from '../types';

const SpotlightBook: React.FC = () => {
  const dispatch = useAppDispatch();
  const allBooks: Book[] = useAppSelector((s) => s.books.items);
  const borrowedIds: string[] = useAppSelector((s) => s.borrow.borrowedIds);

  const spotlightBook = allBooks.find((b) => b.id === '2') || allBooks[0];

  const isBorrowed = spotlightBook ? borrowedIds.includes(spotlightBook.id) : false;
  const isOutOfStock = spotlightBook ? spotlightBook.available === 0 && !isBorrowed : false;

  const handleBorrow = useCallback(() => {
    if (spotlightBook) {
      dispatch(borrowBook(spotlightBook.id));
      dispatch(addBorrow(spotlightBook.id));
    }
  }, [dispatch, spotlightBook]);

  const handleReturn = useCallback(() => {
    if (spotlightBook) {
      dispatch(returnBook(spotlightBook.id));
      dispatch(removeBorrow(spotlightBook.id));
    }
  }, [dispatch, spotlightBook]);

  if (!spotlightBook) return null;

  return (
    <article className="bento-spotlight" aria-label="Sách tiêu biểu trong tuần">
      <div className="spotlight-visual">
        <div className="spotlight-book-cover" aria-hidden="true">
          <div className="spotlight-cover-spine" />
          <div className="spotlight-cover-body">
            <span className="cover-badge">{spotlightBook.category}</span>
            <div className="cover-icon-wrap">
              <BookIcon size={32} />
            </div>
            <span className="cover-year">{spotlightBook.year}</span>
          </div>
        </div>
      </div>

      <div className="spotlight-content">
        <div className="spotlight-tag">
          <SparklesIcon size={14} />
          <span>Tác phẩm tiêu biểu trong tuần</span>
        </div>

        <h3 className="spotlight-title" title={spotlightBook.title}>
          {spotlightBook.title}
        </h3>

        <div className="spotlight-meta-row">
          <span className="spotlight-meta-item">
            <UserIcon size={14} className="meta-icon" />
            <span>{spotlightBook.author}</span>
          </span>
          <span className="spotlight-meta-dot" aria-hidden="true">•</span>
          <span className="spotlight-meta-item">
            <CalendarIcon size={14} className="meta-icon" />
            <span>Năm {spotlightBook.year}</span>
          </span>
          <span className="spotlight-meta-dot" aria-hidden="true">•</span>
          <span className="spotlight-meta-item">
            <span className="spotlight-category-chip">{spotlightBook.category}</span>
          </span>
        </div>

        <p className="spotlight-desc">
          Tài liệu trọng tâm phục vụ học phần Lập trình Web Nâng cao. Hướng dẫn chi tiết kiến trúc Redux Toolkit,
          TypeScript generics và tối ưu hiệu năng render trong ứng dụng thực tế.
        </p>

        <div className="spotlight-actions">
          <div className="spotlight-stock">
            <span className="stock-label">Tình trạng:</span>
            <span className={`stock-val ${isOutOfStock ? 'stock-val--empty' : 'stock-val--available'}`}>
              {spotlightBook.available === 0 ? 'Hết bản in' : `Còn ${spotlightBook.available}/${spotlightBook.total} cuốn sẵn sàng`}
            </span>
          </div>

          <div className="spotlight-btn-group">
            {isBorrowed ? (
              <button
                type="button"
                className="btn btn--return btn--sm"
                onClick={handleReturn}
                aria-label={`Trả sách ${spotlightBook.title}`}
              >
                <ReturnIcon size={15} />
                <span>Trả cuốn này</span>
              </button>
            ) : (
              <button
                type="button"
                className={`btn btn--sm ${isOutOfStock ? 'btn--disabled' : 'btn--borrow'}`}
                onClick={handleBorrow}
                disabled={isOutOfStock}
                aria-disabled={isOutOfStock}
                aria-label={isOutOfStock ? `Hết bản cuốn ${spotlightBook.title}` : `Mượn sách ${spotlightBook.title}`}
              >
                {!isOutOfStock && <BorrowIcon size={15} />}
                <span>{isOutOfStock ? 'Hết bản in' : 'Mượn cuốn này ngay'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default React.memo(SpotlightBook);
