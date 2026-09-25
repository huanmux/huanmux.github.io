import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  ArrowUpDown,
  BookOpen,
  Share2,
  Check,
  ExternalLink,
  ChevronRight,
  Globe,
  Layout,
  MoreVertical,
  Clock,
  Sparkles,
  Link as LinkIcon,
  ShieldCheck,
  Send,
  Eye
} from 'lucide-react';
import { MarkdownPageData, getAllMarkdownPages } from '../utils/markdownParser';
import { CustomPageHeader } from './CustomPageHeader';
import { CustomPageDock } from './CustomPageDock';
import { Footer } from './Footer';

interface PostsPageProps {
  onGoHome: () => void;
  onNavigate: (slug: string) => void;
  onOpenThemeDrawer: () => void;
}

type SortOption = 'latest' | 'oldest' | 'a-z' | 'z-a';
type ViewMode = 'serp' | 'social';

function parsePostDate(dateStr?: string): number {
  if (!dateStr) return 0;
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) return parsed;
  return 0;
}

function formatPostDate(dateStr?: string): string {
  if (!dateStr) return 'Sep 2026';
  const ts = parsePostDate(dateStr);
  if (ts > 0) {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  return dateStr;
}

/**
 * Extract H2/H3 section headings from markdown to generate SERP "Sitelinks"
 */
function extractSectionLinks(markdown: string): { title: string; anchor: string; snippet?: string }[] {
  const headings: { title: string; anchor: string; snippet?: string }[] = [];
  const lines = markdown.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      const cleanTitle = match[1].replace(/[#*`_]/g, '').trim();
      if (cleanTitle && !cleanTitle.toLowerCase().includes('quick answer')) {
        const anchor = cleanTitle
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        
        // Find next non-empty paragraph as brief sitelink snippet
        let snippet = '';
        for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
          const nextLine = lines[j].trim();
          if (nextLine && !nextLine.startsWith('#') && !nextLine.startsWith('<') && !nextLine.startsWith('---')) {
            snippet = nextLine.replace(/[*_`]/g, '').slice(0, 75) + '...';
            break;
          }
        }

        headings.push({ title: cleanTitle, anchor, snippet });
      }
    }
    if (headings.length >= 4) break;
  }
  return headings;
}

export const PostsPage: React.FC<PostsPageProps> = ({
  onGoHome,
  onNavigate,
  onOpenThemeDrawer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [viewMode, setViewMode] = useState<ViewMode>('serp');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [activeMenuSlug, setActiveMenuSlug] = useState<string | null>(null);

  const allPages = useMemo(() => {
    return getAllMarkdownPages();
  }, []);

  // Set document title & SEO for the Posts Index
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Posts & Technical Guides — Mux';

    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute(
        'content',
        'Explore comprehensive technical guides on Test-Driven Development (TDD), Docker, Vue.js 3, Webpack 5, Jest, modern LLM stacks (LangChain vs LangGraph vs LangSmith vs Langflow vs Langfuse), REST APIs, MERN, and software architecture.'
      );
    }

    // Injects CollectionPage Schema.org structured data
    let jsonLdScript = document.getElementById('posts-structured-data') as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'posts-structured-data';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Mux Posts & Technical Guides',
      description: 'Comprehensive educational articles on REST APIs, MERN stack, and LLMs.',
      url: `${window.location.origin}/posts`,
      publisher: {
        '@type': 'Organization',
        name: 'Mux',
        url: window.location.origin,
      },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: allPages.map((p, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: `${window.location.origin}/${p.slug}`,
          name: p.title,
        })),
      },
    };
    jsonLdScript.textContent = JSON.stringify(schema);

    return () => {
      document.title = originalTitle;
      if (jsonLdScript && jsonLdScript.parentNode) {
        jsonLdScript.parentNode.removeChild(jsonLdScript);
      }
    };
  }, [allPages]);

  // Extract distinct categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allPages.forEach((p) => {
      if (p.frontmatter.category) {
        cats.add(p.frontmatter.category);
      }
    });
    return Array.from(cats);
  }, [allPages]);

  // Filter and sort pages
  const filteredAndSortedPages = useMemo(() => {
    let result = [...allPages];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) => (p.frontmatter.category || '').toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query filter
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((p) => {
        const title = p.title.toLowerCase();
        const desc = (p.frontmatter.description || '').toLowerCase();
        const keywords = (p.frontmatter.keywords || '').toLowerCase();
        const author = (p.frontmatter.author || '').toLowerCase();
        const category = (p.frontmatter.category || '').toLowerCase();
        const content = p.rawMarkdown.toLowerCase();

        return (
          title.includes(query) ||
          desc.includes(query) ||
          keywords.includes(query) ||
          author.includes(query) ||
          category.includes(query) ||
          content.includes(query)
        );
      });
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'latest': {
          const dateA = parsePostDate(a.frontmatter.date);
          const dateB = parsePostDate(b.frontmatter.date);
          return dateB - dateA;
        }
        case 'oldest': {
          const dateA = parsePostDate(a.frontmatter.date);
          const dateB = parsePostDate(b.frontmatter.date);
          return dateA - dateB;
        }
        case 'a-z':
          return a.title.localeCompare(b.title);
        case 'z-a':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return result;
  }, [allPages, searchQuery, sortOption, selectedCategory]);

  const handleCopyLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
      setActiveMenuSlug(null);
    });
  };

  // Close overflow menus when clicking outside
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.serp-menu-container')) {
        setActiveMenuSlug(null);
      }
    };
    window.addEventListener('click', handleDocumentClick);
    return () => window.removeEventListener('click', handleDocumentClick);
  }, []);

  return (
    <div className="relative min-h-screen themed-bg themed-text flex flex-col justify-between selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
      {/* Top Navbar */}
      <CustomPageHeader onGoHome={onGoHome} onNavigate={onNavigate} currentSlug="posts" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-10">
        {/* Header Hero Area */}
        <div className="mb-8 sm:mb-10 text-left">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Search &amp; Knowledge Archive</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
            Posts &amp; Technical Guides
          </h1>
          <p className="text-sm sm:text-base opacity-75 max-w-2xl leading-relaxed">
            In-depth architectural guides, full-stack specifications, and machine learning mechanisms designed for engineers, researchers, and technical search engines.
          </p>
        </div>

        {/* Search, Filter & View Mode Toolbar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts by topic, keyword, constraint, or author..."
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/5 border border-inherit/15 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] text-sm transition-all placeholder:opacity-40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity p-1 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Controls Row: View Selector + Sort Selector */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Authentic View Mode Switcher (Search Engine SERP vs Social Media Embed) */}
              <div className="flex items-center rounded-2xl bg-white/5 border border-inherit/15 p-1 text-xs font-medium">
                <button
                  onClick={() => setViewMode('serp')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                    viewMode === 'serp'
                      ? 'themed-send-btn shadow-sm font-semibold'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  title="Display as Search Engine Result Pages (SERP)"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Search Engine (SERP)</span>
                  <span className="sm:hidden">SERP</span>
                </button>
                <button
                  onClick={() => setViewMode('social')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                    viewMode === 'social'
                      ? 'themed-send-btn shadow-sm font-semibold'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  title="Display as Social Media Embed Cards (OpenGraph / Discord / Twitter)"
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Social Media Embed</span>
                  <span className="sm:hidden">Social</span>
                </button>
              </div>

              {/* Sorting Selector */}
              <div className="relative">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-white/5 border border-inherit/15 text-xs font-medium">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span className="opacity-60 hidden lg:inline">Sort:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    aria-label="Sort articles order"
                    className="bg-transparent text-inherit font-semibold focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="latest" className="bg-neutral-900 text-white">
                      Latest (Newest First)
                    </option>
                    <option value="oldest" className="bg-neutral-900 text-white">
                      Oldest (Earliest First)
                    </option>
                    <option value="a-z" className="bg-neutral-900 text-white">
                      A to Z (Alphabetical)
                    </option>
                    <option value="z-a" className="bg-neutral-900 text-white">
                      Z to A (Reverse)
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Category Chips Filter */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'themed-send-btn shadow-sm'
                  : 'bg-white/5 border border-inherit/10 opacity-70 hover:opacity-100'
              }`}
            >
              All Topics ({allPages.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'themed-send-btn shadow-sm'
                    : 'bg-white/5 border border-inherit/10 opacity-70 hover:opacity-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs opacity-50 pt-2 border-b border-inherit/10 pb-3">
            <span>
              Showing {filteredAndSortedPages.length} {filteredAndSortedPages.length === 1 ? 'post' : 'posts'} &bull; {viewMode === 'serp' ? 'Search Engine (SERP) View' : 'Social Media Embed View'}
            </span>
            {searchQuery && (
              <span>Filtered by &ldquo;{searchQuery}&rdquo;</span>
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredAndSortedPages.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/5 border border-inherit/10 my-8">
            <Search className="w-10 h-10 opacity-40 mx-auto mb-3" />
            <h2 className="font-display text-lg font-bold mb-1">No matching results found</h2>
            <p className="text-xs sm:text-sm opacity-60 max-w-sm mx-auto mb-4">
              We couldn&apos;t find any posts matching &ldquo;{searchQuery}&rdquo;. Try another keyword or reset the filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="themed-btn px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Reset Search Filters
            </button>
          </div>
        ) : viewMode === 'serp' ? (
          /* ========================================================================= */
          /* 1. AUTHENTIC SEARCH ENGINE RESULTS ENTRIES (SERP)                         */
          /* Modeled meticulously after Google/Bing desktop results                     */
          /* ========================================================================= */
          <div className="space-y-8 sm:space-y-10">
            {filteredAndSortedPages.map((page, index) => {
              const sitelinks = extractSectionLinks(page.rawMarkdown);
              const author = page.frontmatter.author || 'Mux Staff';
              const authorImg =
                page.frontmatter.authorImage ||
                'https://dewanmukto.github.io/asset/images/MuxGames-icon.webp';
              const dateStr = formatPostDate(page.frontmatter.date);
              const readTime = page.frontmatter.readTime || '10 min read';
              const category = page.frontmatter.category || 'Architecture';
              const isCopied = copiedSlug === page.slug;
              const isMenuOpen = activeMenuSlug === page.slug;

              return (
                <article
                  key={page.slug}
                  className="group relative p-5 sm:p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-inherit/10 hover:border-inherit/25 transition-all duration-200"
                >
                  {/* SERP Header: Favicon + Site Name + URL Breadcrumb Path + 3-Dot Overflow Menu */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs">
                      {/* Circular/Rounded Brand Favicon Frame */}
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-inherit/20 shrink-0 bg-black/40 flex items-center justify-center p-0.5 shadow-sm">
                        <img
                          src="https://huanmux.vercel.app/assets/logo/icon.png"
                          alt="Mux"
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            e.currentTarget.src = '/mux-appicon.png';
                          }}
                        />
                      </div>

                      {/* SERP Authentic Breadcrumb Hierarchy */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5 leading-tight">
                        <span className="font-semibold text-inherit text-xs">Mux</span>
                        <div className="flex items-center gap-1 font-mono text-[11px] opacity-65 truncate max-w-[220px] sm:max-w-md">
                          <span>https://huanmux.vercel.app</span>
                          <span className="opacity-40">›</span>
                          <span>posts</span>
                          <span className="opacity-40">›</span>
                          <span className="text-[var(--accent)] font-medium">{page.slug}</span>
                        </div>
                      </div>
                    </div>

                    {/* SERP 3-Dot Menu & Share Action */}
                    <div className="relative serp-menu-container flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuSlug(isMenuOpen ? null : page.slug);
                        }}
                        title="Result options"
                        aria-label="Result options"
                        className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-white/10 transition-all text-xs cursor-pointer"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-48 rounded-xl bg-neutral-900 border border-white/15 shadow-2xl p-1 z-30 text-xs font-sans">
                          <button
                            onClick={() => handleCopyLink(page.slug)}
                            className="w-full px-3 py-2 rounded-lg text-left hover:bg-white/10 flex items-center gap-2 cursor-pointer text-white/90"
                          >
                            <LinkIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
                            <span>Copy Result URL</span>
                          </button>
                          <button
                            onClick={() => onNavigate(page.slug)}
                            className="w-full px-3 py-2 rounded-lg text-left hover:bg-white/10 flex items-center gap-2 cursor-pointer text-white/90"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[var(--accent)]" />
                            <span>Open Webpage</span>
                          </button>
                          <div className="h-px bg-white/10 my-1" />
                          <div className="px-3 py-1 text-[10px] text-white/50 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>Verified Canonical Source</span>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => handleCopyLink(page.slug)}
                        title="Copy direct link"
                        className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-white/10 transition-all text-xs flex items-center gap-1 cursor-pointer"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[10px] text-emerald-400 font-mono">Copied</span>
                          </>
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* SERP Primary Title Link (Blue/Accent clickable result heading) */}
                  <h2 className="mb-2">
                    <button
                      onClick={() => onNavigate(page.slug)}
                      className="text-left font-display text-lg sm:text-2xl font-bold tracking-tight text-[var(--accent)] hover:underline cursor-pointer group-hover:text-[var(--accent)] leading-snug"
                    >
                      {page.title}
                    </button>
                  </h2>

                  {/* SERP Snippet / Description (Date snippet prefix + body) */}
                  <p className="text-xs sm:text-sm leading-relaxed opacity-80 mb-3.5 text-left font-sans">
                    <span className="font-mono text-[11px] sm:text-xs opacity-60 font-semibold mr-1.5 text-inherit">
                      {dateStr} &mdash;
                    </span>
                    {page.frontmatter.description || 'Comprehensive technical reference and architectural guide.'}
                  </p>

                  {/* SERP Rich Snippet Attributes (Author, Category, Read Time) */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs opacity-75 mb-3.5 pt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-inherit/25 ring-1 ring-[var(--accent)]/30 shrink-0">
                        <img
                          src={authorImg}
                          alt={author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-[11px] sm:text-xs">{author}</span>
                    </div>

                    <span className="opacity-30">&bull;</span>

                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-inherit/10 text-[11px] font-mono text-[var(--accent)]">
                      {category}
                    </span>

                    <span className="opacity-30">&bull;</span>

                    <span className="flex items-center gap-1 text-[11px] opacity-70">
                      <Clock className="w-3 h-3" />
                      <span>{readTime}</span>
                    </span>
                  </div>

                  {/* SERP Sitelinks (Google-style multi-column jump targets) */}
                  {sitelinks.length > 0 && (
                    <div className="pt-3 border-t border-inherit/10 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      {sitelinks.map((link) => (
                        <button
                          key={link.anchor}
                          onClick={() => onNavigate(page.slug)}
                          className="text-left p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.08] border border-inherit/10 hover:border-inherit/25 transition-all flex flex-col justify-between group/link cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="font-semibold text-[var(--accent)] group-hover/link:underline truncate">
                              {link.title}
                            </span>
                            <ChevronRight className="w-3 h-3 opacity-40 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-transform shrink-0" />
                          </div>
                          {link.snippet && (
                            <span className="text-[11px] opacity-60 line-clamp-1">
                              {link.snippet}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* SERP Footer Details */}
                  <div className="mt-4 flex items-center justify-between pt-2 text-[11px] opacity-50 font-mono">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Cached &bull; Structured Schema.org Article</span>
                    </span>
                    <span>Result #{index + 1}</span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* ========================================================================= */
          /* 2. AUTHENTIC SOCIAL MEDIA EMBEDDING CARDS                                 */
          /* Modeled meticulously after Discord Rich Embeds, Twitter Cards & OpenGraph */
          /* ========================================================================= */
          <div className="space-y-8 sm:space-y-10">
            {filteredAndSortedPages.map((page, index) => {
              const author = page.frontmatter.author || 'Mux Staff';
              const authorImg =
                page.frontmatter.authorImage ||
                'https://dewanmukto.github.io/asset/images/MuxGames-icon.webp';
              const bannerImg =
                page.frontmatter.image ||
                page.frontmatter.banner ||
                page.frontmatter.authorImage ||
                'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80';
              const dateStr = formatPostDate(page.frontmatter.date);
              const readTime = page.frontmatter.readTime || '12 min read';
              const category = page.frontmatter.category || 'Engineering';
              const isCopied = copiedSlug === page.slug;

              return (
                <article
                  key={page.slug}
                  className="group relative rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-inherit/15 hover:border-[var(--accent)]/40 overflow-hidden shadow-xl transition-all duration-300"
                >
                  {/* Authentic Discord / Slack Left Accent Color Rail */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1.5 z-20"
                    style={{ background: 'var(--accent)' }}
                  />

                  {/* Main Embed Content Container */}
                  <div className="pl-6 sm:pl-7 pr-5 sm:pr-6 pt-5 pb-5">
                    {/* Social Embed Header: Author Pill + Platform Label */}
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full overflow-hidden border border-inherit/25 ring-1 ring-[var(--accent)]/30 shrink-0">
                          <img
                            src={authorImg}
                            alt={author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-semibold text-inherit">{author}</span>
                        <span className="opacity-30">&bull;</span>
                        <span className="opacity-75 font-mono text-[11px]">{category}</span>
                      </div>

                      {/* Domain Pill (like Twitter/Discord cards) */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-inherit/10 font-mono text-[10px] tracking-wider uppercase opacity-75">
                        <Globe className="w-3 h-3 text-[var(--accent)]" />
                        <span>HUANMUX.VERCEL.APP</span>
                      </div>
                    </div>

                    {/* Social Embed Title */}
                    <h2 className="mb-2.5">
                      <button
                        onClick={() => onNavigate(page.slug)}
                        className="text-left font-display text-xl sm:text-2xl font-bold tracking-tight text-inherit hover:text-[var(--accent)] transition-colors cursor-pointer group-hover:text-[var(--accent)] leading-snug"
                      >
                        {page.title}
                      </button>
                    </h2>

                    {/* Social Embed Description */}
                    <p className="text-xs sm:text-sm leading-relaxed opacity-80 mb-4 text-left font-sans">
                      {page.frontmatter.description || 'Comprehensive architectural deep dive, theoretical analysis, and production specifications.'}
                    </p>

                    {/* Social Embed Visual Banner: 16:9 Aspect Ratio OpenGraph Preview */}
                    <div
                      onClick={() => onNavigate(page.slug)}
                      className="relative w-full aspect-[2/1] sm:aspect-[2.4/1] rounded-xl overflow-hidden border border-inherit/20 mb-4 cursor-pointer group/media bg-black/50"
                    >
                      <img
                        src={bannerImg}
                        alt={page.title}
                        className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-500 filter brightness-90 group-hover/media:brightness-100"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                      {/* Floating Badges on Banner */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono">
                            {readTime}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono opacity-80">
                            {dateStr}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-[var(--accent)] text-black font-semibold shadow-md">
                          <Eye className="w-3 h-3" />
                          <span>Read</span>
                        </span>
                      </div>
                    </div>

                    {/* Social Embed Footer: Meta details & interactive action buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-inherit/10 text-xs">
                      {/* Social metadata stamp */}
                      <div className="flex items-center gap-2 text-[11px] opacity-65 font-mono">
                        <div className="w-4 h-4 rounded-md overflow-hidden bg-black/40 border border-inherit/20 flex items-center justify-center">
                          <img
                            src="https://huanmux.vercel.app/assets/logo/icon.png"
                            alt="Mux"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span>Mux Post #{index + 1} &bull; OpenGraph 2.0</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyLink(page.slug)}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-inherit/15 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5" />
                              <span>Share Link</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => onNavigate(page.slug)}
                          className="themed-send-btn px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <span>Open Article</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer identical to homepage */}
      <Footer onNavigate={onNavigate} />

      {/* Bottom Floating Navigation Dock */}
      <CustomPageDock
        onGoHome={onGoHome}
        onOpenThemeDrawer={onOpenThemeDrawer}
      />
    </div>
  );
};
