import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import type { Theme, ThemeContextValue } from '../types';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  // Đồng bộ theme trực tiếp lên thẻ <html> và <body> để toàn bộ trang web tối đồng nhất
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('theme-dark');
      document.body.classList.add('theme-dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
      document.body.classList.remove('theme-dark');
    }
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div className={`app-wrapper theme-${theme}`} data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

/** Custom hook để dùng ThemeContext — throw nếu dùng ngoài Provider */
export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
