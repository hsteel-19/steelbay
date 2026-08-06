import Link from 'next/link';

// Vibe Check keeps its own dark design — a deliberate contrast with the paper-white
// site, not an unfinished seam. Decided with Henrik, 2026-08-06.
export default function VibeCheckLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f] text-gray-200">
      <header className="border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-6">
          <Link
            href="/"
            className="text-[0.6875rem] uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
          >
            ← Steelbay
          </Link>
          <span className="ml-auto text-[0.6875rem] uppercase tracking-[0.14em] text-gray-600">
            Private
          </span>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-white/5 mt-20">
        <div className="max-w-5xl mx-auto px-6 py-8 text-xs text-gray-600">
          © {new Date().getFullYear()} Henrik Ståhle
        </div>
      </footer>
    </div>
  );
}
