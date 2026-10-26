import React, { useMemo } from 'react';
import { useFilterStore } from '../store/useFilterStore';
import { useAppSelector } from '../hooks/useAppSelector';
import type { FilterCategory, Book } from '../types';
import { BookIcon, CodeIcon, ChartIcon, GlobeIcon } from './Icons';

interface CategoryOption {
  label: FilterCategory;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryOption[] = [
  { label: 'Tất cả', icon: <BookIcon size={14} /> },
  { label: 'CNTT', icon: <CodeIcon size={14} /> },
  { label: 'Kinh tế', icon: <ChartIcon size={14} /> },
  { label: 'Ngoại ngữ', icon: <GlobeIcon size={14} /> },
];

const CategoryFilter: React.FC = () => {
  const category = useFilterStore((s) => s.category);
  const setCategory = useFilterStore((s) => s.setCategory);
  const allBooks: Book[] = useAppSelector((s) => s.books.items);

  const categoryCounts = useMemo(() => {
    return {
      'Tất cả': allBooks.length,
      CNTT: allBooks.filter((b) => b.category === 'CNTT').length,
      'Kinh tế': allBooks.filter((b) => b.category === 'Kinh tế').length,
      'Ngoại ngữ': allBooks.filter((b) => b.category === 'Ngoại ngữ').length,
    };
  }, [allBooks]);

  return (
    <div className="category-filter" role="group" aria-label="Lọc theo thể loại">
      {CATEGORIES.map(({ label, icon }) => {
        const count = categoryCounts[label];
        const isActive = category === label;

        return (
          <button
            key={label}
            type="button"
            className={`category-btn ${isActive ? 'category-btn--active' : ''}`}
            onClick={() => setCategory(label)}
            aria-pressed={isActive}
          >
            <span className="category-btn__icon">{icon}</span>
            <span className="category-btn__label">{label}</span>
            {count > 0 && <span className="category-btn__count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
