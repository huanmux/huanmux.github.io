import React, { useState, useEffect, useMemo } from 'react';
import { CustomPageHeader } from './CustomPageHeader';
import { CustomPageDock } from './CustomPageDock';
import { Footer } from './Footer';
import {
  FileCode2,
  Bot,
  Sparkles,
  Copy,
  Check,
  Download,
  ExternalLink,
  RefreshCw,
  Search,
  Globe,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  generateClientSitemapXml,
  generateClientRobotsTxt,
  generateClientLlmsTxt,
  generateClientLlmsFullTxt,
  CANONICAL_BASE_URL,
} from '../utils/seoGeneratorClient';

export type SeoTab = 'sitemap' | 'robots' | 'llms' | 'llms-full';

interface SeoViewerPageProps {
  initialTab?: SeoTab;
  onGoHome: () => void;
  onNavigate: (path: string) => void;
  onOpenThemeDrawer: () => void;
}

export const SeoViewerPage: React.FC<SeoViewerPageProps> = ({
  initialTab = 'sitemap',
  onGoHome,
  onNavigate,
  onOpenThemeDrawer,
}) => {
  const [activeTab, setActiveTab] = useState<SeoTab>(initialTab);
  const [copied, setCopied] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const titles: Record<SeoTab, string> = {
      sitemap: 'Sitemap.xml — Mux Automated Generator',
      robots: 'Robots.txt — Mux Crawler Policy',
      llms: 'llms.txt — Mux AI & LLM Discovery',
      'llms-full': 'llms-full.txt — Mux Full LLM Corpus',
    };
    document.title = titles[activeTab] || 'SEO & LLM Generator — Mux';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  // Generate content dynamically
  const content = useMemo(() => {
    // refreshCount is a dependency to force re-computation on manual refresh
    void refreshCount;
    switch (activeTab) {
      case 'sitemap':
        return generateClientSitemapXml(CANONICAL_BASE_URL);
      case 'robots':
        return generateClientRobotsTxt(CANONICAL_BASE_URL);
      case 'llms':
        return generateClientLlmsTxt(CANONICAL_BASE_URL);
      case 'llms-full':
        return generateClientLlmsFullTxt(CANONICAL_BASE_URL);
      default:
        return '';
    }
  }, [activeTab, refreshCount]);

  const fileInfo = useMemo(() => {
    switch (activeTab) {
      case 'sitemap':
        return {
          filename: 'sitemap.xml',
          mime: 'application/xml',
          description:
            'Dynamic XML sitemap indexing all sovereign pages, posts, and architectural deep-dives with W3C lastmod, changefreq, and priority metadata.',
          badge: 'XML Protocol 0.9',
          rawUrl: '/sitemap.xml',
        };
      case 'robots':
        return {
          filename: 'robots.txt',
          mime: 'text/plain',
          description:
            'Standard crawler directives allowing search engines and explicit AI/LLM ingestion agents (GPTBot, ClaudeBot, PerplexityBot) with direct sitemap & llms.txt declarations.',
          badge: 'Standard RFC 9309',
          rawUrl: '/robots.txt',
        };
      case 'llms':
        return {
          filename: 'llms.txt',
          mime: 'text/plain',
          description:
            'Emerging web standard (llmstxt.org) providing structured Markdown index of the entire website for LLMs, reasoning models, and AI code agents.',
          badge: 'llmstxt.org Standard',
          rawUrl: '/llms.txt',
        };
      case 'llms-full':
        return {
          filename: 'llms-full.txt',
          mime: 'text/plain',
          description:
            'Full documentation corpus in a single plaintext stream for large-context language models (128k+ tokens) and RAG vector ingestion.',
          badge: 'Full Context Corpus',
          rawUrl: '/llms-full.txt',
        };
    }
  }, [activeTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: fileInfo.mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileInfo.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshCount((prev) => prev + 1);
      setIsRefreshing(false);
    }, 350);
  };

  const filteredContent = useMemo(() => {
    if (!filterQuery.trim()) return content;
    const lines = content.split('\n');
    const matched = lines.filter((line) =>
      line.toLowerCase().includes(filterQuery.toLowerCase())
    );
    return matched.join('\n');
  }, [content, filterQuery]);

  const lineCount = content.split('\n').length;
  const byteSize = new TextEncoder().encode(content).length;
  const formattedSize =
    byteSize < 1024
      ? `${byteSize} B`
      : `${(byteSize / 1024).toFixed(1)} KB`;

  return (
    <div className="relative min-h-screen themed-bg themed-text flex flex-col justify-between selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
      {/* Header */}
      <CustomPageHeader
        onGoHome={onGoHome}
        onNavigate={onNavigate}
        onGoToPosts={() => onNavigate('/posts')}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono opacity-70 mb-6">
          <button
            onClick={onGoHome}
            className="hover:text-[var(--accent)] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-[var(--accent)] font-semibold">SEO &amp; LLM Generator</span>
        </div>

        {/* Title section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-inherit/15 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Automated Dynamic Generator</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
            Discovery &amp; LLM Infrastructure
          </h1>
          <p className="text-sm sm:text-base opacity-75 max-w-2xl leading-relaxed">
            Automated, dynamic generation of <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-white/10 text-[var(--accent)]">sitemap.xml</code>, <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-white/10 text-[var(--accent)]">robots.txt</code>, and <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-white/10 text-[var(--accent)]">llms.txt</code>. Keeps search engines and modern AI reasoning engines synchronized with all sovereign publications.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
              activeTab === 'sitemap'
                ? 'bg-[var(--accent)]/15 border-[var(--accent)] text-[var(--accent)] shadow-md'
                : 'bg-white/5 border-inherit/15 opacity-70 hover:opacity-100 hover:bg-white/10'
            }`}
          >
            <Globe className="w-4 h-4 shrink-0" />
            <div className="text-left overflow-hidden truncate">
              <span className="block font-bold">sitemap.xml</span>
              <span className="text-[10px] opacity-70 block font-normal">Search Engine Map</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('robots')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
              activeTab === 'robots'
                ? 'bg-[var(--accent)]/15 border-[var(--accent)] text-[var(--accent)] shadow-md'
                : 'bg-white/5 border-inherit/15 opacity-70 hover:opacity-100 hover:bg-white/10'
            }`}
          >
            <Bot className="w-4 h-4 shrink-0" />
            <div className="text-left overflow-hidden truncate">
              <span className="block font-bold">robots.txt</span>
              <span className="text-[10px] opacity-70 block font-normal">Crawler Policy</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('llms')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
              activeTab === 'llms'
                ? 'bg-[var(--accent)]/15 border-[var(--accent)] text-[var(--accent)] shadow-md'
                : 'bg-white/5 border-inherit/15 opacity-70 hover:opacity-100 hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <div className="text-left overflow-hidden truncate">
              <span className="block font-bold">llms.txt</span>
              <span className="text-[10px] opacity-70 block font-normal">AI Context Standard</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('llms-full')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
              activeTab === 'llms-full'
                ? 'bg-[var(--accent)]/15 border-[var(--accent)] text-[var(--accent)] shadow-md'
                : 'bg-white/5 border-inherit/15 opacity-70 hover:opacity-100 hover:bg-white/10'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <div className="text-left overflow-hidden truncate">
              <span className="block font-bold">llms-full.txt</span>
              <span className="text-[10px] opacity-70 block font-normal">Full Knowledge Corpus</span>
            </div>
          </button>
        </div>

        {/* File Metadata Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-inherit/15 mb-6 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-sm sm:text-base font-bold text-[var(--accent)]">
                  /{fileInfo.filename}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 border border-inherit/20 font-mono">
                  {fileInfo.badge}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  Dynamic &bull; Live
                </span>
              </div>
              <p className="text-xs sm:text-sm opacity-75 max-w-2xl leading-relaxed">
                {fileInfo.description}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={handleManualRefresh}
                title="Re-run dynamic generator"
                className="themed-btn p-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[var(--accent)]' : ''}`}
                />
                <span className="hidden sm:inline">Regenerate</span>
              </button>

              <button
                onClick={handleCopy}
                className="themed-btn p-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                className="themed-send-btn p-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>

              <a
                href={fileInfo.rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="themed-btn p-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer opacity-80 hover:opacity-100 transition-all"
                title="Open direct HTTP raw endpoint in browser"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Raw Endpoint</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-4 pt-3 border-t border-inherit/10 flex flex-wrap items-center gap-4 sm:gap-8 text-xs font-mono opacity-70">
            <div>
              <span className="opacity-60">Lines: </span>
              <span className="font-semibold text-[var(--accent)]">{lineCount}</span>
            </div>
            <div>
              <span className="opacity-60">Payload Size: </span>
              <span className="font-semibold">{formattedSize}</span>
            </div>
            <div>
              <span className="opacity-60">MIME Type: </span>
              <span>{fileInfo.mime}</span>
            </div>
            <div>
              <span className="opacity-60">Sync Frequency: </span>
              <span>Automated On-the-fly</span>
            </div>
          </div>
        </div>

        {/* Content Viewer with Search */}
        <div className="rounded-2xl border border-inherit/15 bg-black/40 overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 py-3 bg-white/5 border-b border-inherit/10">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-[var(--accent)] opacity-80" />
              <span className="font-mono text-xs font-bold tracking-wider uppercase opacity-80">
                Generated Payload
              </span>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                placeholder="Filter output..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-white/10 border border-inherit/15 focus:outline-none focus:border-[var(--accent)] font-mono"
              />
            </div>
          </div>

          <pre className="p-4 sm:p-6 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed max-h-[600px] overflow-y-auto selection:bg-[var(--accent)] selection:text-white">
            <code>{filteredContent}</code>
          </pre>
        </div>

        {/* Technical Specification Footnote */}
        <div className="mt-8 p-5 rounded-2xl bg-white/5 border border-inherit/10 text-xs opacity-80 leading-relaxed">
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
            <span>How This Automated Generator Works</span>
          </h3>
          <p className="mb-2">
            1. <strong>Dynamic Scanning:</strong> The generator dynamically inspects all files inside <code className="font-mono text-[var(--accent)]">/pages/*.md</code> and extracts YAML frontmatter (titles, canonical slugs, categories, descriptions, publication dates, and author metadata).
          </p>
          <p className="mb-2">
            2. <strong>Multi-layer Automation:</strong> During local development, the Vite dev server dynamically serves <code className="font-mono text-[var(--accent)]">/sitemap.xml</code>, <code className="font-mono text-[var(--accent)]">/robots.txt</code>, and <code className="font-mono text-[var(--accent)]">/llms.txt</code> on the fly with accurate MIME types. On build, <code className="font-mono text-[var(--accent)]">vite build</code> executes bundling hooks that output static files directly to both <code className="font-mono text-[var(--accent)]">dist/</code> and <code className="font-mono text-[var(--accent)]">public/</code> for zero-latency hosting on Vercel, Netlify, or Cloud Run.
          </p>
          <p>
            3. <strong>AI Agent Friendly:</strong> Follows the emerging <a href="https://llmstxt.org" target="_blank" rel="noopener noreferrer" className="underline text-[var(--accent)]">llmstxt.org</a> standard, explicitly granting respectful crawl permissions to ChatGPT, Claude, Perplexity, and Meta AI assistants.
          </p>
        </div>
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />

      {/* Dock */}
      <CustomPageDock
        onGoHome={onGoHome}
        onOpenThemeDrawer={onOpenThemeDrawer}
      />
    </div>
  );
};
