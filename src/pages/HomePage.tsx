import React, { useEffect } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { loadBooks } from '../features/books/booksSlice';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import BookList from '../components/BookList';
import BorrowedSection from '../components/BorrowedSection';
import LoadingSpinner from '../components/LoadingSpinner';
import { RefreshIcon, WarningIcon } from '../components/Icons';

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
      <header className="page-header">
        <div className="page-header__main">
          <div className="page-header__content">
            <h1 className="page-title">Tra cứu & Mượn sách</h1>
            <p className="page-description">
              Hệ thống thư viện khoa điện tử. Tìm kiếm đầu sách chuyên ngành, tra cứu số lượng bản còn sẵn và quản lý mượn trả tiện lợi.
            </p>
          </div>

          <div className="page-header__actions">
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => dispatch(loadBooks(false))}
              disabled={status === 'loading'}
              title="Tải lại danh sách từ API giả lập (độ trễ 500ms)"
            >
              <RefreshIcon size={14} />
              <span>Tải lại</span>
            </button>
            <button
              type="button"
              className="btn btn--ghost-danger btn--sm"
              onClick={() => dispatch(loadBooks(true))}
              disabled={status === 'loading'}
              title="Giả lập lỗi kết nối API"
            >
              <WarningIcon size={14} />
              <span>Thử API lỗi</span>
            </button>
          </div>
        </div>
      </header>

      <section className="catalog-toolbar" aria-label="Bộ lọc tìm kiếm">
        <div className="toolbar-container">
          <SearchBar />
          <CategoryFilter />
        </div>
      </section>

      <div className="page-body">
        {status === 'loading' && <LoadingSpinner />}

        {status === 'failed' && (
          <div className="alert alert--error" role="alert">
            <span className="alert__icon">
              <WarningIcon size={18} />
            </span>
            <div className="alert__content">
              <strong>Không thể tải danh sách sách:</strong> {error}
            </div>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => dispatch(loadBooks(false))}
            >
              <RefreshIcon size={14} />
              <span>Thử lại</span>
            </button>
          </div>
        )}

        {status === 'succeeded' && (
          <>
            <BorrowedSection />
            <section className="books-section" aria-labelledby="catalog-heading">
              <div className="section-header">
                <h2 id="catalog-heading" className="section-title">
                  Danh mục sách
                </h2>
              </div>
              <BookList />
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default HomePage;
