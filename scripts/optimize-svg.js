import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const SVG_DIRS = [path.join(repoRoot, 'src', 'assets', 'images'), path.join(repoRoot, 'public')];

const optimizeSvg = (content) =>
  content
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+\/>/g, '/>')
    .trim();

const main = async () => {
  for (const dir of SVG_DIRS) {
    let files = [];
    try {
      files = await fs.readdir(dir);
    } catch {
      continue;
    }

    await Promise.all(
      files
        .filter((file) => file.endsWith('.svg'))
        .map(async (file) => {
          const filePath = path.join(dir, file);
          const raw = await fs.readFile(filePath, 'utf-8');
          const optimized = optimizeSvg(raw);
          if (optimized !== raw) {
            await fs.writeFile(filePath, optimized, 'utf-8');
          }
        }),
    );
  }

  process.stdout.write('SVG optimization complete.\n');
};

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});
