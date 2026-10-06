/**
 * Creates web-optimized logo variants from the original exports in src/design/
 * and the link preview image (og:image in src/index.html).
 * Run after replacing a logo or the cover: node scripts/build-brand-assets.js
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

// Colours from tailwind.config.js
const PITCH = '#CFE3C4';
const INK = '#16261B';

/**
 * Link preview for WhatsApp, Instagram, Google & co. in the style of the hero:
 * pitch green with field markings, the logo with slogan on the left and the
 * cover as a card with block shadow on the right. 1200x630 is the size all
 * platforms show uncropped as a large preview.
 */
async function buildLinkPreview() {
  const width = 1200;
  const height = 630;
  const card = 456;
  const border = 4;
  const shadow = 12;
  const cardLeft = width - 72 - card - shadow;
  const cardTop = Math.round((height - card - shadow) / 2);

  // Field markings as in the hero: halfway line, centre circle and spot
  const markings = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <g fill="none" stroke="${INK}" stroke-opacity=".14" stroke-width="3">
        <line x1="${width / 2}" y1="0" x2="${width / 2}" y2="${height}" />
        <circle cx="${width / 2}" cy="${height / 2}" r="190" />
        <rect x="-3" y="150" width="130" height="330" />
        <rect x="${width - 127}" y="150" width="130" height="330" />
      </g>
      <circle cx="${width / 2}" cy="${height / 2}" r="7" fill="${INK}" fill-opacity=".2" />
    </svg>`);

  // The slogan logo only exists in white: keep its shape, fill it with ink
  const logoWidth = 560;
  const logoMask = await sharp(path.join(root, 'src/design/logo-white-no-outline-with-slogan-RGB.png'))
    .resize({ width: logoWidth })
    .extractChannel('alpha')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const logo = await sharp({ create: { width: logoMask.info.width, height: logoMask.info.height, channels: 3, background: INK } })
    .joinChannel(logoMask.data, { raw: logoMask.info })
    .png()
    .toBuffer();

  const cover = await sharp(path.join(root, 'src/assets/cover.jpg'))
    .resize(card - 2 * border, card - 2 * border)
    .extend({ top: border, bottom: border, left: border, right: border, background: INK })
    .toBuffer();

  const target = path.join(root, 'src/assets/og-image.jpg');
  const info = await sharp({ create: { width, height, channels: 3, background: PITCH } })
    .composite([
      { input: markings, top: 0, left: 0 },
      { input: { create: { width: card, height: card, channels: 3, background: INK } }, top: cardTop + shadow, left: cardLeft + shadow },
      { input: cover, top: cardTop, left: cardLeft },
      { input: logo, top: Math.round((height - logoMask.info.height) / 2), left: 64 }
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(target);
  console.log(`og-image.jpg: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB`);
}

fs.mkdirSync(outDir, { recursive: true });

Promise.all([
  ...variants.map(async ({ source, target, width }) => {
    const info = await sharp(path.join(root, source))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 90, alphaQuality: 100, effort: 6 })
      .toFile(path.join(outDir, target));
    console.log(`${target}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB`);
  }),
  buildLinkPreview()
]).catch((error) => {
  console.error(error);
  process.exit(1);
});
