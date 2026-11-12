/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// JEY VID VISION - Main Application Component
// Platform: JEY VID VISION | "Your Entertainment. Your Vision."

import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { WatchPage } from './pages/WatchPage';
import { SearchPage } from './pages/SearchPage';
import { LegalPage } from './pages/LegalPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Layout wrapper to show Header/Footer on public routes and hide on Admin Dashboard
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminDashboard = location.pathname.startsWith('/admin/dashboard');

  return (
    <div className="flex flex-col min-h-screen bg-[#080808] text-white">
      {!isAdminDashboard && <Header />}
      <div className="flex-grow">{children}</div>
      {!isAdminDashboard && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/watch/:slug" element={<WatchPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* Catch-all redirect to Home */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}
