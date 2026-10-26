import React from 'react';
import { useFilterStore } from '../store/useFilterStore';
import type { FilterCategory } from '../types';

const CATEGORIES: FilterCategory[] = ['Tất cả', 'CNTT', 'Kinh tế', 'Ngoại ngữ'];

const CategoryFilter: React.FC = () => {
  const category = useFilterStore((s) => s.category);
  const setCategory = useFilterStore((s) => s.setCategory);

  return (
    <div className="category-filter" role="group" aria-label="Lọc theo thể loại">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={`category-btn ${category === cat ? 'category-btn--active' : ''}`}
          onClick={() => setCategory(cat)}
          aria-pressed={category === cat}
        >
          {cat === 'CNTT' && '💻 '}
          {cat === 'Kinh tế' && '💰 '}
          {cat === 'Ngoại ngữ' && '🌏 '}
          {cat === 'Tất cả' && '📚 '}
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
