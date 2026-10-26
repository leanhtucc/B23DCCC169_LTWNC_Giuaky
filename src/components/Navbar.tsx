import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { BookIcon, StatsIcon, SunIcon, MoonIcon } from './Icons';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <header className="navbar-container">
      <nav className="navbar" aria-label="Điều hướng chính">
        <Link to="/" className="navbar__brand">
          <span className="navbar__brand-badge">
            <BookIcon size={18} />
          </span>
          <div className="navbar__brand-text">
            <span className="navbar__title">Mini Library</span>
            <span className="navbar__subtitle">Thư viện khoa</span>
          </div>
        </Link>

        <div className="navbar__actions">
          <div className="navbar__links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'nav-link--active' : ''}`}
            >
              <BookIcon size={15} />
              <span>Tra cứu sách</span>
            </Link>
            <Link
              to="/stats"
              className={`nav-link ${location.pathname === '/stats' ? 'nav-link--active' : ''}`}
            >
              <StatsIcon size={15} />
              <span>Thống kê</span>
            </Link>
          </div>

          <div className="navbar__divider" aria-hidden="true" />

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Chuyển sang giao diện ${theme === 'light' ? 'tối' : 'sáng'}`}
            title={`Giao diện ${theme === 'light' ? 'tối' : 'sáng'}`}
          >
            {theme === 'light' ? <MoonIcon size={17} /> : <SunIcon size={17} />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
