import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getArticle, getArticleSlugs, formatDate } from '@/lib/articles';

export function generateStaticParams() {
  return getArticleSlugs().map(slug => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    // The originals live on the Stardust blog — point search engines there so
    // republishing here never competes with the source.
    alternates: article.originalUrl ? { canonical: article.originalUrl } : undefined,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  return (
    <article className="field pt-16 pb-24 lg:pt-24">
      <div className="split">
        <aside className="rail">
          <div className="flex lg:block gap-x-6 gap-y-1 flex-wrap pb-6 lg:pb-0 border-b lg:border-b-0 border-[var(--rule)] mb-8 lg:mb-0">
            <Link href="/articles" className="rail-label hover:text-[var(--accent)] transition-colors">
              ← Articles
            </Link>
            <span className="meta lg:block lg:mt-6">{formatDate(article.date)}</span>
            {article.publication && (
              <span className="meta lg:block lg:mt-1">{article.publication}</span>
            )}
            {article.originalUrl && (
              <a
                href={article.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="meta lg:block lg:mt-6 hover:text-[var(--accent)] transition-colors"
              >
                Original ↗
              </a>
            )}
          </div>
        </aside>

        <div className="content">
          <h1 className="subdisplay !text-[clamp(2rem,5vw,3.5rem)] !leading-[1.02] max-w-[22ch]">
            {article.title}
          </h1>
          <p className="measure mt-6 text-[var(--muted)]">{article.description}</p>

          <div className="prose-sb mt-14">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Wide tables scroll inside their own container so the page body
                // never scrolls horizontally.
                table: ({ children }) => (
                  <div className="table-wrap">
                    <table>{children}</table>
                  </div>
                ),
              }}
            >
              {article.body}
            </ReactMarkdown>
          </div>

          {article.originalUrl && (
            <p className="meta mt-16 pt-6 rule">
              Publicerad först på{' '}
              <a
                href={article.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-[var(--accent)] transition-colors"
              >
                {article.publication ?? 'originalsidan'} ↗
              </a>
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
