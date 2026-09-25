import React, { useEffect } from 'react';
import { CustomPageHeader } from './CustomPageHeader';
import { CustomPageDock } from './CustomPageDock';
import { Footer } from './Footer';
import {
  Users,
  Cpu,
  Target,
  ShieldCheck,
  Layers,
  MapPin,
  Code2,
  Megaphone,
  Palette,
  Music,
  Film,
  Compass
} from 'lucide-react';

interface TeamPageProps {
  onGoHome: () => void;
  onNavigate: (slug: string) => void;
  onOpenThemeDrawer: () => void;
}

interface CurrentMember {
  name: string;
  domain: string;
  location: string;
  focus: string;
  description: string;
  icon: React.ReactNode;
  capabilities: string[];
}

interface ExStaffMember {
  name: string;
  location: string;
  department: string;
}

export const TeamPage: React.FC<TeamPageProps> = ({
  onGoHome,
  onNavigate,
  onOpenThemeDrawer,
}) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Team — Mux';
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => {
      document.title = originalTitle;
    };
  }, []);

  const currentMembers: CurrentMember[] = [
    {
      name: 'Dewan Mukto',
      domain: 'Operations',
      location: 'Sylhet, Bangladesh',
      focus: 'Execution, Technical Systems, and Sovereign Publishing',
      description:
        'Oversees core systems operations, computational pipelines, product deployment, cross-disciplinary execution, and the realization of software releases across the Mux ecosystem.',
      icon: <Cpu className="w-4 h-4 text-[var(--accent)]" />,
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
      icon: <Target className="w-4 h-4 text-emerald-400" />,
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
      icon: <ShieldCheck className="w-4 h-4 text-purple-400" />,
      capabilities: [
        'Threat Modeling',
        'Information Security',
        'Cryptographic Hygiene',
        'Infrastructure Hardening',
      ],
    },
    {
      name: 'Asif Imtiaz Chowdhury',
      domain: 'Software/IT',
      location: 'Sylhet, Bangladesh',
      focus: 'Systems Engineering, Full-Stack Architecture, and Cloud Infrastructure',
      description:
        'Engineers distributed software systems, backend microservices, real-time data pipelines, and internal developer tooling across Mux application environments.',
      icon: <Code2 className="w-4 h-4 text-sky-400" />,
      capabilities: [
        'Full-Stack Engineering',
        'Database Architecture',
        'Cloud Infrastructure',
        'Systems Integration',
      ],
    },
    {
      name: 'Nafis Hossain Farabi',
      domain: 'Software/IT',
      location: 'Kushtia, Bangladesh',
      focus: 'Frontend Runtimes, Client Architecture, and Application Performance',
      description:
        'Specializes in modern frontend ecosystems, performance optimization, responsive interface pipelines, and robust TypeScript client architectures.',
      icon: <Code2 className="w-4 h-4 text-cyan-400" />,
      capabilities: [
        'TypeScript Engineering',
        'UI Runtimes',
        'Performance Profiling',
        'Reactive Architectures',
      ],
    },
    {
      name: 'Ahnaf bin Enam',
      domain: 'Marketing',
      location: 'Dhaka, Bangladesh',
      focus: 'Ecosystem Distribution, Product Narrative, and Growth Strategy',
      description:
        'Drives global distribution initiatives, ecosystem narratives, digital brand positioning, and multi-channel reach for Mux tools and technical publications.',
      icon: <Megaphone className="w-4 h-4 text-amber-400" />,
      capabilities: [
        'Distribution Channels',
        'Technical Marketing',
        'Brand Identity',
        'Community Growth',
      ],
    },
    {
      name: 'Mahraf Murtoza',
      domain: 'Strategy',
      location: 'Dhaka, Bangladesh',
      focus: 'Organizational Direction, Competitive Analysis, and Strategic Operations',
      description:
        'Analyzes emerging market shifts, develops cross-domain strategy, orchestrates product positioning, and aligns long-term organizational objectives.',
      icon: <Compass className="w-4 h-4 text-rose-400" />,
      capabilities: [
        'Competitive Intelligence',
        'Strategic Planning',
        'Research Analysis',
        'Operational Alignment',
      ],
    },
  ];

  const exStaffMembers: ExStaffMember[] = [
    { name: 'Emily Barrera Simon', location: 'USA', department: 'Music' },
    { name: 'Tazim Ezaz', location: 'Bangladesh', department: 'Software/IT' },
    { name: 'Shayonton Chakraborty', location: 'Bangladesh', department: 'Strategy' },
    { name: 'Barnali Debnath', location: 'Bangladesh', department: 'Art/Design' },
    { name: 'Maliha Rasul', location: 'Bangladesh', department: 'Art/Design' },
    { name: 'Tasneem Islam', location: 'Bangladesh', department: 'Art/Design' },
    { name: 'Syeda Rizwana', location: 'Bangladesh', department: 'Art/Design' },
    { name: 'Michael Paul Eppert', location: 'USA', department: 'Marketing' },
    { name: 'Aryan Majid', location: 'Bangladesh', department: 'Animation' },
    { name: 'Daniel bin Mohsin', location: 'Bangladesh', department: 'Strategy' },
    { name: 'Shah Farhan Alam', location: 'Bangladesh', department: 'Strategy' },
    { name: 'Ashfaqul Awal Himel', location: 'Bangladesh', department: 'Art/Design' },
    { name: 'Dewan Mahbubul Islam', location: 'Bangladesh', department: 'Art/Design' },
    { name: 'Zelqad Hassan Shish', location: 'Bangladesh', department: 'Art/Design' },
    { name: 'Ekhtear Ahmed Fahim', location: 'Bangladesh', department: 'Marketing' },
    { name: 'Md Jawad Iqbal', location: 'Bangladesh', department: 'Art/Design' },
    { name: 'Monojit Dhar Rommyo', location: 'Bangladesh', department: 'Strategy' },
    { name: 'Rumman Saad', location: 'Bangladesh', department: 'Strategy' },
    { name: 'Tasmina Habiba', location: 'Bangladesh', department: 'Art/Design' },
    { name: 'Israt Jahan', location: 'Bangladesh', department: 'Art/Design' },
    { name: 'Julia Mendryshora', location: 'Ukraine', department: 'Art/Design' },
    { name: 'Bethany L.', location: 'USA', department: 'Art/Design' },
    { name: 'Charista wari Sutiandi', location: 'Indonesia', department: 'Art/Design' },
    { name: 'Udit Deb Ucchas', location: 'Bangladesh', department: 'Marketing' },
    { name: 'Rotnodwip Das Orvik', location: 'Canada', department: 'Strategy' },
    { name: 'Omar Sudaisi', location: 'Bangladesh', department: 'Marketing' },
    { name: 'Младен Цвијовић', location: 'Croatia', department: 'Software/IT' },
    { name: 'Al-Zawad Islam Shadman', location: 'Bangladesh', department: 'Strategy' },
    { name: 'Mahdi Faiyaz Okib', location: 'Canada', department: 'Strategy' },
    { name: 'Ashrafull Islam Shawon', location: 'Bangladesh', department: 'Art/Design' },
    { name: 'Ahmed Yashfi', location: 'Bangladesh', department: 'Art/Design' },
    { name: 'Sabyasachi Nirjhar', location: 'Bangladesh', department: 'Strategy' },
    { name: 'Soumitra Mithun', location: 'Bangladesh', department: 'Strategy' },
    { name: 'Fahim Imtiaz', location: 'Bangladesh', department: 'Strategy' },
  ];

  const getDepartmentIcon = (dept: string) => {
    switch (dept) {
      case 'Software/IT':
        return <Code2 className="w-3.5 h-3.5 text-sky-400" />;
      case 'Strategy':
        return <Target className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Marketing':
        return <Megaphone className="w-3.5 h-3.5 text-amber-400" />;
      case 'Art/Design':
        return <Palette className="w-3.5 h-3.5 text-purple-400" />;
      case 'Music':
        return <Music className="w-3.5 h-3.5 text-pink-400" />;
      case 'Animation':
        return <Film className="w-3.5 h-3.5 text-orange-400" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />;
    }
  };

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
          The Mux Team
        </h1>

        {/* Philosophy Callout: Domains of Work */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-inherit/15 backdrop-blur-md mb-10">
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
                We believe rigid corporate titles create organizational latency and artificial silos. At Mux, individuals are entrusted with complete sovereign stewardship over entire domains of work — bridging thinking, engineering, and execution seamlessly.
              </p>
            </div>
          </div>
        </div>

        {/* Horizontal Line with Centered Text: "Current Staff" */}
        <div className="relative my-10 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-inherit/20" />
          </div>
          <div className="relative px-5 py-1.5 rounded-full bg-white/10 dark:bg-black/40 border border-inherit/20 backdrop-blur-md text-xs sm:text-sm font-mono uppercase tracking-widest text-[var(--accent)] font-bold shadow-xs">
            Current Staff
          </div>
        </div>

        {/* Current Staff Grid (Images and image frames removed) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {currentMembers.map((member) => (
            <div
              key={member.name}
              className="p-6 rounded-2xl bg-white/5 border border-inherit/15 hover:border-[var(--accent)]/40 transition-all flex flex-col justify-between backdrop-blur-sm group"
            >
              <div>
                {/* Domain & Department Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-inherit/15 text-xs font-mono">
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

        {/* Horizontal Line with Centered Text: "Ex-Staff" */}
        <div className="relative my-10 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-inherit/20" />
          </div>
          <div className="relative px-5 py-1.5 rounded-full bg-white/10 dark:bg-black/40 border border-inherit/20 backdrop-blur-md text-xs sm:text-sm font-mono uppercase tracking-widest text-[var(--accent)] font-bold shadow-xs">
            Ex-Staff
          </div>
        </div>

        {/* Ex-Staff List Section (Names, Departments, Locations) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-12">
          {exStaffMembers.map((staff, idx) => (
            <div
              key={`${staff.name}-${idx}`}
              className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-inherit/10 hover:border-inherit/25 transition-all flex items-center justify-between gap-3 group"
            >
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm tracking-tight truncate group-hover:text-[var(--accent)] transition-colors">
                  {staff.name}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono opacity-65 mt-0.5">
                  <MapPin className="w-3 h-3 text-[var(--accent)] shrink-0 opacity-80" />
                  <span className="truncate">{staff.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-inherit/10 text-[11px] font-mono shrink-0">
                {getDepartmentIcon(staff.department)}
                <span className="font-medium text-inherit">{staff.department}</span>
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
