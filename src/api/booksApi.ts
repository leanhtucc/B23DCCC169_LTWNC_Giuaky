import type { ApiResponse, Book } from '../types';

const MOCK_BOOKS: Book[] = [
  { id: '1',  title: 'Lập trình TypeScript từ cơ bản đến nâng cao', author: 'Nguyễn Văn An',    category: 'CNTT',     year: 2022, available: 3, total: 3 },
  { id: '2',  title: 'React & Redux Toolkit thực chiến',            author: 'Trần Thị Bình',   category: 'CNTT',     year: 2023, available: 2, total: 3 },
  { id: '3',  title: 'Cấu trúc dữ liệu & Giải thuật',              author: 'Lê Văn Cường',    category: 'CNTT',     year: 2021, available: 1, total: 2 },
  { id: '4',  title: 'Học máy cơ bản với Python',                   author: 'Phạm Thị Dung',   category: 'CNTT',     year: 2023, available: 0, total: 2 },
  { id: '5',  title: 'Hệ điều hành Linux nâng cao',                 author: 'Hoàng Văn Em',    category: 'CNTT',     year: 2020, available: 4, total: 4 },
  { id: '6',  title: 'Kinh tế vi mô hiện đại',                      author: 'Đỗ Thị Phương',   category: 'Kinh tế',  year: 2022, available: 2, total: 3 },
  { id: '7',  title: 'Quản trị tài chính doanh nghiệp',             author: 'Vũ Văn Giang',    category: 'Kinh tế',  year: 2021, available: 3, total: 3 },
  { id: '8',  title: 'Marketing căn bản & ứng dụng',                author: 'Bùi Thị Hoa',     category: 'Kinh tế',  year: 2023, available: 1, total: 2 },
  { id: '9',  title: 'Kế toán doanh nghiệp thực hành',              author: 'Ngô Văn Inh',     category: 'Kinh tế',  year: 2020, available: 2, total: 3 },
  { id: '10', title: 'Luật thương mại quốc tế',                     author: 'Đinh Thị Kim',    category: 'Kinh tế',  year: 2022, available: 0, total: 2 },
  { id: '11', title: 'Tiếng Anh giao tiếp thương mại',              author: 'Lý Văn Long',     category: 'Ngoại ngữ', year: 2023, available: 5, total: 5 },
  { id: '12', title: 'IELTS Writing Band 7+ nâng cao',              author: 'Trương Thị Mai',   category: 'Ngoại ngữ', year: 2022, available: 3, total: 4 },
  { id: '13', title: 'Tiếng Nhật N3 toàn tập',                      author: 'Phan Văn Nam',    category: 'Ngoại ngữ', year: 2021, available: 2, total: 3 },
  { id: '14', title: 'Tiếng Hàn sơ – trung cấp',                   author: 'Mai Thị Oanh',    category: 'Ngoại ngữ', year: 2023, available: 1, total: 2 },
  { id: '15', title: 'Ngữ pháp tiếng Pháp toàn tập',               author: 'Cao Văn Phúc',    category: 'Ngoại ngữ', year: 2020, available: 0, total: 2 },
];

/**
 * Giả lập API lấy danh sách sách — độ trễ 500ms
 * @param shouldFail - truyền true để giả lập lỗi
 */
export const fetchBooks = (shouldFail = false): Promise<ApiResponse<Book[]>> =>
  new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({ ok: false, error: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.' });
      } else {
        resolve({ ok: true, data: MOCK_BOOKS });
      }
    }, 500);
  });
