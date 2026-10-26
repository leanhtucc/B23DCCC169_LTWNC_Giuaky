import React, { useState, useEffect, useRef } from 'react';
import { useFilterStore } from '../store/useFilterStore';
import { useDebounce } from '../hooks/useDebounce';
import { SearchIcon } from './Icons';

const SearchBar: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const setKeyword = useFilterStore((s) => s.setKeyword);
  const debouncedValue = useDebounce<string>(inputValue, 300);

  useEffect(() => {
    setKeyword(debouncedValue);
  }, [debouncedValue, setKeyword]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement !== inputRef.current &&
        !(document.activeElement instanceof HTMLInputElement) &&
        !(document.activeElement instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setInputValue('');
    setKeyword('');
    inputRef.current?.focus();
  };

  return (
    <div className="search-bar">
      <span className="search-bar__icon">
        <SearchIcon size={16} />
      </span>
      <input
        ref={inputRef}
        type="text"
        className="search-bar__input"
        placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        aria-label="Tìm kiếm sách"
      />
      {inputValue ? (
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
      ) : (
        <kbd className="search-bar__shortcut" title="Nhấn phím '/' để tìm kiếm nhanh">
          /
        </kbd>
      )}
    </div>
  );
};

export default SearchBar;
