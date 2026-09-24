import React from 'react';
import { ArrowDown, LayoutGrid } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  appCount: number;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, appCount }) => {
  return (
    <section className="relative min-h-[75vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-12 pb-16 z-10">
      {/* Brand Icon / Logo with tactile glow */}
      <div className="relative mb-6 sm:mb-8 group">
        <div
          className="absolute -inset-2 rounded-3xl opacity-40 blur-xl group-hover:opacity-75 transition-opacity"
          style={{
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          }}
        />
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1 border border-white/15">
          <img
            src="https://huanmux.vercel.app/assets/logo/icon.png"
            alt="HuanMux Logo"
            className="w-full h-full object-cover filter drop-shadow-md"
            onError={(e) => {
              // Fallback to local vector if offline
              e.currentTarget.src = '/mux-appicon.png';
            }}
          />
        </div>
      </div>

      {/* Hero Headline with theme-adaptive animated gradient */}
      <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.08] max-w-4xl mx-auto mb-6 text-balance">
        Reach for the <span className="theme-gradient-word">greatest</span> heights
      </h1>

      {/* Refined Description text from HuanMux original */}
      <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto opacity-75 font-normal leading-relaxed mb-10 text-balance">
        The home of everything related to the cultivation of art, science, technology, research, and entertainment.
      </p>

      {/* Action Area */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <button
          onClick={onExplore}
          className="themed-send-btn px-6 py-3.5 rounded-2xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2 group"
        >
          <LayoutGrid className="w-4 h-4 group-hover:rotate-6 transition-transform" />
          <span>Explore Apps ({appCount})</span>
          <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
};
