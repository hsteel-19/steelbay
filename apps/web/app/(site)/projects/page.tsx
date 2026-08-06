import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export const metadata = {
  title: 'Projects',
  description: 'Things I have built with AI in the loop.',
};

interface Shot {
  src: string;
  alt: string;
}

interface Project {
  n: string;
  href: string;
  external?: boolean;
  title: string;
  status: string;
  lede: string;
  body: string[];
  stack: string;
  shots?: Shot[];
}

// Only things that actually exist. No placeholder cards, no invented screenshots.
const projects: Project[] = [
  {
    n: '01',
    href: 'https://pollio.se/',
    external: true,
    title: 'Pollio',
    status: 'Live · pollio.se',
    lede: 'Live audience polling. Built in a weekend to find out whether that sentence could still be true.',
    body: [
      'Claude Code shipped in December 2025. I think that will be remembered as the start of the agent era — the point where it stopped being obvious that shipping a product requires developers writing code.',
      'So I asked a specific question and gave myself a weekend to answer it: could I rebuild the core of a product that a company of several hundred people spent years building? I picked Mentimeter.',
      '25 hours, start to finish. Interactive polls, audience answering from their phones, results updating live on screen, working payment tiers. It runs.',
      'The product was not really the point. The point was finding out that a product manager can go from idea to a working, paid product with no designer and no developer in the loop. That changed what I think my job is — and it is why everything else on this site exists.',
    ],
    stack: 'Built with Claude Code · ~25 hours · Swedish data residency',
    shots: [
      { src: '/projects/pollio-landing.png', alt: 'Pollio landing page' },
      { src: '/projects/pollio-app.png', alt: 'Pollio presentation dashboard' },
    ],
  },
  {
    n: '02',
    href: '/vibe-check',
    title: 'Vibe Check',
    status: 'Live · private',
    lede: 'A spoken reflection every weekday, rated and analysed without me touching anything.',
    body: [
      'I record a short reflection each weekday and rate the day green, yellow or red. A scheduled job pulls the transcript from Fireflies, Claude extracts the rating and a summary, and it lands in Postgres.',
      'The dashboard is a heatmap of the year plus a monthly analysis that reads the month back to me — what lifted, what weighed, and what to try next month. Days with no recording are stored explicitly as gray rather than left absent, because "I did not record" and "no data" are different facts.',
      'The whole constraint was that it must not need maintenance. It runs on GitHub Actions and commits a heartbeat file, because scheduled workflows get auto-disabled after 60 days of repo silence — which already happened once, quietly, for two days.',
    ],
    stack: 'Next.js · Supabase · Claude API · GitHub Actions',
  },
];

/** Only render a screenshot once the file actually exists in /public. */
function existingShots(shots?: Shot[]): Shot[] {
  if (!shots) return [];
  return shots.filter(s => fs.existsSync(path.join(process.cwd(), 'public', s.src)));
}

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
            Built end to end, mostly in evenings and weekends. Listed here only once they
            actually run.
          </p>

          <div className="mt-16">
            {projects.map(({ n, href, external, title, status, lede, body, stack, shots }) => {
              const visible = existingShots(shots);
              return (
                <article key={title} className="rule py-10">
                  <div className="flex items-baseline gap-4 sm:gap-8">
                    <span className="meta shrink-0">{n}</span>
                    <div className="min-w-0 w-full">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        {external ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="subdisplay hover:text-[var(--accent)] transition-colors"
                          >
                            {title} ↗
                          </a>
                        ) : (
                          <Link
                            href={href}
                            className="subdisplay hover:text-[var(--accent)] transition-colors"
                          >
                            {title}
                          </Link>
                        )}
                        <span className="rail-label">{status}</span>
                      </div>

                      <p className="mt-4 text-[1.0625rem] leading-relaxed max-w-[34rem]">
                        {lede}
                      </p>

                      {visible.length > 0 && (
                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                          {visible.map(s => (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              key={s.src}
                              src={s.src}
                              alt={s.alt}
                              loading="lazy"
                              className="w-full h-auto border border-[var(--rule)]"
                            />
                          ))}
                        </div>
                      )}

                      <div className="mt-6 space-y-4 max-w-[34rem]">
                        {body.map((p, i) => (
                          <p key={i} className="text-[0.9375rem] leading-relaxed text-[var(--muted)]">
                            {p}
                          </p>
                        ))}
                      </div>

                      <span className="meta block mt-6">{stack}</span>
                    </div>
                  </div>
                </article>
              );
            })}
            <div className="rule" />
          </div>
        </div>
      </div>
    </section>
  );
}
