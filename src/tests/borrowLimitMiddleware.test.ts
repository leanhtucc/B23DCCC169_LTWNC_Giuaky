import { configureStore, combineReducers } from '@reduxjs/toolkit';
import booksReducer, { borrowBook } from '../features/books/booksSlice';
import borrowReducer, { addBorrow } from '../features/borrow/borrowSlice';
import { borrowLimitMiddleware } from '../middleware/borrowLimitMiddleware';
import type { Book } from '../types';

const mockBook: Book = {
  id: 'book-1',
  title: 'Sách 1',
  author: 'Tác giả',
  category: 'CNTT',
  year: 2023,
  available: 2,
  total: 2,
};

describe('borrowLimitMiddleware', () => {
  const createTestStore = () =>
    configureStore({
      reducer: combineReducers({
        books: booksReducer,
        borrow: borrowReducer,
      }),
      middleware: (getDefault) => getDefault().concat(borrowLimitMiddleware),
    });

  it('allows borrowing up to 3 books', () => {
    const store = createTestStore();
    store.dispatch(addBorrow('1'));
    store.dispatch(addBorrow('2'));
    store.dispatch(addBorrow('3'));

    const state = store.getState();
    expect(state.borrow.borrowedIds).toEqual(['1', '2', '3']);
    expect(state.borrow.limitWarning).toBe(false);
  });

  it('blocks 4th borrow and sets limitWarning to true', () => {
    const store = createTestStore();
    store.dispatch(addBorrow('1'));
    store.dispatch(addBorrow('2'));
    store.dispatch(addBorrow('3'));

    // Cố mượn cuốn thứ 4
    store.dispatch(addBorrow('4'));

    const state = store.getState();
    expect(state.borrow.borrowedIds).toHaveLength(3);
    expect(state.borrow.borrowedIds).not.toContain('4');
    expect(state.borrow.limitWarning).toBe(true);
  });

  it('blocks books/borrowBook when at limit so available count does not decrement', () => {
    const store = createTestStore();
    // Khởi tạo state sách
    store.dispatch({
      type: 'books/load/fulfilled',
      payload: [{ ...mockBook, available: 5 }],
    });
    // Đã mượn 3 cuốn
    store.dispatch(addBorrow('1'));
    store.dispatch(addBorrow('2'));
    store.dispatch(addBorrow('3'));

    // Thử gọi borrowBook
    store.dispatch(borrowBook('book-1'));

    // Số lượng sách không được phép giảm
    const state = store.getState();
    expect(state.books.items[0].available).toBe(5);
  });
});
