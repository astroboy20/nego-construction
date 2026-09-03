import sharp from 'sharp';
import { readdir, stat, rename, unlink, writeFile } from 'fs/promises';
import { join, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');

const SKIP_DIRS = ['marquee'];
const SKIP_FILES = ['logo.png', 'placeholder', 'next.svg', 'vercel.svg', 'globe.svg', 'file.svg', 'window.svg', 'icon.svg', 'favicon'];
const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;
const MAX_WIDTH = 2400;

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.some(s => entry.name.includes(s))) {
        files.push(...await getFiles(full));
      }
    } else {
      const ext = extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        if (!SKIP_FILES.some(s => entry.name.toLowerCase().includes(s))) {
          files.push(full);
        }
      }
    }
  }
  return files;
}

async function compress(file) {
  const ext = extname(file).toLowerCase();
  const s = await stat(file);
  const originalKB = Math.round(s.size / 1024);
  const tmp = file + '.tmp';

  try {
    const meta = await sharp(file).metadata();
    const needsResize = meta.width && meta.width > MAX_WIDTH;

    let pipeline = sharp(file);
    if (needsResize) pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });

    let buf;
    if (ext === '.png') {
      buf = await pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toBuffer();
    } else {
      buf = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
    }

    const newKB = Math.round(buf.length / 1024);
    const saving = Math.round((1 - buf.length / s.size) * 100);

    if (buf.length < s.size) {
      // Write to temp then rename (avoids read-write conflict)
      await writeFile(tmp, buf);
      await unlink(file);
      await rename(tmp, file);
      console.log(`✓ ${file.replace(PUBLIC, '')}  ${originalKB}KB → ${newKB}KB  (-${saving}%)`);
    } else {
      console.log(`  ${file.replace(PUBLIC, '')}  already optimal (${originalKB}KB)`);
    }
  } catch (e) {
    try { await unlink(tmp); } catch {}
    console.error(`✗ ${file.replace(PUBLIC, '')}  ${e.message.split('\n')[0]}`);
  }
}

const files = await getFiles(PUBLIC);
console.log(`\nCompressing ${files.length} images...\n`);

// Process one at a time to avoid file lock conflicts on Windows
let saved = 0;
let total = 0;
for (const file of files) {
  const before = (await stat(file)).size;
  await compress(file);
  try {
    const after = (await stat(file)).size;
    saved += before - after;
    total += before;
  } catch {}
}

console.log(`\nTotal saved: ${Math.round(saved / 1024 / 1024 * 10) / 10}MB of ${Math.round(total / 1024 / 1024 * 10) / 10}MB original`);
