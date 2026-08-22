import Image from 'next/image';
import MixPlayer from '@/components/MixPlayer';
import { getMixGroups, getAllMixes } from '@/lib/mixes';
import { getPhotos, type PhotoScale } from '@/lib/photos';

export const metadata = {
  title: 'Music',
  description: 'Various mixtapes from Hempi',
};

/** The three hanging sizes. Kept out of the JSX so the wall is tuned in one place. */
const scaleClass: Record<PhotoScale, string> = {
  sm: 'h-20 sm:h-28',
  md: 'h-28 sm:h-40',
  lg: 'h-36 sm:h-52',
};

export default function MusicPage() {
  const groups = getMixGroups();
  const all = getAllMixes();
  const photos = getPhotos();
  const total = all.reduce((sum, m) => sum + m.duration, 0);

  return (
    <section className="field pt-16 pb-24 lg:pt-24">
      <div className="split">
        <div className="rail">
          <div className="flex lg:block gap-x-6 gap-y-1 flex-wrap pb-6 lg:pb-0 border-b lg:border-b-0 border-[var(--rule)] mb-8 lg:mb-0">
            <span className="rail-label">05 — Music</span>
            <span className="meta lg:block lg:mt-6">{all.length} mixes</span>
            <span className="meta lg:block lg:mt-1">{Math.round(total / 3600)} hours</span>
          </div>
        </div>

        <div className="content">
          <h1 className="display">MUSIC</h1>

          <p className="measure mt-10 text-[var(--muted)]">Various mixtapes, various genres</p>

          <div className="mt-16">
            <MixPlayer groups={groups} />
          </div>

          {photos.length > 0 && (
            <section className="mt-16">
              <h2 className="rail-label">Pics</h2>
              {/* A gallery wall: three hanging sizes, every aspect ratio left
                  alone, all of it aligned to a common bottom edge — which is
                  what makes a row of mismatched frames read as hung rather than
                  as scattered. Cropping to a uniform square was tried first and
                  took the venue and the date clean off the 9:16 posters. */}
              <div className="mt-4 flex flex-wrap items-end gap-3 sm:gap-4">
                {photos.map(photo => (
                  <Image
                    key={photo.src}
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="320px"
                    className={`w-auto border border-[var(--rule)] ${scaleClass[photo.scale]}`}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
