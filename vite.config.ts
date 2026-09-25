import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function markdownPagesPlugin(): Plugin {
  return {
    name: 'vite-plugin-markdown-pages',
    closeBundle() {
      const rootDir = process.cwd();
      const distDir = path.resolve(rootDir, 'dist');
      const distIndexHtmlPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(distIndexHtmlPath)) return;

      const baseHtml = fs.readFileSync(distIndexHtmlPath, 'utf-8');

      // Support both pages/ and page/ directories
      const possibleDirs = [
        path.resolve(rootDir, 'pages'),
        path.resolve(rootDir, 'page'),
      ];

      for (const pagesDir of possibleDirs) {
        if (!fs.existsSync(pagesDir)) continue;

        const files = fs.readdirSync(pagesDir);
        for (const file of files) {
          if (!file.endsWith('.md')) continue;

          const slug = file.replace(/\.md$/, '');
          const filePath = path.join(pagesDir, file);
          const rawContent = fs.readFileSync(filePath, 'utf-8');

          // Extract frontmatter properties
          let title = slug.replace(/[-_]/g, ' ');
          let description = 'HuanMux In-Depth Guide';
          let keywords = 'engineering, technology, software architecture';
          let author = 'HuanMux Engineering';
          let authorImage = 'https://huanmux.vercel.app/assets/logo/Mux_appicon.png';
          let date = '2026-09-25';
          let category = 'Technology';

          const titleMatch = rawContent.match(/^title:\s*(.+)$/m);
          if (titleMatch) title = titleMatch[1].trim().replace(/^['"]|['"]$/g, '');

          const descMatch = rawContent.match(/^description:\s*(.+)$/m);
          if (descMatch) description = descMatch[1].trim().replace(/^['"]|['"]$/g, '');

          const kwMatch = rawContent.match(/^keywords:\s*(.+)$/m);
          if (kwMatch) keywords = kwMatch[1].trim().replace(/^['"]|['"]$/g, '');

          const authorMatch = rawContent.match(/^author:\s*(.+)$/m);
          if (authorMatch) author = authorMatch[1].trim().replace(/^['"]|['"]$/g, '');

          const authorImgMatch = rawContent.match(/^authorImage:\s*(.+)$/m);
          if (authorImgMatch) authorImage = authorImgMatch[1].trim().replace(/^['"]|['"]$/g, '');

          let postImage = authorImage;
          const imageMatch = rawContent.match(/^image:\s*(.+)$/m);
          if (imageMatch) postImage = imageMatch[1].trim().replace(/^['"]|['"]$/g, '');

          const dateMatch = rawContent.match(/^date:\s*(.+)$/m);
          if (dateMatch) date = dateMatch[1].trim().replace(/^['"]|['"]$/g, '');

          const catMatch = rawContent.match(/^category:\s*(.+)$/m);
          if (catMatch) category = catMatch[1].trim().replace(/^['"]|['"]$/g, '');

          const canonicalUrl = `https://huanmux.vercel.app/${slug}`;
          const fullTitle = `${title} — HuanMux`;

          // Extract FAQs for AEO (Answer Engine Optimization)
          const faqMatches = Array.from(rawContent.matchAll(/###\s+(.+?\?)\n+([^#\n]+(?:\n(?!###)[^#\n]+)*)/g));
          const faqEntities = faqMatches.slice(0, 5).map((m) => ({
            '@type': 'Question',
            name: m[1].trim(),
            acceptedAnswer: {
              '@type': 'Answer',
              text: m[2].trim().replace(/\n+/g, ' '),
            },
          }));

          const schemaLd = {
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'TechArticle',
                '@id': `${canonicalUrl}#article`,
                headline: title,
                description: description,
                url: canonicalUrl,
                inLanguage: 'en-US',
                mainEntityOfPage: {
                  '@type': 'WebPage',
                  '@id': canonicalUrl,
                },
                author: {
                  '@type': 'Person',
                  name: author,
                  image: authorImage,
                },
                publisher: {
                  '@type': 'Organization',
                  name: 'HuanMux',
                  url: 'https://huanmux.vercel.app',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://huanmux.vercel.app/assets/logo/Mux_appicon.png',
                  },
                },
                datePublished: date,
                articleSection: category,
              },
              {
                '@type': 'BreadcrumbList',
                '@id': `${canonicalUrl}#breadcrumb`,
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://huanmux.vercel.app',
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: title,
                    item: canonicalUrl,
                  },
                ],
              },
              ...(faqEntities.length > 0
                ? [
                    {
                      '@type': 'FAQPage',
                      '@id': `${canonicalUrl}#faq`,
                      mainEntity: faqEntities,
                    },
                  ]
                : []),
            ],
          };

          const headInjectTags = `
    <title>${fullTitle}</title>
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${keywords}" />
    <meta name="author" content="${author}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${fullTitle}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="HuanMux" />
    <meta property="og:image" content="${postImage}" />
    <meta property="article:published_time" content="${date}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${fullTitle}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${postImage}" />
    <script type="application/ld+json">${JSON.stringify(schemaLd)}</script>
`;

          let pageHtml = baseHtml
            .replace(/<title>.*?<\/title>/, '')
            .replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, '')
            .replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, '')
            .replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, '')
            .replace(/<meta\s+property="og:type"\s+content=".*?"\s*\/?>/i, '')
            .replace(/<meta\s+name="twitter:card"\s+content=".*?"\s*\/?>/i, '')
            .replace('</head>', `${headInjectTags}  </head>`);

          // 1. Output dist/<slug>/index.html
          const slugDir = path.join(distDir, slug);
          if (!fs.existsSync(slugDir)) {
            fs.mkdirSync(slugDir, { recursive: true });
          }
          fs.writeFileSync(path.join(slugDir, 'index.html'), pageHtml, 'utf-8');

          // 2. Output dist/<slug>.html
          fs.writeFileSync(path.join(distDir, `${slug}.html`), pageHtml, 'utf-8');

          console.log(`[markdown-pages] Compiled webpage: /${slug}`);
        }
      }

      // Also compile static /posts webpage
      const postsTitle = 'Posts & Technical Guides — HuanMux';
      const postsDesc = 'Explore technical guides, architectural specifications, and machine learning tutorials on REST APIs, MERN stack, and LLMs.';
      const postsCanonical = 'https://huanmux.vercel.app/posts';
      const postsSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: postsTitle,
        description: postsDesc,
        url: postsCanonical,
      };
      const postsHeadTags = `
    <title>${postsTitle}</title>
    <meta name="description" content="${postsDesc}" />
    <link rel="canonical" href="${postsCanonical}" />
    <meta property="og:title" content="${postsTitle}" />
    <meta property="og:description" content="${postsDesc}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${postsCanonical}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${postsTitle}" />
    <meta name="twitter:description" content="${postsDesc}" />
    <script type="application/ld+json">${JSON.stringify(postsSchema)}</script>
`;
      const postsHtml = baseHtml
        .replace(/<title>.*?<\/title>/, '')
        .replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, '')
        .replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, '')
        .replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, '')
        .replace('</head>', `${postsHeadTags}  </head>`);

      const postsDir = path.join(distDir, 'posts');
      if (!fs.existsSync(postsDir)) {
        fs.mkdirSync(postsDir, { recursive: true });
      }
      fs.writeFileSync(path.join(postsDir, 'index.html'), postsHtml, 'utf-8');
      fs.writeFileSync(path.join(distDir, 'posts.html'), postsHtml, 'utf-8');
      console.log('[markdown-pages] Compiled webpage: /posts');
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), markdownPagesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
