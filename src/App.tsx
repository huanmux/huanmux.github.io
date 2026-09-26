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
import { CustomPage } from './components/CustomPage';
import { CustomPageHeader } from './components/CustomPageHeader';
import { CustomPageDock } from './components/CustomPageDock';
import { PostsPage } from './components/PostsPage';
import { AboutPage } from './components/AboutPage';
import { TeamPage } from './components/TeamPage';
import { CareersPage } from './components/CareersPage';
import { SeoViewerPage, SeoTab } from './components/SeoViewerPage';
import { CustomCursor } from './components/CustomCursor';
import { getMarkdownPageBySlug } from './utils/markdownParser';
import { ArrowLeft, ArrowRight, FileText, Home } from 'lucide-react';

export default function App() {
  const [apps] = useState<AppItem[]>(appsData as AppItem[]);
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname;
  });
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

  // Handle browser popstate navigation (Back / Forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = useCallback((target: string) => {
    let normalized = target;
    if (!normalized.startsWith('/')) {
      normalized = `/${normalized}`;
    }
    if (window.location.pathname !== normalized) {
      window.history.pushState({}, '', normalized);
      setCurrentPath(normalized);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleGoHome = useCallback(() => {
    navigateTo('/');
  }, [navigateTo]);

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

  // Determine current route
  const normalizedSlug = currentPath.replace(/^\/+|\/+$/g, '').toLowerCase();
  const isHomePage = !normalizedSlug || normalizedSlug === 'index.html';
  const isAboutPage = normalizedSlug === 'about';
  const isTeamPage = normalizedSlug === 'team';
  const isCareersPage = normalizedSlug === 'careers';
  const isPostsPage = normalizedSlug === 'posts';
  const isSitemap = normalizedSlug === 'sitemap.xml' || normalizedSlug === 'sitemap';
  const isRobots = normalizedSlug === 'robots.txt' || normalizedSlug === 'robots';
  const isLlms = normalizedSlug === 'llms.txt' || normalizedSlug === 'llms';
  const isLlmsFull = normalizedSlug === 'llms-full.txt' || normalizedSlug === 'llms-full';
  const isSeoPage = isSitemap || isRobots || isLlms || isLlmsFull || normalizedSlug === 'seo';
  const isSpecialPage = isHomePage || isAboutPage || isTeamPage || isCareersPage || isPostsPage || isSeoPage;
  const matchedCustomPage = isSpecialPage ? null : getMarkdownPageBySlug(normalizedSlug);

  // Reset title when on homepage
  useEffect(() => {
    if (isHomePage) {
      document.title = 'HuanMux';
    }
  }, [isHomePage]);

  // If on About page
  if (isAboutPage) {
    return (
      <div className="relative min-h-screen themed-bg themed-text overflow-x-hidden selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
        <CustomCursor />
        <AboutPage
          onGoHome={handleGoHome}
          onNavigate={navigateTo}
          onOpenThemeDrawer={() => setIsThemeDrawerOpen(true)}
        />
        <ThemeDrawer
          isOpen={isThemeDrawerOpen}
          onClose={() => setIsThemeDrawerOpen(false)}
          currentTheme={theme}
          onSelectTheme={handleSelectTheme}
        />
      </div>
    );
  }

  // If on Team page
  if (isTeamPage) {
    return (
      <div className="relative min-h-screen themed-bg themed-text overflow-x-hidden selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
        <CustomCursor />
        <TeamPage
          onGoHome={handleGoHome}
          onNavigate={navigateTo}
          onOpenThemeDrawer={() => setIsThemeDrawerOpen(true)}
        />
        <ThemeDrawer
          isOpen={isThemeDrawerOpen}
          onClose={() => setIsThemeDrawerOpen(false)}
          currentTheme={theme}
          onSelectTheme={handleSelectTheme}
        />
      </div>
    );
  }

  // If on Careers page
  if (isCareersPage) {
    return (
      <div className="relative min-h-screen themed-bg themed-text overflow-x-hidden selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
        <CustomCursor />
        <CareersPage
          onGoHome={handleGoHome}
          onNavigate={navigateTo}
          onOpenThemeDrawer={() => setIsThemeDrawerOpen(true)}
        />
        <ThemeDrawer
          isOpen={isThemeDrawerOpen}
          onClose={() => setIsThemeDrawerOpen(false)}
          currentTheme={theme}
          onSelectTheme={handleSelectTheme}
        />
      </div>
    );
  }

  // If on the Posts archive page
  if (isPostsPage) {
    return (
      <div className="relative min-h-screen themed-bg themed-text overflow-x-hidden selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
        <CustomCursor />
        <PostsPage
          onGoHome={handleGoHome}
          onNavigate={navigateTo}
          onOpenThemeDrawer={() => setIsThemeDrawerOpen(true)}
        />
        <ThemeDrawer
          isOpen={isThemeDrawerOpen}
          onClose={() => setIsThemeDrawerOpen(false)}
          currentTheme={theme}
          onSelectTheme={handleSelectTheme}
        />
      </div>
    );
  }

  // If on SEO & LLM discovery page (/sitemap.xml, /robots.txt, /llms.txt, /llms-full.txt, /seo)
  if (isSeoPage) {
    let initialTab: SeoTab = 'sitemap';
    if (isRobots) initialTab = 'robots';
    else if (isLlms) initialTab = 'llms';
    else if (isLlmsFull) initialTab = 'llms-full';

    return (
      <div className="relative min-h-screen themed-bg themed-text overflow-x-hidden selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
        <CustomCursor />
        <SeoViewerPage
          initialTab={initialTab}
          onGoHome={handleGoHome}
          onNavigate={navigateTo}
          onOpenThemeDrawer={() => setIsThemeDrawerOpen(true)}
        />
        <ThemeDrawer
          isOpen={isThemeDrawerOpen}
          onClose={() => setIsThemeDrawerOpen(false)}
          currentTheme={theme}
          onSelectTheme={handleSelectTheme}
        />
      </div>
    );
  }

  // If a custom page matches the route
  if (matchedCustomPage) {
    return (
      <div className="relative min-h-screen themed-bg themed-text overflow-x-hidden selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
        <CustomCursor />
        <CustomPage
          page={matchedCustomPage}
          onGoHome={handleGoHome}
          onNavigate={navigateTo}
          onOpenThemeDrawer={() => setIsThemeDrawerOpen(true)}
        />
        <ThemeDrawer
          isOpen={isThemeDrawerOpen}
          onClose={() => setIsThemeDrawerOpen(false)}
          currentTheme={theme}
          onSelectTheme={handleSelectTheme}
        />
      </div>
    );
  }

  // If the path is not home and no custom page was found (404)
  if (!isHomePage && !matchedCustomPage && !isSpecialPage) {
    return (
      <div className="relative min-h-screen themed-bg themed-text flex flex-col justify-between selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
        <CustomCursor />
        <CustomPageHeader
          onGoHome={handleGoHome}
          onNavigate={navigateTo}
          onGoToPosts={() => navigateTo('/posts')}
        />

        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 z-10 max-w-2xl mx-auto">
          <div className="p-4 rounded-2xl bg-white/5 border border-inherit/10 mb-6">
            <FileText className="w-12 h-12 text-[var(--accent)] mx-auto opacity-80" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Page Not Found
          </h1>
          <p className="text-sm sm:text-base opacity-75 mb-8 max-w-md">
            The page <code className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[var(--accent)]">/{normalizedSlug}</code> does not exist in the <code className="font-mono">pages/</code> directory.
          </p>

          {/* Replaced available custom pages module with a direct link to visit the new posts page */}
          <div className="w-full max-w-md p-6 rounded-2xl bg-white/5 border border-inherit/15 mb-8 text-center backdrop-blur-md">
            <p className="text-sm opacity-80 mb-4 leading-relaxed">
              Looking for technical documentation, architectural guides, or specifications? Explore our full archive of articles.
            </p>
            <button
              onClick={() => navigateTo('/posts')}
              className="w-full themed-send-btn py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <FileText className="w-4 h-4" />
              <span>Explore All Posts &amp; Guides</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGoHome}
              className="themed-btn px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer opacity-90 hover:opacity-100 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </main>

        <Footer onNavigate={navigateTo} />

        <CustomPageDock
          onGoHome={handleGoHome}
          onOpenThemeDrawer={() => setIsThemeDrawerOpen(true)}
        />

        <ThemeDrawer
          isOpen={isThemeDrawerOpen}
          onClose={() => setIsThemeDrawerOpen(false)}
          currentTheme={theme}
          onSelectTheme={handleSelectTheme}
        />
      </div>
    );
  }

  // Standard Home Landing Page (Everything intact!)
  return (
    <div className="relative min-h-screen themed-bg themed-text overflow-x-hidden selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
      <CustomCursor />
      {/* 1. Ambient Background (Auroras + Procedural Grid) */}
      <AmbientBackground />

      {/* 2. Top Navigation Bar - Corporate links & Mobile burger menu */}
      <Header
        onNavigate={navigateTo}
        onNavigateToPosts={() => navigateTo('/posts')}
      />

      {/* Main Content Layout */}
      <main className="relative z-10">
        {/* 3. Hero Section with Fiery Headline */}
        <Hero
          onExplore={handleScrollToApps}
          appCount={apps.length}
        />

        {/* 4. Core App Showcase Grid */}
        <AppGrid apps={apps} />

        {/* 5. Brand Pillars (Art, Science, Tech, Entertainment) */}
        <BrandPillars onScrollToApps={handleScrollToApps} />

        {/* 6. About HuanMux */}
        <AboutSection />
      </main>

      {/* 7. Footer */}
      <Footer onNavigate={navigateTo} />

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
