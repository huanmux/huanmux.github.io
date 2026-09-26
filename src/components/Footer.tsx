import React from 'react';
import { ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate?: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (slug: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNavigate && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      onNavigate(slug);
    }
  };

  return (
    <footer className="mt-20 border-t border-inherit/10 py-12 px-4 sm:px-8 max-w-7xl mx-auto z-10 relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-inherit/10">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: 'var(--accent)' }}
            />
            <span>HuanMux</span>
          </div>
          <p className="text-xs sm:text-sm opacity-60 mt-1 max-w-sm">
            Cultivating art, science, technology, research &amp; entertainment.
          </p>
        </div>

        {/* Social and Community Links */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-medium opacity-70">
          <a
            href="https://github.com/huanmux"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-100 transition-opacity flex items-center gap-1"
          >
            <span>GitHub</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a
            href="https://x.com/huanmux"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-100 transition-opacity flex items-center gap-1"
          >
            <span>X (Twitter)</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a
            href="https://www.linkedin.com/company/huanmux"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-100 transition-opacity flex items-center gap-1"
          >
            <span>LinkedIn</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a
            href="https://instagram.com/huanmux"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-100 transition-opacity flex items-center gap-1"
          >
            <span>Instagram</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Exploration & Machine Discovery Links */}
      <div className="py-4 border-b border-inherit/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono opacity-65">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <a
            href="/posts"
            onClick={handleLinkClick('/posts')}
            className="hover:opacity-100 hover:text-[var(--accent)] transition-all"
          >
            Posts &amp; Guides
          </a>
          <a
            href="/about"
            onClick={handleLinkClick('/about')}
            className="hover:opacity-100 hover:text-[var(--accent)] transition-all"
          >
            About
          </a>
          <a
            href="/team"
            onClick={handleLinkClick('/team')}
            className="hover:opacity-100 hover:text-[var(--accent)] transition-all"
          >
            Team
          </a>
          <a
            href="/careers"
            onClick={handleLinkClick('/careers')}
            className="hover:opacity-100 hover:text-[var(--accent)] transition-all"
          >
            Careers
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px]">
          <span className="opacity-40 uppercase tracking-widest text-[10px]">Machine Feeds:</span>
          <a
            href="/sitemap.xml"
            onClick={handleLinkClick('/sitemap.xml')}
            className="px-2 py-0.5 rounded bg-white/5 border border-inherit/15 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
          >
            sitemap.xml
          </a>
          <a
            href="/robots.txt"
            onClick={handleLinkClick('/robots.txt')}
            className="px-2 py-0.5 rounded bg-white/5 border border-inherit/15 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
          >
            robots.txt
          </a>
          <a
            href="/llms.txt"
            onClick={handleLinkClick('/llms.txt')}
            className="px-2 py-0.5 rounded bg-white/5 border border-inherit/15 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
          >
            llms.txt
          </a>
        </div>
      </div>

      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-50">
        <p>© 2026 HuanMux. All rights reserved.</p>
        <p className="flex items-center gap-1">
          <span>
            Part of the{' '}
            <a
              href="https://senturisk.github.io/public/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-100 transition-opacity font-medium hover:text-[var(--accent)]"
            >
              Senturisk
            </a>{' '}
            portfolio of brands
          </span>
          <Heart className="w-3 h-3 text-[var(--accent)] fill-current" />
        </p>
      </div>
    </footer>
  );
};
