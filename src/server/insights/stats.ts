// Small, dependency-free statistics. The engine only raises a finding when the
// numbers clear a significance bar AND a minimum size, so day-to-day ranking
// noise and tiny samples never become recommendations.

/** Standard normal CDF (Abramowitz-Stegun 7.1.26, error < 1.5e-7). */
export function normalCdf(z: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t
    * Math.exp(-(z * z) / 2);
  return z >= 0 ? (1 + y) / 2 : (1 - y) / 2;
}

function logFactorial(n: number): number {
  let s = 0;
  for (let i = 2; i <= n; i++) s += Math.log(i);
  return s;
}

/** P(X <= k) for X ~ Poisson(lambda). Exact up to k = 5000, normal approximation above. */
export function poissonCdf(k: number, lambda: number): number {
  if (lambda <= 0) return 1;
  if (k < 0) return 0;
  if (k > 5000 || lambda > 5000) return normalCdf((k + 0.5 - lambda) / Math.sqrt(lambda));
  let sum = 0;
  let logTerm = -lambda; // log P(X=0)
  sum += Math.exp(logTerm);
  for (let i = 1; i <= k; i++) {
    logTerm += Math.log(lambda) - Math.log(i);
    sum += Math.exp(logTerm);
  }
  return Math.min(1, sum);
}

/** P(X >= k) for X ~ Poisson(lambda). */
export function poissonUpper(k: number, lambda: number): number {
  return k <= 0 ? 1 : 1 - poissonCdf(k - 1, lambda);
}

/** One-sided p-value that x successes in n trials is BELOW rate p0. */
export function binomialLowerP(x: number, n: number, p0: number): number {
  if (n <= 0) return 1;
  if (n * p0 >= 10 && n * (1 - p0) >= 10) {
    return normalCdf((x + 0.5 - n * p0) / Math.sqrt(n * p0 * (1 - p0)));
  }
  // exact
  let sum = 0;
  const lf = logFactorial(n);
  for (let i = 0; i <= x; i++) {
    sum += Math.exp(lf - logFactorial(i) - logFactorial(n - i) + i * Math.log(p0) + (n - i) * Math.log(1 - p0));
  }
  return Math.min(1, sum);
}

/** Two-proportion z-test; returns z (positive when a > b) and the two-sided p-value. */
export function twoProportion(xa: number, na: number, xb: number, nb: number): { z: number; p: number } {
  if (na <= 0 || nb <= 0) return { z: 0, p: 1 };
  const pa = xa / na;
  const pb = xb / nb;
  const pool = (xa + xb) / (na + nb);
  const se = Math.sqrt(pool * (1 - pool) * (1 / na + 1 / nb));
  if (se === 0) return { z: 0, p: 1 };
  const z = (pa - pb) / se;
  return { z, p: 2 * (1 - normalCdf(Math.abs(z))) };
}

export function wilson(x: number, n: number, z = 1.96): { low: number; high: number } {
  if (n <= 0) return { low: 0, high: 1 };
  const p = x / n;
  const d = 1 + (z * z) / n;
  const c = p + (z * z) / (2 * n);
  const m = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
  return { low: Math.max(0, (c - m) / d), high: Math.min(1, (c + m) / d) };
}

export function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** Robust z-score of x against history, using median and MAD (scaled to SD). */
export function robustZ(x: number, history: number[]): number | null {
  if (history.length < 5) return null;
  const med = median(history);
  const mad = median(history.map((h) => Math.abs(h - med))) * 1.4826;
  if (mad === 0) return x === med ? 0 : null;
  return (x - med) / mad;
}

/**
 * Ratio of two Poisson rates with a 95% interval on the log scale:
 * (a / exposureA) / (b / exposureB). Used to compare clicks before and after a
 * change; counts of zero get a 0.5 continuity correction.
 */
export function rateRatio(a: number, exposureA: number, b: number, exposureB: number): { ratio: number; low: number; high: number } {
  const ca = a === 0 ? 0.5 : a;
  const cb = b === 0 ? 0.5 : b;
  const ratio = (ca / exposureA) / (cb / exposureB);
  const se = Math.sqrt(1 / ca + 1 / cb);
  return { ratio, low: ratio * Math.exp(-1.96 * se), high: ratio * Math.exp(1.96 * se) };
}

/**
 * Difference-in-differences on counts: (treatAfter/treatBefore) / (ctrlAfter/ctrlBefore),
 * with exposures (impressions or days) so it works for CTR as well as raw clicks.
 */
export function didRatio(
  tA: number, tAExp: number, tB: number, tBExp: number,
  cA: number, cAExp: number, cB: number, cBExp: number,
): { ratio: number; low: number; high: number } {
  const f = (x: number) => (x === 0 ? 0.5 : x);
  const ratio = ((f(tA) / tAExp) / (f(tB) / tBExp)) / ((f(cA) / cAExp) / (f(cB) / cBExp));
  const se = Math.sqrt(1 / f(tA) + 1 / f(tB) + 1 / f(cA) + 1 / f(cB));
  return { ratio, low: ratio * Math.exp(-1.96 * se), high: ratio * Math.exp(1.96 * se) };
}

export const round = (x: number, dp = 1) => Math.round(x * 10 ** dp) / 10 ** dp;
export const pct = (x: number, dp = 1) => `${round(x * 100, dp)}%`;
