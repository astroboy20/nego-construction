import sharp from 'sharp';
import { readdir, unlink, stat } from 'fs/promises';
import { join, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Folders with large render PNGs that are photos (safe to convert to JPEG)
const TARGETS = [
  join(__dirname, '..', 'public', '3-bedroom-detached'),
];

const MIN_SIZE = 500 * 1024; // Only convert PNGs > 500KB

for (const dir of TARGETS) {
  const files = await readdir(dir);
  for (const file of files) {
    if (extname(file).toLowerCase() !== '.png') continue;
    const full = join(dir, file);
    const s = await stat(full);
    if (s.size < MIN_SIZE) continue;

    const jpgPath = full.replace(/\.png$/i, '.jpg');
    const beforeKB = Math.round(s.size / 1024);

    try {
      await sharp(full)
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(jpgPath);

      const afterKB = Math.round((await stat(jpgPath)).size / 1024);
      await unlink(full);
      console.log(`✓ ${file} → ${basename(jpgPath)}  ${beforeKB}KB → ${afterKB}KB  (-${Math.round((1-afterKB/beforeKB)*100)}%)`);
    } catch(e) {
      console.error(`✗ ${file}  ${e.message.split('\n')[0]}`);
    }
  }
}
console.log('\nDone. Remember to update image paths in the page!');
