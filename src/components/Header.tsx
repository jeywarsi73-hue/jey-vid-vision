// JEY VID VISION - Main Header Component
// Features official cinematic branding, 6 mandatory categories, search affordance, and mobile navigation

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Shield, Film, Tv, Music, Smile, PlaySquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Bangla Natok', path: '/category/bangla-natok' },
    { label: 'Hindi Natok', path: '/category/hindi-natok' },
    { label: 'Pakistani Natok', path: '/category/pakistani-natok' },
    { label: 'Comedy', path: '/category/comedy-serial-natok' },
    { label: 'Music Videos', path: '/category/all-music-video' },
    { label: 'Others', path: '/category/others' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#080808]/95 backdrop-blur-md border-b border-neutral-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* 1. Official Logo (Preserves original brand logo appearance) */}
          <Link to="/" className="flex items-center gap-3 shrink-0 py-1" aria-label="JEY VID VISION Home">
            <img 
              src="/logo.png" 
              alt="JEY VID VISION" 
              className="h-12 md:h-14 w-auto object-contain transition-transform duration-200 hover:scale-[1.02]"
              onError={(e) => {
                // In case of any path issue, fallback to public assets
                (e.target as HTMLImageElement).src = '/assets/aistudio/Jey_Vid_Vision_Cinematic_Logo_c6a37e17.png';
              }}
            />
          </Link>

          {/* 2. Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative py-1 whitespace-nowrap transition-colors duration-150 ${
                    active 
                      ? 'text-[#F00018] font-semibold' 
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#F00018] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right Action Controls: Search & Admin Access */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Input toggle */}
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search natok, music, artist..."
                  autoFocus
                  className="w-48 sm:w-64 px-3 py-1.5 pl-9 text-xs bg-neutral-900 border border-neutral-700 rounded-full text-white placeholder-neutral-500 focus:outline-none focus:border-[#F00018]"
                />
                <Search className="absolute left-3 w-3.5 h-3.5 text-neutral-400" />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2 text-neutral-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-full transition-colors"
                aria-label="Open Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Owner Admin Button */}
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isAuthenticated 
                  ? 'bg-neutral-800 text-neutral-200 border border-neutral-700 hover:bg-neutral-700' 
                  : 'bg-[#F00018] text-white hover:bg-[#d00015] shadow-sm shadow-red-950/40'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isAuthenticated ? 'Admin Panel' : 'Owner Login'}</span>
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d0d0d] border-b border-neutral-800 px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200">
          <form onSubmit={handleSearchSubmit} className="mb-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all videos, natok, songs..."
              className="w-full px-4 py-2.5 pl-10 text-sm bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#F00018]"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
          </form>

          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(item.path)
                    ? 'bg-[#F00018]/10 text-[#F00018] font-semibold'
                    : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-neutral-800">
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-center text-xs font-semibold rounded-lg bg-[#F00018] text-white"
            >
              <Shield className="w-4 h-4" />
              {isAuthenticated ? 'Admin Dashboard' : 'Private Owner Login'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
