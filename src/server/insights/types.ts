// Shared types for the website insights engine (src/server/insights).
// Server-only: nothing here is imported by the public site's client bundle.

export type Confidence = 'low' | 'medium' | 'high';
export type Effort = 'small' | 'medium' | 'large';
export type Category = 'seo' | 'conversion' | 'behaviour' | 'technical' | 'data_quality' | 'anomaly';
export type ScopeType = 'site' | 'group' | 'page' | 'query';
export type RecStatus =
  | 'new' | 'investigating' | 'proposed' | 'awaiting_approval' | 'approved' | 'implemented'
  | 'monitoring' | 'successful' | 'inconclusive' | 'reverted' | 'dismissed' | 'resolved';

/** Statuses in which the engine keeps refreshing a recommendation's evidence. */
export const OPEN_STATUSES: RecStatus[] = ['new', 'investigating', 'proposed', 'awaiting_approval', 'approved'];

export interface PageInfo {
  path: string;
  group: string;
  service: string | null;
  location: string | null;
  pageType: string;
}

export interface SitemapPage {
  path: string;
  lastmod: string | null;
  sitemap: string;
}

/** One page's totals for a window, from whatever sources had data. */
export interface PageWindow {
  path: string;
  group: string;
  clicks: number;
  impressions: number;
  position: number | null;
  mobileImpressions: number;
  otherHostImpressions: number;
  prevClicks: number | null;
  prevImpressions: number | null;
  prevPosition: number | null;
  sessions: number | null;
  engagedSessions: number | null;
  engagementSeconds: number | null;
  mobileSessions: number | null;
  mobileEngaged: number | null;
  views: number | null;
  leads: number | null;
  phoneClicks: number | null;
  whatsappClicks: number | null;
  bookingStarts: number | null;
  deposits: number | null;
  clarity: ClarityPageStats | null;
  inSitemap: boolean;
  contentChangedOn: string | null;
}

export interface ClarityPageStats {
  sessions: number;
  scrollDepth: number | null;
  deadClickPct: number | null;
  rageClickPct: number | null;
  quickbackPct: number | null;
  excessiveScrollPct: number | null;
  mobileSessions: number;
  mobileScrollDepth: number | null;
  desktopScrollDepth: number | null;
}

export interface QueryRow {
  query: string;
  path: string;
  clicks: number;
  impressions: number;
  position: number;
}

export interface EvidenceItem {
  label: string;
  value: string;
  period?: string;
  source: 'Search Console' | 'GA4' | 'Clarity' | 'Website' | 'Stripe' | 'Dashboard' | 'Sitemap' | 'Engine';
}

/** What a rule produces. The recommender merges these into web_recommendations. */
export interface Finding {
  dedupeKey: string;
  kind: 'opportunity' | 'alert';
  rule: string;
  category: Category;
  scopeType: ScopeType;
  scopeKey: string;
  pages: string[];
  title: string;
  problem: string;
  evidence: EvidenceItem[];
  facts: string[];
  hypotheses: string[];
  proposal: string;
  benefit: string;
  effort: Effort;
  confidence: Confidence;
  confidenceScore: number;
  estExtraClicksMonth: number | null;
  valueScore: number;
  measurementDays: number;
  successMetric: string;
  dataSource: 'api' | 'export' | 'mixed';
}

export interface AnalysisWindow {
  /** inclusive ISO dates */
  from: string;
  to: string;
  prevFrom: string;
  prevTo: string;
  days: number;
  label: string;
}

export interface Experiment {
  id: string;
  title: string;
  pages: string[];
  page_groups: string[];
  control_pages: string[];
  method: 'before_after' | 'diff_in_diff' | 'split_test';
  primary_metric: string;
  implemented_on: string | null;
  measure_from: string | null;
  measure_to: string | null;
  baseline_from: string | null;
  baseline_to: string | null;
  outcome: string;
  recommendation_id: string | null;
}

export interface RunStep {
  step: string;
  status: 'ok' | 'skipped' | 'failed';
  rows?: number;
  ms: number;
  note?: string;
  error?: string;
}
