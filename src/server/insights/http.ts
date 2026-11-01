// fetch with a timeout and retries for the transient failures every API has
// (rate limits, 5xx, dropped connections). Permanent errors (4xx other than
// 408/429) fail at once with the API's own message, so a lost permission shows
// up in the run log as exactly that.

export class HttpError extends Error {
  constructor(message: string, public status: number, public body: string) {
    super(message);
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchJson<T>(
  url: string,
  init: RequestInit & { timeoutMs?: number; retries?: number; label?: string } = {},
): Promise<T> {
  const { timeoutMs = 30_000, retries = 2, label = new URL(url).hostname, ...rest } = init;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...rest, signal: ctrl.signal });
      const text = await res.text();
      if (res.ok) return (text ? JSON.parse(text) : null) as T;
      const transient = res.status === 408 || res.status === 429 || res.status >= 500;
      // Keep API error text short and free of anything echoed from our request.
      const msg = `${label}: HTTP ${res.status} ${text.slice(0, 300).replace(/\s+/g, ' ')}`;
      lastErr = new HttpError(msg, res.status, text.slice(0, 2000));
      // Clarity's daily allowance is spent: retrying only spends nothing more but cannot succeed today.
      if (!transient || (res.status === 429 && /daily limit/i.test(text))) throw lastErr;
    } catch (e) {
      lastErr = e;
      if (e instanceof HttpError && !(e.status === 408 || e.status === 429 || e.status >= 500)) throw e;
      if (e instanceof HttpError && e.status === 429 && /daily limit/i.test(e.body)) throw e;
    } finally {
      clearTimeout(timer);
    }
    if (attempt < retries) await sleep(1000 * 3 ** attempt);
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}
