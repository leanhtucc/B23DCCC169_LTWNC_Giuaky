import React from 'react';
import { useFilterStore } from '../store/useFilterStore';
import type { FilterCategory } from '../types';
import { BookIcon, CodeIcon, ChartIcon, GlobeIcon } from './Icons';

const CATEGORIES: { label: FilterCategory; icon: React.ReactNode }[] = [
  { label: 'Tất cả', icon: <BookIcon size={14} /> },
  { label: 'CNTT', icon: <CodeIcon size={14} /> },
  { label: 'Kinh tế', icon: <ChartIcon size={14} /> },
  { label: 'Ngoại ngữ', icon: <GlobeIcon size={14} /> },
];

const CategoryFilter: React.FC = () => {
  const category = useFilterStore((s) => s.category);
  const setCategory = useFilterStore((s) => s.setCategory);

  return (
    <div className="category-filter" role="group" aria-label="Lọc theo thể loại">
      {CATEGORIES.map(({ label, icon }) => (
        <button
          key={label}
          type="button"
          className={`category-btn ${category === label ? 'category-btn--active' : ''}`}
          onClick={() => setCategory(label)}
          aria-pressed={category === label}
        >
          <span className="category-btn__icon">{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
