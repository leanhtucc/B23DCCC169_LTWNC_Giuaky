import booksReducer, {
  borrowBook,
  returnBook,
  loadBooks,
} from './booksSlice';
import type { BooksState, Book } from '../../types';

const mockBook: Book = {
  id: '1',
  title: 'Test Book',
  author: 'Test Author',
  category: 'CNTT',
  year: 2023,
  available: 2,
  total: 3,
};

const initialState: BooksState = {
  items: [],
  status: 'idle',
  error: null,
};

describe('booksSlice reducer', () => {
  // Test 1: loadBooks.pending
  it('should set status to loading when loadBooks is pending', () => {
    const action = { type: loadBooks.pending.type };
    const state = booksReducer(initialState, action);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  // Test 2: loadBooks.fulfilled
  it('should set items and status succeeded when loadBooks is fulfilled', () => {
    const action = {
      type: loadBooks.fulfilled.type,
      payload: [mockBook],
    };
    const state = booksReducer(initialState, action);
    expect(state.status).toBe('succeeded');
    expect(state.items).toHaveLength(1);
    expect(state.items[0].title).toBe('Test Book');
  });

  // Test 3: loadBooks.rejected
  it('should set status failed and error when loadBooks is rejected', () => {
    const action = {
      type: loadBooks.rejected.type,
      payload: 'Lỗi kết nối máy chủ',
    };
    const state = booksReducer(initialState, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Lỗi kết nối máy chủ');
  });

  // Test 4: borrowBook reducer — giảm available đúng 1
  it('should decrease available by 1 when borrowBook is dispatched', () => {
    const stateWithBook: BooksState = {
      items: [{ ...mockBook, available: 2 }],
      status: 'succeeded',
      error: null,
    };
    const state = booksReducer(stateWithBook, borrowBook('1'));
    expect(state.items[0].available).toBe(1);
  });

  // Test 5: returnBook reducer — tăng available đúng 1
  it('should increase available by 1 when returnBook is dispatched', () => {
    const stateWithBook: BooksState = {
      items: [{ ...mockBook, available: 1, total: 3 }],
      status: 'succeeded',
      error: null,
    };
    const state = booksReducer(stateWithBook, returnBook('1'));
    expect(state.items[0].available).toBe(2);
  });

  // Test 6: borrowBook không giảm dưới 0
  it('should NOT decrease available below 0', () => {
    const stateWithBook: BooksState = {
      items: [{ ...mockBook, available: 0 }],
      status: 'succeeded',
      error: null,
    };
    const state = booksReducer(stateWithBook, borrowBook('1'));
    expect(state.items[0].available).toBe(0);
  });
});
