import React, { useState } from 'react';
import { useFilterStore } from '../store/useFilterStore';
import { useDebounce } from '../hooks/useDebounce';
import { SearchIcon } from './Icons';

const SearchBar: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const setKeyword = useFilterStore((s) => s.setKeyword);
  const debouncedValue = useDebounce<string>(inputValue, 300);

  // Sync debounced value vào Zustand store
  React.useEffect(() => {
    setKeyword(debouncedValue);
  }, [debouncedValue, setKeyword]);

  const handleClear = () => {
    setInputValue('');
    setKeyword('');
  };

  return (
    <div className="search-bar">
      <span className="search-bar__icon">
        <SearchIcon size={16} />
      </span>
      <input
        type="text"
        className="search-bar__input"
        placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        aria-label="Tìm kiếm sách"
      />
      {inputValue && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Xoá tìm kiếm"
          title="Xoá từ khóa"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
