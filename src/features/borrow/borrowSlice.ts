import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { BorrowState } from '../../types';

const initialState: BorrowState = {
  borrowedIds: [],
  limitWarning: false,
};

const borrowSlice = createSlice({
  name: 'borrow',
  initialState,
  reducers: {
    addBorrow(state, action: PayloadAction<string>) {
      if (!state.borrowedIds.includes(action.payload)) {
        state.borrowedIds.push(action.payload);
      }
      state.limitWarning = false;
    },
    removeBorrow(state, action: PayloadAction<string>) {
      state.borrowedIds = state.borrowedIds.filter((id) => id !== action.payload);
      state.limitWarning = false;
    },
    setLimitWarning(state, action: PayloadAction<boolean>) {
      state.limitWarning = action.payload;
    },
  },
});

export const { addBorrow, removeBorrow, setLimitWarning } = borrowSlice.actions;
export default borrowSlice.reducer;
