import React from 'react';
import { Palette, Cpu, Compass, Film, ArrowRight } from 'lucide-react';

interface BrandPillarsProps {
  onScrollToApps: () => void;
}

export const BrandPillars: React.FC<BrandPillarsProps> = ({ onScrollToApps }) => {
  const pillars = [
    {
      num: '01',
      title: 'Art & Aesthetics',
      subtitle: 'Creative Expression & Infinite Canvases',
      description:
        'Cultivating digital paint, vector geometry, and procedural styling engines such as BRUSH and Makron to empower modern visual artists.',
      icon: Palette,
      highlight: 'Expressive Tools',
    },
    {
      num: '02',
      title: 'Science & Intelligence',
      subtitle: 'Cognitive Frontiers & Synthetic Reasoning',
      description:
        'Advancing conversational AI architectures and generative systems with MuxAI and Serafina, grounding ambient computing into practical reality.',
      icon: Cpu,
      highlight: 'Cognitive Synergy',
    },
    {
      num: '03',
      title: 'Technology & Research',
      subtitle: 'Decentralized Protocols & Frictionless Flow',
      description:
        'Building high-velocity peer-to-peer file relays via Send, lightweight web shaders, and resilient cloud-native application runtimes.',
      icon: Compass,
      highlight: 'Protocol Velocity',
    },
    {
      num: '04',
      title: 'Entertainment & Media',
      subtitle: 'Sensory Audio Spaces & Virtual Worlds',
      description:
        'Crafting spatial acoustic dimensions with Vibe, social metaverses with Liaoverse, and immersive interactive play through Excite.',
      icon: Film,
      highlight: 'Immersive Realities',
    },
  ];

  return (
    <section id="pillars" className="scroll-mt-20 py-20 px-4 sm:px-8 max-w-7xl mx-auto z-10 relative">
      {/* Editorial Header */}
      <div className="max-w-3xl mb-14">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase opacity-60 mb-3">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
          <span>Foundational Principles</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          Cultivating the realms of human curiosity
        </h2>
        <p className="text-base sm:text-lg opacity-70 mt-3 leading-relaxed">
          HuanMux operates at the intersection of creative intuition and rigorous engineering, incubating software that expands perception.
        </p>
      </div>

      {/* Asymmetric 4-Card Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.num}
              className="themed-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
            >
              <div>
                {/* Top bar with Editorial Number and Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-sm font-semibold opacity-40 group-hover:opacity-80 transition-opacity">
                    {pillar.num}
                  </span>
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent)' }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h3 className="font-display text-xl sm:text-2xl font-bold mb-1 group-hover:text-[var(--accent)] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium opacity-50 mb-4">
                  {pillar.subtitle}
                </p>

                {/* Description */}
                <p className="text-sm sm:text-base opacity-75 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Unboxed Metadata & Action */}
              <div className="mt-8 pt-4 border-t border-inherit/10 flex items-center justify-between text-xs opacity-60 group-hover:opacity-100 transition-opacity">
                <span>{pillar.highlight}</span>
                <button
                  onClick={onScrollToApps}
                  className="flex items-center gap-1 font-semibold hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  <span>Explore Apps</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
