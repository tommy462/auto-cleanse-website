// Database access for the insights engine, through PostgREST with the secret
// key (src/server/supabase.ts). Writes are upserts on each table's natural key,
// so re-running a day replaces that day instead of adding to it.

import { sb } from '../supabase.js';
import type { RunStep } from './types.js';

export async function upsert(table: string, rows: Record<string, unknown>[], onConflict: string, batch = 500): Promise<number> {
  for (let i = 0; i < rows.length; i += batch) {
    await sb(`/${table}?on_conflict=${onConflict}`, {
      method: 'POST',
      body: JSON.stringify(rows.slice(i, i + batch)),
      prefer: 'resolution=merge-duplicates,return=minimal',
    });
  }
  return rows.length;
}

/** Inserts rows, silently skipping any whose unique key already exists. */
export async function insertIgnore(table: string, rows: Record<string, unknown>[], onConflict: string): Promise<number> {
  for (let i = 0; i < rows.length; i += 500) {
    await sb(`/${table}?on_conflict=${onConflict}`, {
      method: 'POST',
      body: JSON.stringify(rows.slice(i, i + 500)),
      prefer: 'resolution=ignore-duplicates,return=minimal',
    });
  }
  return rows.length;
}

export async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  return sb<T>(`/rpc/${fn}`, { method: 'POST', body: JSON.stringify(args) });
}

/**
 * Every row of a set-returning function, 1,000 at a time. PostgREST caps each
 * response at 1,000 rows without saying so; since the AdBlue and remap towns
 * went live more than 1,000 pages get impressions, so a plain rpc() would
 * silently lose pages. `order` must name columns that make the order stable.
 */
export async function rpcAll<T>(fn: string, args: Record<string, unknown>, order: string): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; from < 500_000; from += 1000) {
    const rows = await sb<T[]>(`/rpc/${fn}?order=${order}&limit=1000&offset=${from}`, { method: 'POST', body: JSON.stringify(args) });
    out.push(...(rows ?? []));
    if (!rows || rows.length < 1000) break;
  }
  return out;
}

/** Reads every row of a query, 1,000 at a time (PostgREST's cap). `path` must include an order. */
export async function selectAll<T>(path: string): Promise<T[]> {
  const out: T[] = [];
  const sep = path.includes('?') ? '&' : '?';
  for (let from = 0; from < 200_000; from += 1000) {
    const rows = await sb<T[]>(`${path}${sep}limit=1000&offset=${from}`, { method: 'GET' });
    out.push(...(rows ?? []));
    if (!rows || rows.length < 1000) break;
  }
  return out;
}

export async function patch(table: string, filter: string, values: Record<string, unknown>): Promise<void> {
  await sb(`/${table}?${filter}`, { method: 'PATCH', body: JSON.stringify(values), prefer: 'return=minimal' });
}

export async function claimRun(site: string, kind: string, date: string, trigger: string, force: boolean): Promise<number | null> {
  const id = await rpc<number | null>('web_claim_run', { p_site: site, p_kind: kind, p_date: date, p_trigger: trigger, p_force: force });
  return typeof id === 'number' ? id : null;
}

export async function finishRun(id: number, status: 'succeeded' | 'partial' | 'failed' | 'skipped', steps: RunStep[], summary: Record<string, unknown>, error?: string) {
  await patch('web_runs', `id=eq.${id}`, {
    status, steps, summary, finished_at: new Date().toISOString(), error: error ? error.slice(0, 4000) : null,
  });
}

/** Runs one step, timing it and turning any error into a recorded failure instead of a crash. */
export async function step(steps: RunStep[], name: string, fn: () => Promise<{ rows?: number; note?: string } | void>): Promise<boolean> {
  const t0 = Date.now();
  try {
    const r = (await fn()) ?? {};
    steps.push({ step: name, status: 'ok', ms: Date.now() - t0, ...(r.rows != null ? { rows: r.rows } : {}), ...(r.note ? { note: r.note } : {}) });
    return true;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[insights] ${name} failed: ${msg}`);
    steps.push({ step: name, status: 'failed', ms: Date.now() - t0, error: msg.slice(0, 600) });
    return false;
  }
}

export function skip(steps: RunStep[], name: string, note: string) {
  steps.push({ step: name, status: 'skipped', ms: 0, note });
}
