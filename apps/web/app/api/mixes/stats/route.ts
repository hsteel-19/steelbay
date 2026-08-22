import { NextResponse } from 'next/server';
import { readStats } from '@/lib/mix-stats';

export const dynamic = 'force-dynamic';

/** Like and play counts for every mix, in one request on page load. */
export async function GET() {
  const stats = await readStats();
  return NextResponse.json(
    stats ? { stats, enabled: true } : { stats: {}, enabled: false },
  );
}
