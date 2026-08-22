import MixPlayer from '@/components/MixPlayer';
import { getMixes } from '@/lib/mixes';
import { formatDuration } from '@/lib/duration';

export const metadata = {
  title: 'Music',
  description: 'Mixes I record when I DJ, uploaded full length.',
};

export default function MusicPage() {
  const mixes = getMixes();
  const total = mixes.reduce((sum, m) => sum + m.duration, 0);

  return (
    <section className="field pt-16 pb-24 lg:pt-24">
      <div className="split">
        <div className="rail">
          <div className="flex lg:block gap-x-6 gap-y-1 flex-wrap pb-6 lg:pb-0 border-b lg:border-b-0 border-[var(--rule)] mb-8 lg:mb-0">
            <span className="rail-label">05 — Music</span>
            <span className="meta lg:block lg:mt-6">{mixes.length} mixes</span>
            <span className="meta lg:block lg:mt-1">{Math.round(total / 3600)} hours</span>
          </div>
        </div>

        <div className="content">
          <h1 className="display">MUSIC</h1>

          <p className="measure mt-10 text-[var(--muted)]">Various mixtapes :)</p>

          <div className="mt-16">
            <MixPlayer mixes={mixes} />
          </div>

          <p className="meta mt-8">
            {mixes.length} mixes · {formatDuration(total)} total · the heart saves to this
            browser, there is no counter behind it
          </p>
        </div>
      </div>
    </section>
  );
}
