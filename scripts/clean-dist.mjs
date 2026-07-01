// Removes previous build output so retired routes never linger in dist/.
// Runs before the client build in `npm run build`.
import { rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

for (const dir of ['dist', 'dist-server']) {
  const target = join(projectRoot, dir);
  rmSync(target, { recursive: true, force: true });
  console.log(`Cleaned ${dir}/`);
}
