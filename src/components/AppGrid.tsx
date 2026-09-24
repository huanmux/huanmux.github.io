import React, { useState, useMemo } from 'react';
import { ExternalLink, Search, Grid, List, Check, ArrowUpRight } from 'lucide-react';
import { AppItem } from '../types';

interface AppGridProps {
  apps: AppItem[];
}

export const AppGrid: React.FC<AppGridProps> = ({ apps }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'launchpad' | 'list'>('launchpad');
  const [recentlyOpened, setRecentlyOpened] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const categories = useMemo(() => {
    const cats = ['All'];
    apps.forEach((app) => {
      if (!cats.includes(app.category)) {
        cats.push(app.category);
      }
    });
    return cats;
  }, [apps]);

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [apps, searchQuery, selectedCategory]);

  const handleLaunchApp = (app: AppItem) => {
    setRecentlyOpened(app.id);
    setTimeout(() => setRecentlyOpened(null), 2500);
  };

  const handleImgError = (appId: string) => {
    setImgErrors((prev) => ({ ...prev, [appId]: true }));
  };

  return (
    <section id="showcase-section" className="scroll-mt-20 py-16 px-4 sm:px-8 max-w-7xl mx-auto z-10 relative">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-inherit/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase opacity-60 mb-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
            <span>Launchpad Ecosystem</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            App Showcase
          </h2>
          <p className="text-sm sm:text-base opacity-70 mt-2 max-w-xl">
            Tap or click any icon to connect directly to the active application portal.
          </p>
        </div>

        {/* Controls: Search, View switch, and Category filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Quick Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="themed-input w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm outline-none backdrop-blur-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs opacity-50 hover:opacity-100 p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="themed-btn p-1 rounded-xl flex items-center shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('launchpad')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'launchpad'
                  ? 'bg-white/20 text-inherit font-semibold shadow-xs'
                  : 'opacity-60 hover:opacity-100'
              }`}
              title="Launchpad Grid View"
              aria-label="Launchpad Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white/20 text-inherit font-semibold shadow-xs'
                  : 'opacity-60 hover:opacity-100'
              }`}
              title="Compact List View"
              aria-label="Compact List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Segmented Tabs (Interactive Filter Controls allowed by Skill) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'themed-send-btn shadow-sm'
                : 'themed-btn opacity-70 hover:opacity-100'
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="text-xs opacity-40 ml-auto pl-4 shrink-0 tabular-nums">
          Showing {filteredApps.length} of {apps.length}
        </span>
      </div>

      {/* Notification Toast when an app is launched */}
      {recentlyOpened && (
        <div className="mb-6 p-3 rounded-2xl themed-card flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Connecting to <strong>{apps.find((a) => a.id === recentlyOpened)?.name}</strong> at {apps.find((a) => a.id === recentlyOpened)?.url}...</span>
          </div>
          <span className="opacity-50">Opened in new tab</span>
        </div>
      )}

      {/* Empty State if filter yields zero matches */}
      {filteredApps.length === 0 && (
        <div className="themed-card rounded-3xl p-12 text-center max-w-md mx-auto my-12">
          <p className="font-display text-lg font-bold mb-2">No applications found</p>
          <p className="text-sm opacity-60 mb-4">
            Try adjusting your search query or select "All" categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="themed-send-btn px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* VIEW MODE 1: Launchpad App Showcase Grid (Only Icons & Names connected to URLs) */}
      {viewMode === 'launchpad' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredApps.map((app) => {
            const hasImgError = imgErrors[app.id];
            return (
              <a
                key={app.id}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLaunchApp(app)}
                className="group relative flex flex-col items-center text-center p-5 sm:p-7 rounded-3xl themed-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                title={`Launch ${app.name} (${app.domain})`}
              >
                {/* Background Ambient Glow on Hover */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none"
                  style={{ backgroundColor: 'var(--accent)' }}
                />

                {/* Squircle App Icon Container */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-3xl p-3 sm:p-4 mb-3.5 sm:mb-4 flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 group-hover:border-white/25 transition-all duration-300 shadow-md group-hover:shadow-xl group-hover:scale-105">
                  {!hasImgError ? (
                    <img
                      src={app.icon}
                      alt={`${app.name} app icon`}
                      className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                      onError={() => handleImgError(app.id)}
                    />
                  ) : (
                    // Stylized zero-broken-image fallback container with vibrant monogram
                    <div className="w-full h-full rounded-2xl flex items-center justify-center font-display font-black text-2xl sm:text-3xl text-white shadow-inner bg-gradient-to-br from-[var(--accent)] to-black/60">
                      {app.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  {/* Corner Launch Arrow on Hover */}
                  <div
                    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-75 group-hover:scale-100 shadow-md"
                    style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* App Name */}
                <h3 className="font-display font-bold text-base sm:text-lg md:text-xl tracking-tight text-inherit group-hover:text-[var(--accent)] transition-colors">
                  {app.name}
                </h3>

                {/* Quiet Subtitle / Domain Metadata */}
                <span className="text-xs opacity-50 group-hover:opacity-85 transition-opacity mt-1 flex items-center gap-1 font-mono text-[11px]">
                  <span>{app.domain}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </span>
              </a>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: Compact List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredApps.map((app) => {
            const hasImgError = imgErrors[app.id];
            return (
              <a
                key={app.id}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLaunchApp(app)}
                className="group flex items-center justify-between p-4 sm:p-5 rounded-2xl themed-card hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl p-2 bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {!hasImgError ? (
                      <img
                        src={app.icon}
                        alt={`${app.name} icon`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        onError={() => handleImgError(app.id)}
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg flex items-center justify-center font-display font-bold text-sm text-white bg-gradient-to-br from-[var(--accent)] to-black/60">
                        {app.name.slice(0, 1)}
                      </div>
                    )}
                  </div>

                  {/* Name and Tagline */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-base sm:text-lg text-inherit group-hover:text-[var(--accent)] transition-colors">
                        {app.name}
                      </h3>
                      <span className="text-xs opacity-40 font-mono hidden sm:inline">
                        ({app.domain})
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm opacity-65 line-clamp-1">
                      {app.tagline}
                    </p>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium opacity-60 group-hover:opacity-100 hidden md:inline">
                    Launch
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                    style={{ backgroundColor: 'var(--btn-bg)' }}
                  >
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
};
