import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Henrik's Vibe Check",
  description: 'Daily mood tracking dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body className="min-h-screen bg-[#0f0f0f] text-gray-200">
        {children}
      </body>
    </html>
  );
}
