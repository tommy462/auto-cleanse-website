// fetch with a timeout and retries for the transient failures every API has
// (rate limits, 5xx, dropped connections, timeouts). Permanent errors (4xx
// other than 408/429) fail at once with the API's own message, so a lost
// permission shows up in the run log as exactly that.
//
// Errors read as plain sentences in the run log. A request that runs out of
// time reads "Clarity took longer than 75 seconds to answer (2 attempts)", never
// the runtime's "This operation was aborted"; a dropped connection reads
// "<label> could not be reached (<code>)".

export class HttpError extends Error {
  constructor(message: string, public status: number, public body: string) {
    super(message);
  }
}

/** Our own timeout ran out before the API answered. */
export class TimeoutError extends Error {
  constructor(public label: string, public timeoutMs: number, public attempts: number) {
    super(`${label} took longer than ${seconds(timeoutMs)} seconds to answer${attempts > 1 ? ` (${attempts} attempts)` : ''}`);
    this.name = 'TimeoutError';
  }
}

/** The API could not be reached, or its answer could not be read. Worth another try. */
export class TransportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransportError';
  }
}

function seconds(ms: number): string {
  const s = ms / 1000;
  return s >= 10 ? String(Math.round(s)) : String(Math.round(s * 10) / 10);
}

/** Node's fetch throws "TypeError: fetch failed" and keeps the useful part on .cause. */
function networkDetail(e: unknown): string {
  const cause = e && typeof e === 'object' ? (e as { cause?: unknown }).cause : undefined;
  const c = cause && typeof cause === 'object' ? (cause as { code?: unknown; message?: unknown }) : {};
  const detail = typeof c.code === 'string' && c.code ? c.code
    : typeof c.message === 'string' && c.message ? c.message
    : e instanceof Error ? e.message : String(e);
  return detail.trim().slice(0, 120);
}

/** True for failures that another attempt might fix. Clarity's "daily limit" 429 never is. */
export function isTransient(e: unknown): boolean {
  if (e instanceof TimeoutError || e instanceof TransportError) return true;
  if (e instanceof HttpError) {
    if (e.status === 429) return !/daily limit/i.test(e.body);
    return e.status === 408 || e.status >= 500;
  }
  return false;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchJson<T>(
  url: string,
  init: RequestInit & { timeoutMs?: number; retries?: number; label?: string; retryDelayMs?: number } = {},
): Promise<T> {
  const { timeoutMs = 30_000, retries = 2, label = new URL(url).hostname, retryDelayMs, ...rest } = init;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; ctrl.abort(); }, timeoutMs);
    try {
      let res: Response;
      let text: string;
      try {
        res = await fetch(url, { ...rest, signal: ctrl.signal });
        text = await res.text();
      } catch (e) {
        throw timedOut ? new TimeoutError(label, timeoutMs, attempt + 1) : new TransportError(`${label} could not be reached (${networkDetail(e)})`);
      }
      if (res.ok) {
        if (!text) return null as T;
        try {
          return JSON.parse(text) as T;
        } catch {
          throw new TransportError(`${label} sent an answer that could not be read as JSON`);
        }
      }
      // Keep API error text short and free of anything echoed from our request.
      const msg = `${label}: HTTP ${res.status} ${text.slice(0, 300).replace(/\s+/g, ' ')}`;
      throw new HttpError(msg, res.status, text.slice(0, 2000));
    } catch (e) {
      lastErr = e;
      // Permanent errors, and Clarity's spent daily allowance, fail at once.
      if (!isTransient(e)) throw e;
    } finally {
      clearTimeout(timer);
    }
    if (attempt < retries) await sleep(retryDelayMs ?? 1000 * 3 ** attempt);
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}
