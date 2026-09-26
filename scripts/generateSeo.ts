import path from 'path';
import { generateAllSeoFiles } from '../src/utils/seoGeneratorNode';

const rootDir = process.cwd();
const publicDir = path.resolve(rootDir, 'public');
const distDir = path.resolve(rootDir, 'dist');

console.log('[seo-generator] Executing automated dynamic SEO generator...');

// Target both public/ and dist/ (if dist exists)
const targetDirs = [publicDir];
generateAllSeoFiles(targetDirs, 'https://huanmux.vercel.app', rootDir);

console.log('[seo-generator] Complete: sitemap.xml, robots.txt, llms.txt, llms-full.txt successfully generated.');
