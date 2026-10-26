import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import { setLimitWarning } from '../features/borrow/borrowSlice';

export const BORROW_LIMIT = 3;

/**
 * Middleware Redux tự viết chặn mượn sách khi đã đạt giới hạn 3 cuốn.
 * Nếu vượt giới hạn: dispatch warning, không cho action mượn sách đi tiếp qua reducer.
 */
export const borrowLimitMiddleware: Middleware<unknown, RootState> =
  (storeApi) => (next) => (action) => {
    if (
      action !== null &&
      typeof action === 'object' &&
      'type' in action &&
      (action.type === 'borrow/addBorrow' || action.type === 'books/borrowBook')
    ) {
      const state = storeApi.getState();
      if (state.borrow.borrowedIds.length >= BORROW_LIMIT) {
        storeApi.dispatch(setLimitWarning(true));
        return; // Chặn action — không cho vào reducer
      }
    }
    return next(action);
  };
