import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const publicDir = join(root, 'public');
const assetDirs = ['files', 'images'];

mkdirSync(publicDir, { recursive: true });

for (const dir of assetDirs) {
  const source = join(root, dir);
  const destination = join(publicDir, dir);

  if (!existsSync(source)) {
    continue;
  }

  rmSync(destination, { recursive: true, force: true });
  cpSync(source, destination, { recursive: true });
}
