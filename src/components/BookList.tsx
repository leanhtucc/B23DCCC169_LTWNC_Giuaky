import React, { useMemo, useCallback } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { borrowBook, returnBook } from '../features/books/booksSlice';
import { addBorrow, removeBorrow } from '../features/borrow/borrowSlice';
import { useFilterStore } from '../store/useFilterStore';
import BookCard from './BookCard/BookCard';
import type { Book } from '../types';

const BookList: React.FC = () => {
  const dispatch = useAppDispatch();
  const books = useAppSelector((state) => state.books.items);
  const borrowedIds = useAppSelector((state) => state.borrow.borrowedIds);
  const keyword = useFilterStore((s) => s.keyword);
  const category = useFilterStore((s) => s.category);

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

  if (filteredBooks.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__icon">📭</span>
        <p>Không tìm thấy sách phù hợp</p>
      </div>
    );
  }

  return (
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
  );
};

export default BookList;
