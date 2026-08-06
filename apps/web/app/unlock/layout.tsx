// The unlock screen belongs to Vibe Check, so it wears Vibe Check's dark design
// rather than the paper-white site shell.
export default function UnlockLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#0f0f0f] text-gray-200">{children}</div>;
}
