import React from 'react';
import { ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
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

      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-50">
        <p>© 2026 HuanMux. All rights reserved.</p>
        <p className="flex items-center gap-1">
          <span>Part of the Senturisk portfolio of brands</span>
          <Heart className="w-3 h-3 text-[var(--accent)] fill-current" />
        </p>
      </div>
    </footer>
  );
};
