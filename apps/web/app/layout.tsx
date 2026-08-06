import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Steelbay',
    template: '%s — Steelbay',
  },
  description: 'Henrik Ståhle — projects, experiments and writing.',
};

const nav = [
  { href: '/', label: 'Home' },
  { href: '/vibe-check', label: 'Vibe Check' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0f0f0f] text-gray-200 antialiased">
        <header className="border-b border-white/5">
          <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold text-white tracking-tight">
              steelbay
            </Link>
            <div className="flex items-center gap-5 ml-auto">
              {nav.slice(1).map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </header>

        {children}

        <footer className="border-t border-white/5 mt-20">
          <div className="max-w-5xl mx-auto px-6 py-8 text-xs text-gray-600">
            © {new Date().getFullYear()} Henrik Ståhle
          </div>
        </footer>
      </body>
    </html>
  );
}
