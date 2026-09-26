import fs from 'fs';
import path from 'path';

export interface PageMetadata {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  author: string;
  isSpecial?: boolean;
}

export interface AppMetadata {
  id: string;
  name: string;
  tagline: string;
  domain: string;
  url: string;
  category: string;
}

const DEFAULT_BASE_URL = 'https://huanmux.vercel.app';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function parseIsoDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const trimmed = dateStr.trim();
  // If already YYYY-MM-DD
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
 * Scan the /pages directory and parse metadata from frontmatter
 */
export function getMarkdownPagesData(rootDir: string = process.cwd()): {
  pages: PageMetadata[];
  fullMarkdownMap: Map<string, { meta: PageMetadata; content: string }>;
} {
  const possibleDirs = [
    path.resolve(rootDir, 'pages'),
    path.resolve(rootDir, 'page'),
  ];

  const pages: PageMetadata[] = [];
  const fullMarkdownMap = new Map<string, { meta: PageMetadata; content: string }>();

  for (const pagesDir of possibleDirs) {
    if (!fs.existsSync(pagesDir)) continue;

    const files = fs.readdirSync(pagesDir);
    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      const slug = file.replace(/\.md$/, '');
      const filePath = path.join(pagesDir, file);
      const rawContent = fs.readFileSync(filePath, 'utf-8');

      // Extract frontmatter
      let title = slug.replace(/[-_]/g, ' ');
      let description = 'In-depth architectural guide and technical documentation from Mux.';
      let category = 'Technology';
      let date = '2026-09-25';
      let author = 'Mux Staff';

      const titleMatch = rawContent.match(/^title:\s*(.+)$/m);
      if (titleMatch) title = titleMatch[1].trim().replace(/^['"]|['"]$/g, '');

      const descMatch = rawContent.match(/^description:\s*(.+)$/m);
      if (descMatch) description = descMatch[1].trim().replace(/^['"]|['"]$/g, '');

      const catMatch = rawContent.match(/^category:\s*(.+)$/m);
      if (catMatch) category = catMatch[1].trim().replace(/^['"]|['"]$/g, '');

      const dateMatch = rawContent.match(/^date:\s*(.+)$/m);
      if (dateMatch) {
        date = parseIsoDate(dateMatch[1].trim().replace(/^['"]|['"]$/g, ''));
      } else {
        // Fallback to file mtime
        try {
          const stats = fs.statSync(filePath);
          date = stats.mtime.toISOString().split('T')[0];
        } catch {
          date = '2026-09-25';
        }
      }

      const authorMatch = rawContent.match(/^author:\s*(.+)$/m);
      if (authorMatch) author = authorMatch[1].trim().replace(/^['"]|['"]$/g, '');

      const meta: PageMetadata = {
        slug,
        title,
        description,
        category,
        date,
        author,
        isSpecial: ['about', 'team', 'careers'].includes(slug),
      };

      pages.push(meta);
      fullMarkdownMap.set(slug, { meta, content: rawContent });
    }
  }

  return { pages, fullMarkdownMap };
}

/**
 * Load apps from apps.json
 */
export function getAppsData(rootDir: string = process.cwd()): AppMetadata[] {
  const appsJsonPath = path.resolve(rootDir, 'src/data/apps.json');
  if (fs.existsSync(appsJsonPath)) {
    try {
      const raw = fs.readFileSync(appsJsonPath, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Generate standard dynamic sitemap.xml
 */
export function generateSitemapXml(
  baseUrl: string = DEFAULT_BASE_URL,
  rootDir: string = process.cwd()
): string {
  const { pages } = getMarkdownPagesData(rootDir);
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];

  // Core static routes with their priorities and change frequencies
  const staticRoutes = [
    {
      loc: `${cleanBase}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: '1.0',
    },
    {
      loc: `${cleanBase}/posts`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.9',
    },
    {
      loc: `${cleanBase}/about`,
      lastmod: '2026-09-25',
      changefreq: 'monthly',
      priority: '0.8',
    },
    {
      loc: `${cleanBase}/team`,
      lastmod: '2026-09-25',
      changefreq: 'monthly',
      priority: '0.8',
    },
    {
      loc: `${cleanBase}/careers`,
      lastmod: '2026-09-25',
      changefreq: 'monthly',
      priority: '0.7',
    },
  ];

  // Dynamic routes from pages/ (excluding about, team, careers which are already mapped as special pages)
  const dynamicRoutes = pages
    .filter((p) => !['about', 'team', 'careers'].includes(p.slug))
    .map((p) => ({
      loc: `${cleanBase}/${p.slug}`,
      lastmod: p.date || today,
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
 * Generate standard dynamic robots.txt
 */
export function generateRobotsTxt(baseUrl: string = DEFAULT_BASE_URL): string {
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
 * Generate standard dynamic llms.txt per https://llmstxt.org specification
 */
export function generateLlmsTxt(
  baseUrl: string = DEFAULT_BASE_URL,
  rootDir: string = process.cwd()
): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const { pages } = getMarkdownPagesData(rootDir);
  const apps = getAppsData(rootDir);

  // Group technical guides (exclude special pages about, team, careers)
  const techGuides = pages.filter(
    (p) => !['about', 'team', 'careers'].includes(p.slug)
  );

  let guidesMarkdown = '';
  if (techGuides.length > 0) {
    guidesMarkdown = techGuides
      .map(
        (g) =>
          `- [${g.title}](${cleanBase}/${g.slug}): ${g.description} *(Category: ${g.category}, Author: ${g.author})*`
      )
      .join('\n');
  }

  let appsMarkdown = '';
  if (apps.length > 0) {
    appsMarkdown = apps
      .map(
        (a) =>
          `- [${a.name}](${a.url}): ${a.tagline} *(Category: ${a.category}, Domain: ${a.domain})*`
      )
      .join('\n');
  }

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
 * Generate dynamic llms-full.txt containing the entire text corpus
 */
export function generateLlmsFullTxt(
  baseUrl: string = DEFAULT_BASE_URL,
  rootDir: string = process.cwd()
): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const { fullMarkdownMap } = getMarkdownPagesData(rootDir);

  let output = `# HuanMux — Complete Technical Documentation Corpus
> This single-file documentation corpus contains the full text of all HuanMux architectural guides, technical teardowns, and specifications. Optimized for Large Language Models, reasoning agents, and RAG systems.
> Canonical Base URL: ${cleanBase}

================================================================================
`;

  for (const [slug, item] of fullMarkdownMap.entries()) {
    const canonical = `${cleanBase}/${slug}`;
    output += `
--------------------------------------------------------------------------------
DOCUMENT: ${item.meta.title}
CANONICAL URL: ${canonical}
CATEGORY: ${item.meta.category}
AUTHOR: ${item.meta.author}
DATE: ${item.meta.date}
DESCRIPTION: ${item.meta.description}
--------------------------------------------------------------------------------

${item.content.trim()}

`;
  }

  return output;
}

/**
 * Write all SEO files to designated target directories (e.g. public/ and dist/)
 */
export function generateAllSeoFiles(
  targetDirs: string[],
  baseUrl: string = DEFAULT_BASE_URL,
  rootDir: string = process.cwd()
): void {
  const sitemapXml = generateSitemapXml(baseUrl, rootDir);
  const robotsTxt = generateRobotsTxt(baseUrl);
  const llmsTxt = generateLlmsTxt(baseUrl, rootDir);
  const llmsFullTxt = generateLlmsFullTxt(baseUrl, rootDir);

  for (const targetDir of targetDirs) {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(path.join(targetDir, 'sitemap.xml'), sitemapXml, 'utf-8');
    fs.writeFileSync(path.join(targetDir, 'robots.txt'), robotsTxt, 'utf-8');
    fs.writeFileSync(path.join(targetDir, 'llms.txt'), llmsTxt, 'utf-8');
    fs.writeFileSync(path.join(targetDir, 'llms-full.txt'), llmsFullTxt, 'utf-8');

    console.log(`[seo-generator] Generated SEO assets in ${targetDir}`);
  }
}
