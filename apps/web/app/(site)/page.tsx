import Link from 'next/link';
import Image from 'next/image';
import { getAllArticles } from '@/lib/articles';
import { findImage } from '@/lib/media';

const sections = [
  {
    n: '01',
    href: '/articles',
    title: 'Articles',
    note: 'Writing on AI-first organisations, governance and what actually changes.',
  },
  {
    n: '02',
    href: '/claude',
    title: 'Claude',
    note: 'Skills, instructions and agent setups I build — mostly to learn, kept public in case they are useful.',
  },
  {
    n: '03',
    href: '/projects',
    title: 'Projects',
    note: 'Things I have built. Some shipped, some abandoned on purpose.',
  },
  {
    n: '04',
    href: '/vibe-check',
    title: 'Vibe Check',
    note: 'A spoken reflection every weekday, transcribed and rated. Private.',
    locked: true,
  },
];

export default function Home() {
  const articleCount = getAllArticles().length;
  const hero = findImage('/hero', 'hero');

  return (
    <>
      {/* Hero. Vertical padding sits INSIDE the grid so the column rule runs
          unbroken into the next section — a rule that stops and restarts reads
          as two pages stapled together. */}
      <section className="field pt-16 lg:pt-24">
        <div className="split">
          <div className="rail">
            {/* On mobile this stays a meta row with its own rule and numbering —
                not a stacked list. See DESIGN.md, Known failure mode. */}
            <div className="flex lg:block gap-x-6 gap-y-1 flex-wrap pb-6 lg:pb-0 border-b lg:border-b-0 border-[var(--rule)] mb-8 lg:mb-0">
              <span className="rail-label">00 — Index</span>
            </div>
          </div>

          <div className="content">
            <h1 className="display">
              HENRIK
              <br />
              STÅHLE
            </h1>

            {/* The single accent plane. DESIGN.md: applied as a plane, not decoration. */}
            <div
              className="mt-10 h-2 w-full max-w-[22rem]"
              style={{ backgroundColor: 'var(--accent)' }}
              aria-hidden="true"
            />

            {/* Text and image share a sub-grid so the picture sits IN the grid as an
                element, rather than floating behind the type as decoration. Stacks
                at mobile, side by side from 1024px. */}
            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12 lg:items-start">
              <div>
                <p className="text-[1.0625rem] leading-[1.55]">
                  Dropping things I do around AI here.
                </p>
              </div>

              {hero && (
                <figure>
                  <Image
                    src={hero.src}
                    alt="Henrik and his daughter, as astronauts, somewhere above Earth"
                    width={hero.width}
                    height={hero.height}
                    priority
                    sizes="(min-width: 1024px) 44rem, 100vw"
                    className="w-full h-auto rounded-xl border border-[var(--rule)]"
                  />
                  <figcaption className="meta mt-3">
                    Not a real photo. That is rather the point.
                  </figcaption>
                </figure>
              )}
            </div>

            <div className="pb-20 lg:pb-28" />
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="field pb-24">
        <div className="split">
          <div className="rail">
            <span className="rail-label">Sections</span>
          </div>
          <div className="content">
            {sections.map(({ n, href, title, note, locked }) => (
              <Link key={href} href={href} className="row-link group py-6">
                <div className="flex items-baseline gap-4 sm:gap-8">
                  <span className="meta shrink-0">{n}</span>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="subdisplay">{title}</span>
                      {locked && <span className="rail-label">Private</span>}
                      {href === '/articles' && articleCount > 0 && (
                        <span className="rail-label">{articleCount} pcs</span>
                      )}
                    </div>
                    <p className="text-[var(--muted)] mt-2 text-[0.9375rem] leading-relaxed max-w-[34rem] group-hover:text-[var(--accent)] transition-colors">
                      {note}
                    </p>
                  </div>
                  <span className="meta ml-auto shrink-0 hidden sm:block">→</span>
                </div>
              </Link>
            ))}
            <div className="rule" />
          </div>
        </div>
      </section>
    </>
  );
}
