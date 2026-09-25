import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface CustomPageHeaderProps {
  onGoHome: () => void;
  onNavigate?: (slug: string) => void;
  onOpenThemeDrawer?: () => void; // Deprecated in header: theme switch is retained in floating dock
  onGoToPosts?: () => void;
  currentSlug?: string;
}

export const CustomPageHeader: React.FC<CustomPageHeaderProps> = ({
  onGoHome,
  onNavigate,
  onGoToPosts,
  currentSlug = '',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLinkClick = (slug: string) => {
    setIsMobileMenuOpen(false);
    if (slug === 'home') {
      onGoHome();
    } else if (slug === 'posts' && onGoToPosts) {
      onGoToPosts();
    } else if (onNavigate) {
      onNavigate(slug);
    } else if (slug === 'posts') {
      window.location.pathname = '/posts';
    }
  };

  const navLinks = [
    { label: 'About', slug: 'about' },
    { label: 'Team', slug: 'team' },
    { label: 'Careers', slug: 'careers' },
    { label: 'Posts', slug: 'posts' },
  ];

  return (
    <header className="themed-header sticky top-0 z-30 border-b backdrop-blur-xl transition-colors">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 max-w-7xl mx-auto">
        {/* Top-left: Logo + Wordmark */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 cursor-pointer group transition-transform active:scale-95 text-left"
          title="Return to HuanMux Home"
        >
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl overflow-hidden border border-inherit/20 shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-105">
            <img
              src="https://huanmux.vercel.app/assets/logo/icon.png"
              alt="HuanMux Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/mux-appicon.png';
              }}
            />
          </div>
          <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-inherit select-none group-hover:opacity-85 transition-opacity">
            HuanMux
          </span>
        </button>

        {/* Desktop Corporate-Style Text Links (No Icons) */}
        <nav className="hidden md:flex items-center space-x-7 text-sm font-medium tracking-normal" aria-label="Corporate Navigation">
          {navLinks.map((item) => {
            const isActive = currentSlug === item.slug;
            return (
              <button
                key={item.slug}
                onClick={() => handleLinkClick(item.slug)}
                className={`transition-colors cursor-pointer py-1 ${
                  isActive
                    ? 'text-[var(--accent)] font-semibold'
                    : 'opacity-75 hover:opacity-100 hover:text-[var(--accent)]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button in Top-Right Corner */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl border border-inherit/15 bg-white/5 opacity-85 hover:opacity-100 active:scale-95 transition-all cursor-pointer"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-inherit" />
            ) : (
              <Menu className="w-5 h-5 text-inherit" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-inherit/10 px-6 py-4 space-y-2 bg-inherit/95 backdrop-blur-2xl shadow-xl animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => handleLinkClick('home')}
            className="w-full text-left py-2.5 text-sm font-medium opacity-80 hover:opacity-100 hover:text-[var(--accent)] transition-colors cursor-pointer"
          >
            Home
          </button>
          {navLinks.map((item) => {
            const isActive = currentSlug === item.slug;
            return (
              <button
                key={item.slug}
                onClick={() => handleLinkClick(item.slug)}
                className={`w-full text-left py-2.5 text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${
                  isActive
                    ? 'text-[var(--accent)] font-semibold'
                    : 'opacity-80 hover:opacity-100 hover:text-[var(--accent)]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
