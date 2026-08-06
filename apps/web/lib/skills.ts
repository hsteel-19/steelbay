import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SKILLS_DIR = path.join(process.cwd(), 'content/skills');

export interface Skill {
  slug: string;
  name: string;
  description: string;
  /** Every file in the skill, relative to its folder — the real tree, not a guess. */
  files: string[];
  /** Bytes of the generated zip, or null if it has not been built yet. */
  zipBytes: number | null;
}

function walk(dir: string, base = ''): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap(entry => {
      const rel = base ? `${base}/${entry.name}` : entry.name;
      return entry.isDirectory() ? walk(path.join(dir, entry.name), rel) : [rel];
    })
    .sort();
}

export function getSkills(): Skill[] {
  if (!fs.existsSync(SKILLS_DIR)) return [];

  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => {
      const dir = path.join(SKILLS_DIR, d.name);
      const { data } = matter(fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8'));
      const zip = path.join(process.cwd(), 'public/skills', `${d.name}.zip`);
      return {
        slug: d.name,
        name: data.name ?? d.name,
        description: data.description ?? '',
        files: walk(dir),
        zipBytes: fs.existsSync(zip) ? fs.statSync(zip).size : null,
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function formatBytes(bytes: number): string {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} kB`;
}
