/**
 * Checks for api/insights.ts with fake requests. Supabase calls are intercepted:
 * nothing leaves the machine. All values are synthetic.
 *
 *   npx tsx scripts/test-insights-api.ts
 */

process.env.CRON_SECRET = 'x'.repeat(32);
process.env.AUTOCLEANSE_SUPABASE_URL = 'https://example.invalid';
process.env.AUTOCLEANSE_SUPABASE_SERVICE_KEY = 'test';
const calls: { url: string; method: string; body?: string }[] = [];
globalThis.fetch = (async (url: string, init: RequestInit = {}) => {
  calls.push({ url: String(url), method: init.method ?? 'GET', body: init.body as string | undefined });
  if (String(url).includes('/web_conversions?site_id') && (init.method ?? 'GET') === 'GET') return new Response('[]', { status: 200 });
  return new Response('', { status: 201 });
}) as typeof fetch;

import type { VercelRequest, VercelResponse } from '@vercel/node';

const { default: handler } = await import('../api/insights.js');
function call(req: Record<string, unknown>) {
  return new Promise<{ status: number; body: unknown }>((resolve) => {
    let status = 200;
    const res = {
      setHeader() {}, status(s: number) { status = s; return res; },
      json(b: unknown) { resolve({ status, body: b }); return res; }, end() { resolve({ status, body: null }); return res; },
    } as unknown as VercelResponse;
    handler({ method: 'GET', headers: {}, query: {}, body: undefined, ...req } as unknown as VercelRequest, res);
  });
}
let failed = 0;
const check = (name: string, ok: boolean, detail?: unknown) => { if (!ok) failed++; console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : ` ${JSON.stringify(detail)}`}`); };

let r = await call({ method: 'GET' });
check('cron without the secret is refused (401)', r.status === 401, r);
r = await call({ method: 'GET', headers: { authorization: 'Bearer wrong' } });
check('cron with a wrong secret is refused (401)', r.status === 401, r);
r = await call({ method: 'POST', headers: { authorization: 'Bearer nope' }, body: { task: 'daily' } });
check('manual run with a wrong secret is refused (401)', r.status === 401, r);

const good = { e: 'lead_submitted', id: 'f9276d66-e48b-4bfa-89fe-f5dd9a38131c', f: 'dpf-cleaning-exeter', s: 'DPF Cleaning', p: '/dpf-cleaning-exeter', l: '/dpf-cleaning-exeter', c: 'paid_search', d: 'mobile', k: 'granted', us: 'test', um: 'cpc', uc: null, r: null };
calls.length = 0;
r = await call({ method: 'POST', headers: { origin: 'https://www.auto-cleanse.co.uk', 'x-forwarded-for': '1.1.1.1' }, body: JSON.stringify(good) });
const insert = calls.find((c) => c.method === 'POST' && c.url.includes('/web_conversions'));
const row = insert ? JSON.parse(insert.body!)[0] : null;
check('a valid lead is stored (204)', r.status === 204 && row?.dedupe_key === `web:${good.id}`, { r, row });
check('stored row has no IP and only allowed fields', row && !JSON.stringify(row).includes('1.1.1.1') && Object.keys(row).every((k) => ['site_id', 'occurred_at', 'event', 'source', 'page_path', 'landing_path', 'channel', 'referrer_host', 'utm_source', 'utm_medium', 'utm_campaign', 'service', 'form', 'device', 'consent', 'dedupe_key'].includes(k)), row);
r = await call({ method: 'POST', headers: { origin: 'https://evil.example' }, body: JSON.stringify(good) });
check('another site cannot post (403)', r.status === 403, r);
r = await call({ method: 'POST', headers: {}, body: JSON.stringify({ ...good, name: 'Someone', phone: '0700' }) });
check('unexpected fields (name, phone) are rejected (400)', r.status === 400, r);
r = await call({ method: 'POST', headers: {}, body: JSON.stringify({ ...good, e: 'deposit_paid' }) });
check('only lead_submitted can be posted (400)', r.status === 400, r);
r = await call({ method: 'POST', headers: {}, body: JSON.stringify({ ...good, p: 'javascript:alert(1)' }) });
check('a page that is not a path is rejected (400)', r.status === 400, r);
r = await call({ method: 'POST', headers: {}, body: '{not json' });
check('broken JSON is rejected (400)', r.status === 400, r);
let last = 0;
for (let i = 0; i < 7; i++) last = (await call({ method: 'POST', headers: { 'x-forwarded-for': '9.9.9.9' }, body: JSON.stringify({ ...good, id: `abcdefgh-${i}` }) })).status;
check('more than 5 a minute from one address is rate limited (429)', last === 429, last);
r = await call({ method: 'DELETE' });
check('other methods are refused (405)', r.status === 405, r);

console.log(failed ? `\n${failed} FAILED` : '\nALL PASSED');
process.exit(failed ? 1 : 0);
