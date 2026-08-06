import type { Metadata } from 'next';
import { Familjen_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const grotesk = Familjen_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-grotesk',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Henrik Ståhle — Steelbay',
    template: '%s — Steelbay',
  },
  description: 'Henrik Ståhle — AI projects, agent loops and writing.',
};

// Root layout holds the document only. The site shell lives in (site)/layout,
// and /vibe-check brings its own dark shell — the two designs are deliberate,
// not an unfinished seam.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
