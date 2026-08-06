import Link from 'next/link';
import { getAllArticles, formatDate } from '@/lib/articles';

export const metadata = {
  title: 'Articles',
  description: 'Writing on AI-first organisations, governance and what actually changes.',
};

export default function ArticlesIndex() {
  const articles = getAllArticles();

  return (
    <section className="field pt-16 pb-24 lg:pt-24">
      <div className="split">
        <div className="rail">
          <div className="flex lg:block gap-x-6 gap-y-1 flex-wrap pb-6 lg:pb-0 border-b lg:border-b-0 border-[var(--rule)] mb-8 lg:mb-0">
            <span className="rail-label">01 — Articles</span>
            <span className="meta lg:block lg:mt-6">{articles.length} published</span>
            <span className="meta lg:block lg:mt-1">Swedish</span>
          </div>
        </div>

        <div className="content">
          <h1 className="display">ARTICLES</h1>
          <p className="measure mt-10 text-[var(--muted)]">
            Skrivet för svenska bolag som försöker gå från att prata om AI till att
            faktiskt ändra hur arbetet görs. Publicerat först hos Stardust Consulting.
          </p>

          <div className="mt-16">
            {articles.map((a, i) => (
              <Link key={a.slug} href={`/articles/${a.slug}`} className="row-link group py-7">
                <div className="flex items-baseline gap-4 sm:gap-8">
                  <span className="meta shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <h2 className="subdisplay">{a.title}</h2>
                    <p className="text-[var(--muted)] mt-3 text-[0.9375rem] leading-relaxed max-w-[34rem] group-hover:text-[var(--accent)] transition-colors">
                      {a.description}
                    </p>
                    <span className="meta block mt-4">{formatDate(a.date)}</span>
                  </div>
                </div>
              </Link>
            ))}
            <div className="rule" />
          </div>

          {articles.length === 0 && (
            <p className="measure mt-10 text-[var(--muted)]">Inget publicerat ännu.</p>
          )}
        </div>
      </div>
    </section>
  );
}
