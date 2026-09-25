import React, { useState, useEffect } from 'react';
import { CustomPageHeader } from './CustomPageHeader';
import { CustomPageDock } from './CustomPageDock';
import { Footer } from './Footer';
import {
  Briefcase,
  Search,
  ExternalLink,
  Linkedin,
  RefreshCw,
  Building2,
  Sparkles,
  Inbox
} from 'lucide-react';

interface CareersPageProps {
  onGoHome: () => void;
  onNavigate: (slug: string) => void;
  onOpenThemeDrawer: () => void;
}

export const CareersPage: React.FC<CareersPageProps> = ({
  onGoHome,
  onNavigate,
  onOpenThemeDrawer,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Careers — HuanMux';
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => {
      document.title = originalTitle;
    };
  }, []);

  useEffect(() => {
    // Simulate query to talent pipeline
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleRefresh = () => {
    setIsLoading(true);
  };

  return (
    <div className="relative min-h-screen themed-bg themed-text flex flex-col justify-between selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
      {/* Top Corporate Navigation */}
      <CustomPageHeader
        onGoHome={onGoHome}
        onNavigate={onNavigate}
        currentSlug="careers"
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 md:px-8 py-10 sm:py-16 z-10">
        {/* Category breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold mb-3">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Opportunities &amp; Careers</span>
        </div>

        {/* Page Title */}
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Careers at HuanMux
        </h1>
        <p className="text-base sm:text-lg opacity-80 leading-relaxed max-w-2xl mb-10">
          Discover opportunities to work across sovereign domains of work in computing, engineering, interface design, and product strategy.
        </p>

        {/* Fake Loading Section OR No Openings State */}
        <div className="p-8 sm:p-10 rounded-2xl bg-white/5 border border-inherit/15 backdrop-blur-md shadow-sm mb-10">
          {isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-5 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-[var(--accent)] animate-spin" />
              </div>
              <div className="space-y-2 max-w-sm">
                <div className="font-bold text-base">Querying Available Positions...</div>
                <div className="text-xs opacity-60 font-mono">
                  Synchronizing with HuanMux domain records &amp; Senturisk recruitment database
                </div>
              </div>

              {/* Skeleton Cards */}
              <div className="w-full max-w-md space-y-3 pt-4">
                <div className="h-10 bg-white/5 rounded-xl border border-inherit/10" />
                <div className="h-10 bg-white/5 rounded-xl border border-inherit/10" />
              </div>
            </div>
          ) : (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-inherit/15 flex items-center justify-center text-inherit/60 shadow-xs">
                <Inbox className="w-7 h-7 text-[var(--accent)] opacity-85" />
              </div>
              <div className="space-y-2 max-w-md">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  No Job Openings Found
                </h2>
                <p className="text-xs sm:text-sm opacity-75 leading-relaxed">
                  There are currently no active job vacancies or open employment positions at HuanMux. All current domains of work are fully staffed.
                </p>
              </div>

              <button
                onClick={handleRefresh}
                className="themed-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 opacity-80 hover:opacity-100 transition-all cursor-pointer mt-2"
                title="Refresh talent database query"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Check for updates</span>
              </button>
            </div>
          )}
        </div>

        {/* Contact Parent Company Senturisk Module */}
        <section className="p-7 sm:p-9 rounded-2xl bg-white/5 border border-[var(--accent)]/30 backdrop-blur-md shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-lg">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] font-semibold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>Parent Organization</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Employment Opportunities at Senturisk
              </h2>
              <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
                HuanMux is part of the <strong className="font-semibold text-inherit">Senturisk</strong> portfolio of brands. For broad career inquiries, corporate roles, speculative applications, or employment opportunities across the Senturisk collective, reach out directly to the parent company.
              </p>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <a
                href="https://www.linkedin.com/in/senturisk"
                target="_blank"
                rel="noopener noreferrer"
                className="themed-send-btn w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 shadow-lg hover:scale-105 active:scale-95 transition-all group"
              >
                <Linkedin className="w-4 h-4 fill-current" />
                <span>Contact Senturisk on LinkedIn</span>
                <ExternalLink className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />

      <CustomPageDock
        onGoHome={onGoHome}
        onOpenThemeDrawer={onOpenThemeDrawer}
      />
    </div>
  );
};
