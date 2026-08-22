import { findImage, type SizedImage } from '@/lib/media';

/**
 * How big this one hangs. Not derived from the file — a gallery wall is a
 * composition, so the sizes are chosen against each other by eye.
 */
export type PhotoScale = 'sm' | 'md' | 'lg';

export interface Photo extends SizedImage {
  alt: string;
  scale: PhotoScale;
}

/**
 * The live gallery. Add one with ./scripts/add-photo.sh <slug> <photo.jpg>,
 * then a row here.
 *
 * Shapes are deliberately mixed — some of these are 9:16 gig posters, some are
 * 3:2 photographs. The gallery lays them out in columns rather than cropping
 * them square, which took the venue and date off the top and bottom of the
 * posters.
 */
const photos: { slug: string; alt: string; scale: PhotoScale }[] = [
  { slug: 'menti-festival-1', alt: 'Hempi playing at Menti Festival', scale: 'lg' },
  { slug: 'lydmar-1', alt: 'Poster for a Hempi set at Lydmar', scale: 'sm' },
  { slug: 'oddbar-1', alt: 'Hempi playing at Oddbar', scale: 'md' },
  { slug: 'lydmar-2', alt: 'Poster for a Hempi set at Lydmar Hotel', scale: 'md' },
  { slug: 'menti-festival-2', alt: 'Hempi playing at Menti Festival', scale: 'sm' },
  { slug: 'oddbar-2', alt: 'Poster for a Hempi set at Oddbar', scale: 'lg' },
];

/**
 * Real dimensions come off the file, so the browser reserves the right space in
 * a column layout instead of reflowing as each image lands. A missing file
 * drops out rather than rendering a broken tile.
 */
export function getPhotos(): Photo[] {
  return photos.flatMap(({ slug, alt, scale }) => {
    const found = findImage('/live', slug);
    return found ? [{ ...found, alt, scale }] : [];
  });
}
