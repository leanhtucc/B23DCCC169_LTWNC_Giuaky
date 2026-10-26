import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import { setLimitWarning } from '../features/borrow/borrowSlice';

export const BORROW_LIMIT = 3;
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
        return; 
      }
    }
    return next(action);
  };
