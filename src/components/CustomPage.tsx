import React, { useEffect, useRef } from 'react';
import { MarkdownPageData } from '../utils/markdownParser';
import { CustomPageHeader } from './CustomPageHeader';
import { CustomPageDock } from './CustomPageDock';
import { Footer } from './Footer';

interface CustomPageProps {
  page: MarkdownPageData;
  onGoHome: () => void;
  onNavigate: (slug: string) => void;
  onOpenThemeDrawer: () => void;
}

export const CustomPage: React.FC<CustomPageProps> = ({
  page,
  onGoHome,
  onNavigate,
  onOpenThemeDrawer,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Update document title, description, SEO, and AEO (Answer Engine Optimization) tags
  useEffect(() => {
    const originalTitle = document.title;
    const pageTitle = `${page.title} — HuanMux`;
    document.title = pageTitle;

    const canonicalUrl = `${window.location.origin}/${page.slug}`;
    const authorName = page.frontmatter.author || 'HuanMux Engineering';
    const authorImg = page.frontmatter.authorImage || 'https://huanmux.vercel.app/assets/logo/Mux_appicon.png';
    const description = page.frontmatter.description || 'In-depth technical architecture and engineering guide.';
    const keywords = page.frontmatter.keywords || 'engineering, technology, software architecture';

    function setOrCreateMeta(selector: string, attrName: string, attrVal: string, content: string) {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
      return el;
    }

    // Standard SEO Tags
    setOrCreateMeta('meta[name="description"]', 'name', 'description', description);
    setOrCreateMeta('meta[name="keywords"]', 'name', 'keywords', keywords);
    setOrCreateMeta('meta[name="author"]', 'name', 'author', authorName);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // OpenGraph Social Tags
    setOrCreateMeta('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    setOrCreateMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setOrCreateMeta('meta[property="og:type"]', 'property', 'og:type', 'article');
    setOrCreateMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setOrCreateMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'HuanMux');
    setOrCreateMeta('meta[property="og:image"]', 'property', 'og:image', authorImg);

    // Twitter Card Tags
    setOrCreateMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setOrCreateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
    setOrCreateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setOrCreateMeta('meta[name="twitter:image"]', 'name', 'twitter:image', authorImg);

    // Schema.org JSON-LD for AEO (Answer Engine Optimization) & Semantic Search
    let jsonLdScript = document.getElementById('aeo-structured-data') as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'aeo-structured-data';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }

    // Extract FAQs from markdown if available
    const faqMatches = Array.from(page.rawMarkdown.matchAll(/###\s+(.+?\?)\n+([^#\n]+(?:\n(?!###)[^#\n]+)*)/g));
    const faqEntities = faqMatches.slice(0, 5).map((match) => ({
      '@type': 'Question',
      name: match[1].trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: match[2].trim().replace(/\n+/g, ' '),
      },
    }));

    const schemaGraph: any[] = [
      {
        '@type': 'TechArticle',
        '@id': `${canonicalUrl}#article`,
        headline: page.title,
        description: description,
        url: canonicalUrl,
        inLanguage: 'en-US',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        author: {
          '@type': 'Person',
          name: authorName,
          image: authorImg,
        },
        publisher: {
          '@type': 'Organization',
          name: 'HuanMux',
          url: window.location.origin,
          logo: {
            '@type': 'ImageObject',
            url: 'https://huanmux.vercel.app/assets/logo/Mux_appicon.png',
          },
        },
        datePublished: page.frontmatter.date || '2026-09-25',
        articleSection: page.frontmatter.category || 'Technology',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: window.location.origin,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.title,
            item: canonicalUrl,
          },
        ],
      },
    ];

    if (faqEntities.length > 0) {
      schemaGraph.push({
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: faqEntities,
      });
    }

    jsonLdScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': schemaGraph,
    });

    return () => {
      // Revert title
      document.title = originalTitle || 'HuanMux';
      // Reset meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'HuanMux - The home of everything related to the cultivation of art, science, technology, research and entertainment.'
        );
      }
      // Clean up injected script
      jsonLdScript?.remove();
      canonicalLink?.remove();
    };
  }, [page.title, page.slug, page.frontmatter, page.rawMarkdown]);

  // Execute embedded scripts, configure copy buttons, and handle internal links
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    // 1. Execute embedded <script> tags safely in the DOM
    const scripts = container.querySelectorAll('script');
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

    // 2. Attach click handlers to code block Copy buttons
    const copyButtons = container.querySelectorAll<HTMLButtonElement>('.mux-copy-btn');
    const cleanupFns: Array<() => void> = [];

    copyButtons.forEach((btn) => {
      const block = btn.closest('.mux-code-block');
      const encodedCode = block?.getAttribute('data-code');
      if (!encodedCode) return;

      const clickHandler = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          const rawCode = decodeURIComponent(encodedCode);
          await navigator.clipboard.writeText(rawCode);

          const label = btn.querySelector('.mux-copy-label');
          const originalText = label?.textContent || 'Copy';

          if (label) {
            label.textContent = 'Copied!';
            btn.classList.add('text-emerald-400');
          }

          setTimeout(() => {
            if (label) {
              label.textContent = originalText;
              btn.classList.remove('text-emerald-400');
            }
          }, 2000);
        } catch (err) {
          console.error('Failed to copy code to clipboard', err);
        }
      };

      btn.addEventListener('click', clickHandler);
      cleanupFns.push(() => btn.removeEventListener('click', clickHandler));
    });

    // 3. Intercept internal anchor links (e.g. /welcome-to-mux or /)
    const links = container.querySelectorAll<HTMLAnchorElement>('a');
    links.forEach((a) => {
      const href = a.getAttribute('href');
      if (href && (href.startsWith('/') || href.startsWith('./') || href.startsWith('../'))) {
        const linkHandler = (e: MouseEvent) => {
          // If not opening in new tab or with modifier keys
          if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
            e.preventDefault();
            const cleanPath = href.replace(/^(\.\/|\.\.\/)/, '/');
            if (cleanPath === '/' || cleanPath === '') {
              onGoHome();
            } else {
              onNavigate(cleanPath.replace(/^\//, ''));
            }
          }
        };
        a.addEventListener('click', linkHandler);
        cleanupFns.push(() => a.removeEventListener('click', linkHandler));
      }
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, [page.html, page.slug, onGoHome, onNavigate]);

  const hasAuthor = Boolean(page.frontmatter.author || page.frontmatter.authorImage);

  return (
    <div className="relative min-h-screen themed-bg themed-text overflow-x-hidden selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)] flex flex-col">
      {/* 1. Header with corporate navigation */}
      <CustomPageHeader
        onGoHome={onGoHome}
        onNavigate={onNavigate}
        onGoToPosts={() => onNavigate('posts')}
        currentSlug={page.slug}
      />

      {/* 2. Main Article Content Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14 z-10">
        {/* Optional Author Data Section in circular frame */}
        {hasAuthor && (
          <div className="flex items-center gap-4 mb-8 p-3 sm:p-4 rounded-2xl bg-white/5 border border-inherit/10 backdrop-blur-md max-w-fit shadow-xs">
            {page.frontmatter.authorImage && (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-[var(--accent)] shrink-0 shadow-md">
                <img
                  src={page.frontmatter.authorImage}
                  alt={page.frontmatter.author || 'Author'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://huanmux.vercel.app/assets/logo/Mux_appicon.png';
                  }}
                />
              </div>
            )}
            <div>
              <div className="text-[11px] uppercase tracking-wider opacity-60 font-semibold">Author</div>
              <div className="font-bold text-sm sm:text-base leading-tight">
                {page.frontmatter.author || 'HuanMux Contributor'}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs opacity-60 mt-1">
                {page.frontmatter.date && <span>{page.frontmatter.date}</span>}
                {page.frontmatter.category && (
                  <>
                    <span>•</span>
                    <span className="text-[var(--accent)] font-medium">{page.frontmatter.category}</span>
                  </>
                )}
                {page.frontmatter.readTime && (
                  <>
                    <span>•</span>
                    <span>{page.frontmatter.readTime}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Markdown Content Area */}
        <article
          ref={contentRef}
          className="mux-markdown-body leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.html }}
        />
      </main>

      {/* 3. Footer (Same as landing page) */}
      <Footer />

      {/* 4. Custom Floating Navbar (Home button + Theme icon + optional Arrow up) */}
      <CustomPageDock
        onGoHome={onGoHome}
        onOpenThemeDrawer={onOpenThemeDrawer}
      />
    </div>
  );
};
