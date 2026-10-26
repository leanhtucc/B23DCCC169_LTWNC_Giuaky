import React, { useCallback, useMemo } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { returnBook } from '../features/books/booksSlice';
import { removeBorrow, setLimitWarning } from '../features/borrow/borrowSlice';
import { useFilterStore } from '../store/useFilterStore';
import SearchBar from './SearchBar';
import {
  UserIcon,
  CheckIcon,
  BookIcon,
  WarningIcon,
  ReturnIcon,
  CodeIcon,
  ChartIcon,
  GlobeIcon,
} from './Icons';
import type { Book, FilterCategory } from '../types';

const BORROW_MAX = 3;

interface CategoryOption {
  label: FilterCategory;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryOption[] = [
  { label: 'Tất cả', icon: <BookIcon size={14} /> },
  { label: 'CNTT', icon: <CodeIcon size={14} /> },
  { label: 'Kinh tế', icon: <ChartIcon size={14} /> },
  { label: 'Ngoại ngữ', icon: <GlobeIcon size={14} /> },
];

const StudentDesk: React.FC = () => {
  const dispatch = useAppDispatch();
  const borrowedIds: string[] = useAppSelector((s) => s.borrow.borrowedIds);
  const allBooks: Book[] = useAppSelector((s) => s.books.items);
  const limitWarning: boolean = useAppSelector((s) => s.borrow.limitWarning);

  const category = useFilterStore((s) => s.category);
  const setCategory = useFilterStore((s) => s.setCategory);

  const borrowedBooks: Book[] = useMemo(
    () => allBooks.filter((b: Book) => borrowedIds.includes(b.id)),
    [allBooks, borrowedIds]
  );

  const categoryCounts = useMemo(() => {
    return {
      'Tất cả': allBooks.length,
      CNTT: allBooks.filter((b) => b.category === 'CNTT').length,
      'Kinh tế': allBooks.filter((b) => b.category === 'Kinh tế').length,
      'Ngoại ngữ': allBooks.filter((b) => b.category === 'Ngoại ngữ').length,
    };
  }, [allBooks]);

  const handleReturn = useCallback(
    (id: string) => {
      dispatch(returnBook(id));
      dispatch(removeBorrow(id));
    },
    [dispatch]
  );

  const handleDismissWarning = useCallback(() => {
    dispatch(setLimitWarning(false));
  }, [dispatch]);

  const remainingSlots = Math.max(0, BORROW_MAX - borrowedBooks.length);

  return (
    <aside className="student-desk" aria-label="Bàn đọc cá nhân và bộ lọc">
      {/* 1. Student Personal Borrow Desk Section */}
      <div className="desk-card desk-card--borrow">
        <div className="desk-card__header">
          <div className="desk-title-wrap">
            <span className="desk-icon-badge" aria-hidden="true">
              <UserIcon size={15} />
            </span>
            <div>
              <h2 className="desk-title">Bàn đọc cá nhân</h2>
              <span className="desk-subtitle">
                {remainingSlots > 0
                  ? `Còn ${remainingSlots} lượt mượn khả dụng`
                  : 'Đã đạt giới hạn tối đa 3 cuốn'}
              </span>
            </div>
          </div>

          <span
            className={`desk-quota-badge ${
              borrowedBooks.length >= BORROW_MAX ? 'desk-quota-badge--max' : ''
            }`}
          >
            {borrowedBooks.length}/{BORROW_MAX}
          </span>
        </div>

        {/* 3 Quota Slots */}
        <div className="desk-slots" aria-label="Các khe sách mượn">
          {[0, 1, 2].map((idx) => {
            const isFilled = idx < borrowedBooks.length;
            const bookAtSlot = borrowedBooks[idx];

            return (
              <div
                key={idx}
                className={`desk-slot ${isFilled ? 'desk-slot--filled' : 'desk-slot--empty'}`}
                title={
                  isFilled
                    ? `Cuốn ${idx + 1}: ${bookAtSlot?.title}`
                    : `Ô ${idx + 1}: Sẵn sàng mượn`
                }
              >
                {isFilled ? <CheckIcon size={13} /> : <BookIcon size={13} />}
                <span>Cuốn {idx + 1}</span>
              </div>
            );
          })}
        </div>

        {/* Limit Warning Alert */}
        {limitWarning && (
          <div className="alert alert--warning alert--dismissible desk-alert" role="alert">
            <span className="alert__icon">
              <WarningIcon size={16} />
            </span>
            <div className="alert__content">
              <strong>Đã đạt tối đa:</strong> Bạn chỉ được mượn 3 cuốn cùng lúc. Hãy trả bớt sách trước khi mượn thêm.
            </div>
            <button
              type="button"
              className="alert__close"
              onClick={handleDismissWarning}
              aria-label="Đóng cảnh báo"
            >
              ×
            </button>
          </div>
        )}

        {/* List of currently borrowed books */}
        {borrowedBooks.length > 0 ? (
          <div className="desk-borrowed-list">
            <span className="desk-list-heading">Sách đang lưu giữ:</span>
            {borrowedBooks.map((book) => (
              <div key={book.id} className="desk-book-item">
                <div className={`desk-book-spine desk-book-spine--${book.category.toLowerCase().replace(/\s+/g, '')}`} />
                <div className="desk-book-info">
                  <span className="desk-book-title" title={book.title}>
                    {book.title}
                  </span>
                  <span className="desk-book-author">{book.author}</span>
                </div>
                <button
                  type="button"
                  className="btn-return-icon"
                  onClick={() => handleReturn(book.id)}
                  title={`Trả cuốn ${book.title}`}
                  aria-label={`Trả sách ${book.title}`}
                >
                  <ReturnIcon size={14} />
                  <span>Trả</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="desk-empty-hint">
            <span>Bàn đọc đang trống. Hãy chọn sách từ danh mục bên phải để mượn.</span>
          </div>
        )}
      </div>

      {/* 2. Search & Categorization Hub */}
      <div className="desk-card desk-card--filters">
        <div className="desk-card__header">
          <h3 className="desk-filter-title">Bộ lọc & Tra cứu</h3>
          <span className="desk-total-tag">{allBooks.length} cuốn</span>
        </div>

        {/* Search Input */}
        <div className="desk-search-wrap">
          <SearchBar />
        </div>

        {/* Category List */}
        <div className="desk-categories" role="group" aria-label="Lọc theo thể loại chuyên ngành">
          <span className="desk-cat-heading">Chuyên ngành:</span>
          <div className="desk-cat-list">
            {CATEGORIES.map(({ label, icon }) => {
              const count = categoryCounts[label];
              const isActive = category === label;

              return (
                <button
                  key={label}
                  type="button"
                  className={`desk-cat-btn ${isActive ? 'is-active' : ''}`}
                  onClick={() => setCategory(label)}
                  aria-pressed={isActive}
                >
                  <span className="desk-cat-btn__left">
                    <span className="desk-cat-icon">{icon}</span>
                    <span className="desk-cat-label">{label}</span>
                  </span>
                  {count > 0 && <span className="desk-cat-badge">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default React.memo(StudentDesk);
