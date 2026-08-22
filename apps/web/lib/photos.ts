import { findImage, type SizedImage } from '@/lib/media';

export interface Photo extends SizedImage {
  alt: string;
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
const photos: { slug: string; alt: string }[] = [
  { slug: 'lydmar-1', alt: 'Poster for a Hempi set at Lydmar' },
  { slug: 'lydmar-2', alt: 'Poster for a Hempi set at Lydmar Hotel' },
  { slug: 'menti-festival-1', alt: 'Hempi playing at Menti Festival' },
  { slug: 'menti-festival-2', alt: 'Hempi playing at Menti Festival' },
  { slug: 'oddbar-1', alt: 'Hempi playing at Oddbar' },
  { slug: 'oddbar-2', alt: 'Hempi playing at Oddbar' },
];

/**
 * Real dimensions come off the file, so the browser reserves the right space in
 * a column layout instead of reflowing as each image lands. A missing file
 * drops out rather than rendering a broken tile.
 */
export function getPhotos(): Photo[] {
  return photos.flatMap(({ slug, alt }) => {
    const found = findImage('/live', slug);
    return found ? [{ ...found, alt }] : [];
  });
}
