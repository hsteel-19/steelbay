/**
 * Precompute a waveform for a mix from its source WAV.
 *
 * The waveform has to be drawn before a single byte of audio is fetched — a
 * 79MB mix cannot be decoded in the browser just to know how tall the bars are.
 * So the peaks are computed once, here, and shipped as a ~1KB JSON file.
 *
 *   node scripts/mix-peaks.mjs <input.wav> <slug>
 *
 * Writes content/mixes/<slug>.peaks.json and prints the duration in seconds.
 */
import fs from 'fs';
import path from 'path';

const BARS = 480; // one bar per ~2px across the widest field

function readWavHeader(fd) {
  const head = Buffer.alloc(64 * 1024);
  fs.readSync(fd, head, 0, head.length, 0);
  if (head.toString('ascii', 0, 4) !== 'RIFF' || head.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error('not a RIFF/WAVE file');
  }
  let offset = 12;
  let fmt = null;
  // Walk the chunk list rather than assuming fmt-then-data at fixed offsets —
  // exported DJ mixes routinely carry LIST/bext chunks in between.
  while (offset + 8 <= head.length) {
    const id = head.toString('ascii', offset, offset + 4);
    const size = head.readUInt32LE(offset + 4);
    if (id === 'fmt ') {
      fmt = {
        format: head.readUInt16LE(offset + 8),
        channels: head.readUInt16LE(offset + 10),
        sampleRate: head.readUInt32LE(offset + 12),
        bitsPerSample: head.readUInt16LE(offset + 22),
      };
    }
    if (id === 'data') {
      if (!fmt) throw new Error('data chunk precedes fmt chunk');
      return { ...fmt, dataOffset: offset + 8, dataSize: size };
    }
    offset += 8 + size + (size % 2); // chunks are word-aligned
  }
  throw new Error('no data chunk found in the first 64KB');
}

async function peaks(file) {
  const fd = fs.openSync(file, 'r');
  const h = readWavHeader(fd);
  fs.closeSync(fd);

  if (h.bitsPerSample !== 16) throw new Error(`expected 16-bit PCM, got ${h.bitsPerSample}-bit`);

  const bytesPerFrame = (h.bitsPerSample / 8) * h.channels;
  // dataSize can overstate what is actually on disk if the export was truncated.
  const realSize = Math.min(h.dataSize, fs.statSync(file).size - h.dataOffset);
  const frames = Math.floor(realSize / bytesPerFrame);
  const framesPerBar = Math.floor(frames / BARS);
  const duration = frames / h.sampleRate;

  const out = new Array(BARS).fill(0);
  let frame = 0;
  let barMax = 0;

  const stream = fs.createReadStream(file, {
    start: h.dataOffset,
    end: h.dataOffset + frames * bytesPerFrame - 1,
    highWaterMark: 1 << 22,
  });

  let carry = Buffer.alloc(0);
  for await (const chunk of stream) {
    const buf = carry.length ? Buffer.concat([carry, chunk]) : chunk;
    const usable = buf.length - (buf.length % bytesPerFrame);
    carry = buf.subarray(usable);

    for (let i = 0; i < usable; i += bytesPerFrame) {
      // Peak of the loudest channel in the frame. RMS would render a flatter,
      // prettier waveform, but peak is what actually shows where the drops are.
      let v = 0;
      for (let c = 0; c < h.channels; c++) {
        const s = Math.abs(buf.readInt16LE(i + c * 2));
        if (s > v) v = s;
      }
      if (v > barMax) barMax = v;
      frame++;
      if (frame % framesPerBar === 0) {
        const bar = frame / framesPerBar - 1;
        if (bar < BARS) out[bar] = barMax;
        barMax = 0;
      }
    }
  }

  const loudest = Math.max(...out, 1);
  // Quantised to 0-100: a 480-entry array of small ints gzips to well under 1KB,
  // and no waveform is ever drawn precisely enough to need more resolution.
  return { duration, peaks: out.map(v => Math.round((v / loudest) * 100)) };
}

const [input, slug] = process.argv.slice(2);
if (!input || !slug) {
  console.error('usage: node scripts/mix-peaks.mjs <input.wav> <slug>');
  process.exit(1);
}

const { duration, peaks: data } = await peaks(input);
const dir = path.join(process.cwd(), 'content', 'mixes');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, `${slug}.peaks.json`), JSON.stringify(data));
console.log(`${slug}: ${Math.round(duration)}s (${Math.floor(duration / 60)}m) -> content/mixes/${slug}.peaks.json`);
