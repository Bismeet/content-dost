import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, '../public/hero-sequence');
const outputPath = path.join(__dirname, '../src/content/frameManifest.json');

try {
  // Ensure content directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const files = fs.readdirSync(directoryPath);
  const frameFiles = files
    .filter(file => file.startsWith('frame_') && (file.endsWith('.jpg') || file.endsWith('.webp') || file.endsWith('.jpeg')))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0], 10);
      const numB = parseInt(b.match(/\d+/)[0], 10);
      return numA - numB;
    });

  fs.writeFileSync(outputPath, JSON.stringify(frameFiles, null, 2));
  console.log(`Successfully generated manifest with ${frameFiles.length} frames.`);
  console.log(`First frame: ${frameFiles[0]}`);
  console.log(`Last frame: ${frameFiles[frameFiles.length - 1]}`);
} catch (err) {
  console.error('Unable to scan directory or write manifest:', err);
  process.exit(1);
}
