/**
 * Creates web-optimized logo variants from the original exports in src/design/.
 * Run after replacing a logo: node scripts/build-brand-assets.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'src/assets/brand');

// Width = twice the largest rendered width in the design (hero 600px, footer 380px) for sharp HiDPI output
const variants = [
  { source: 'src/design/logo-black-no-outline-RGB.png', target: 'logo-black.webp', width: 1200 },
  { source: 'src/design/logo-white-no-outline-with-slogan-RGB.png', target: 'logo-white-slogan.webp', width: 760 }
];

fs.mkdirSync(outDir, { recursive: true });

Promise.all(variants.map(async ({ source, target, width }) => {
  const info = await sharp(path.join(root, source))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toFile(path.join(outDir, target));
  console.log(`${target}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB`);
})).catch((error) => {
  console.error(error);
  process.exit(1);
});
