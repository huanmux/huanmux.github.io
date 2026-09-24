import React from 'react';
import { Sparkles, Globe, Terminal, ShieldCheck } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="scroll-mt-20 py-20 px-4 sm:px-8 max-w-7xl mx-auto z-10 relative">
      <div className="themed-card rounded-3xl p-8 sm:p-12 relative overflow-hidden backdrop-blur-xl">
        {/* Subtle Accent Radial Orb in Corner */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-20 pointer-events-none blur-3xl"
          style={{ backgroundColor: 'var(--accent)' }}
        />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase opacity-60 mb-3">
            <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            <span>The Organization</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Building software with poise, depth, and human warmth.
          </h2>

          <p className="text-base sm:text-lg opacity-80 leading-relaxed mb-8">
            HuanMux (also known as Mux) was founded to unite creative arts, computational intelligence, and playful curiosity into cohesive experiences. Whether developing generative reasoning frameworks like Serafina and MuxAI, or craft-first visual tools like BRUSH and Makron, our creations are built to serve imagination.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-inherit/15">
            <div>
              <div className="flex items-center gap-2 font-display font-bold text-sm mb-1.5">
                <Globe className="w-4 h-4 opacity-70" />
                <span>Open Protocols</span>
              </div>
              <p className="text-xs opacity-65 leading-relaxed">
                Interconnected web-native architectures accessible anywhere without barriers.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 font-display font-bold text-sm mb-1.5">
                <Terminal className="w-4 h-4 opacity-70" />
                <span>Zero Slop Aesthetic</span>
              </div>
              <p className="text-xs opacity-65 leading-relaxed">
                Refined typography, tactile squircle interfaces, and hardware-accelerated ambient light.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 font-display font-bold text-sm mb-1.5">
                <ShieldCheck className="w-4 h-4 opacity-70" />
                <span>User Primacy</span>
              </div>
              <p className="text-xs opacity-65 leading-relaxed">
                Lightweight footprint, zero telemetry bloat, and instantaneous application launch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
