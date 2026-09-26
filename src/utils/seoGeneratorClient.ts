import appsData from '../data/apps.json';
import { getAllMarkdownPages } from './markdownParser';

export const CANONICAL_BASE_URL = 'https://huanmux.vercel.app';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function parseIsoDate(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const trimmed = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  const parsed = Date.parse(trimmed);
  if (!isNaN(parsed)) {
    return new Date(parsed).toISOString().split('T')[0];
  }
  return new Date().toISOString().split('T')[0];
}

/**
 * Generate client-side sitemap.xml dynamically from parsed markdown pages
 */
export function generateClientSitemapXml(baseUrl: string = CANONICAL_BASE_URL): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const pages = getAllMarkdownPages();
  const today = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    { loc: `${cleanBase}/`, lastmod: today, changefreq: 'daily', priority: '1.0' },
    { loc: `${cleanBase}/posts`, lastmod: today, changefreq: 'daily', priority: '0.9' },
    { loc: `${cleanBase}/about`, lastmod: '2026-09-25', changefreq: 'monthly', priority: '0.8' },
    { loc: `${cleanBase}/team`, lastmod: '2026-09-25', changefreq: 'monthly', priority: '0.8' },
    { loc: `${cleanBase}/careers`, lastmod: '2026-09-25', changefreq: 'monthly', priority: '0.7' },
  ];

  const dynamicRoutes = pages
    .filter((p) => !['about', 'team', 'careers'].includes(p.slug.toLowerCase()))
    .map((p) => ({
      loc: `${cleanBase}/${p.slug}`,
      lastmod: parseIsoDate(p.frontmatter.date),
      changefreq: 'weekly',
      priority: '0.8',
    }));

  const allUrls = [...staticRoutes, ...dynamicRoutes];

  const urlsXml = allUrls
    .map(
      (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlsXml}
</urlset>
`;
}

/**
 * Generate client-side robots.txt dynamically
 */
export function generateClientRobotsTxt(baseUrl: string = CANONICAL_BASE_URL): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');

  return `# ==============================================================================
# Robots.txt for HuanMux (Mux)
# Automated Dynamic Generation
# ==============================================================================

User-agent: *
Allow: /

# ------------------------------------------------------------------------------
# Known AI Crawlers & LLM Ingestion Agents (Allowed for citation and discovery)
# ------------------------------------------------------------------------------
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: CCBot
Allow: /

User-agent: Cohere-ai
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

# ------------------------------------------------------------------------------
# Sitemap Index
# ------------------------------------------------------------------------------
Sitemap: ${cleanBase}/sitemap.xml

# ------------------------------------------------------------------------------
# LLM Context Standard (https://llmstxt.org)
# ------------------------------------------------------------------------------
# Curated Context: ${cleanBase}/llms.txt
# Comprehensive Corpus: ${cleanBase}/llms-full.txt
`;
}

/**
 * Generate client-side llms.txt dynamically
 */
export function generateClientLlmsTxt(baseUrl: string = CANONICAL_BASE_URL): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const pages = getAllMarkdownPages();
  const techGuides = pages.filter(
    (p) => !['about', 'team', 'careers'].includes(p.slug.toLowerCase())
  );

  const guidesMarkdown = techGuides
    .map((g) => {
      const desc =
        g.frontmatter.description ||
        'In-depth architectural guide and technical documentation from Mux.';
      const cat = g.frontmatter.category || 'Technology';
      const author = g.frontmatter.author || 'Mux Staff';
      return `- [${g.title}](${cleanBase}/${g.slug}): ${desc} *(Category: ${cat}, Author: ${author})*`;
    })
    .join('\n');

  const appsMarkdown = appsData
    .map(
      (a: any) =>
        `- [${a.name}](${a.url}): ${a.tagline} *(Category: ${a.category}, Domain: ${a.domain})*`
    )
    .join('\n');

  return `# HuanMux

> HuanMux (Mux) is a sovereign multidisciplinary creative brand, technology collective, and technical publication studio dedicated to cultivating art, science, technology, research, and entertainment.

## Core Pages & Architecture
- [Home](${cleanBase}/): Interactive ecosystem showcase, live applications grid, and brand philosophy.
- [About](${cleanBase}/about): Origins of HuanMux, founder Dewan Mukto's creative philosophy, and multidisciplinary studio mission.
- [Team](${cleanBase}/team): Sovereign domains of work, current staff, and alumni across Software/IT, Strategy, Art/Design, Marketing, Music, and Animation.
- [Careers](${cleanBase}/careers): Talent pathways, creative roles, and contact channels through parent company Senturisk.
- [Posts & Technical Guides](${cleanBase}/posts): Archive of in-depth engineering documentation, architecture teardowns, and comparison matrices.

## Technical Guides & Architectural Deep Dives
${guidesMarkdown}

## Software Applications & Creative Ecosystem
${appsMarkdown}

## Automated Feeds & Discovery
- [XML Sitemap](${cleanBase}/sitemap.xml): Dynamic sitemap indexing all published routes and guides.
- [Robots.txt](${cleanBase}/robots.txt): Machine crawler instructions and bot access policies.
- [Full LLM Knowledge Stream](${cleanBase}/llms-full.txt): Complete concatenated text corpus of all guides and technical documentation for large-context LLM ingestion and RAG.
`;
}

/**
 * Generate client-side llms-full.txt dynamically
 */
export function generateClientLlmsFullTxt(baseUrl: string = CANONICAL_BASE_URL): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const pages = getAllMarkdownPages();

  let output = `# HuanMux — Complete Technical Documentation Corpus
> This single-file documentation corpus contains the full text of all HuanMux architectural guides, technical teardowns, and specifications. Optimized for Large Language Models, reasoning agents, and RAG systems.
> Canonical Base URL: ${cleanBase}

================================================================================
`;

  for (const page of pages) {
    const canonical = `${cleanBase}/${page.slug}`;
    const author = page.frontmatter.author || 'Mux Staff';
    const category = page.frontmatter.category || 'Technology';
    const date = page.frontmatter.date || '2026-09-25';
    const desc = page.frontmatter.description || '';

    output += `
--------------------------------------------------------------------------------
DOCUMENT: ${page.title}
CANONICAL URL: ${canonical}
CATEGORY: ${category}
AUTHOR: ${author}
DATE: ${date}
DESCRIPTION: ${desc}
--------------------------------------------------------------------------------

${page.rawMarkdown.trim()}

`;
  }

  return output;
}
