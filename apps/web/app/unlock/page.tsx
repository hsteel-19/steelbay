import { safeNextPath } from '@/lib/auth';

export const metadata = {
  title: 'Unlock — Steelbay',
  robots: { index: false, follow: false },
};

export default function UnlockPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  const next = safeNextPath(searchParams.next);
  const failed = searchParams.error === '1';

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-xs">
        <h1 className="text-lg font-medium text-white text-center">Private</h1>
        <p className="text-gray-500 text-sm text-center mt-2 mb-8">
          Enter the six-digit code to continue.
        </p>

        <form action="/api/unlock" method="POST" className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <input
            type="text"
            name="code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            autoComplete="off"
            autoFocus
            required
            aria-label="Six-digit code"
            aria-invalid={failed}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3
                       text-center text-2xl tracking-[0.5em] text-white
                       focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20"
          />

          {failed && (
            <p role="alert" className="text-red-400 text-sm text-center">
              Wrong code. Try again.
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-white/10 hover:bg-white/15 border border-white/10
                       rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors"
          >
            Unlock
          </button>
        </form>
      </div>
    </main>
  );
}
