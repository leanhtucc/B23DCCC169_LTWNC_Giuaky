import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">📚</span>
        <span className="navbar__title">Mini Library</span>
      </div>

      <div className="navbar__links">
        <Link
          to="/"
          className={`nav-link ${location.pathname === '/' ? 'nav-link--active' : ''}`}
        >
          🏠 Trang chủ
        </Link>
        <Link
          to="/stats"
          className={`nav-link ${location.pathname === '/stats' ? 'nav-link--active' : ''}`}
        >
          📊 Thống kê
        </Link>
      </div>

      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Chuyển sang giao diện ${theme === 'light' ? 'tối' : 'sáng'}`}
        title={`Giao diện ${theme === 'light' ? 'tối' : 'sáng'}`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </nav>
  );
};

export default Navbar;
