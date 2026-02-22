const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Define paths
const sourceFile = path.join(__dirname, '../src/assets/schnittstellenpass-zwischen-profi-und-amateur-trailer-8muzwmq49esbq.avif');
const targetFile = path.join(__dirname, '../src/assets/logo.png');

// Check if source file exists
if (!fs.existsSync(sourceFile)) {
  console.error(`Source file not found: ${sourceFile}`);
  process.exit(1);
}

// Convert AVIF to JPEG
sharp(sourceFile)
  .jpeg({ quality: 90 })
  .toFile(targetFile)
  .then(() => {
    console.log(`Successfully converted ${sourceFile} to ${targetFile}`);
  })
  .catch(err => {
    console.error('Error converting file:', err);
  });
