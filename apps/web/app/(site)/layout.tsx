import Link from 'next/link';

const nav = [
  { href: '/articles', label: 'Articles' },
  { href: '/claude', label: 'Claude' },
  { href: '/projects', label: 'Projects' },
  { href: '/vibe-check', label: 'Vibe Check' },
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Four items plus the wordmark do not fit on one 375px line. Rather than
          let the nav scroll sideways and hide Vibe Check behind a scrollbar, it
          drops to its own rule-separated row — a deliberate second band, not an
          overflow accident. */}
      <header>
        <div className="field flex items-center h-16">
          <Link href="/" className="rail-label !text-[var(--ink)] tracking-[0.2em]">
            STEELBAY
          </Link>
          <nav className="ml-auto hidden sm:flex items-center gap-6">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rail-label whitespace-nowrap hover:text-[var(--accent)] transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <nav className="sm:hidden rule">
          <div className="field flex items-center justify-between h-11">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rail-label whitespace-nowrap hover:text-[var(--accent)] transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="rule mt-24">
        <div className="field py-8 flex flex-wrap gap-x-8 gap-y-2">
          <span className="meta">© {new Date().getFullYear()} Henrik Ståhle</span>
          <span className="meta">Stockholm</span>
          <a
            className="meta hover:text-[var(--accent)] transition-colors"
            href="https://stardustconsulting.se"
            target="_blank"
            rel="noreferrer"
          >
            Stardust Consulting ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
