import React, { useEffect } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { loadBooks } from '../features/books/booksSlice';
import StudentDesk from '../components/StudentDesk';
import SpotlightBook from '../components/SpotlightBook';
import BookList from '../components/BookList';
import LoadingSpinner from '../components/LoadingSpinner';
import { RefreshIcon, WarningIcon, BookIcon } from '../components/Icons';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.books.status);
  const error = useAppSelector((s) => s.books.error);
  const totalBooks = useAppSelector((s) => s.books.items.length);

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
            <div className="page-header__eyebrow">
              <span className="eyebrow-badge">
                <BookIcon size={13} />
                <span>Khoa Công nghệ Thông tin & Truyền thông</span>
              </span>
              {totalBooks > 0 && (
                <span className="eyebrow-stat">{totalBooks} đầu sách sẵn sàng</span>
              )}
            </div>
            <h1 className="page-title">Tra cứu & Mượn sách Chuyên ngành</h1>
            <p className="page-description">
              Không gian học thuật số. Khám phá tài liệu chuyên sâu, quản lý hạn ngạch mượn trả realtime ngay trên bàn đọc cá nhân.
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
              title="Giả lập lỗi kết nối API để kiểm tra xử lý lỗi"
            >
              <WarningIcon size={14} />
              <span>Thử API lỗi</span>
            </button>
          </div>
        </div>
      </header>
      <div className="page-body">
        {status === 'loading' && <LoadingSpinner />}

        {status === 'failed' && (
          <div className="error-card" role="alert">
            <div className="error-card__icon" aria-hidden="true">
              <WarningIcon size={32} />
            </div>
            <div className="error-card__body">
              <h3 className="error-card__title">Không thể kết nối đến máy chủ thư viện</h3>
              <p className="error-card__desc">
                Đã xảy ra lỗi khi tải danh mục sách: <code>{error}</code>. Vui lòng kiểm tra lại đường truyền mạng hoặc thử tải lại.
              </p>
              <div className="error-card__actions">
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() => dispatch(loadBooks(false))}
                >
                  <RefreshIcon size={14} />
                  <span>Thử lại ngay</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {status === 'succeeded' && (
          <div className="bento-workspace">
            <StudentDesk />

            <div className="bento-main">
              <SpotlightBook />
              <section className="catalog-section" aria-labelledby="catalog-heading">
                <div className="section-header">
                  <div className="section-title-wrap">
                    <h2 id="catalog-heading" className="section-title">
                      Danh mục tài liệu
                    </h2>
                    <span className="section-count-badge">{totalBooks} cuốn</span>
                  </div>
                </div>
                <BookList />
              </section>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default HomePage;
