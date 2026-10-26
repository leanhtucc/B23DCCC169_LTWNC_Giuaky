import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchBooks } from '../../api/booksApi';
import { isApiSuccess } from '../../types';
import type { BooksState, Book } from '../../types';

// ===== Async Thunk: Xử lý 3 trạng thái pending / fulfilled / rejected =====
export const loadBooks = createAsyncThunk<Book[], boolean | undefined, { rejectValue: string }>(
  'books/load',
  async (shouldFail = false, { rejectWithValue }) => {
    const res = await fetchBooks(Boolean(shouldFail));
    if (!isApiSuccess(res)) {
      return rejectWithValue(res.error);
    }
    return res.data;
  }
);

// ===== Initial State =====
const initialState: BooksState = {
  items: [],
  status: 'idle',
  error: null,
};

// ===== Slice =====
const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    borrowBook(state, action: PayloadAction<string>) {
      const book = state.items.find((b) => b.id === action.payload);
      if (book && book.available > 0) {
        book.available--;
      }
    },
    returnBook(state, action: PayloadAction<string>) {
      const book = state.items.find((b) => b.id === action.payload);
      if (book && book.available < book.total) {
        book.available++;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Đã xảy ra lỗi không xác định.';
      });
  },
});

export const { borrowBook, returnBook } = booksSlice.actions;
export default booksSlice.reducer;
