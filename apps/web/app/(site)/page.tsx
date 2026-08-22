import Link from 'next/link';
import Image from 'next/image';
import { getAllArticles } from '@/lib/articles';
import { findImage } from '@/lib/media';

const sections = [
  {
    n: '01',
    href: '/articles',
    title: 'Articles',
    note: 'Writing about AI-native companies, with a focus on operations.',
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
  {
    n: '05',
    href: '/music',
    title: 'Music',
    note: 'Mixes I record when I DJ, uploaded full length.',
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
            {/* The name still has to be the page's h1 for search and screen readers.
                It is just not the thing you look at — the picture is. */}
            <h1 className="sr-only">Henrik Ståhle</h1>

            {/* Image, accent plane and line share one width so they read as a single
                stacked block rather than three things that happen to be near each
                other. Change HERO_W and all three move together. */}
            {hero && (
              <Image
                src={hero.src}
                alt="Henrik Ståhle and a baby, both in spacesuits, floating above Earth. Generated, not photographed."
                width={hero.width}
                height={hero.height}
                priority
                sizes="(min-width: 640px) 25rem, 100vw"
                className="w-full max-w-[25rem] h-auto rounded-xl border border-[var(--rule)]"
              />
            )}

            {/* The single accent plane. DESIGN.md: applied as a plane, not decoration. */}
            <div
              className="mt-5 h-2 w-full max-w-[25rem]"
              style={{ backgroundColor: 'var(--accent)' }}
              aria-hidden="true"
            />

            <p className="mt-9 text-[1.0625rem] leading-[1.55]">
              Dropping things I do around AI here.
            </p>

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
