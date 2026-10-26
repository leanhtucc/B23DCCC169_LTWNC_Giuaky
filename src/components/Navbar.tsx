import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAppSelector } from '../hooks/useAppSelector';
import { BookIcon, StatsIcon, SunIcon, MoonIcon, BorrowIcon } from './Icons';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const borrowedCount = useAppSelector((s) => s.borrow.borrowedIds.length);

  return (
    <header className="navbar-container">
      <nav className="navbar" aria-label="Điều hướng chính">
        {/* Brand with Academic Crest */}
        <Link to="/" className="navbar__brand">
          <div className="navbar__brand-badge">
            <BookIcon size={18} />
          </div>
          <div className="navbar__brand-text">
            <span className="navbar__title">Mini Library</span>
            <div className="navbar__status-row">
              <span className="status-dot" aria-hidden="true" />
              <span className="navbar__subtitle">Thư viện mở cửa</span>
            </div>
          </div>
        </Link>

        {/* Center: Sliding Capsule Pill Navigation (lucian-ref 039 / 047 pattern) */}
        <div className="navbar__pill-container" role="tablist" aria-label="Menu chuyển trang">
          <Link
            to="/"
            role="tab"
            aria-selected={location.pathname === '/'}
            className={`navbar__pill-tab ${location.pathname === '/' ? 'navbar__pill-tab--active' : ''}`}
          >
            <BookIcon size={15} />
            <span>Tra cứu sách</span>
          </Link>
          <Link
            to="/stats"
            role="tab"
            aria-selected={location.pathname === '/stats'}
            className={`navbar__pill-tab ${location.pathname === '/stats' ? 'navbar__pill-tab--active' : ''}`}
          >
            <StatsIcon size={15} />
            <span>Thống kê</span>
          </Link>
        </div>

        {/* Right Actions: Borrow Badge & Day-Night Sky Switch (lucian-ref 021 pattern) */}
        <div className="navbar__actions">
          {borrowedCount > 0 && (
            <Link
              to="/#borrowed"
              className={`nav-loan-chip ${borrowedCount >= 3 ? 'nav-loan-chip--full' : ''}`}
              title="Xem danh sách các cuốn sách đang mượn"
            >
              <BorrowIcon size={14} />
              <span>Đang mượn <strong>{borrowedCount}/3</strong></span>
            </Link>
          )}

          {/* Interactive Sun-Moon Switcher */}
          <button
            type="button"
            className={`theme-pill-switch ${theme === 'dark' ? 'is-dark' : 'is-light'}`}
            onClick={toggleTheme}
            aria-label={`Chuyển sang giao diện ${theme === 'light' ? 'tối' : 'sáng'}`}
            title={`Giao diện ${theme === 'light' ? 'tối' : 'sáng'} (Bấm để đổi)`}
          >
            <span className="switch-icon switch-icon--sun" aria-hidden="true">
              <SunIcon size={13} />
            </span>
            <span className="switch-icon switch-icon--moon" aria-hidden="true">
              <MoonIcon size={13} />
            </span>
            <span className="switch-knob" aria-hidden="true" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
