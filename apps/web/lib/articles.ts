import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  originalUrl?: string;
  publication?: string;
}

export interface Article extends ArticleMeta {
  body: string;
}

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''));
}

export function getArticle(slug: string): Article | null {
  const file = path.join(ARTICLES_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? '',
    date: data.date ?? '',
    originalUrl: data.originalUrl,
    publication: data.publication,
    body: content,
  };
}

/** Newest first. */
export function getAllArticles(): ArticleMeta[] {
  return getArticleSlugs()
    .map(getArticle)
    .filter((a): a is Article => a !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ body: _body, ...meta }) => meta);
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  return new Date(iso + 'T12:00:00').toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
