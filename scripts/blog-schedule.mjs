// The blog's publishing queue.
//
// A post goes live once `draft` is false AND its `date` has arrived (UK time).
// Posts dated in the future sit in the repo, scheduled, until a build runs on
// or after their date. The weekly GitHub Action (.github/workflows/weekly-blog.yml)
// runs that build every Monday morning.
//
//   npm run blog:status                    what is live, what is queued, which covers are placeholders
//   node scripts/blog-schedule.mjs due     JSON list of posts that should be live but are not yet (used by the Action)
//   node scripts/blog-schedule.mjs queue   number of posts still scheduled (used by the Action)
//
// No dependencies, so the Action can run it without installing the project.
import { readFileSync, readdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { COVER_ART } from './blog-cover-map.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const blogDir = join(projectRoot, 'content', 'blog');
const workspaceRoot = join(projectRoot, '..', '..');
const SITE = 'https://www.auto-cleanse.co.uk';

export function ukToday() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
}

function field(front, key) {
  const m = new RegExp(`^${key}:\\s*(.*?)\\s*(#.*)?$`, 'm').exec(front);
  if (!m) return '';
  return m[1].replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
}

export function readPosts() {
  return readdirSync(blogDir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_') && f.toLowerCase() !== 'readme.md')
    .map((file) => {
      const raw = readFileSync(join(blogDir, file), 'utf-8');
      const front = (/^---\r?\n([\s\S]*?)\r?\n---/.exec(raw) || [])[1] || '';
      const slug = field(front, 'slug') || file.replace(/\.md$/, '');
      return {
        file,
        slug,
        title: field(front, 'title'),
        date: field(front, 'date').slice(0, 10),
        category: field(front, 'category'),
        draft: field(front, 'draft') === 'true',
        hasCover: existsSync(join(projectRoot, 'public', 'blog', slug, 'cover.jpg')),
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

const artBySlug = new Map(Object.entries(COVER_ART).map(([file, slug]) => [slug, file]));

function coverState(post) {
  if (!post.hasCover) return 'NO COVER';
  const art = artBySlug.get(post.slug);
  if (art && existsSync(join(workspaceRoot, art))) return 'your artwork';
  return art ? `placeholder (save "${art}")` : 'placeholder';
}

const cmd = process.argv[2] || 'status';
const today = process.env.BLOG_BUILD_DATE || ukToday();
const posts = readPosts().filter((p) => !p.draft);
const live = posts.filter((p) => p.date <= today);
const queued = posts.filter((p) => p.date > today);

if (cmd === 'due') {
  // Posts whose date has arrived but which the live site does not serve yet.
  const checks = await Promise.all(
    live.map(async (p) => {
      const res = await fetch(`${SITE}/blog/${p.slug}`, { method: 'HEAD', redirect: 'manual' });
      return res.status === 200 ? null : { slug: p.slug, title: p.title, date: p.date, status: res.status };
    })
  );
  console.log(JSON.stringify(checks.filter(Boolean)));
} else if (cmd === 'queue') {
  console.log(queued.length);
} else {
  const fmt = (p) => `  ${p.date}  ${p.category.padEnd(6)}  ${p.title}\n              cover: ${coverState(p)}`;
  console.log(`\nBlog status on ${today} (UK)\n`);
  console.log(`LIVE: ${live.length} posts. Latest five:`);
  for (const p of live.slice(-5)) console.log(fmt(p));
  console.log(`\nSCHEDULED: ${queued.length} posts`);
  for (const p of queued) console.log(fmt(p));

  // Weekly cadence: every post a Monday, seven days apart.
  const problems = [];
  for (let i = 0; i < posts.length; i++) {
    const d = new Date(`${posts[i].date}T12:00:00Z`);
    if (d.getUTCDay() !== 1) problems.push(`${posts[i].date} is not a Monday (${posts[i].slug})`);
    if (i > 0) {
      const gap = Math.round((d - new Date(`${posts[i - 1].date}T12:00:00Z`)) / 86400000);
      if (gap !== 7) problems.push(`${gap}-day gap before ${posts[i].date} (${posts[i].slug})`);
    }
  }
  if (problems.length) {
    console.log('\nCadence notes:');
    for (const p of problems) console.log(`  - ${p}`);
  }

  const last = queued.at(-1) || live.at(-1);
  console.log(
    queued.length
      ? `\nThe queue runs out after ${last.date}. ${queued.length <= 2 ? 'Time to add more posts.' : ''}`
      : '\nThe queue is empty: nothing will publish next Monday.'
  );
  const placeholders = posts.filter((p) => coverState(p).startsWith('placeholder'));
  if (placeholders.length) {
    console.log(`\n${placeholders.length} posts still use a generated placeholder cover.`);
    console.log('Save your enhanced version in the workspace root under the name shown, then run: npm run blog:covers');
  }
  console.log('');
}
