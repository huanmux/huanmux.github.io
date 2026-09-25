import React, { useEffect } from 'react';
import { CustomPageHeader } from './CustomPageHeader';
import { CustomPageDock } from './CustomPageDock';
import { Footer } from './Footer';
import { Users, Cpu, Target, ShieldCheck, Layers, Sparkles, MapPin } from 'lucide-react';

interface TeamPageProps {
  onGoHome: () => void;
  onNavigate: (slug: string) => void;
  onOpenThemeDrawer: () => void;
}

interface TeamMember {
  name: string;
  domain: string;
  location: string;
  focus: string;
  description: string;
  icon: React.ReactNode;
  initials: string;
  capabilities: string[];
}

export const TeamPage: React.FC<TeamPageProps> = ({
  onGoHome,
  onNavigate,
  onOpenThemeDrawer,
}) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Team — HuanMux';
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => {
      document.title = originalTitle;
    };
  }, []);

  const members: TeamMember[] = [
    {
      name: 'Dewan Mukto',
      domain: 'Operations',
      location: 'Sylhet, Bangladesh',
      focus: 'Execution, Technical Systems, and Sovereign Publishing',
      description:
        'Oversees core systems operations, computational pipelines, product deployment, cross-disciplinary execution, and the realization of software releases across the HuanMux ecosystem.',
      icon: <Cpu className="w-5 h-5 text-[var(--accent)]" />,
      initials: 'DM',
      capabilities: [
        'Computational Systems',
        'Full-Stack Architecture',
        'Interface Engineering',
        'Publishing Operations',
      ],
    },
    {
      name: 'Mahir Chowdhury',
      domain: 'Strategy',
      location: 'New York, USA',
      focus: 'Long-term Roadmaps, Ecosystem Positioning, and Research Trajectory',
      description:
        'Directs organizational foresight, venture expansion, multi-sector research alignment, and the strategic positioning of digital products within global software ecosystems.',
      icon: <Target className="w-5 h-5 text-emerald-400" />,
      initials: 'MC',
      capabilities: [
        'Strategic Planning',
        'Venture Architecture',
        'Ecosystem Growth',
        'Market Research',
      ],
    },
    {
      name: 'Abrar Ahmed',
      domain: 'Cybersecurity',
      location: 'Dhaka, Bangladesh',
      focus: 'Threat Modeling, Cryptographic Integrity, and Systems Hardening',
      description:
        'Safeguards technical infrastructure, data privacy mechanisms, runtime security, access boundary verification, and continuous cryptographic hygiene across all applications and client runtimes.',
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
      initials: 'AA',
      capabilities: [
        'Threat Modeling',
        'Information Security',
        'Cryptographic Hygiene',
        'Infrastructure Hardening',
      ],
    },
  ];

  return (
    <div className="relative min-h-screen themed-bg themed-text flex flex-col justify-between selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
      {/* Top Corporate Navigation */}
      <CustomPageHeader
        onGoHome={onGoHome}
        onNavigate={onNavigate}
        currentSlug="team"
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 md:px-8 py-10 sm:py-16 z-10">
        {/* Category breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold mb-3">
          <Users className="w-3.5 h-3.5" />
          <span>Collective &amp; Leadership</span>
        </div>

        {/* Page Title */}
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          The HuanMux Team
        </h1>

        {/* Philosophy Callout: Domains of Work */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-inherit/15 backdrop-blur-md mb-12">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center shrink-0 mt-0.5">
              <Layers className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <div>
              <h2 className="text-sm font-mono uppercase tracking-wider text-[var(--accent)] font-bold mb-1">
                Our Organizational Model
              </h2>
              <p className="text-base sm:text-lg font-bold tracking-tight mb-2">
                This business doesn&apos;t define roles, but instead domains of work.
              </p>
              <p className="text-xs sm:text-sm opacity-75 leading-relaxed max-w-3xl">
                We believe rigid corporate titles create organizational latency and artificial silos. At HuanMux, individuals are entrusted with complete sovereign stewardship over entire domains of work — bridging thinking, engineering, and execution seamlessly.
              </p>
            </div>
          </div>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {members.map((member) => (
            <div
              key={member.name}
              className="p-6 rounded-2xl bg-white/5 border border-inherit/15 hover:border-[var(--accent)]/40 transition-all flex flex-col justify-between backdrop-blur-sm group"
            >
              <div>
                {/* Header: Initials Avatar + Domain Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-inherit/20 font-display font-extrabold text-base flex items-center justify-center tracking-wider text-inherit shadow-xs">
                    {member.initials}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-inherit/10 text-xs font-mono">
                    {member.icon}
                    <span className="font-bold text-inherit">{member.domain}</span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-display text-xl font-bold tracking-tight mb-1 group-hover:text-[var(--accent)] transition-colors">
                  {member.name}
                </h3>

                {/* Location */}
                <div className="text-xs font-mono text-[var(--accent)] font-medium mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  <span>{member.location}</span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm opacity-75 leading-relaxed mb-6">
                  {member.description}
                </p>
              </div>

              {/* Core Domain Responsibilities */}
              <div className="pt-4 border-t border-inherit/10">
                <div className="text-[11px] uppercase font-mono tracking-wider opacity-60 font-semibold mb-2">
                  Key Focus Areas
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {member.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="text-[11px] opacity-75 font-mono"
                    >
                      • {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
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
