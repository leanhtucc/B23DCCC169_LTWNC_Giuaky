import React, { useState } from 'react';
import { useFilterStore } from '../store/useFilterStore';
import { useDebounce } from '../hooks/useDebounce';

// Debounce được tách vào component con riêng để useEffect chạy đúng
const SearchBarInner: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const setKeyword = useFilterStore((s) => s.setKeyword);
  const debouncedValue = useDebounce<string>(inputValue, 300);

  // Sync debounced value vào Zustand store
  React.useEffect(() => {
    setKeyword(debouncedValue);
  }, [debouncedValue, setKeyword]);

  return (
    <div className="search-bar">
      <span className="search-bar__icon">🔍</span>
      <input
        type="text"
        className="search-bar__input"
        placeholder="Tìm theo tên sách hoặc tác giả..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        aria-label="Tìm kiếm sách"
      />
      {inputValue && (
        <button
          className="search-bar__clear"
          onClick={() => { setInputValue(''); setKeyword(''); }}
          aria-label="Xoá tìm kiếm"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBarInner;
