import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="spinner-ring" aria-hidden="true">
        <svg viewBox="0 0 50 50" className="spinner-ring__svg">
          <circle
            className="spinner-ring__circle"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="3.5"
          />
        </svg>
      </div>
      <p className="loading-state__label">Đang tải danh sách sách...</p>
    </div>
  );
};

export default LoadingSpinner;
