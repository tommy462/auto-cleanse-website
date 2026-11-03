/**
 * Tests for scripts/agent-guard.mjs, the gate in front of the website agent's
 * automatic changes. Synthetic diffs for each rule, then the real first change
 * (pull request #1) and a real revert of it in a throwaway worktree.
 *
 *   node scripts/test-agent-guard.mjs
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkChange, isExactRevert, readChange } from './agent-guard.mjs';

let failed = 0;
function test(name, fn) {
  try { fn(); console.log(`PASS ${name}`); } catch (e) { failed++; console.log(`FAIL ${name}\n     ${e.message}`); }
}
const B = 'claude/insights-test';
const page = (added, removed = [], path = 'src/pages/DPFCleaningExeter.tsx') => ({ path, status: 'M', added, removed });
const ok = (files, branch = B) => assert.deepEqual(checkChange({ branch, files }), []);
const stops = (files, re, branch = B) => {
  const p = checkChange({ branch, files });
  assert.ok(p.some((x) => re.test(x)), `expected ${re} in ${JSON.stringify(p)}`);
};

test('an FAQ built from published facts passes', () => ok([
  page(["    q: 'What actually happens to my DPF during the clean?',", "    a: 'It is water only, with no chemicals. Reverse flushed at 1 to 2 bar, then dried with hot air at up to 100°C. Call 07823 649190.',"]),
  { path: 'scripts/page-lastmod.json', status: 'M', added: ['  "/dpf-cleaning-exeter": ["2026-11-03","651b90c59652"],'], removed: ['  "/dpf-cleaning-exeter": ["2026-10-12","d75b668d3362"],'] },
]));
test('prices: only the published list, or ones already there', () => {
  stops([page(["a: 'From £199.'"])], /price not in the published/);
  ok([page(["title: 'DPF cleaning Exeter from £210'"])]);
  ok([page(["a: 'Rather than gamble £1,000+ on a new one, call us.'"], ["a: 'Rather than gamble £1,000+ on a replacement.'"])]);
  stops([page(["a: 'Repairs from £250.'"], [], 'src/data/adblue-guides/p20ee.ts')], /national AdBlue pages show no prices/);
});
test('links stay on the site', () => {
  stops([page(['<a href="https://example.com">x</a>'])], /links outside the site/);
  stops([page(['<Link to="//evil.example">x</Link>'])], /link target/);
  stops([page(["{ label: 'x', href: '//evil.example/x' },"])], /links outside the site/);
  ok([page(['See <Link to="/dpf-cleaning">how the clean works</Link>.', "import { Link } from 'react-router-dom';", "a: 'text', // a comment"])]);
});
test('contact details: the mobile and the one email only', () => {
  stops([page(["a: 'Ring 01803 123456.'"])], /phone number/);
  stops([page(["a: 'Email sales@auto-cleanse.co.uk.'"])], /email address/);
  ok([page(["a: 'Ring 07823 649190 or email info@auto-cleanse.co.uk.'"])]);
});
test('banned claims, unless only carried over', () => {
  stops([page(["a: 'Results guaranteed.'"])], /guarantee/);
  ok([page(["a: 'Nothing is guaranteed here, as before.'"], ["a: 'Nothing is guaranteed.'"])]);
  stops([page(["a: '98% of soot removed.'"])], /98 percent|percentage/);
  stops([page(["a: 'Trusted by hundreds of drivers.'"])], /trusted by/);
  stops([page(["a: 'We offer DPF delete kits.'"])], /delete/);
  stops([page(["a: 'Our national MET network.'"])], /national network/);
  stops([page(["a: 'AutoCleanse does it.'"])], /brand spelling/);
  stops([page([`a: 'Quick ${String.fromCharCode(0x2014)} and clean.'`])], /dash/);
  stops([page(["a: 'A 40% better flow.'"])], /percentage/);
});
test('qualified phrases', () => {
  stops([page(["a: 'Same day service.'"])], /same day/);
  ok([page(["a: 'Same day where possible.'"])]);
  stops([page(["a: 'Mobile DPF cleaning across Devon.'"])], /mobile DPF/);
  ok([page(["a: 'We do not offer mobile DPF cleaning.'"])]);
  stops([page(["a: 'A chemical clean.'"])], /chemicals/);
});
test('files: content only', () => {
  stops([{ path: 'src/config/booking.ts', status: 'M', added: ['x'], removed: [] }], /not a file the agent may change/);
  stops([page(['x'], [], 'src/pages/Pricing.tsx')], /not a file/);
  stops([page(['x'], [], 'src/pages/RemappingBooking.tsx')], /not a file/);
  stops([page(['x'], [], '.github/workflows/agent-ship.yml')], /not a file/);
  stops([page(['x'], [], 'scripts/agent-guard.mjs')], /not a file/);
  stops([{ path: 'src/pages/NewPage.tsx', status: 'A', added: ['x'], removed: [] }], /only be edited/);
  stops([{ path: 'scripts/page-lastmod.json', status: 'M', added: ['"x": 1'], removed: [] }], /only page dates/);
  stops([page(['date: 2026-01-05'], ['date: 2027-01-04'], 'content/blog/some-post.md')], /blog dates/);
  stops(Array.from({ length: 41 }, (_, i) => page(['x'], [], `src/pages/Page${i}.tsx`)), /touches 41 files/);
});
test('code: content edits only', () => {
  stops([page(['useEffect(() => { fetch("/x"); }, []);'])], /runs code/);
  stops([page(["import axios from 'axios';"])], /import from a package/);
  stops([page(['<div dangerouslySetInnerHTML={{ __html: x }} />'])], /page scripting/);
  stops([page(['<button onClick={() => go()}>x</button>'])], /event handler/);
});
test('branch names', () => {
  stops([page(['x'])], /branch/, 'feature/x');
  stops([page(['x'])], /branch/, 'main');
});

// Real history: the first change the agent made, and an undo of it.
const git = (args, cwd = '.') => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8' });
let haveHistory = true;
try { git(['cat-file', '-e', 'be2bbeb^{commit}']); git(['cat-file', '-e', 'e7daac6^{commit}']); } catch { haveHistory = false; }
if (haveHistory) {
  test('the real first change (pull request #1) passes', () => {
    const { files } = readChange('.', 'be2bbeb^', 'be2bbeb');
    assert.deepEqual(checkChange({ branch: 'claude/insights-dpf-exeter-process-faqs', files }), []);
  });
  const dir = mkdtempSync(join(tmpdir(), 'agent-guard-'));
  try {
    git(['worktree', 'add', '--detach', '-q', dir, 'e7daac6']);
    const id = ['-c', 'user.name=test', '-c', 'user.email=test@example.invalid'];
    execFileSync('git', ['-C', dir, ...id, 'revert', '-m', '1', '--no-edit', 'e7daac6'], { encoding: 'utf8' });
    test('an exact revert of a merged change passes as an undo', () => {
      assert.equal(isExactRevert(dir, 'e7daac6', 'HEAD'), true);
    });
    writeFileSync(join(dir, 'src/pages/DPFCleaningExeter.tsx'), `${git(['show', 'HEAD:src/pages/DPFCleaningExeter.tsx'], dir)}\n// extra\n`);
    execFileSync('git', ['-C', dir, ...id, 'commit', '-qam', 'more'], { encoding: 'utf8' });
    test('a revert with anything extra is not an undo', () => {
      assert.equal(isExactRevert(dir, 'e7daac6', 'HEAD'), false);
    });
    test('a change that only claims to revert is not an undo', () => {
      execFileSync('git', ['-C', dir, ...id, 'commit', '-q', '--allow-empty', '-m', 'This reverts commit 0000000.'], { encoding: 'utf8' });
      assert.equal(isExactRevert(dir, 'e7daac6', 'HEAD'), false);
    });
  } finally {
    git(['worktree', 'remove', '--force', dir]);
    rmSync(dir, { recursive: true, force: true });
  }
} else {
  console.log('SKIP real-history tests (commits be2bbeb / e7daac6 not in this clone)');
}

console.log(failed ? `\n${failed} FAILED` : '\nALL PASSED');
process.exit(failed ? 1 : 0);
