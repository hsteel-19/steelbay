import { getSkills, formatBytes } from '@/lib/skills';

export const metadata = {
  title: 'Claude',
  description: 'Skills I have written for Claude — free to download and use.',
};

// The one idea behind each skill, written for a reader deciding whether to bother.
// `before` is for the steps a skill cannot do for you, because they happen before
// the skill is installed.
const notes: Record<
  string,
  { headline: string; body: string; idea: string; before?: string }
> = {
  'loop-engineering': {
    headline: 'Decide whether a task should be an agent loop at all, then design one that stops.',
    body: 'Runs a decision check before designing anything — can fresh feedback change the next step, can "done" be defined objectively, does the agent have a real way to verify. If any of the three fails it tells you to write a single sharp prompt instead. If they pass, it builds the loop around observe → choose → act → verify → record, with named end states so a hit budget cap is never dressed up as success.',
    idea: 'A loop is only as good as its stop condition. The cheapest way for an agent to raise its own score is to move the target — so the goal has to live somewhere that changing it is visible.',
  },
  'cowork-setup': {
    headline: 'Set up Claude Cowork the right way.',
    body: 'A step-by-step walkthrough of how I set mine up, built from my own experience and a lot of ideas taken from people on the internet. It takes about twenty minutes. What you get back is a folder Claude reads at the start of every session, so you stop spending the first ten messages explaining who you are and what good looks like.',
    idea: 'The three files it builds are read at the start of every session, so length is a cost you pay every time, not once. That is why it interviews you instead of letting you write them. Nobody edits their own about-me down.',
    before:
      'Two things it cannot do for you, because they happen first: make a folder called Claude Cowork, and select it in the Cowork app. Then hand it this skill.',
  },
};

export default function ClaudePage() {
  const skills = getSkills();

  return (
    <section className="field pt-16 pb-24 lg:pt-24">
      <div className="split">
        <div className="rail">
          <div className="flex lg:block gap-x-6 gap-y-1 flex-wrap pb-6 lg:pb-0 border-b lg:border-b-0 border-[var(--rule)] mb-8 lg:mb-0">
            <span className="rail-label">02 — Claude</span>
            <span className="meta lg:block lg:mt-6">{skills.length} skills</span>
            <span className="meta lg:block lg:mt-1">Free to use</span>
          </div>
        </div>

        <div className="content">
          <h1 className="display">CLAUDE</h1>

          <p className="measure mt-10">
            Skills I have written for Claude, free to download. A skill is one{' '}
            <code className="font-mono text-[0.9em]">SKILL.md</code> file, sometimes with
            a few reference files beside it — instructions Claude loads when the task
            calls for them, and ignores when it does not.
          </p>
          <p className="measure mt-5 text-[var(--muted)]">
            The interesting part was never the syntax. It is deciding what the
            instruction should actually say.
          </p>

          {/* The install path, because a skill nobody can install is just a file. */}
          <div className="mt-12 pl-5 border-l border-[var(--rule)]">
            <p className="rail-label">Installing one</p>
            <ol className="mt-4 space-y-2.5 max-w-[32rem]">
              {[
                'Download the zip below. Leave it zipped.',
                'In Claude, open Settings → Customize → Skills → Add → Upload a skill.',
                'Upload the zip and turn the skill on.',
                'Start a new Cowork session and describe your task. Claude loads the skill when it fits — you do not have to call it by name.',
              ].map((step, i) => (
                <li key={i} className="flex gap-4 text-[0.9375rem] leading-relaxed">
                  <span className="meta shrink-0 pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-16">
            {skills.map((skill, i) => {
              const note = notes[skill.slug];
              return (
                <article key={skill.slug} className="rule py-9">
                  <div className="flex items-baseline gap-4 sm:gap-8">
                    <span className="meta shrink-0">{String(i + 1).padStart(2, '0')}</span>

                    <div className="min-w-0 w-full">
                      <h2 className="subdisplay font-mono !text-[clamp(1.25rem,2.4vw,1.75rem)]">
                        {skill.name}
                      </h2>

                      {note && (
                        <>
                          <p className="mt-3 text-[1.0625rem] leading-relaxed max-w-[34rem]">
                            {note.headline}
                          </p>
                          <p className="mt-4 text-[0.9375rem] leading-relaxed max-w-[34rem] text-[var(--muted)]">
                            {note.body}
                          </p>
                          <p className="mt-6 pl-5 border-l-2 border-[var(--accent)] text-[1.0625rem] leading-snug max-w-[32rem]">
                            {note.idea}
                          </p>
                          {note.before && (
                            <p className="mt-6 meta max-w-[34rem] leading-relaxed">
                              {note.before}
                            </p>
                          )}
                        </>
                      )}

                      {/* The real file tree, read from the repo at build time. */}
                      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                        <a
                          href={`/skills/${skill.slug}.zip`}
                          download
                          className="rail-label !text-[var(--ink)] border border-[var(--rule)] px-4 py-2.5
                                     hover:border-[var(--accent)] hover:!text-[var(--accent)] transition-colors"
                        >
                          Download ↓
                        </a>
                        <span className="meta">
                          {skill.files.length} files
                          {skill.zipBytes !== null && ` · ${formatBytes(skill.zipBytes)}`}
                        </span>
                      </div>

                      <ul className="mt-5 space-y-0.5">
                        {skill.files.map(f => (
                          <li key={f} className="meta">
                            {skill.slug}/{f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              );
            })}
            <div className="rule" />
          </div>

          <p className="meta mt-10 max-w-[34rem] leading-relaxed">
            Use them, change them, strip out the parts you disagree with. If one is
            wrong or you make it better, I would genuinely like to know.
          </p>
        </div>
      </div>
    </section>
  );
}
