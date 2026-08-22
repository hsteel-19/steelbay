import Image from 'next/image';
import MixPlayer from '@/components/MixPlayer';
import { getMixGroups, getAllMixes } from '@/lib/mixes';
import { getPhotos } from '@/lib/photos';

export const metadata = {
  title: 'Music',
  description: 'Various mixtapes from Hempi',
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

          <p className="measure mt-10 text-[var(--muted)]">Various mixtapes :)</p>

          <div className="mt-16">
            <MixPlayer groups={groups} />
          </div>

          {photos.length > 0 && (
            <section className="mt-16">
              <h2 className="rail-label">Live</h2>
              {/* One height, natural widths. The library mixes 9:16 gig posters
                  with 3:2 photographs: cropping them to a common square took the
                  venue and the date clean off the posters, and a masonry left
                  ragged column bottoms. A shared baseline keeps the row tidy
                  without touching a single image. */}
              <div className="mt-4 flex flex-wrap items-start gap-3">
                {photos.map(photo => (
                  <Image
                    key={photo.src}
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="240px"
                    className="h-28 sm:h-36 w-auto border border-[var(--rule)]"
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
