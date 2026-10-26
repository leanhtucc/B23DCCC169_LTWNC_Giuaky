import React, { useMemo } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import type { BookCategory, ReadonlyRecord, Book } from '../types';

const CATEGORIES: BookCategory[] = ['CNTT', 'Kinh tế', 'Ngoại ngữ'];

const categoryIcons: ReadonlyRecord<BookCategory, string> = {
  CNTT: '💻',
  'Kinh tế': '💰',
  'Ngoại ngữ': '🌏',
};

const categoryColors: ReadonlyRecord<BookCategory, string> = {
  CNTT: '#3b82f6',
  'Kinh tế': '#10b981',
  'Ngoại ngữ': '#8b5cf6',
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

  // useMemo: tính thống kê theo thể loại
  const statsByCategory = useMemo<CategoryStat[]>(() => {
    return CATEGORIES.map((cat: BookCategory) => {
      const catBooks = books.filter((b: Book) => b.category === cat);
      const totalTitles = catBooks.length;
      const totalCopies = catBooks.reduce((sum: number, b: Book) => sum + b.total, 0);
      const availableCopies = catBooks.reduce((sum: number, b: Book) => sum + b.available, 0);
      return { category: cat, totalTitles, totalCopies, availableCopies };
    });
  }, [books]);

  const totalBooks = books.length;
  const totalBorrowed = borrowedIds.length;

  return (
    <main className="stats-page">
      <div className="hero">
        <h1 className="hero__title">📊 Thống kê thư viện</h1>
        <p className="hero__subtitle">Tổng quan về tình trạng sách trong thư viện</p>
      </div>

      {/* Tổng quan */}
      <div className="stats-overview">
        <div className="stat-card stat-card--total">
          <span className="stat-card__icon">📚</span>
          <div>
            <p className="stat-card__label">Tổng đầu sách</p>
            <p className="stat-card__value">{totalBooks}</p>
          </div>
        </div>
        <div className="stat-card stat-card--borrowed">
          <span className="stat-card__icon">📋</span>
          <div>
            <p className="stat-card__label">Đang mượn</p>
            <p className="stat-card__value">{totalBorrowed}</p>
          </div>
        </div>
        <div className="stat-card stat-card--available">
          <span className="stat-card__icon">✅</span>
          <div>
            <p className="stat-card__label">Có thể mượn</p>
            <p className="stat-card__value">
              {books.filter((b: Book) => b.available > 0).length}
            </p>
          </div>
        </div>
      </div>

      {/* Thống kê theo thể loại */}
      <section className="stats-by-category">
        <h2 className="section-title">Theo thể loại</h2>
        <div className="category-stats-grid">
          {statsByCategory.map(({ category, totalTitles, totalCopies, availableCopies }) => {
            const percent =
              totalCopies > 0 ? Math.round((availableCopies / totalCopies) * 100) : 0;
            return (
              <div className="category-stat-card" key={category}>
                <div className="category-stat-card__header">
                  <span className="category-stat-card__icon">{categoryIcons[category]}</span>
                  <h3 className="category-stat-card__name">{category}</h3>
                </div>
                <div className="category-stat-card__info">
                  <div className="stat-row">
                    <span>Đầu sách</span>
                    <strong>{totalTitles}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Tổng bản</span>
                    <strong>{totalCopies}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Còn sẵn</span>
                    <strong>{availableCopies}</strong>
                  </div>
                </div>
                {/* Thanh biểu đồ CSS */}
                <div className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: categoryColors[category],
                    }}
                    title={`${percent}% còn sẵn`}
                  />
                  <span className="chart-bar__label">{percent}% còn sẵn</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default StatsPage;
