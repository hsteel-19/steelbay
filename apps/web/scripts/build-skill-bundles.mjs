// Zips every folder in content/skills/ into public/skills/<name>.zip.
// Runs before build (and can be run by hand), so the downloadable bundle can
// never drift from the skill files that are actually in the repo.
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

const SRC = path.join(process.cwd(), 'content/skills');
const OUT = path.join(process.cwd(), 'public/skills');

if (!fs.existsSync(SRC)) {
  console.log('No content/skills — nothing to bundle.');
  process.exit(0);
}

fs.mkdirSync(OUT, { recursive: true });

const skills = fs
  .readdirSync(SRC, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

await Promise.all(
  skills.map(
    name =>
      new Promise((resolve, reject) => {
        const outFile = path.join(OUT, `${name}.zip`);
        const stream = fs.createWriteStream(outFile);
        const archive = archiver('zip', { zlib: { level: 9 } });

        stream.on('close', () => {
          console.log(`  ${name}.zip — ${archive.pointer()} bytes`);
          resolve();
        });
        archive.on('error', reject);
        archive.pipe(stream);
        // Nest under the skill name so unzipping produces a usable skill folder.
        archive.directory(path.join(SRC, name), name);
        archive.finalize();
      })
  )
);

console.log(`Bundled ${skills.length} skill(s).`);
