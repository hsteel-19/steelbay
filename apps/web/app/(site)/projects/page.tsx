import Link from 'next/link';

export const metadata = {
  title: 'Projects',
  description: 'Things I have built with AI in the loop.',
};

// Only things that actually exist. No placeholder cards, no invented screenshots.
const projects = [
  {
    n: '01',
    href: '/vibe-check',
    title: 'Vibe Check',
    status: 'Live · private',
    body: 'A spoken reflection every weekday, pulled from Fireflies, parsed and rated green/yellow/red by Claude, then written to Postgres. A heatmap of the year, and a monthly analysis that reads the month back to me. Runs itself on GitHub Actions — the whole point was that it must not need maintenance.',
    stack: 'Next.js · Supabase · Claude API · GitHub Actions',
  },
];

export default function ProjectsPage() {
  return (
    <section className="field pt-16 pb-24 lg:pt-24">
      <div className="split">
        <div className="rail">
          <div className="flex lg:block gap-x-6 gap-y-1 flex-wrap pb-6 lg:pb-0 border-b lg:border-b-0 border-[var(--rule)] mb-8 lg:mb-0">
            <span className="rail-label">03 — Projects</span>
            <span className="meta lg:block lg:mt-6">{projects.length} listed</span>
          </div>
        </div>

        <div className="content">
          <h1 className="display">PROJECTS</h1>

          <p className="measure mt-10 text-[var(--muted)]">
            Built end to end, mostly in evenings. Listed here only once they actually run.
          </p>

          <div className="mt-16">
            {projects.map(({ n, href, title, status, body, stack }) => (
              <Link key={href} href={href} className="row-link group py-7">
                <div className="flex items-baseline gap-4 sm:gap-8">
                  <span className="meta shrink-0">{n}</span>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <h2 className="subdisplay">{title}</h2>
                      <span className="rail-label">{status}</span>
                    </div>
                    <p className="text-[var(--muted)] mt-3 text-[0.9375rem] leading-relaxed max-w-[34rem] group-hover:text-[var(--accent)] transition-colors">
                      {body}
                    </p>
                    <span className="meta block mt-4">{stack}</span>
                  </div>
                </div>
              </Link>
            ))}
            <div className="rule" />
          </div>
        </div>
      </div>
    </section>
  );
}
