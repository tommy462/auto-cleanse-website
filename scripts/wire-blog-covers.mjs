// Ensures every published post whose cover image exists on disk carries the
// matching `coverImage:` frontmatter field. Idempotent - safe to re-run, and
// worth re-running after any bulk edit of content/blog.
//
//   node scripts/wire-blog-covers.mjs
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const blog = join(root, 'content', 'blog');
const pub = join(root, 'public');

const files = readdirSync(blog).filter(
  (f) => f.endsWith('.md') && !f.startsWith('_') && f.toLowerCase() !== 'readme.md'
);

let added = 0, corrected = 0, skipped = 0;

for (const file of files) {
  const path = join(blog, file);
  let src = readFileSync(path, 'utf-8');

  const slug = (src.match(/^slug:\s*"?(.*?)"?\s*$/m) || [])[1] || file.replace(/\.md$/, '');
  const img = `/blog/${slug}/cover.jpg`;

  if (!existsSync(join(pub, img))) { skipped++; continue; }

  if (/^coverImage:/m.test(src)) {
    const current = (src.match(/^coverImage:\s*"?(.*?)"?\s*$/m) || [])[1];
    if (current === img) continue;
    src = src.replace(/^coverImage:.*$/m, `coverImage: "${img}"`);
    corrected++;
    console.log(`  ~ corrected ${slug}`);
  } else if (/^coverAlt:/m.test(src)) {
    src = src.replace(/^(coverAlt:)/m, `coverImage: "${img}"\n$1`);
    added++;
    console.log(`  + added ${slug}`);
  } else {
    console.log(`  ! no coverAlt anchor, skipped ${slug}`);
    continue;
  }
  writeFileSync(path, src, 'utf-8');
}

console.log(`\nadded ${added}, corrected ${corrected}, no image for ${skipped}.`);
