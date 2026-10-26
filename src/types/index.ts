// ===== Utility Types =====
export type Nullable<T> = T | null;
export type ReadonlyRecord<K extends string, V> = Readonly<Record<K, V>>;

// ===== Domain Types =====
export type BookCategory = 'CNTT' | 'Kinh tế' | 'Ngoại ngữ';
export type FilterCategory = 'Tất cả' | BookCategory;
export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export type Theme = 'light' | 'dark';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  year: number;
  available: number;
  total: number;
}

// ===== Generic API Response =====
export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// ===== Type Guard =====
export function isApiSuccess<T>(res: ApiResponse<T>): res is { ok: true; data: T } {
  return res.ok === true;
}

// ===== Redux State Types =====
export interface BooksState {
  items: Book[];
  status: LoadingStatus;
  error: Nullable<string>;
}

export interface BorrowState {
  borrowedIds: string[];
  limitWarning: boolean;
}

// ===== Filter Store Type (Zustand) =====
export interface FilterState {
  keyword: string;
  category: FilterCategory;
  setKeyword: (kw: string) => void;
  setCategory: (cat: FilterCategory) => void;
}

// ===== Theme =====
export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}
