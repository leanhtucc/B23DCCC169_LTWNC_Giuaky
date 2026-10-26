import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load StatsPage
const StatsPage = lazy(() => import('./pages/StatsPage'));

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <div className="app-shell">
            <Navbar />
            <div className="page-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/stats"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <StatsPage />
                    </Suspense>
                  }
                />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
