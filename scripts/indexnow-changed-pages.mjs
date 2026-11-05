#!/usr/bin/env node
/**
 * Lists the sitemap pages whose text a change altered, from two copies of
 * scripts/page-lastmod.json (before and after). .github/workflows/agent-ship.yml
 * runs THIS copy from main on each website agent change, then hands the list to
 * scripts/indexnow-submit.mjs once the merge is live.
 *
 *   node scripts/indexnow-changed-pages.mjs before.json after.json
 *
 * Prints the paths separated by spaces, or nothing when no page changed. Only
 * plain site paths are printed, at most MAX_PAGES of them.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const MAX_PAGES = 100;
const SAFE_PATH = /^\/(?:[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)*)?$/;

/** Paths that are new, or whose fingerprint (the second entry) changed. */
export function changedPages(before, after) {
  return Object.entries(after)
    .filter(([path, entry]) => SAFE_PATH.test(path) && Array.isArray(entry) && entry[1] && before[path]?.[1] !== entry[1])
    .map(([path]) => path)
    .slice(0, MAX_PAGES);
}

function main() {
  const [beforeFile, afterFile] = process.argv.slice(2);
  if (!beforeFile || !afterFile) {
    console.error('usage: node scripts/indexnow-changed-pages.mjs before.json after.json');
    process.exit(2);
  }
  const read = (f) => JSON.parse(readFileSync(f, 'utf8'));
  process.stdout.write(changedPages(read(beforeFile), read(afterFile)).join(' '));
}

if (process.argv[1] && resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1])) main();
