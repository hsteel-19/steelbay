import fs from 'fs';
import path from 'path';
import { imageSize } from 'image-size';

export interface SizedImage {
  src: string;
  width: number;
  height: number;
}

/**
 * Resolve a public-folder image to its real dimensions, so the browser can
 * reserve space before it loads. Returns null if the file is not there — every
 * caller renders conditionally, so a missing image is a no-op rather than a
 * broken page.
 */
export function sizedImage(publicPath: string): SizedImage | null {
  const file = path.join(process.cwd(), 'public', publicPath);
  if (!fs.existsSync(file)) return null;
  const { width, height } = imageSize(fs.readFileSync(file));
  if (!width || !height) return null;
  return { src: publicPath, width, height };
}

/**
 * Find the first image matching a basename across common extensions, so it does
 * not matter which format gets saved.
 */
export function findImage(dir: string, base: string): SizedImage | null {
  for (const ext of ['png', 'jpg', 'jpeg', 'webp', 'avif']) {
    const found = sizedImage(`${dir}/${base}.${ext}`);
    if (found) return found;
  }
  return null;
}
