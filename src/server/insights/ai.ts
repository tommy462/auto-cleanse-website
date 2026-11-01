// The AI write-up: once a week the best few findings (already detected,
// measured and ranked by plain code) are sent to Claude as compact JSON, and
// Claude writes the specific proposal and the likely causes for each. It never
// sees raw analytics tables, never sets a number, and its text is stored apart
// from the measured facts so the dashboard can label it.
//
// Spending is capped: the call is skipped unless a master has switched AI on
// (web_sites.ai_enabled), an ANTHROPIC_API_KEY is set, and this month's logged
// spend plus the worst case for this call stays under ai_monthly_budget_usd.
// Every call, made or skipped, is logged in web_ai_calls with tokens and cost.
//
// A Claude subscription (Pro/Max, Claude Code) does not cover unattended API
// calls: this needs an API key from console.anthropic.com, billed per token.

import Anthropic from '@anthropic-ai/sdk';
import type { SiteConfig } from './site-config.js';
import type { Finding } from './types.js';

export const AI_MODEL = process.env.INSIGHTS_AI_MODEL || 'claude-opus-5-5';
const MAX_TOKENS = 12_000;
/** USD per million tokens. Opus 5.5 list prices; a fallback model is costed at the higher Opus 4.8 rate to stay conservative. */
const PRICE = { input: 4, output: 20, cacheRead: 0.2, cacheWrite: 5 };
const FALLBACK_PRICE = { input: 5, output: 25, cacheRead: 0.5, cacheWrite: 6.25 };

export interface AiItem {
  id: string;
  headline: string;
  summary: string;
  likely_causes: string[];
  proposed_change: string;
  how_to_measure: string;
  risks: string;
  keep_priority: boolean;
  priority_note: string;
}
export interface AiResult { items: AiItem[]; top_three: { id: string; why: string }[]; notes_for_owner: string }

export interface AiCallLog {
  purpose: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  cache_write_tokens: number;
  cost_usd: number;
  status: 'ok' | 'error' | 'invalid_output' | 'skipped_budget' | 'skipped_disabled' | 'skipped_no_key';
  error: string | null;
}

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['items', 'top_three', 'notes_for_owner'],
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'headline', 'summary', 'likely_causes', 'proposed_change', 'how_to_measure', 'risks', 'keep_priority', 'priority_note'],
        properties: {
          id: { type: 'string' },
          headline: { type: 'string' },
          summary: { type: 'string' },
          likely_causes: { type: 'array', items: { type: 'string' } },
          proposed_change: { type: 'string' },
          how_to_measure: { type: 'string' },
          risks: { type: 'string' },
          keep_priority: { type: 'boolean' },
          priority_note: { type: 'string' },
        },
      },
    },
    top_three: {
      type: 'array',
      items: { type: 'object', additionalProperties: false, required: ['id', 'why'], properties: { id: { type: 'string' }, why: { type: 'string' } } },
    },
    notes_for_owner: { type: 'string' },
  },
} as const;

function systemPrompt(config: SiteConfig): string {
  return [
    `You review website analytics findings for ${config.name} and write short, practical recommendations for the owner, Tom, who runs the workshop and reads this on his phone.`,
    '',
    'Each finding you receive was detected by code from real Search Console, GA4, Clarity and booking data. Its numbers, facts and confidence are measured and final: never change, re-estimate or add numbers, and never claim a result the facts do not show. Your job is the judgement the code cannot make: what most likely explains the pattern, and the single most useful change to make, specific enough to act on (for a title change, write the proposed title; for a layout change, say what moves where).',
    '',
    'Label causes as possibilities, not facts. If the facts are too thin to support a change, say what to check first instead. Prefer small, reversible changes that can be measured against unchanged pages. Respect running experiments: never propose changing pages that are under test.',
    '',
    'Business facts you may rely on (nothing else about the business):',
    ...config.businessFacts.map((f) => `- ${f}`),
    '',
    'Writing rules for every string:',
    ...config.copyRules.map((r) => `- ${r}`),
    '- Plain British English, short sentences, no marketing tone, no headings or markdown.',
    '',
    'For each finding return one item with its id. Set keep_priority to false only if the facts suggest the finding is less valuable than its rank implies (say why in priority_note; otherwise leave priority_note empty). Then pick the three findings Tom should do next for the most commercial value (enquiries and bookings, not just traffic) and say why in one sentence each. notes_for_owner: at most two sentences on anything he must know, or an empty string.',
  ].join('\n');
}

function compact(f: Finding & { id: string; priority_score?: number }) {
  return {
    id: f.id,
    rule: f.rule,
    kind: f.kind,
    scope: `${f.scopeType}: ${f.scopeKey}`,
    pages: f.pages.slice(0, 12),
    title: f.title,
    problem: f.problem,
    facts: f.facts.slice(0, 10),
    evidence: f.evidence.map((e) => `${e.label}: ${e.value}${e.period ? ` (${e.period})` : ''} [${e.source}]`),
    code_hypotheses: f.hypotheses,
    code_proposal: f.proposal,
    estimated_extra_clicks_per_month: f.estExtraClicksMonth,
    confidence: f.confidence,
    effort: f.effort,
    priority_rank_score: f.priority_score ?? null,
  };
}

const BANNED = /\b(guaranteed|24\/7|free diagnosis|no fix no fee|lifetime warranty|nationwide)\b/i;
const tidy = (s: unknown, max: number) =>
  (typeof s === 'string' ? s : '').replace(/\s*[–—]\s*/g, ', ').replace(/\s+/g, ' ').trim().slice(0, max);

/** Checks Claude's answer against the input: known ids only, length caps, house copy rules. */
export function validateAiResult(raw: unknown, ids: Set<string>): AiResult | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (!Array.isArray(r.items) || !Array.isArray(r.top_three)) return null;
  const items: AiItem[] = [];
  for (const it of r.items as Record<string, unknown>[]) {
    if (!it || typeof it.id !== 'string' || !ids.has(it.id)) continue;
    const item: AiItem = {
      id: it.id,
      headline: tidy(it.headline, 140),
      summary: tidy(it.summary, 600),
      likely_causes: (Array.isArray(it.likely_causes) ? it.likely_causes : []).map((c) => tidy(c, 300)).filter(Boolean).slice(0, 4),
      proposed_change: tidy(it.proposed_change, 900),
      how_to_measure: tidy(it.how_to_measure, 400),
      risks: tidy(it.risks, 300),
      keep_priority: it.keep_priority !== false,
      priority_note: tidy(it.priority_note, 300),
    };
    const text = [item.headline, item.summary, item.proposed_change, ...item.likely_causes].join(' ');
    if (!item.headline || !item.proposed_change || BANNED.test(text)) continue;
    items.push(item);
  }
  const top = (r.top_three as Record<string, unknown>[])
    .filter((t) => t && typeof t.id === 'string' && ids.has(t.id as string))
    .map((t) => ({ id: t.id as string, why: tidy(t.why, 300) }))
    .slice(0, 3);
  if (!items.length) return null;
  return { items, top_three: top, notes_for_owner: tidy(r.notes_for_owner, 400) };
}

export function estimateMaxCost(inputChars: number): number {
  const inputTokens = Math.ceil(inputChars / 3);
  return (inputTokens * FALLBACK_PRICE.input + MAX_TOKENS * FALLBACK_PRICE.output) / 1_000_000;
}

export async function writeUp(opts: {
  config: SiteConfig;
  findings: (Finding & { id: string; priority_score?: number })[];
  experiments: string[];
  enabled: boolean;
  budgetUsd: number;
  spentThisMonthUsd: number;
}): Promise<{ result: AiResult | null; log: AiCallLog }> {
  const base: AiCallLog = { purpose: 'weekly_writeup', model: AI_MODEL, input_tokens: 0, output_tokens: 0, cache_read_tokens: 0, cache_write_tokens: 0, cost_usd: 0, status: 'ok', error: null };
  if (!opts.enabled) return { result: null, log: { ...base, status: 'skipped_disabled' } };
  if (!process.env.ANTHROPIC_API_KEY) return { result: null, log: { ...base, status: 'skipped_no_key' } };
  if (!opts.findings.length) return { result: null, log: { ...base, status: 'skipped_disabled', error: 'nothing to write up' } };

  const system = systemPrompt(opts.config);
  const user = JSON.stringify({
    running_experiments: opts.experiments,
    findings: opts.findings.map(compact),
  });
  const worst = estimateMaxCost(system.length + user.length);
  if (opts.spentThisMonthUsd + worst > opts.budgetUsd) {
    return { result: null, log: { ...base, status: 'skipped_budget', error: `Spent $${opts.spentThisMonthUsd.toFixed(2)} of $${opts.budgetUsd.toFixed(2)} this month; this call could cost up to $${worst.toFixed(2)}.` } };
  }

  const client = new Anthropic({ maxRetries: 2, timeout: 240_000 });
  try {
    // Server-side fallback: if a safety classifier declines (very unlikely for
    // analytics text), the API re-runs the request on its recommended model.
    const response = await client.beta.messages.create({
      model: AI_MODEL,
      max_tokens: MAX_TOKENS,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      thinking: { type: 'adaptive' },
      output_config: { effort: 'medium', format: { type: 'json_schema', schema: SCHEMA as unknown as Record<string, unknown> } },
      system,
      messages: [{ role: 'user', content: user }],
    });
    const u = response.usage;
    const fellBack = (u.iterations ?? []).some((i) => i.type === 'fallback_message');
    const p = fellBack ? FALLBACK_PRICE : PRICE;
    const log: AiCallLog = {
      ...base,
      model: response.model,
      input_tokens: u.input_tokens ?? 0,
      output_tokens: u.output_tokens ?? 0,
      cache_read_tokens: u.cache_read_input_tokens ?? 0,
      cache_write_tokens: u.cache_creation_input_tokens ?? 0,
      cost_usd: 0,
    };
    log.cost_usd = Math.round(((log.input_tokens * p.input + log.output_tokens * p.output + log.cache_read_tokens * p.cacheRead + log.cache_write_tokens * p.cacheWrite) / 1_000_000) * 100_000) / 100_000;
    if (response.stop_reason === 'refusal') return { result: null, log: { ...log, status: 'error', error: 'The model declined the request.' } };
    if (response.stop_reason === 'max_tokens') return { result: null, log: { ...log, status: 'invalid_output', error: 'Output hit max_tokens.' } };
    const text = response.content.filter((b) => b.type === 'text').map((b) => (b as { text: string }).text).join('');
    let parsed: unknown = null;
    try { parsed = JSON.parse(text); } catch { /* handled below */ }
    const result = validateAiResult(parsed, new Set(opts.findings.map((f) => f.id)));
    if (!result) return { result: null, log: { ...log, status: 'invalid_output', error: 'Output did not pass validation; the deterministic write-up is kept.' } };
    return { result, log };
  } catch (e) {
    let msg = e instanceof Error ? e.message : String(e);
    if (e instanceof Anthropic.AuthenticationError) msg = 'The Anthropic API key was rejected.';
    else if (e instanceof Anthropic.RateLimitError) msg = 'Anthropic rate limit; will try again next week.';
    else if (e instanceof Anthropic.APIError) msg = `Anthropic API error ${e.status}: ${e.message}`;
    return { result: null, log: { ...base, status: 'error', error: msg.slice(0, 500) } };
  }
}
