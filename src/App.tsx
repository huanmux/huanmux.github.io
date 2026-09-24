/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import appsData from './data/apps.json';
import { AppItem, ThemeId } from './types';
import { AmbientBackground } from './components/AmbientBackground';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AppGrid } from './components/AppGrid';
import { BrandPillars } from './components/BrandPillars';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { ThemeDrawer } from './components/ThemeDrawer';
import { FloatingDock } from './components/FloatingDock';

export default function App() {
  const [apps] = useState<AppItem[]>(appsData as AppItem[]);
  const [theme, setTheme] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('mux-theme') as ThemeId;
    return saved || 'classic-dark';
  });
  const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState(false);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mux-theme', theme);
  }, [theme]);

  const handleSelectTheme = useCallback((newTheme: ThemeId) => {
    setTheme(newTheme);
  }, []);

  const handleScrollToApps = useCallback(() => {
    const el = document.getElementById('showcase-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleFocusSearch = useCallback(() => {
    handleScrollToApps();
    setTimeout(() => {
      const searchInput = document.querySelector<HTMLInputElement>(
        '#showcase-section input[type="text"]'
      );
      if (searchInput) {
        searchInput.focus();
      }
    }, 400);
  }, [handleScrollToApps]);

  return (
    <div className="relative min-h-screen themed-bg themed-text overflow-x-hidden selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
      {/* 1. Ambient Background (Auroras + Procedural Grid) */}
      <AmbientBackground />

      {/* 2. Top Navigation Bar - Minimalist with HuanMux text only */}
      <Header />

      {/* Main Content Layout */}
      <main className="relative z-10">
        {/* 3. Hero Section with Fiery Headline */}
        <Hero onExplore={handleScrollToApps} appCount={apps.length} />

        {/* 4. Core App Showcase Grid */}
        <AppGrid apps={apps} />

        {/* 5. Brand Pillars (Art, Science, Tech, Entertainment) */}
        <BrandPillars onScrollToApps={handleScrollToApps} />

        {/* 6. About HuanMux */}
        <AboutSection />
      </main>

      {/* 7. Footer */}
      <Footer />

      {/* 8. Floating Bottom Dock */}
      <FloatingDock
        onScrollToApps={handleScrollToApps}
        onOpenThemeDrawer={() => setIsThemeDrawerOpen(true)}
        onFocusSearch={handleFocusSearch}
      />

      {/* 9. Theme Drawer */}
      <ThemeDrawer
        isOpen={isThemeDrawerOpen}
        onClose={() => setIsThemeDrawerOpen(false)}
        currentTheme={theme}
        onSelectTheme={handleSelectTheme}
      />
    </div>
  );
}
