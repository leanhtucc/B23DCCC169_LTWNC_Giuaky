import React, { useMemo } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import type { BookCategory, ReadonlyRecord, Book } from '../types';
import { BookIcon, BorrowIcon, CheckIcon, CodeIcon, ChartIcon, GlobeIcon } from '../components/Icons';

const CATEGORIES: BookCategory[] = ['CNTT', 'Kinh tế', 'Ngoại ngữ'];

const categoryIcons: ReadonlyRecord<BookCategory, React.ReactNode> = {
  CNTT: <CodeIcon size={16} />,
  'Kinh tế': <ChartIcon size={16} />,
  'Ngoại ngữ': <GlobeIcon size={16} />,
};

interface CategoryStat {
  category: BookCategory;
  totalTitles: number;
  totalCopies: number;
  availableCopies: number;
}

const StatsPage: React.FC = () => {
  const books: Book[] = useAppSelector((s) => s.books.items);
  const borrowedIds: string[] = useAppSelector((s) => s.borrow.borrowedIds);

  const statsByCategory = useMemo<CategoryStat[]>(() => {
    return CATEGORIES.map((cat: BookCategory) => {
      const catBooks = books.filter((b: Book) => b.category === cat);
      const totalTitles = catBooks.length;
      const totalCopies = catBooks.reduce((sum: number, b: Book) => sum + b.total, 0);
      const availableCopies = catBooks.reduce((sum: number, b: Book) => sum + b.available, 0);
      return { category: cat, totalTitles, totalCopies, availableCopies };
    });
  }, [books]);

  const totalTitles = books.length;
  const totalCopies = books.reduce((sum, b) => sum + b.total, 0);
  const totalAvailable = books.reduce((sum, b) => sum + b.available, 0);
  const totalBorrowed = borrowedIds.length;

  return (
    <main className="stats-page">
      <header className="page-header">
        <div className="page-header__main">
          <div className="page-header__content">
            <h1 className="page-title">Báo cáo & Thống kê Thư viện</h1>
            <p className="page-description">
              Tổng quan tình hình phân bổ tài liệu, tỷ lệ sẵn sàng và dữ liệu mượn sách theo từng thể loại chuyên ngành.
            </p>
          </div>
        </div>
      </header>

      <div className="page-body">
        {/* KPI Overview Metrics */}
        <section className="metrics-grid" aria-label="Chỉ số tổng quan">
          <div className="metric-card">
            <div className="metric-card__header">
              <span className="metric-card__label">Tổng số đầu sách</span>
              <span className="metric-card__icon" aria-hidden="true">
                <BookIcon size={18} />
              </span>
            </div>
            <div className="metric-card__value">{totalTitles}</div>
            <div className="metric-card__hint">Quy mô toàn thư viện ({totalCopies} bản in)</div>
          </div>

          <div className="metric-card">
            <div className="metric-card__header">
              <span className="metric-card__label">Đang được mượn</span>
              <span className="metric-card__icon metric-card__icon--warning" aria-hidden="true">
                <BorrowIcon size={18} />
              </span>
            </div>
            <div className="metric-card__value metric-card__value--warning">{totalBorrowed}</div>
            <div className="metric-card__hint">Đang do sinh viên lưu giữ</div>
          </div>

          <div className="metric-card">
            <div className="metric-card__header">
              <span className="metric-card__label">Bản in sẵn sàng</span>
              <span className="metric-card__icon metric-card__icon--success" aria-hidden="true">
                <CheckIcon size={18} />
              </span>
            </div>
            <div className="metric-card__value metric-card__value--success">{totalAvailable}</div>
            <div className="metric-card__hint">Có thể mượn ngay trên giá sách</div>
          </div>
        </section>

        {/* Breakdown by Category */}
        <section className="breakdown-section" aria-labelledby="breakdown-heading">
          <div className="section-header">
            <h2 id="breakdown-heading" className="section-title">
              Phân bổ theo chuyên ngành
            </h2>
            <p className="section-subtitle">
              Chi tiết số đầu sách, tổng lượng bản in và tỷ lệ bản in còn tại thư viện
            </p>
          </div>

          <div className="category-grid">
            {statsByCategory.map(({ category, totalTitles, totalCopies, availableCopies }) => {
              const availabilityPercent =
                totalCopies > 0 ? Math.round((availableCopies / totalCopies) * 100) : 0;

              return (
                <article className="category-card" key={category}>
                  <div className="category-card__header">
                    <span className="category-card__tag">
                      <span className="category-card__icon">{categoryIcons[category]}</span>
                      <span className="category-card__name">{category}</span>
                    </span>
                    <span className="category-card__rate">{availabilityPercent}% khả dụng</span>
                  </div>

                  <dl className="category-card__data">
                    <div className="data-row">
                      <dt>Số đầu sách:</dt>
                      <dd>{totalTitles} tác phẩm</dd>
                    </div>
                    <div className="data-row">
                      <dt>Tổng số bản:</dt>
                      <dd>{totalCopies} bản</dd>
                    </div>
                    <div className="data-row">
                      <dt>Còn trên kệ:</dt>
                      <dd className="highlight-text">{availableCopies} bản</dd>
                    </div>
                  </dl>

                  <div className="progress-container" aria-hidden="true">
                    <div
                      className="progress-bar"
                      style={{ width: `${availabilityPercent}%` }}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
};

export default StatsPage;
