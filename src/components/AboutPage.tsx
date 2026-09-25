import React, { useEffect } from 'react';
import { CustomPageHeader } from './CustomPageHeader';
import { CustomPageDock } from './CustomPageDock';
import { Footer } from './Footer';
import { Code2, Palette, Megaphone, Sparkles, Compass, Shield, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onGoHome: () => void;
  onNavigate: (slug: string) => void;
  onOpenThemeDrawer: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onGoHome,
  onNavigate,
  onOpenThemeDrawer,
}) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'About — HuanMux';
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => {
      document.title = originalTitle;
    };
  }, []);

  return (
    <div className="relative min-h-screen themed-bg themed-text flex flex-col justify-between selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
      {/* Top Corporate Navigation */}
      <CustomPageHeader
        onGoHome={onGoHome}
        onNavigate={onNavigate}
        currentSlug="about"
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 md:px-8 py-10 sm:py-16 z-10">
        {/* Breadcrumb / Category indicator */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Brand &amp; Sovereign Studio</span>
        </div>

        {/* Page Title */}
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 sm:mb-6">
          About HuanMux
        </h1>
        <p className="text-base sm:text-lg opacity-80 leading-relaxed max-w-2xl mb-12">
          An independent creative studio and software publishing brand founded by Dewan Mukto, dedicated to the cultivation of art, science, technology, research, and entertainment.
        </p>

        {/* Founder Story Section */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-inherit/15 backdrop-blur-md shadow-sm mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">The Origin of HuanMux</h2>
              <p className="text-xs opacity-60">Founded by Dewan Mukto</p>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base opacity-85 leading-relaxed">
            <p>
              HuanMux was born out of a clear realization by founder <strong className="font-semibold text-inherit">Dewan Mukto</strong>: modern computational work has become excessively fragmented, isolating engineering from aesthetics and strategy.
            </p>
            <p>
              Drawing upon extensive knowledge and years of hands-on experience across <strong className="text-inherit">computer programming</strong>, <strong className="text-inherit">interface and visual design</strong>, and <strong className="text-inherit">growth marketing</strong>, Dewan Mukto decided to establish his own independent brand to publish original software works, research initiatives, and creative tools directly to the world without bureaucratic dilution.
            </p>
            <p>
              HuanMux operates as an autonomous publishing house and engineering laboratory where software architecture, typography, algorithmic reasoning, and user distribution coalesce into cohesive, human-centered experiences.
            </p>
          </div>
        </section>

        {/* The 3 Core Pillars of Founder Experience */}
        <div className="mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-bold mb-4">
            Foundational Knowledge Disciplines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pillar 1: Programming */}
            <div className="p-5 rounded-2xl bg-white/5 border border-inherit/10 flex flex-col justify-between hover:border-[var(--accent)]/40 transition-colors">
              <div>
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                  <Code2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base mb-1.5">Programming</h3>
                <p className="text-xs sm:text-sm opacity-70 leading-relaxed">
                  Deep technical foundations across systems engineering, modern web runtimes, generative models, and scalable architectures.
                </p>
              </div>
            </div>

            {/* Pillar 2: Designing */}
            <div className="p-5 rounded-2xl bg-white/5 border border-inherit/10 flex flex-col justify-between hover:border-[var(--accent)]/40 transition-colors">
              <div>
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                  <Palette className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base mb-1.5">Designing</h3>
                <p className="text-xs sm:text-sm opacity-70 leading-relaxed">
                  Crafting refined visual systems, rigorous typography, spatial aesthetics, and zero-compromise human interfaces.
                </p>
              </div>
            </div>

            {/* Pillar 3: Marketing */}
            <div className="p-5 rounded-2xl bg-white/5 border border-inherit/10 flex flex-col justify-between hover:border-[var(--accent)]/40 transition-colors">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                  <Megaphone className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base mb-1.5">Marketing</h3>
                <p className="text-xs sm:text-sm opacity-70 leading-relaxed">
                  Strategic brand building, distribution channels, narrative precision, and sustainable ecosystem positioning.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Organization & Portfolio Affiliation */}
        <div className="p-6 rounded-2xl bg-white/5 border border-inherit/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <div>
              <div className="text-xs uppercase font-mono tracking-wider opacity-60">Corporate Affiliation</div>
              <div className="font-bold text-sm sm:text-base">Part of the Senturisk Portfolio of Brands</div>
            </div>
          </div>
          <a
            href="https://senturisk.github.io/public/"
            target="_blank"
            rel="noopener noreferrer"
            className="themed-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-all shrink-0 cursor-pointer"
          >
            <span>Learn About Senturisk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />

      <CustomPageDock
        onGoHome={onGoHome}
        onOpenThemeDrawer={onOpenThemeDrawer}
      />
    </div>
  );
};
