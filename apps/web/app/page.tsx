import Link from 'next/link';

// Placeholder landing page. The real design is SB-14 and gets built as the
// first proper agent loop — see BACKLOG.md.
const projects = [
  {
    href: '/vibe-check',
    title: 'Vibe Check',
    description:
      'A spoken daily reflection, transcribed and rated automatically. Private.',
    status: 'Live',
  },
];

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-20">
      <section className="mb-16">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Henrik Ståhle
        </h1>
        <p className="text-gray-400 mt-3 max-w-xl leading-relaxed">
          Things I&apos;m building, mostly with AI in the loop. Some of it is
          useful, some of it is just an experiment that got out of hand.
        </p>
      </section>

      <section>
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
          Projects
        </h2>
        <div className="grid gap-3">
          {projects.map(({ href, title, description, status }) => (
            <Link
              key={href}
              href={href}
              className="group bg-[#1a1a1a] border border-white/5 rounded-lg p-5
                         hover:border-white/15 transition-colors"
            >
              <div className="flex items-baseline gap-3">
                <h3 className="text-white font-medium group-hover:underline">
                  {title}
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 border border-white/10 rounded px-1.5 py-0.5">
                  {status}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-2">{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
