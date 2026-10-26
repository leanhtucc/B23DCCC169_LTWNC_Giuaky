import React, { useEffect } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { loadBooks } from '../features/books/booksSlice';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import BookList from '../components/BookList';
import BorrowedSection from '../components/BorrowedSection';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.books.status);
  const error = useAppSelector((s) => s.books.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadBooks(false));
    }
  }, [dispatch, status]);

  return (
    <main className="home-page">
      <div className="hero">
        <h1 className="hero__title">Thư viện chuyên ngành 📚</h1>
        <p className="hero__subtitle">
          Tra cứu, theo dõi và quản lý mượn/trả sách trực tuyến nhanh chóng
        </p>

        {/* Nút giả lập kiểm thử API cho giảng viên / chấm bài */}
        <div className="hero__test-buttons">
          <button
            className="btn btn--subtle"
            onClick={() => dispatch(loadBooks(false))}
            disabled={status === 'loading'}
            title="Tải lại danh sách từ API giả lập (500ms)"
          >
            🔄 Tải lại dữ liệu
          </button>
          <button
            className="btn btn--subtle-danger"
            onClick={() => dispatch(loadBooks(true))}
            disabled={status === 'loading'}
            title="Giả lập API thất bại để kiểm tra thông báo lỗi"
          >
            🧪 Thử API lỗi
          </button>
        </div>
      </div>

      <div className="controls">
        <SearchBar />
        <CategoryFilter />
      </div>

      {status === 'loading' && <LoadingSpinner />}

      {status === 'failed' && (
        <div className="error-container">
          <div className="alert alert--error" role="alert">
            <span className="error-icon">⚠️</span>
            <div className="error-content">
              <strong>Lỗi tải dữ liệu:</strong> {error}
            </div>
            <button
              className="btn btn--retry"
              onClick={() => dispatch(loadBooks(false))}
            >
              🔄 Thử lại
            </button>
          </div>
        </div>
      )}

      {status === 'succeeded' && (
        <>
          <BorrowedSection />
          <section className="books-section">
            <h2 className="section-title">📖 Danh mục sách</h2>
            <BookList />
          </section>
        </>
      )}
    </main>
  );
};

export default HomePage;
