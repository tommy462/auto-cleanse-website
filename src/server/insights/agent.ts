// The narrow interface the implementation agent (a scheduled Claude Code
// routine, see docs/insights-agent.md) uses. It never gets the database key:
// with INSIGHTS_AGENT_KEY it can only read approved recommendations, claim one,
// record the pull request it opened (as a planned experiment), report that a
// job needs a person, or report a failure. The site's autonomy_mode decides
// who ships: in 'recommend' a person approves and merges; in 'auto' new
// recommendations count as approved and the agent's pull requests are merged by
// .github/workflows/agent-ship.yml once checks the agent cannot change pass;
// 'observe' pauses the agent. Either way the daily run (or the next queue call
// in 'auto') notices the merge and starts the measurement.

import { CHANGE_TYPES, recordForAgent, trackRecord } from './learning.js';
import { insertIgnore, patch, selectAll } from './store.js';

const SITE = 'auto-cleanse';
export const REPO = 'tommy462/auto-cleanse-website';
const PR_URL = new RegExp(`^https://github\\.com/${REPO.replace('/', '\\/')}/pull/\\d{1,6}$`);
// Cloud agents push to claude/... branches; opening the pull request may be left to a person.
const BRANCH = /^claude\/[a-z0-9._\-/]{1,100}$/i;
const BRANCH_REF = 'branch:';
/** A change's reference is its pull request URL or, until one is opened, branch:<name>. */
const isRef = (ref: string | null | undefined): ref is string => Boolean(ref && (PR_URL.test(ref) || (ref.startsWith(BRANCH_REF) && BRANCH.test(ref.slice(BRANCH_REF.length)))));
/** Where a person reviews and ships a change: the pull request, or GitHub's page for opening one. */
export function shipUrl(ref: string): string {
  return ref.startsWith(BRANCH_REF) ? `https://github.com/${REPO}/compare/main...${ref.slice(BRANCH_REF.length)}?expand=1` : ref;
}
function refFrom(body: Record<string, unknown>, prField: string, branchField: string): string {
  const pr = str(body[prField], 120, prField, false);
  if (pr) {
    if (!PR_URL.test(pr)) throw new AgentError(`${prField} must be a pull request on ${REPO}`);
    return pr;
  }
  const branch = str(body[branchField], 110, branchField, false);
  if (!branch || !BRANCH.test(branch)) throw new AgentError(`give ${prField}, or ${branchField} (a claude/... branch you pushed)`);
  return `${BRANCH_REF}${branch}`;
}
/** At most this many changes waiting to be shipped or measured at once, so results stay readable. */
export const MAX_OPEN = 2;
const CLAIM_HOURS = 6;
export const CLAIM_PREFIX = 'Claude is preparing this change';

export class AgentError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

interface RecRow {
  id: string; rule: string; kind: string; category: string; scope_type: string; scope_key: string; pages: string[]; page_count: number;
  title: string; problem: string; facts: string[]; hypotheses: string[]; proposal: string; benefit: string | null;
  measurement_days: number; success_metric: string; ai: Record<string, unknown> | null; status: string; status_note: string | null; updated_at: string;
}
interface ExpRow {
  id: string; recommendation_id: string | null; outcome: string; implementation_ref: string | null; title: string; rollback_ref: string | null;
  pages: string[]; page_groups: string[]; control_pages?: string[]; result: Record<string, unknown> | null; undo_requested_at?: string | null;
  change_type?: string | null; decided_at?: string | null; created_at?: string | null;
}
// select=* so the agent keeps working whether or not the undo column has been added yet.
const EXP_SELECT = 'select=*';
/** Experiments still affecting the site, which a revert can apply to. */
const LIVE_OUTCOMES = ['running', 'successful', 'inconclusive'];

export type Mode = 'observe' | 'recommend' | 'auto';
export async function siteMode(): Promise<Mode> {
  const [s] = await selectAll<{ autonomy_mode: string }>(`/web_sites?id=eq.${SITE}&select=autonomy_mode&order=id`);
  return s?.autonomy_mode === 'auto' || s?.autonomy_mode === 'observe' ? s.autonomy_mode : 'recommend';
}
/** A change to undo: it measurably made things worse, or Tom pressed Undo, and no undo has been started. */
const wantsRevert = (e: ExpRow) => !e.result?.revert_pr && !e.result?.revert_closed
  && (e.outcome === 'unsuccessful' || (Boolean(e.undo_requested_at) && LIVE_OUTCOMES.includes(e.outcome)));

const str = (v: unknown, max: number, field: string, required = true): string | null => {
  if (v == null || v === '') {
    if (required) throw new AgentError(`${field} is required`);
    return null;
  }
  if (typeof v !== 'string') throw new AgentError(`${field} must be text`);
  const s = v.trim();
  if (s.length > max) throw new AgentError(`${field} is longer than ${max} characters`);
  return s;
};
const paths = (v: unknown, field: string): string[] => {
  if (v == null) return [];
  if (!Array.isArray(v) || v.length > 500) throw new AgentError(`${field} must be a list of up to 500 paths`);
  return v.map((p) => {
    if (typeof p !== 'string' || !/^\/[a-z0-9\-/._~%]{0,299}$/i.test(p)) throw new AgentError(`${field} has an invalid path`);
    return p;
  });
};
const isUuid = (v: unknown): v is string => typeof v === 'string' && /^[0-9a-f-]{36}$/i.test(v);

async function rec(id: unknown): Promise<RecRow> {
  if (!isUuid(id)) throw new AgentError('id must be a recommendation id');
  const [r] = await selectAll<RecRow>(`/web_recommendations?site_id=eq.${SITE}&id=eq.${id}&select=*&order=id`);
  if (!r) throw new AgentError('recommendation not found', 404);
  return r;
}

export async function agentQueue(now = new Date(), sync: () => Promise<unknown> = () => syncPulls()) {
  const mode = await siteMode();
  if (mode === 'observe') {
    return { mode, can_start: false, open_changes: [], busy_pages: [] as string[], busy_groups: [] as string[], items: [], reverts: [], track_record: recordForAgent(trackRecord([])) };
  }
  // Automatic changes go live minutes after the last run: learn about merges now, not at the next daily run.
  if (mode === 'auto') await sync().catch(() => undefined);
  // In automatic mode Tom has approved every opportunity in advance; he can still dismiss one in the dashboard.
  const statuses = mode === 'auto' ? 'in.(new,approved)' : 'eq.approved';
  const [recs, exps] = await Promise.all([
    selectAll<RecRow>(`/web_recommendations?site_id=eq.${SITE}&status=${statuses}&kind=eq.opportunity&select=id,rule,kind,category,scope_type,scope_key,pages,page_count,title,problem,facts,hypotheses,proposal,benefit,measurement_days,success_metric,ai,status,status_note,updated_at&order=priority_score.desc`),
    selectAll<ExpRow>(`/web_experiments?site_id=eq.${SITE}&${EXP_SELECT}&order=id`),
  ]);
  const busy = new Set(exps.filter((e) => ['planned', 'running'].includes(e.outcome)).map((e) => e.recommendation_id));
  const claimCutoff = new Date(now.getTime() - CLAIM_HOURS * 3_600_000).toISOString();
  const items = recs.filter((r) => !busy.has(r.id) && !(r.status_note?.startsWith(CLAIM_PREFIX) && r.updated_at > claimCutoff));
  const waiting = exps.filter((e) => e.outcome === 'planned' && isRef(e.implementation_ref));
  const reverts = exps.filter(wantsRevert);
  return {
    mode,
    can_start: waiting.length < MAX_OPEN,
    open_changes: waiting.map((e) => ({ title: e.title, ref: e.implementation_ref })),
    // Pages already being changed or measured, and the pages they are compared against: never touch them before the verdict.
    busy_pages: exps.filter((e) => ['planned', 'running'].includes(e.outcome)).flatMap((e) => [...e.pages, ...(e.control_pages ?? [])]),
    busy_groups: exps.filter((e) => ['planned', 'running'].includes(e.outcome)).flatMap((e) => e.page_groups),
    items: items.map((r) => ({
      id: r.id, rule: r.rule, category: r.category, scope_type: r.scope_type, scope_key: r.scope_key, pages: r.pages,
      page_count: r.page_count, title: r.title, problem: r.problem, facts: r.facts, hypotheses: r.hypotheses,
      proposal: r.proposal, benefit: r.benefit, measurement_days: r.measurement_days, success_metric: r.success_metric, ai: r.ai,
    })),
    reverts: reverts.map((e) => ({
      experiment_id: e.id, title: e.title, ref: e.implementation_ref, rollback: e.rollback_ref,
      reason: e.outcome === 'unsuccessful' ? 'made things worse' : 'Tom asked for it to be undone',
    })),
    // What has worked so far, by kind of change: the agent prefers what works and stops what keeps doing nothing.
    track_record: recordForAgent(trackRecord(exps)),
  };
}

export async function agentClaim(body: Record<string, unknown>) {
  const r = await rec(body.id);
  const mode = await siteMode();
  if (mode === 'observe') throw new AgentError('changes are paused (observe mode)', 409);
  if (r.status !== 'approved' && !(mode === 'auto' && r.status === 'new')) {
    throw new AgentError(mode === 'auto' ? 'only new or approved recommendations can be claimed' : 'only approved recommendations can be claimed', 409);
  }
  await patch('web_recommendations', `id=eq.${r.id}`, { status: 'approved', status_note: `${CLAIM_PREFIX} (started ${new Date().toISOString().slice(0, 16)}Z).` });
  return { ok: true };
}

export async function agentRecord(body: Record<string, unknown>) {
  const r = await rec(body.id);
  if (r.status !== 'approved') throw new AgentError('only approved recommendations can be recorded', 409);
  const ref = refFrom(body, 'pr_url', 'branch');
  const method = body.method ?? 'before_after';
  if (!['before_after', 'diff_in_diff', 'split_test'].includes(String(method))) throw new AgentError('method is not valid');
  const metric = body.primary_metric ?? 'ctr';
  if (!['ctr', 'clicks', 'impressions', 'position', 'leads', 'lead_rate', 'sessions', 'engaged_rate'].includes(String(metric))) throw new AgentError('primary_metric is not valid');
  const pages = paths(body.pages, 'pages');
  const control = paths(body.control_pages, 'control_pages');
  if (!pages.length) throw new AgentError('pages must list the changed pages');
  if (control.length && method === 'before_after') throw new AgentError('give method diff_in_diff when you name control pages');
  const changeType = str(body.change_type, 20, 'change_type')!;
  if (!(CHANGE_TYPES as readonly string[]).includes(changeType)) throw new AgentError(`change_type must be one of ${CHANGE_TYPES.join(', ')}`);
  const row = {
    site_id: SITE,
    recommendation_id: r.id,
    title: str(body.title, 200, 'title'),
    hypothesis: str(body.hypothesis, 2000, 'hypothesis'),
    change_summary: str(body.change_summary, 3000, 'change_summary'),
    pages,
    page_groups: [],
    control_pages: control,
    method,
    primary_metric: metric,
    guardrail_metrics: ['clicks', 'position'],
    original_snapshot: str(body.original_snapshot, 20000, 'original_snapshot'),
    implementation_ref: ref,
    rollback_ref: str(body.rollback_ref, 500, 'rollback_ref', false) ?? 'Do not merge it; once merged, revert its merge commit.',
    outcome: 'planned',
    change_type: changeType,
  };
  try {
    await insertIgnore('web_experiments', [row], 'id');
  } catch (e) {
    // Until the dashboard migration of 4 Nov 2026 adds change_type, record the change without it rather than lose it.
    const { change_type: _omit, ...without } = row;
    void _omit;
    await insertIgnore('web_experiments', [without], 'id').catch(() => { throw e; });
  }
  const auto = (await siteMode()) === 'auto' && PR_URL.test(ref);
  await patch('web_recommendations', `id=eq.${r.id}`, {
    status_note: auto
      ? `Changed automatically: it goes live by itself once the safety checks pass, usually within 10 minutes. The change: ${ref} . Measurement starts a week after it goes live.`
      : `Ready to ship: review the change and merge it at ${shipUrl(ref)} . Measurement starts a week after it goes live.`,
  });
  return { ok: true };
}

export async function agentManual(body: Record<string, unknown>) {
  const r = await rec(body.id);
  const steps = str(body.steps, 1500, 'steps')!;
  await patch('web_recommendations', `id=eq.${r.id}`, { status: 'investigating', status_note: `Needs you (not a website code change): ${steps}` });
  return { ok: true };
}

export async function agentFail(body: Record<string, unknown>) {
  const r = await rec(body.id);
  const reason = str(body.reason, 1500, 'reason')!;
  await patch('web_recommendations', `id=eq.${r.id}`, { status: 'investigating', status_note: `Claude could not prepare this change: ${reason}` });
  return { ok: true };
}

export async function agentRevert(body: Record<string, unknown>) {
  if (!isUuid(body.experiment_id)) throw new AgentError('experiment_id must be an experiment id');
  const ref = refFrom(body, 'pr_url', 'branch');
  const [e] = await selectAll<ExpRow>(`/web_experiments?site_id=eq.${SITE}&id=eq.${body.experiment_id}&${EXP_SELECT}&order=id`);
  if (!e) throw new AgentError('experiment not found', 404);
  if (!wantsRevert(e)) throw new AgentError('only changes that made things worse, or that Tom asked to undo, are reverted', 409);
  await patch('web_experiments', `id=eq.${e.id}`, { result: { ...(e.result ?? {}), revert_pr: ref } });
  if (e.recommendation_id) {
    const why = e.outcome === 'unsuccessful' ? 'It made things worse' : 'You asked for it to be undone';
    const auto = (await siteMode()) === 'auto' && PR_URL.test(ref);
    await patch('web_recommendations', `id=eq.${e.recommendation_id}`, {
      status_note: auto ? `${why}: it is being undone automatically (${ref} ).` : `${why}: merge the undo at ${shipUrl(ref)} .`,
    });
  }
  return { ok: true };
}

/* ── Shipping: the daily run follows the pull requests ───────────────────── */

interface Pull { state: 'open' | 'closed'; merged_at: string | null; number: number; html_url: string }

/** The pull request behind a change: by URL, or the newest one opened from its branch (null if none yet). */
async function pull(ref: string): Promise<Pull | null> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'AutoCleanseInsights/1.0' };
  if (process.env.INSIGHTS_GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.INSIGHTS_GITHUB_TOKEN}`;
  const url = ref.startsWith(BRANCH_REF)
    ? `https://api.github.com/repos/${REPO}/pulls?state=all&per_page=5&head=${REPO.split('/')[0]}:${encodeURIComponent(ref.slice(BRANCH_REF.length))}`
    : `https://api.github.com/repos/${REPO}/pulls/${ref.split('/').pop()}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub: HTTP ${res.status} for ${ref}`);
  const j = (await res.json()) as Pull | Pull[];
  if (!Array.isArray(j)) return j;
  return j.find((p) => p.merged_at) ?? j.find((p) => p.state === 'open') ?? j[0] ?? null;
}

const ukDay = (iso: string) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date(iso));

/** Marks merged changes as live (measurement starts), closed ones as not shipped, merged reverts as reverted. */
export async function syncPulls(fetchPull: (url: string) => Promise<Pull | null> = pull): Promise<{ checked: number; shipped: number; closed: number; reverted: number }> {
  const exps = await selectAll<ExpRow>(`/web_experiments?site_id=eq.${SITE}&outcome=in.(planned,running,successful,inconclusive,unsuccessful)&${EXP_SELECT}&order=id`);
  const out = { checked: 0, shipped: 0, closed: 0, reverted: 0 };
  for (const e of exps) {
    // Planned: follow the change itself. Anything else: follow its undo, if one was started.
    const ref = e.outcome === 'planned' ? e.implementation_ref : (e.result?.revert_pr as string | undefined) ?? null;
    if (!isRef(ref)) continue;
    const p = await fetchPull(ref);
    out.checked++;
    if (!p) continue;
    // A branch whose pull request now exists: remember the pull request.
    if (e.outcome === 'planned' && ref.startsWith(BRANCH_REF) && PR_URL.test(p.html_url)) {
      await patch('web_experiments', `id=eq.${e.id}`, { implementation_ref: p.html_url });
    }
    if (e.outcome === 'planned' && p.merged_at) {
      const day = ukDay(p.merged_at);
      await patch('web_experiments', `id=eq.${e.id}`, { outcome: 'running', implemented_on: day });
      if (e.recommendation_id) {
        await patch('web_recommendations', `id=eq.${e.recommendation_id}&status=eq.approved`, { status: 'monitoring', status_note: `Live since ${day} (pull request #${p.number}). Measuring from a week after that.` });
      }
      out.shipped++;
    } else if (e.outcome === 'planned' && p.state === 'closed') {
      await patch('web_experiments', `id=eq.${e.id}`, { outcome: 'reverted', conclusion: 'Not shipped: the pull request was closed without merging.', decided_at: new Date().toISOString() });
      if (e.recommendation_id) {
        await patch('web_recommendations', `id=eq.${e.recommendation_id}&status=eq.approved`, { status: 'investigating', status_note: `Pull request #${p.number} was closed without merging (when the automatic checks close one, its comment says why). Approve or reopen it to have another go.` });
      }
      out.closed++;
    } else if (e.outcome !== 'planned' && p.merged_at) {
      const asked = e.outcome !== 'unsuccessful';
      await patch('web_experiments', `id=eq.${e.id}`, {
        outcome: 'reverted', decided_at: new Date().toISOString(),
        ...(asked ? { conclusion: `Undone on ${ukDay(p.merged_at)} at Tom's request (pull request #${p.number}), before or regardless of the measured result.` } : {}),
      });
      if (e.recommendation_id) {
        await patch('web_recommendations', `id=eq.${e.recommendation_id}`, { status: 'reverted', status_note: `Undone on ${ukDay(p.merged_at)} (pull request #${p.number}).` });
      }
      out.reverted++;
    } else if (e.outcome !== 'planned' && p.state === 'closed') {
      // The undo was stopped (by the checks or by hand): never retry it on its own; a person decides.
      await patch('web_experiments', `id=eq.${e.id}`, { result: { ...(e.result ?? {}), revert_pr: null, revert_closed: p.html_url } });
      if (e.recommendation_id) {
        await patch('web_recommendations', `id=eq.${e.recommendation_id}`, { status_note: `The undo (pull request #${p.number}) was closed without merging, so the change is still live. Revert it on GitHub if it should go.` });
      }
      out.closed++;
    }
  }
  return out;
}
