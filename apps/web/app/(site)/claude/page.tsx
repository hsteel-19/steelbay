export const metadata = {
  title: 'Claude',
  description: 'Skills and agent loops I build for Claude — mostly to learn, kept public in case they are useful.',
};

const skills = [
  {
    n: '01',
    name: 'loop-engineering',
    summary:
      'Decide whether a task should be an agent loop at all, then design one that actually stops.',
    body: 'Most tasks should not be loops. The skill runs a decision check first — can fresh feedback change the next step, can "done" be defined objectively, does the agent have a real way to verify — and recommends a single sharp prompt when any of the three fails. If it passes, it builds the loop around observe → choose → act → verify → record, with named end states so a hit budget cap is never reported as success.',
    idea: 'A loop is only as good as its stop condition. The cheapest way for an agent to raise its own score is to move the target — so the premise has to live somewhere changing it is visible.',
    shape: 'SKILL.md + 3 references (decision checklist, playbook, illustrated walk-through)',
    lang: 'English',
  },
  {
    n: '02',
    name: 'stardust-cowork',
    summary:
      'Gets a Stardust consultant from zero to a working Claude Cowork setup, one step at a time.',
    body: 'Asks where the person actually is before answering — setting up from scratch, stuck on a specific step, or wanting to see a real project as a reference — then switches mode accordingly. Covers folder structure, ABOUT ME files, global instructions and project layout. It waits for confirmation between steps instead of dumping the whole guide at once.',
    idea: 'Setup guides fail because they answer a question nobody asked yet. Ask which of four situations the person is in first, and most of the guide becomes irrelevant — which is the point.',
    shape: 'Single SKILL.md, Swedish, four branching modes',
    lang: 'Svenska',
  },
];

export default function ClaudePage() {
  return (
    <section className="field pt-16 pb-24 lg:pt-24">
      <div className="split">
        <div className="rail">
          <div className="flex lg:block gap-x-6 gap-y-1 flex-wrap pb-6 lg:pb-0 border-b lg:border-b-0 border-[var(--rule)] mb-8 lg:mb-0">
            <span className="rail-label">02 — Claude</span>
            <span className="meta lg:block lg:mt-6">{skills.length} skills</span>
            <span className="meta lg:block lg:mt-1">More coming</span>
          </div>
        </div>

        <div className="content">
          <h1 className="display">CLAUDE</h1>

          <p className="measure mt-10">
            Skills I have written for Claude. Most exist because I wanted to learn
            something specific, not because anyone asked for them.
          </p>
          <p className="measure mt-5 text-[var(--muted)]">
            A skill is just a folder with instructions Claude loads when the task calls
            for it. The interesting part is not the syntax — it is deciding what the
            instruction should actually say.
          </p>

          <div className="mt-16">
            {skills.map(({ n, name, summary, body, idea, shape, lang }) => (
              <article key={name} className="rule py-8">
                <div className="flex items-baseline gap-4 sm:gap-8">
                  <span className="meta shrink-0">{n}</span>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <h2 className="subdisplay font-mono !text-[clamp(1.25rem,2.4vw,1.75rem)]">
                        {name}
                      </h2>
                      <span className="rail-label">{lang}</span>
                    </div>

                    <p className="mt-3 text-[1.0625rem] leading-relaxed max-w-[34rem]">
                      {summary}
                    </p>
                    <p className="mt-4 text-[0.9375rem] leading-relaxed max-w-[34rem] text-[var(--muted)]">
                      {body}
                    </p>

                    <p className="mt-6 pl-5 border-l-2 border-[var(--accent)] text-[1.0625rem] leading-snug max-w-[32rem]">
                      {idea}
                    </p>

                    <span className="meta block mt-6">{shape}</span>
                  </div>
                </div>
              </article>
            ))}
            <div className="rule" />
          </div>
        </div>
      </div>
    </section>
  );
}
