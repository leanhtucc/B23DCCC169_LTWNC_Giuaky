import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-wrapper" aria-live="polite" aria-label="Đang tải">
      <div className="spinner">
        <div className="spinner__book">📖</div>
      </div>
      <p className="loading-text">Đang tải danh sách sách...</p>
    </div>
  );
};

export default LoadingSpinner;
