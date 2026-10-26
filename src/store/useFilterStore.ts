import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { FilterState } from '../types';

export const useFilterStore = create<FilterState>()(
  subscribeWithSelector((set) => ({
    keyword: '',
    category: 'Tất cả',
    setKeyword: (kw) => set({ keyword: kw }),
    setCategory: (cat) => set({ category: cat }),
  }))
);
