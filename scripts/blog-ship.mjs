// One command to ship blog changes: installs any enhanced cover art saved in
// the workspace root, makes sure every post points at its cover, then commits
// and pushes content/blog and public/blog to main (Vercel deploys it).
//
//   npm run blog:ship
//
// It only ever stages the blog folders, so other work in progress is left alone.
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const run = (cmd, opts = {}) => execSync(cmd, { cwd: projectRoot, stdio: 'inherit', ...opts });
const read = (cmd) => execSync(cmd, { cwd: projectRoot, encoding: 'utf-8' }).trim();

const branch = read('git branch --show-current');
if (branch !== 'main') {
  console.error(`You are on "${branch}", not main. Switch with: git switch main`);
  process.exit(1);
}

// Scheduled (future-dated) posts only stay hidden if the date gating is already
// committed. Without it, pushing the posts would publish every one of them at once.
if (!read('git show HEAD:src/lib/blog.ts').includes('__BLOG_BUILD_DATE__')) {
  console.error('The scheduling code (src/lib/blog.ts, vite.config.ts) is not committed yet.');
  console.error('Shipping now would publish every future-dated post immediately. Commit that first.');
  process.exit(1);
}

run('git fetch origin main --quiet');
const [ahead, behind] = read('git rev-list --left-right --count HEAD...origin/main').split(/\s+/).map(Number);
if (behind > 0) {
  console.log(`main is ${behind} commit(s) behind GitHub; pulling first.`);
  run('git pull --ff-only origin main');
}

run('node scripts/install-blog-covers.mjs');
run('node scripts/wire-blog-covers.mjs');

run('git add content/blog public/blog scripts/blog-cover-map.mjs');
if (!read('git diff --cached --name-only')) {
  console.log(ahead > 0 ? 'No new blog changes. Pushing earlier commits.' : 'No blog changes to ship.');
  if (ahead === 0) process.exit(0);
} else {
  run('git commit -m "Blog: update posts and covers"');
}
run('git push origin main');
console.log('\nPushed. The site rebuilds in about two minutes. Run npm run blog:status to see the queue.\n');
