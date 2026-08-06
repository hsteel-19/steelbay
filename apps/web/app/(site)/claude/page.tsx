import Link from 'next/link';

export const metadata = {
  title: 'Claude',
  description: 'Skills, instructions and agent loops built for learning — and kept public.',
};

export default function ClaudePage() {
  return (
    <section className="field pt-16 pb-24 lg:pt-24">
      <div className="split">
        <div className="rail">
          <div className="flex lg:block gap-x-6 gap-y-1 flex-wrap pb-6 lg:pb-0 border-b lg:border-b-0 border-[var(--rule)] mb-8 lg:mb-0">
            <span className="rail-label">02 — Claude</span>
            <span className="meta lg:block lg:mt-6">Skills</span>
            <span className="meta lg:block lg:mt-1">Agent loops</span>
          </div>
        </div>

        <div className="content">
          <h1 className="display">CLAUDE</h1>

          <p className="measure mt-10">
            The skills, instructions and loops I build to work with Claude. Most of them
            exist because I wanted to learn something specific, not because anyone asked
            for them.
          </p>
          <p className="measure mt-5 text-[var(--muted)]">
            The thing I keep coming back to: a loop is only as good as its stop condition.
            An agent that cannot check its own work will happily iterate forever, and an
            agent that grades itself will always find that the cheapest way to raise a
            score is to move the target.
          </p>

          {/* Honest empty state. Nothing fabricated — the list gets filled from the
              real skills once Henrik decides which are public. */}
          <div className="mt-16 rule pt-8">
            <span className="rail-label">Not yet published</span>
            <p className="measure mt-4 text-[var(--muted)]">
              I have a handful of these running locally. Deciding which are worth
              publishing, and how much of the internals to show.
            </p>
            <Link
              href="/projects"
              className="rail-label inline-block mt-8 hover:text-[var(--accent)] transition-colors"
            >
              Projects instead →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
