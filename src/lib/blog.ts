// Static, build-time blog pipeline.
//
// Markdown posts live in /content/blog/*.md and are loaded eagerly at build time
// via Vite's import.meta.glob (?raw). Frontmatter is parsed with js-yaml and the
// body is rendered with marked. No database, no runtime fetch - everything is
// resolved during the SSR/prerender build and the client build, so each post
// prerenders to real HTML.
//
// (js-yaml is used instead of gray-matter because gray-matter relies on Node's
// Buffer and breaks Vite's browser bundle; js-yaml is pure JS and safe in both.)
import { marked } from 'marked';
import { load } from 'js-yaml';

export type BlogCategory = 'DPF' | 'ECU' | 'AdBlue';

export interface BlogPost {
  title: string;
  slug: string;
  date: string;
  updated?: string;
  category: BlogCategory;
  excerpt: string;
  coverImage?: string;
  coverAlt: string;
  vehicle?: string;
  mileage?: string;
  faultCodes?: string[];
  symptoms?: string;
  fix?: string;
  relatedServices?: string[];
  author: string;
  draft: boolean;
  html: string;
  readingTime: number;
}

// Branded fallback used when a post omits its own coverImage. Alt text is always
// required from frontmatter, so accessibility never depends on the image source.
export const FALLBACK_COVER_IMAGE = '/blog/default-cover.jpg';

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  DPF: 'DPF Cleaning',
  ECU: 'ECU Remapping',
  AdBlue: 'AdBlue',
};

const rawModules = import.meta.glob('/content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function splitFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, body: raw };
  const data = (load(match[1]) as Record<string, unknown>) ?? {};
  return { data, body: match[2] };
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const arr = value.map((v) => String(v)).filter(Boolean);
  return arr.length ? arr : undefined;
}

function buildPost(path: string, raw: string): BlogPost {
  const { data, body } = splitFrontmatter(raw);
  const fileSlug = (path.split('/').pop() ?? '').replace(/\.md$/, '');
  const slug = String(data.slug || fileSlug);
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const title = String(data.title ?? slug);

  return {
    title,
    slug,
    date: String(data.date ?? ''),
    updated: data.updated ? String(data.updated) : undefined,
    category: (['DPF', 'ECU', 'AdBlue'].includes(String(data.category)) ? data.category : 'DPF') as BlogCategory,
    excerpt: String(data.excerpt ?? ''),
    coverImage: data.coverImage ? String(data.coverImage) : undefined,
    coverAlt: String(data.coverAlt ?? title),
    vehicle: data.vehicle ? String(data.vehicle) : undefined,
    mileage: data.mileage ? String(data.mileage) : undefined,
    faultCodes: asStringArray(data.faultCodes),
    symptoms: data.symptoms ? String(data.symptoms) : undefined,
    fix: data.fix ? String(data.fix) : undefined,
    relatedServices: asStringArray(data.relatedServices),
    author: String(data.author ?? 'Auto-Cleanse'),
    draft: Boolean(data.draft),
    html: marked.parse(body) as string,
    readingTime: Math.max(1, Math.round(words / 200)),
  };
}

const ALL_POSTS: BlogPost[] = Object.entries(rawModules)
  .filter(([path]) => {
    const name = (path.split('/').pop() ?? '').toLowerCase();
    return !name.startsWith('_') && name !== 'readme.md';
  })
  .map(([path, raw]) => buildPost(path, raw))
  .sort((a, b) => +new Date(b.date) - +new Date(a.date));

export const PUBLISHED_POSTS: BlogPost[] = ALL_POSTS.filter((p) => !p.draft);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return PUBLISHED_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost, max = 3): BlogPost[] {
  return PUBLISHED_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, max);
}

export function getRecentByCategory(category: BlogCategory, max = 3): BlogPost[] {
  return PUBLISHED_POSTS.filter((p) => p.category === category).slice(0, max);
}
