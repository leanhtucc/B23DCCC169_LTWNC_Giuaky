# Mini Library — Ứng Dụng Quản Lý Mượn / Trả Sách Thư Viện Khoa

> **Bài thi giữa kỳ môn Lập trình Web Nâng cao (LTWNC)**  
> Ứng dụng xây dựng trên nền tảng **React 18 + Vite + TypeScript**, vận dụng tổng hợp kiến thức từ Buổi 1 đến Buổi 6.

---

## Giới thiệu

Thư viện khoa có hàng trăm đầu sách chuyên ngành nhưng việc mượn/trả trước đây vẫn ghi chép thủ công. **Mini Library** là giải pháp phần mềm hiện đại giúp:
* Sinh viên tra cứu sách nhanh chóng theo tên, tác giả, thể loại.
* Biết chính xác tình trạng còn/hết của từng đầu sách theo thời gian thực.
* Theo dõi danh sách các cuốn sách đang mượn và thực hiện trả sách thuận tiện.
* Tự động áp dụng quy tắc mượn sách (tối đa 3 cuốn/sinh viên).

---

## Công nghệ sử dụng

| Công nghệ | Vai trò trong dự án |
|---|---|
| **React 18** | Thư viện UI chính (Hooks, Context, Memo, Lazy load, Suspense) |
| **TypeScript (Strict mode)** | Đảm bảo an toàn kiểu dữ liệu tuyệt đối (**100% không dùng `any`**) |
| **Redux Toolkit** | Quản lý state danh sách sách và sách đang mượn (Feature-based structure) |
| **Custom Redux Middleware** | Tự viết middleware chặn mượn quá 3 cuốn sách |
| **Zustand** | Quản lý state bộ lọc (từ khóa tìm kiếm + thể loại) |
| **Context API** | Quản lý giao diện Sáng / Tối (Light / Dark mode) với `useMemo` và custom hook `useTheme` |
| **Jest & React Testing Library** | Unit test reducer, custom hook, middleware và integration test component (userEvent) |
| **Vite** | Bundler siêu tốc, hỗ trợ phân tách code (code-splitting chunk cho route `/stats`) |

---

## Danh sách chức năng

1. **Khởi động & API giả lập**: Gọi API bất đồng bộ với độ trễ 500ms, hiển thị trạng thái *"Đang tải..."* và thông báo lỗi nếu API gặp sự cố (có nút bấm test lỗi và nút thử lại).
2. **Hiển thị danh sách sách**: Chi tiết tên sách, tác giả, thể loại (CNTT / Kinh tế / Ngoại ngữ), năm xuất bản, thanh trực quan tiến độ và số bản còn lại.
3. **Tìm kiếm Debounce**: Tìm theo tên hoặc tác giả (không phân biệt hoa/thường), tự động trì hoãn 300ms với custom hook `useDebounce<T>`.
4. **Lọc theo thể loại**: Lọc nhanh theo 4 danh mục: *Tất cả*, *CNTT*, *Kinh tế*, *Ngoại ngữ*.
5. **Mượn sách**: Giảm số bản còn lại đi 1; nút "Mượn sách" tự động vô hiệu hóa (disabled) khi hết bản.
6. **Trả sách**: Mục *"Sách đang mượn"* hiển thị nút "Trả sách", khi trả sẽ hoàn trả số bản tăng 1.
7. **Giới hạn 3 cuốn**: Mỗi sinh viên chỉ được mượn tối đa 3 cuốn; vượt quá sẽ bị chặn lại ở cấp Redux Middleware và xuất hiện thông báo cảnh báo.
8. **Chuyển đổi giao diện Sáng / Tối (Theme)**: Nút chuyển chế độ Light / Dark mode toàn ứng dụng.
9. **Trang Thống kê (Route `/stats`)**: Lazy-loaded route thống kê tổng đầu sách, số bản còn lại theo từng chuyên ngành và số lượng sách đang mượn.

---

## Chi tiết triển khai theo yêu cầu kỹ thuật

### 1. TypeScript nâng cao
* **Generic API Response**:
  ```typescript
  export type ApiResponse<T> =
    | { ok: true; data: T }
    | { ok: false; error: string };
  ```
* **Type Guard**:
  ```typescript
  export function isApiSuccess<T>(res: ApiResponse<T>): res is { ok: true; data: T } {
    return res.ok === true;
  }
  ```
* **Utility Types sử dụng**: `Nullable<T>`, `ReadonlyRecord<K, V>`.
* **Quy chuẩn**: 100% codebase không sử dụng từ khóa `any`.

### 2. Redux Toolkit (Feature-based)
* `src/features/books/booksSlice.ts`: Xử lý `createAsyncThunk` đủ 3 trạng thái `pending`, `fulfilled`, `rejected` cùng các reducers `borrowBook`, `returnBook`.
* `src/features/borrow/borrowSlice.ts`: Lưu trữ danh sách `borrowedIds` và trạng thái `limitWarning`.
* Custom Typed Hooks: `useAppSelector` và `useAppDispatch`.

### 3. Redux Middleware tự viết (`borrowLimitMiddleware`)
Chặn đứng action mượn sách trước khi vào reducer nếu sinh viên đã mượn đủ 3 cuốn:
```typescript
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
        return; // Chặn action đi tiếp vào reducer
      }
    }
    return next(action);
  };
```

### 4. Zustand & Context API
* **Zustand** (`src/store/useFilterStore.ts`): Quản lý từ khóa tìm kiếm `keyword` và `category` gọn nhẹ, không gây render thừa cho toàn bộ cây component.
* **Context** (`src/context/ThemeContext.tsx`): Cung cấp giá trị theme được bọc `useMemo` và custom hook `useTheme()`.

### 5. Custom Hook Generic `useDebounce<T>`
```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
```

### 6. Tối ưu hiệu năng
* **`useMemo`**: Tính toán danh sách sách đã lọc chỉ khi danh sách gốc, từ khóa hoặc thể loại thay đổi.
* **`React.memo`**: Bọc component `BookCard` để ngăn re-render không cần thiết.
* **`useCallback`**: Đóng gói các hàm xử lý mượn/trả truyền xuống components con.
* **Stable Keys**: Sử dụng `book.id` làm React key thay vì dùng index.
* **Code Splitting**: Route `/stats` được tải lười bằng `React.lazy` và `Suspense`.

---

## Kết quả kiểm thử (Unit & Integration Tests)

Hệ thống kiểm thử với Jest và React Testing Library đạt **17/17 tests PASS**:

```bash
PASS src/tests/borrowLimitMiddleware.test.ts
PASS src/tests/booksSlice.test.ts
PASS src/tests/useDebounce.test.ts
PASS src/tests/BookCard.test.tsx

Test Suites: 4 passed, 4 total
Tests:       17 passed, 17 total
Snapshots:   0 total
Time:        4.068 s
```

* **`booksSlice.test.ts` (6 tests)**: Kiểm thử pending, fulfilled, rejected của `loadBooks`, kiểm tra giảm/tăng số lượng bản và chặn giảm dưới 0.
* **`BookCard.test.tsx` (4 tests)**: Kiểm tra hiển thị thông tin sách, sự kiện click "Mượn" gọi đúng ID sách qua `userEvent`, kiểm tra nút bị disabled khi hết bản và kiểm tra nút "Trả".
* **`useDebounce.test.ts` (4 tests)**: Kiểm tra giá trị khởi tạo, kiểm tra không cập nhật trước delay và cập nhật chính xác sau delay bằng `jest.useFakeTimers()`, kiểm tra generic với kiểu số.
* **`borrowLimitMiddleware.test.ts` (3 tests)**: Kiểm tra cho phép mượn đến 3 cuốn, chặn cuốn thứ 4 và ngăn giảm số lượng bản khả dụng khi chạm ngưỡng.

---

## Cấu trúc thư mục dự án

```
MiniLibrary/
├── __mocks__/                      # Mock styles và assets cho Jest
│   ├── fileMock.js
│   └── styleMock.js
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   └── booksApi.ts             # API giả lập độ trễ 500ms
│   ├── app/
│   │   └── store.ts                # Cấu hình Redux store & RootState
│   ├── components/
│   │   ├── BookCard/
│   │   │   └── BookCard.tsx        # Component hiển thị sách (React.memo)
│   │   ├── BookList.tsx            # Danh sách sách tối ưu useMemo
│   │   ├── BorrowedSection.tsx     # Danh sách các sách đang mượn
│   │   ├── CategoryFilter.tsx      # Lọc thể loại liên kết Zustand
│   │   ├── LoadingSpinner.tsx      # Hiệu ứng chờ tải dữ liệu
│   │   ├── Navbar.tsx              # Thanh điều hướng & nút đổi Theme
│   │   └── SearchBar.tsx           # Ô tìm kiếm với generic useDebounce
│   ├── context/
│   │   └── ThemeContext.tsx        # Context API quản lý Light/Dark theme
│   ├── features/
│   │   ├── books/
│   │   │   └── booksSlice.ts       # Slice quản lý sách & async thunk
│   │   └── borrow/
│   │       └── borrowSlice.ts      # Slice quản lý danh sách mượn
│   ├── hooks/
│   │   ├── useAppDispatch.ts       # Typed Redux dispatch
│   │   ├── useAppSelector.ts       # Typed Redux selector
│   │   └── useDebounce.ts          # Custom hook generic useDebounce<T>
│   ├── middleware/
│   │   └── borrowLimitMiddleware.ts      # Middleware giới hạn mượn 3 cuốn
│   ├── pages/
│   │   ├── HomePage.tsx            # Trang chủ
│   │   └── StatsPage.tsx           # Trang thống kê (Lazy load)
│   ├── store/
│   │   └── useFilterStore.ts       # Zustand store cho từ khóa & thể loại
│   ├── tests/                      # Toàn bộ test tập trung tại một thư mục duy nhất
│   │   ├── BookCard.test.tsx       # Kiểm thử RTL cho BookCard
│   │   ├── booksSlice.test.ts      # Kiểm thử reducer booksSlice
│   │   ├── borrowLimitMiddleware.test.ts # Kiểm thử middleware giới hạn 3 cuốn
│   │   └── useDebounce.test.ts     # Kiểm thử hook với fake timers
│   ├── types/
│   │   └── index.ts                # Định nghĩa toàn bộ kiểu dữ liệu & guard
│   ├── App.tsx                     # Định tuyến & bọc Provider
│   ├── index.css                   # Toàn bộ CSS (Variables, Theme, Responsive)
│   ├── main.tsx                    # Entry point React
│   ├── setupTests.ts               # Thiết lập jest-dom cho kiểm thử
│   └── vite-env.d.ts               # Định nghĩa môi trường Vite
├── index.html                      # HTML root
├── jest.config.js                  # Cấu hình Jest & ts-jest
├── package.json                    # Cấu hình thư viện và scripts
├── tsconfig.json                   # Cấu hình TypeScript cho dự án
├── tsconfig.test.json              # Cấu hình TypeScript cho Jest
└── vite.config.ts                  # Cấu hình Vite build
```

---

## Hướng dẫn cài đặt & khởi chạy

### 1. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 2. Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Truy cập ứng dụng tại địa chỉ: `http://localhost:5173`

### 3. Chạy toàn bộ bài kiểm thử (Test)
```bash
npm test
```

### 4. Kiểm tra TypeScript & Đóng gói sản phẩm (Build)
```bash
npm run build
```

### 5. Xem trước bản đóng gói (Preview)
```bash
npm run preview
```

---

## Hướng dẫn nộp bài GitHub

Theo đúng quy định của đề thi:
1. Tạo một repository mới trên GitHub với tên: `<Mã_sinh_viên>_LTWNC_Giuaky`
2. Để trạng thái repository là **Public**
3. Thực hiện push mã nguồn lên repository:
   ```bash
   git remote add origin https://github.com/<tai-khoan-github>/<Ma_sinh_vien>_LTWNC_Giuaky.git
   git branch -M main
   git push -u origin main
   ```
4. Đảm bảo commit cuối cùng được đẩy lên trước thời hạn nộp bài.
