import React, { useState, useEffect } from 'react';
import { Home, Palette, ArrowUp } from 'lucide-react';

interface CustomPageDockProps {
  onGoHome: () => void;
  onOpenThemeDrawer: () => void;
}

export const CustomPageDock: React.FC<CustomPageDockProps> = ({
  onGoHome,
  onOpenThemeDrawer,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Custom Page Quick Navigation Dock"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 px-3 py-2 rounded-full themed-dock backdrop-blur-2xl shadow-2xl flex items-center gap-1.5 sm:gap-2 transition-all duration-300"
    >
      {/* 1. Home Button */}
      <button
        onClick={onGoHome}
        className="p-2 sm:px-3 sm:py-2 rounded-full themed-btn flex items-center gap-1.5 text-xs font-semibold cursor-pointer hover:scale-105 active:scale-95 transition-all"
        title="Return to Home Landing Page"
      >
        <Home className="w-4 h-4" style={{ color: 'var(--accent)' }} />
        <span>Home</span>
      </button>

      {/* Divider */}
      <div className="w-px h-5 bg-current opacity-15 mx-0.5" />

      {/* 2. Theme Icon Button */}
      <button
        onClick={onOpenThemeDrawer}
        className="p-2 rounded-full themed-btn opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Change Theme Palette"
        aria-label="Change Theme Palette"
      >
        <Palette className="w-4 h-4" />
      </button>

      {/* 3. Optional Arrow Up Button (for going back up) */}
      {showScrollTop && (
        <>
          <div className="w-px h-5 bg-current opacity-15 mx-0.5" />
          <button
            onClick={scrollToTop}
            className="p-2 rounded-full themed-btn opacity-85 hover:opacity-100 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Return to top"
            aria-label="Return to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </>
      )}
    </aside>
  );
};
