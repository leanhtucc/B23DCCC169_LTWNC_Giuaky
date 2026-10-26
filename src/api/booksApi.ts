import type { ApiResponse, Book } from '../types';

const MOCK_BOOKS: Book[] = [
  // --- CNTT (12 đầu sách) ---
  { id: '1',  title: 'Lập trình TypeScript từ cơ bản đến nâng cao',       author: 'Nguyễn Văn An',    category: 'CNTT',     year: 2022, available: 3, total: 3 },
  { id: '2',  title: 'React & Redux Toolkit thực chiến',                  author: 'Trần Thị Bình',   category: 'CNTT',     year: 2023, available: 2, total: 3 },
  { id: '3',  title: 'Cấu trúc dữ liệu & Giải thuật ứng dụng',           author: 'Lê Văn Cường',    category: 'CNTT',     year: 2021, available: 1, total: 2 },
  { id: '4',  title: 'Học máy cơ bản với Python',                         author: 'Phạm Thị Dung',   category: 'CNTT',     year: 2023, available: 0, total: 2 },
  { id: '5',  title: 'Hệ điều hành Linux nâng cao',                       author: 'Hoàng Văn Em',    category: 'CNTT',     year: 2020, available: 4, total: 4 },
  { id: '6',  title: 'Thiết kế Kiến trúc Microservices',                  author: 'Nguyễn Quốc Hưng', category: 'CNTT',     year: 2023, available: 2, total: 3 },
  { id: '7',  title: 'Lập trình Web Fullstack với Node.js & Next.js',     author: 'Võ Minh Trí',     category: 'CNTT',     year: 2024, available: 3, total: 3 },
  { id: '8',  title: 'An toàn thông tin & Mật mã học',                   author: 'Đỗ Tuấn Kiệt',    category: 'CNTT',     year: 2022, available: 2, total: 2 },
  { id: '9',  title: 'Cơ sở dữ liệu phân tán & NoSQL',                   author: 'Trịnh Hoài Nam',  category: 'CNTT',     year: 2021, available: 1, total: 2 },
  { id: '10', title: 'Trí tuệ nhân tạo: Tiếp cận hiện đại',              author: 'Ngô Đức Thành',   category: 'CNTT',     year: 2023, available: 0, total: 3 },
  { id: '11', title: 'DevOps & Triển khai CI/CD với Docker, K8s',         author: 'Dương Gia Bảo',   category: 'CNTT',     year: 2024, available: 4, total: 4 },
  { id: '12', title: 'Kỹ nghệ phần mềm & Phương pháp Agile Scrum',        author: 'Phan Đình Thảo',  category: 'CNTT',     year: 2022, available: 2, total: 3 },

  // --- Kinh tế (12 đầu sách) ---
  { id: '13', title: 'Kinh tế vi mô hiện đại',                            author: 'Đỗ Thị Phương',   category: 'Kinh tế',  year: 2022, available: 2, total: 3 },
  { id: '14', title: 'Quản trị tài chính doanh nghiệp',                   author: 'Vũ Văn Giang',    category: 'Kinh tế',  year: 2021, available: 3, total: 3 },
  { id: '15', title: 'Marketing căn bản & Tiếp thị số',                   author: 'Bùi Thị Hoa',     category: 'Kinh tế',  year: 2023, available: 1, total: 2 },
  { id: '16', title: 'Kế toán doanh nghiệp thực hành',                    author: 'Ngô Văn Inh',     category: 'Kinh tế',  year: 2020, available: 2, total: 3 },
  { id: '17', title: 'Luật thương mại quốc tế',                           author: 'Đinh Thị Kim',    category: 'Kinh tế',  year: 2022, available: 0, total: 2 },
  { id: '18', title: 'Kinh tế vĩ mô & Chính sách tiền tệ',                author: 'Trần Hữu Danh',   category: 'Kinh tế',  year: 2023, available: 3, total: 3 },
  { id: '19', title: 'Khởi nghiệp đổi mới sáng tạo trong thời đại số',    author: 'Lâm Hoàng Yến',   category: 'Kinh tế',  year: 2024, available: 2, total: 2 },
  { id: '20', title: 'Quản trị chuỗi cung ứng toàn cầu (Logistics)',      author: 'Nguyễn Thành Tâm', category: 'Kinh tế',  year: 2022, available: 1, total: 3 },
  { id: '21', title: 'Phân tích dữ liệu kinh doanh (Business Analytics)', author: 'Huỳnh Khánh Vân', category: 'Kinh tế',  year: 2023, available: 2, total: 2 },
  { id: '22', title: 'Đầu tư tài chính & Thị trường chứng khoán',         author: 'Phạm Tấn Tài',    category: 'Kinh tế',  year: 2021, available: 0, total: 2 },
  { id: '23', title: 'Hành vi người tiêu dùng kỷ nguyên số',             author: 'Vũ Ngọc Lan',     category: 'Kinh tế',  year: 2023, available: 3, total: 4 },
  { id: '24', title: 'Quản trị chiến lược kinh doanh đa quốc gia',        author: 'Đặng Minh Châu',  category: 'Kinh tế',  year: 2022, available: 2, total: 3 },

  // --- Ngoại ngữ (12 đầu sách) ---
  { id: '25', title: 'Tiếng Anh giao tiếp thương mại quốc tế',            author: 'Lý Văn Long',     category: 'Ngoại ngữ', year: 2023, available: 5, total: 5 },
  { id: '26', title: 'IELTS Writing Band 7+ nâng cao',                    author: 'Trương Thị Mai',   category: 'Ngoại ngữ', year: 2022, available: 3, total: 4 },
  { id: '27', title: 'Tiếng Nhật N3 toàn tập & Luyện đề',                 author: 'Phan Văn Nam',    category: 'Ngoại ngữ', year: 2021, available: 2, total: 3 },
  { id: '28', title: 'Tiếng Hàn sơ – trung cấp thực hành',                author: 'Mai Thị Oanh',    category: 'Ngoại ngữ', year: 2023, available: 1, total: 2 },
  { id: '29', title: 'Ngữ pháp tiếng Pháp toàn tập',                     author: 'Cao Văn Phúc',    category: 'Ngoại ngữ', year: 2020, available: 0, total: 2 },
  { id: '30', title: 'Tiếng Anh chuyên ngành Công nghệ thông tin',        author: 'Hoàng Trọng Nghĩa', category: 'Ngoại ngữ', year: 2024, available: 4, total: 4 },
  { id: '31', title: 'Luyện thi TOEIC 800+ cấp tốc 4 kỹ năng',            author: 'Lê Thùy Trang',   category: 'Ngoại ngữ', year: 2023, available: 2, total: 3 },
  { id: '32', title: 'Tiếng Trung thương mại ứng dụng thực tiễn',         author: 'Chu Văn Đạt',     category: 'Ngoại ngữ', year: 2022, available: 3, total: 3 },
  { id: '33', title: 'Kỹ năng dịch thuật chuyên nghiệp Anh - Việt',       author: 'Tô Mỹ Duyên',     category: 'Ngoại ngữ', year: 2021, available: 1, total: 2 },
  { id: '34', title: 'Ngữ âm & Âm vị học tiếng Anh đại cương',            author: 'Đỗ Hải Đăng',     category: 'Ngoại ngữ', year: 2022, available: 0, total: 2 },
  { id: '35', title: 'Tiếng Đức căn bản trình độ B1',                     author: 'Nguyễn Bích Ngọc', category: 'Ngoại ngữ', year: 2023, available: 2, total: 2 },
  { id: '36', title: 'Văn hóa và giao tiếp liên văn hóa toàn cầu',        author: 'Quách Tuấn Anh',  category: 'Ngoại ngữ', year: 2024, available: 3, total: 3 },
];

/**
 * Giả lập API lấy danh sách sách — độ trễ 500ms
 * @param shouldFail - truyền true để giả lập lỗi kết nối API
 */
export const fetchBooks = (shouldFail = false): Promise<ApiResponse<Book[]>> =>
  new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          ok: false,
          error: 'Lỗi kết nối máy chủ thư viện khoa (Mã lỗi: LIB-500)',
        });
      } else {
        resolve({ ok: true, data: MOCK_BOOKS });
      }
    }, 500);
  });
