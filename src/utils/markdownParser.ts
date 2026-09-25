import { marked } from 'marked';

export interface PageFrontmatter {
  title?: string;
  author?: string;
  authorImage?: string;
  author_image?: string;
  avatar?: string;
  date?: string;
  description?: string;
  keywords?: string;
  category?: string;
  readTime?: string;
  canonical?: string;
  image?: string;
  banner?: string;
  coverImage?: string;
  [key: string]: any;
}

export interface MarkdownPageData {
  slug: string;
  title: string;
  frontmatter: PageFrontmatter;
  rawMarkdown: string;
  html: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Configure marked with custom code renderer to include copy button and language badge
 */
const renderer = new marked.Renderer();

renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
  const language = (lang || 'code').trim().toLowerCase();
  const escapedCode = escapeHtml(text);
  const encodedCode = encodeURIComponent(text);

  return `
    <div class="mux-code-block my-6 rounded-2xl overflow-hidden border border-inherit/15 bg-black/40 shadow-xl backdrop-blur-md" data-code="${encodedCode}">
      <div class="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-inherit/10 text-xs font-mono select-none">
        <span class="font-bold tracking-wider opacity-75 uppercase text-[11px] text-[var(--accent)]">${language}</span>
        <button type="button" class="mux-copy-btn flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-xs cursor-pointer text-inherit">
          <svg class="w-3.5 h-3.5 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
          <span class="mux-copy-label">Copy</span>
        </button>
      </div>
      <pre class="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-inherit/90"><code>${escapedCode}</code></pre>
    </div>
  `;
};

marked.use({
  gfm: true,
  breaks: false,
  renderer,
});

/**
 * Robust frontmatter extractor that parses YAML-style metadata between --- delimiters
 */
export function extractFrontmatter(source: string): { frontmatter: PageFrontmatter; content: string } {
  const trimmed = source.trimStart();
  if (!trimmed.startsWith('---')) {
    return { frontmatter: {}, content: source };
  }

  const endIdx = trimmed.indexOf('\n---', 3);
  if (endIdx === -1) {
    return { frontmatter: {}, content: source };
  }

  const frontmatterRaw = trimmed.slice(3, endIdx).trim();
  const content = trimmed.slice(endIdx + 4).trimStart();

  const frontmatter: PageFrontmatter = {};
  const lines = frontmatterRaw.split('\n');

  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();

      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  }

  // Normalize author image property
  if (!frontmatter.authorImage) {
    frontmatter.authorImage = frontmatter.author_image || frontmatter.avatar;
  }

  // Normalize post preview banner image property
  if (!frontmatter.image) {
    frontmatter.image = frontmatter.banner || frontmatter.coverImage;
  }

  return { frontmatter, content };
}

/**
 * Import all markdown files from /pages/ (and /page/ if present)
 */
const rawPagesGlob = import.meta.glob(
  ['/pages/*.md', '/page/*.md', '../pages/*.md'],
  { query: '?raw', import: 'default', eager: true }
) as Record<string, string>;

/**
 * Cache parsed pages
 */
let cachedPages: MarkdownPageData[] | null = null;

export function getAllMarkdownPages(): MarkdownPageData[] {
  if (cachedPages) {
    return cachedPages;
  }

  const pagesMap = new Map<string, MarkdownPageData>();

  for (const [filepath, rawContent] of Object.entries(rawPagesGlob)) {
    if (typeof rawContent !== 'string') continue;

    // Extract slug from filepath: e.g. /pages/welcome-to-mux.md -> welcome-to-mux
    const filename = filepath.split('/').pop()?.replace(/\.md$/, '') || '';
    if (!filename) continue;

    const slug = filename;
    const { frontmatter, content } = extractFrontmatter(rawContent);

    // Extract first H1 as fallback title if not in frontmatter
    let title = frontmatter.title || '';
    if (!title) {
      const h1Match = content.match(/^#\s+(.+)$/m);
      if (h1Match) {
        title = h1Match[1].trim();
      } else {
        title = slug.replace(/[-_]/g, ' ');
      }
    }

    const html = marked.parse(content) as string;

    pagesMap.set(slug.toLowerCase(), {
      slug,
      title,
      frontmatter,
      rawMarkdown: content,
      html,
    });
  }

  cachedPages = Array.from(pagesMap.values());
  return cachedPages;
}

export function getMarkdownPageBySlug(rawSlug: string): MarkdownPageData | null {
  const pages = getAllMarkdownPages();
  let normalized = rawSlug.replace(/^\/+|\/+$/g, '').toLowerCase();

  // Alias lookups for convenience
  const aliasMap: Record<string, string> = {
    'rest-api': 'rest-apis',
    'rest-api-guide': 'rest-apis',
    'restapi': 'rest-apis',
    'mern': 'mern-stack',
    'mern-stack-guide': 'mern-stack',
    'mernstack': 'mern-stack',
    'llm': 'llms-how-they-work',
    'llms': 'llms-how-they-work',
    'how-llms-work': 'llms-how-they-work',
    'how-do-llms-work': 'llms-how-they-work',
  };

  if (aliasMap[normalized]) {
    normalized = aliasMap[normalized];
  }

  return pages.find((p) => p.slug.toLowerCase() === normalized) || null;
}
