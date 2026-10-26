import { combineReducers, configureStore } from '@reduxjs/toolkit';
import booksReducer from '../features/books/booksSlice';
import borrowReducer from '../features/borrow/borrowSlice';
import { borrowLimitMiddleware } from '../middleware/borrowLimitMiddleware';

export const rootReducer = combineReducers({
  books: booksReducer,
  borrow: borrowReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(borrowLimitMiddleware),
});

export type AppDispatch = typeof store.dispatch;
