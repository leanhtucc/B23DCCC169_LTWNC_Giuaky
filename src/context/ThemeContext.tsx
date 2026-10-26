import React, { createContext, useState, useMemo, useContext } from 'react';
import type { Theme, ThemeContextValue } from '../types';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div className={`app-wrapper theme-${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
};

/** Custom hook để dùng ThemeContext — throw nếu dùng ngoài Provider */
export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
