/**
 * Tests for the implementation agent's interface (src/server/insights/agent.ts)
 * and its route in api/insights.ts. The database is an in-memory stand-in for
 * the few PostgREST calls involved; GitHub is faked. All data is synthetic.
 *
 *   npx tsx scripts/test-insights-agent.ts
 */
import assert from 'node:assert/strict';
import type { VercelRequest, VercelResponse } from '@vercel/node';

process.env.AUTOCLEANSE_SUPABASE_URL = 'https://db.example.invalid';
process.env.AUTOCLEANSE_SUPABASE_SERVICE_KEY = 'test';
process.env.INSIGHTS_AGENT_KEY = 'a'.repeat(40);
process.env.CRON_SECRET = 'c'.repeat(40);

type Row = Record<string, unknown>;
const db: Record<string, Row[]> = { web_recommendations: [], web_experiments: [], web_sites: [{ id: 'auto-cleanse', autonomy_mode: 'recommend' }] };
const setMode = (m: string) => { db.web_sites[0].autonomy_mode = m; };
let nextId = 1;
const uuid = () => `00000000-0000-4000-8000-${String(nextId++).padStart(12, '0')}`;

// Minimal PostgREST: eq / in filters, select (ignored), order (ignored), insert, patch.
function matches(row: Row, params: URLSearchParams): boolean {
  for (const [k, v] of params) {
    if (['select', 'order', 'limit', 'offset', 'on_conflict'].includes(k)) continue;
    const [op, ...rest] = v.split('.');
    const val = rest.join('.');
    if (op === 'eq' && String(row[k]) !== val) return false;
    if (op === 'in' && !val.replace(/^\(|\)$/g, '').split(',').includes(String(row[k]))) return false;
  }
  return true;
}
globalThis.fetch = (async (input: string | URL, init: RequestInit = {}) => {
  const url = new URL(String(input));
  if (url.hostname === 'db.example.invalid') {
    const table = url.pathname.replace('/rest/v1/', '');
    const rows = db[table];
    const method = init.method ?? 'GET';
    if (method === 'GET') return new Response(JSON.stringify(rows.filter((r) => matches(r, url.searchParams))), { status: 200 });
    if (method === 'POST') {
      for (const r of JSON.parse(String(init.body))) rows.push({ id: uuid(), result: null, ...r });
      return new Response('', { status: 201 });
    }
    if (method === 'PATCH') {
      for (const r of rows.filter((x) => matches(x, url.searchParams))) Object.assign(r, JSON.parse(String(init.body)), { updated_at: new Date().toISOString() });
      return new Response(null, { status: 204 });
    }
  }
  throw new Error(`unexpected fetch ${url}`);
}) as typeof fetch;

const { agentQueue, agentClaim, agentRecord, agentManual, agentFail, agentRevert, syncPulls, shipUrl } = await import('../src/server/insights/agent.js');
const { default: handler } = await import('../api/insights.js');

let failed = 0;
async function test(name: string, fn: () => Promise<void>) {
  try { await fn(); console.log(`PASS ${name}`); } catch (e) { failed++; console.log(`FAIL ${name}\n     ${(e as Error).message}`); }
}
const rejects = async (p: Promise<unknown>, re: RegExp) => { await assert.rejects(p, (e: Error) => re.test(e.message)); };

const rec = (over: Row = {}): Row => {
  const r = { id: uuid(), site_id: 'auto-cleanse', kind: 'opportunity', status: 'approved', status_note: null, updated_at: '2026-11-01T00:00:00Z',
    rule: 'ctr_gap', category: 'seo', scope_type: 'page', scope_key: '/x', pages: ['/x'], page_count: 1, title: 'Synthetic', problem: 'p',
    facts: [], hypotheses: [], proposal: 'do it', benefit: null, measurement_days: 28, success_metric: 'm', ai: null, priority_score: 1, ...over };
  db.web_recommendations.push(r);
  return r;
};
const exp = (over: Row = {}): Row => {
  const e = { id: uuid(), site_id: 'auto-cleanse', recommendation_id: null, outcome: 'planned', implementation_ref: null, title: 't', rollback_ref: null, pages: [], page_groups: [], result: null, ...over };
  db.web_experiments.push(e);
  return e;
};

await test('queue: approved, unclaimed, not already being changed', async () => {
  const a = rec(); const b = rec({ status: 'new' }); const c = rec(); exp({ recommendation_id: c.id, outcome: 'running', pages: ['/c'] });
  const d = rec({ status_note: 'Claude is preparing this change (started now)', updated_at: new Date().toISOString() });
  const q = await agentQueue();
  const ids = q.items.map((i: { id: string }) => i.id);
  assert.ok(ids.includes(a.id as string));
  assert.ok(!ids.includes(b.id as string) && !ids.includes(c.id as string) && !ids.includes(d.id as string));
  assert.ok(q.busy_pages.includes('/c'));
  assert.ok(!('status_note' in q.items[0]));
  db.web_recommendations.length = 0; db.web_experiments.length = 0;
});

await test('queue: stops starting new changes when two are waiting to ship', async () => {
  exp({ implementation_ref: 'branch:claude/one' }); exp({ implementation_ref: 'https://github.com/tommy462/auto-cleanse-website/pull/7' });
  assert.equal((await agentQueue()).can_start, false);
  db.web_experiments.length = 0;
  assert.equal((await agentQueue()).can_start, true);
});

await test('claim and record: a branch becomes a planned experiment with a ship link', async () => {
  const r = rec();
  await agentClaim({ id: r.id });
  assert.match(String(r.status_note), /Claude is preparing/);
  await rejects(agentRecord({ id: r.id, branch: 'feature/x', title: 't', hypothesis: 'h', change_summary: 'c', pages: ['/x'] }), /claude\//);
  await rejects(agentRecord({ id: r.id, pr_url: 'https://github.com/someone/else/pull/1', title: 't', hypothesis: 'h', change_summary: 'c', pages: ['/x'] }), /pull request on/);
  await rejects(agentRecord({ id: r.id, branch: 'claude/x', title: 't', hypothesis: 'h', change_summary: 'c', pages: ['javascript:alert(1)'] }), /invalid path/);
  await rejects(agentRecord({ id: r.id, branch: 'claude/x', title: 't', hypothesis: 'h', change_summary: 'c', pages: ['/x'], control_pages: ['/y'] }), /diff_in_diff/);
  await rejects(agentRecord({ id: r.id, branch: 'claude/x', title: 't', hypothesis: 'h', change_summary: 'c', pages: ['/x'], original_snapshot: 'o', change_type: 'magic' }), /change_type must be one of/);
  await agentRecord({ id: r.id, branch: 'claude/titles-dpf', title: 'Titles', hypothesis: 'h', change_summary: 'c', pages: ['/x'], control_pages: ['/y'], method: 'diff_in_diff', original_snapshot: 'old title', change_type: 'title' });
  const e = db.web_experiments.at(-1)!;
  assert.equal(e.outcome, 'planned');
  assert.equal(e.change_type, 'title');
  assert.equal(e.implementation_ref, 'branch:claude/titles-dpf');
  assert.match(String(r.status_note), /compare\/main\.\.\.claude\/titles-dpf\?expand=1/);
  assert.equal(shipUrl('branch:claude/a'), 'https://github.com/tommy462/auto-cleanse-website/compare/main...claude/a?expand=1');
});

await test('only approved recommendations can be claimed or recorded', async () => {
  const r = rec({ status: 'new' });
  await rejects(agentClaim({ id: r.id }), /only approved/);
  await rejects(agentClaim({ id: 'not-a-uuid' }), /recommendation id/);
});

await test('manual and fail hand the job back to a person', async () => {
  const r = rec();
  await agentManual({ id: r.id, steps: 'Add 10 photos to the Google Business Profile.' });
  assert.equal(r.status, 'investigating');
  assert.match(String(r.status_note), /^Needs you/);
  const r2 = rec();
  await agentFail({ id: r2.id, reason: 'build failed' });
  assert.match(String(r2.status_note), /could not prepare/);
});

await test('daily sync: merged ships, closed is not shipped, merged revert reverts', async () => {
  db.web_recommendations.length = 0; db.web_experiments.length = 0;
  const r1 = rec(); const e1 = exp({ recommendation_id: r1.id, implementation_ref: 'branch:claude/a' });
  const r2 = rec(); const e2 = exp({ recommendation_id: r2.id, implementation_ref: 'https://github.com/tommy462/auto-cleanse-website/pull/12' });
  const r3 = rec({ status: 'inconclusive' }); const e3 = exp({ recommendation_id: r3.id, outcome: 'unsuccessful', implementation_ref: 'https://github.com/tommy462/auto-cleanse-website/pull/5', result: { revert_pr: 'branch:claude/undo' } });
  const e4 = exp({ implementation_ref: 'branch:claude/waiting' });
  const pulls: Record<string, unknown> = {
    'branch:claude/a': { state: 'closed', merged_at: '2026-11-04T10:00:00Z', number: 13, html_url: 'https://github.com/tommy462/auto-cleanse-website/pull/13' },
    'https://github.com/tommy462/auto-cleanse-website/pull/12': { state: 'closed', merged_at: null, number: 12, html_url: 'https://github.com/tommy462/auto-cleanse-website/pull/12' },
    'branch:claude/undo': { state: 'closed', merged_at: '2026-12-10T09:00:00Z', number: 20, html_url: 'https://github.com/tommy462/auto-cleanse-website/pull/20' },
    'branch:claude/waiting': null,
  };
  const out = await syncPulls(async (ref: string) => pulls[ref] as never);
  assert.deepEqual(out, { checked: 4, shipped: 1, closed: 1, reverted: 1 });
  assert.equal(e1.outcome, 'running'); assert.equal(e1.implemented_on, '2026-11-04'); assert.equal(e1.implementation_ref, 'https://github.com/tommy462/auto-cleanse-website/pull/13');
  assert.equal(r1.status, 'monitoring');
  assert.equal(e2.outcome, 'reverted'); assert.equal(r2.status, 'investigating');
  assert.equal(e3.outcome, 'reverted'); assert.equal(r3.status, 'reverted');
  assert.equal(e4.outcome, 'planned');
});

await test('revert is only for changes that made things worse', async () => {
  const e = exp({ outcome: 'running' });
  await rejects(agentRevert({ experiment_id: e.id, branch: 'claude/undo-x' }), /made things worse/);
});

await test('automatic mode: new recommendations are queued, claimed and shipped without approval', async () => {
  db.web_recommendations.length = 0; db.web_experiments.length = 0;
  setMode('auto');
  const a = rec({ status: 'new' }); const b = rec(); const c = rec({ status: 'investigating' }); const d = rec({ status: 'dismissed' });
  let synced = 0;
  const q = await agentQueue(new Date(), async () => { synced++; });
  const ids = q.items.map((i: { id: string }) => i.id);
  assert.equal(q.mode, 'auto');
  assert.equal(synced, 1, 'merges are picked up before choosing work');
  assert.ok(ids.includes(a.id as string) && ids.includes(b.id as string));
  assert.ok(!ids.includes(c.id as string) && !ids.includes(d.id as string), 'held-back and dismissed ones stay out');
  await agentClaim({ id: a.id });
  assert.equal(a.status, 'approved');
  await agentRecord({ id: a.id, pr_url: 'https://github.com/tommy462/auto-cleanse-website/pull/31', title: 't', hypothesis: 'h', change_summary: 'c', pages: ['/x'], original_snapshot: 'old text', change_type: 'faq' });
  assert.match(String(a.status_note), /^Changed automatically/);
  assert.match(String(a.status_note), /pull\/31/);
  await rejects(agentClaim({ id: d.id }), /new or approved/);
  setMode('recommend');
  await rejects(agentClaim({ id: rec({ status: 'new' }).id }), /only approved/);
});

await test('observe mode pauses the agent', async () => {
  setMode('observe');
  const r = rec();
  const q = await agentQueue(new Date(), async () => { throw new Error('should not sync'); });
  assert.equal(q.can_start, false);
  assert.equal(q.items.length, 0);
  await rejects(agentClaim({ id: r.id }), /paused/);
  setMode('recommend');
});

await test('undo: Tom asks, the agent reverts, the merge marks it undone', async () => {
  db.web_recommendations.length = 0; db.web_experiments.length = 0;
  setMode('auto');
  const r = rec({ status: 'monitoring' });
  const e = exp({ recommendation_id: r.id, outcome: 'running', implementation_ref: 'https://github.com/tommy462/auto-cleanse-website/pull/31', undo_requested_at: '2026-11-10T09:00:00Z' });
  const kept = exp({ outcome: 'running', implementation_ref: 'https://github.com/tommy462/auto-cleanse-website/pull/32' });
  const q = await agentQueue(new Date(), async () => undefined);
  assert.deepEqual(q.reverts.map((x: { experiment_id: string }) => x.experiment_id), [e.id]);
  assert.match(q.reverts[0].reason, /asked/);
  await rejects(agentRevert({ experiment_id: kept.id, branch: 'claude/undo-y' }), /asked to undo/);
  await agentRevert({ experiment_id: e.id, pr_url: 'https://github.com/tommy462/auto-cleanse-website/pull/33' });
  assert.match(String(r.status_note), /being undone automatically/);
  assert.equal((await agentQueue(new Date(), async () => undefined)).reverts.length, 0, 'not started twice');
  const out = await syncPulls(async (ref: string) => (ref.endsWith('/33') ? { state: 'closed', merged_at: '2026-11-10T10:00:00Z', number: 33, html_url: ref } : null) as never);
  assert.equal(out.reverted, 1);
  assert.equal(e.outcome, 'reverted');
  assert.match(String(e.conclusion), /at Tom's request/);
  assert.equal(r.status, 'reverted');
  setMode('recommend');
});

await test('queue: the track record says what to prefer and what to stop', async () => {
  db.web_recommendations.length = 0; db.web_experiments.length = 0;
  exp({ outcome: 'inconclusive', change_type: 'faq', decided_at: '2026-12-01T00:00:00Z' });
  exp({ outcome: 'inconclusive', change_type: 'faq', decided_at: '2026-12-05T00:00:00Z' });
  exp({ outcome: 'reverted', change_type: 'faq', decided_at: '2026-12-09T00:00:00Z' });
  exp({ outcome: 'successful', change_type: 'title', decided_at: '2026-12-02T00:00:00Z' });
  exp({ outcome: 'successful', change_type: 'title', decided_at: '2026-12-06T00:00:00Z' });
  const q = await agentQueue();
  assert.deepEqual(q.track_record.avoid, ['faq']);
  assert.deepEqual(q.track_record.prefer, ['title']);
  assert.equal(q.track_record.by_type.faq.streak, 3);
  assert.equal(q.track_record.stop_after, 3);
});

await test('an undo stopped by the checks is not retried on its own', async () => {
  db.web_recommendations.length = 0; db.web_experiments.length = 0;
  const r = rec({ status: 'monitoring' });
  const e = exp({ recommendation_id: r.id, outcome: 'unsuccessful', implementation_ref: 'https://github.com/tommy462/auto-cleanse-website/pull/40', result: { revert_pr: 'branch:claude/undo-z' } });
  const out = await syncPulls(async () => ({ state: 'closed', merged_at: null, number: 41, html_url: 'https://github.com/tommy462/auto-cleanse-website/pull/41' }) as never);
  assert.equal(out.closed, 1);
  assert.equal(e.outcome, 'unsuccessful');
  assert.equal((e.result as Row).revert_pr, null);
  assert.match(String(r.status_note), /still live/);
  assert.equal((await agentQueue()).reverts.length, 0);
});

// Route: its own key; the cron secret does not open it and the agent key does not run the cron.
function call(req: Record<string, unknown>) {
  return new Promise<{ status: number; body: unknown }>((resolve) => {
    let status = 200;
    const res = { setHeader() {}, status(s: number) { status = s; return res; }, json(b: unknown) { resolve({ status, body: b }); return res; }, end() { resolve({ status, body: null }); return res; } } as unknown as VercelResponse;
    handler({ method: 'GET', headers: {}, query: {}, body: undefined, ...req } as unknown as VercelRequest, res);
  });
}
await test('route: agent key required, and it opens nothing else', async () => {
  assert.equal((await call({ query: { agent: 'queue' } })).status, 401);
  assert.equal((await call({ query: { agent: 'queue' }, headers: { authorization: `Bearer ${'c'.repeat(40)}` } })).status, 401);
  assert.equal((await call({ query: { agent: 'queue' }, headers: { authorization: `Bearer ${'a'.repeat(40)}` } })).status, 200);
  assert.equal((await call({ method: 'POST', query: { agent: 'drop_tables' }, headers: { authorization: `Bearer ${'a'.repeat(40)}` }, body: {} })).status, 400);
  assert.equal((await call({ method: 'GET', headers: { authorization: `Bearer ${'a'.repeat(40)}` } })).status, 401, 'agent key cannot trigger the daily run');
  const bad = await call({ method: 'POST', query: { agent: 'claim' }, headers: { authorization: `Bearer ${'a'.repeat(40)}` }, body: { id: 'x' } });
  assert.equal(bad.status, 400);
});

console.log(failed ? `\n${failed} FAILED` : '\nALL PASSED');
process.exit(failed ? 1 : 0);
