import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      {/* Centered pulse spinner with required text */}
      <div className="loading-state">
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
        <p className="loading-state__label">Đang tải ...</p>
        <span className="loading-state__sublabel">Đang kết nối cơ sở dữ liệu thư viện khoa</span>
      </div>

      {/* Shimmering Skeleton Cards (lucian-ref 079-skeleton-to-content pattern) */}
      <div className="skeleton-grid" aria-hidden="true">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="skeleton-card">
            <div className="skeleton-card__shimmer" />
            <div className="skeleton-card__top">
              <div className="skeleton-pill skeleton-pill--badge" />
              <div className="skeleton-pill skeleton-pill--year" />
            </div>
            <div className="skeleton-card__mid">
              <div className="skeleton-line skeleton-line--title" />
              <div className="skeleton-line skeleton-line--title-short" />
              <div className="skeleton-line skeleton-line--author" />
            </div>
            <div className="skeleton-card__bottom">
              <div className="skeleton-line skeleton-line--bar" />
              <div className="skeleton-pill skeleton-pill--btn" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
