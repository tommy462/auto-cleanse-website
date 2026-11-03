# Website insights engine

Collects the site's analytics every morning, works out what deserves attention, and shows it in the
internal dashboard (Auto-Cleanse > Website, `/dpf/website`). It recommends; it does not change the
website. This file has no analytics figures in it on purpose: this repository is public.

## How it fits together

```
Vercel Cron (06:00 + 07:00 UTC)        dashboard (JUSTLOGPLATFORM, masters only)
        |                                        ^
        v                                        | reads with the signed-in user's session
api/insights.ts  --- writes (secret key) --->  Supabase  web_* tables
        |                                        ^
        +-- src/server/insights/pipeline.ts      | the website's enquiry counter (POST /api/insights)
              sitemap -> Search Console -> GA4 -> Clarity -> jobs + Stripe
              -> marts -> rules -> recommendations -> experiments -> (Mondays) AI write-up
```

- **One function, three jobs** (`api/insights.ts`): the cron run (GET, `Authorization: Bearer CRON_SECRET`),
  manual runs (POST with the same header), and the cookieless enquiry counter (POST from the site's own
  forms). Hobby allows 12 functions; this is the 10th (11th once `/partners` ships).
- **The run waits for 7am UK.** Vercel Cron is UTC and fires within the hour, so two schedules exist and
  the handler skips until the UK clock reads 7. `web_claim_run` makes sure only one run per day does the
  work; a failed day can be retried (up to 4 attempts), a run stuck for 20 minutes is released.
- **Each source is a separate step.** A failing source is logged in `web_runs.steps` and the rest carry
  on (status `partial`). Transient API errors are retried with backoff (`http.ts`).
- **Search Console** is re-read for the last 10 days every run (late revisions land; days before
  `firstIncompleteDate` are marked final). Page x day totals (stored as device `ALL`), property totals per
  day (these include anonymised queries), and on Mondays a query x page snapshot for 28 days. Page x
  device x day is fetched too but only for the phone share: adding the device dimension makes Google drop
  most rows (found 3 Nov 2026, about 80% of impressions), so it must never be used for page totals.
- **PostgREST returns at most 1,000 rows per request**, including from functions. More than 1,000 pages get
  impressions, so every window-function read goes through `rpcAll` (paged, stable order).
- **GA4** is re-read for the last 4 days: landing page x channel x device, page views, and the conversion
  events listed in `site-config.ts` (`generate_lead`, `phone_click`, `contact_click`, `booking_click`,
  `begin_checkout`, `dpf_cta_click`). GA4 only sees visitors who pressed Accept.
- **Clarity**: 3 of the 10 daily requests (site, URL, URL x device) for the last 24 hours. The export API
  cannot go further back and has no recordings or heatmaps, so history builds one day at a time and the
  dashboard links into Clarity for recordings and heatmaps. Only the "Traffic" response shape is documented
  by Microsoft; the parser is defensive and the raw responses are kept in `web_clarity_snapshots`.
- **Business**: jobs created and done per day and service (counts and quoted value only; the
  "Stripe session" filter runs in the database so job notes are never read), and Stripe checkout sessions
  (started / paid) with the `attr_*` metadata the booking page now sends.

## What counts as a conversion

| Event | Source | Counts | Notes |
|---|---|---|---|
| Enquiry form sent | site counter (`lead_submitted`) + GA4 `generate_lead` | every form, plus source when not rejected | primary |
| Remap deposit paid | Stripe (`deposit_paid`) | every paid session | primary, revenue |
| Booking started | Stripe (`checkout_started`), GA4 `begin_checkout` | | secondary |
| Booking link tapped | GA4 `booking_click` | consented only | secondary |
| Call tap | GA4 `phone_click` (+ Google Ads call conversion) | consented only | a tap, not a completed call |
| WhatsApp / text tap | GA4 `contact_click` | consented only | secondary |
| Job booked | dashboard `jobs` | all channels | cannot be credited to a page (most come by phone) |

The site counter and GA4 are never added together: the dashboard shows the site counter when it has data
and says which source it used.

## Analysis rules (`rules.ts`, `alerts.ts`)

Every finding needs a significance test and a minimum size; near-identical pages are rolled up into one
group finding; facts and possible explanations are kept apart. Rules: CTR below this site's own CTR at the
same position (`ctr_gap`), pages just off page one (`page_two`), significant visibility drops, sitemap pages
with no impressions, unmet search demand by service, two pages splitting the same searches, non-www
impressions and dead URLs, pages converting below similar pages (GA4), phone vs desktop engagement, Clarity
frustration signals and low scroll depth. Daily alerts: stale Search Console data, GA4 or Clarity going
silent, tracking that stops firing, and extreme moves against the same weekday over 8 weeks.

**Holds.** Pages under a running experiment are left out of every rule. Pages whose text changed during or
after the data window (sitemap `lastmod`, which only moves when title, description or text change) are left
out of CTR and behaviour rules for 5 weeks; ranking rules still report them with the change date.

**Recommendations** (`recommend.ts`): one row per dedupe key, ever. New opportunities only come from the
Monday run; the daily run refreshes evidence and raises alerts. Implemented, dismissed (90-day snooze) and
closed items are left alone; an open item not seen for 14 days closes itself as resolved.

**Priority** = value x confidence / effort (1, 1.5, 2.5). Value is extra Google clicks a month x a page-group
weight. The weights in `site-config.ts` are business assumptions (Devon work at full price, national work
for a margin, articles rarely sell), not measurements; edit them to change the ranking.

**Experiments** (`experiments.ts`): baseline = the same number of days before the change; measurement
starts 7 days after it. Before/after, or difference-in-differences when control pages are given. Verdict
"successful" / "unsuccessful" only when the whole 95% interval is on one side of no change; otherwise
"inconclusive".

## AI (`ai.ts`)

Weekly, the top 12 open opportunities (compact JSON, never raw tables) go to `claude-opus-5-5`
(override with `INSIGHTS_AI_MODEL`) with structured JSON output and server-side refusal fallback. Claude
writes the headline, likely causes, a specific proposal, how to measure it and the top three; it never
sets numbers. Output is validated (known ids only, length caps, no dashes, banned claims rejected) and
stored in `web_recommendations.ai`, shown labelled in the dashboard. Off until a master switches it on
in Data health; hard monthly cap (default $5, max $50); every call, made or skipped, is logged with
tokens and cost in `web_ai_calls`. A Claude subscription does not cover this: it needs an API key.

## Setup

1. **Database**: run `supabase/migrations/20261101_website_insights.sql` in the Supabase SQL editor
   (JUSTLOGPLATFORM repo). It tests itself and rolls back on any failure.
2. **Vercel env (website project, Production)**:
   - `CRON_SECRET`: 32+ random characters. Vercel sends it to the cron automatically.
   - `INSIGHTS_GOOGLE_CLIENT_EMAIL`, `INSIGHTS_GOOGLE_PRIVATE_KEY` (Secret): a Google Cloud service account
     with the Search Console API and Google Analytics Data API enabled. Add its email as a user on the
     Search Console property and as a Viewer in GA4 Admin > Property access management.
   - `INSIGHTS_GSC_PROPERTY`: `https://www.auto-cleanse.co.uk/` (or `sc-domain:auto-cleanse.co.uk` if that
     is the verified property).
   - `INSIGHTS_GA4_PROPERTY_ID`: the numeric GA4 property id (Admin > Property details), not `G-...`.
   - `VITE_CLARITY_PROJECT_ID`: turns the Clarity script on (after Accept only) and adds Clarity to the
     banner and policies. `INSIGHTS_CLARITY_TOKEN` (Secret): Clarity > Settings > Data Export.
   - `ANTHROPIC_API_KEY` (Secret, optional): for the weekly write-up.
   - Existing and reused: `AUTOCLEANSE_SUPABASE_URL`, `AUTOCLEANSE_SUPABASE_SERVICE_KEY`, `STRIPE_SECRET_KEY`.
3. **Clarity project settings**: masking Balanced or Strict (inputs are masked in every mode; forms, booking
   pages, chat and lookup results also carry `data-clarity-mask`). Leave "cookies" on: the script only loads
   after Accept.
4. **Backfill** (once, from a terminal with the env above in a local file that is never committed):
   `npx tsx --env-file=<file> scripts/insights.ts backfill --from 2025-07-01 --to <yesterday>`, then
   `scripts/insights.ts seed-experiments` and `scripts/insights.ts daily --force --weekly`.
5. **Search Console export** (works before the API is connected):
   `npx tsx --env-file=<file> scripts/insights.ts import-export <unzipped export folder>`.
   `analyse-export <folder>` does the analysis without touching the database.

## Tests

- `npx tsx scripts/test-insights.ts`: the engine (synthetic data only).
- JUSTLOGPLATFORM: `npx tsx scripts/test-website-insights-sql.ts` (migration, access rules, run claiming,
  window totals, retention, in PGlite) and `npx tsx scripts/test-website-model.ts`.

## Privacy

- No personal data in any `web_*` table: no names, contact details, registrations, IPs or visitor ids.
- Google and Clarity load only after Accept (`src/lib/consent.ts`); an Accept given before Clarity was
  added is asked again once. Reject removes their cookies and reloads.
- The enquiry counter sends page, form and service on every successful form; the traffic source and
  device type only when the visitor has not chosen Reject. No cookies or browser storage. The attribution
  is read once per page load and kept in memory (`src/lib/attribution.ts`); ad click ids are never stored.
- Retention: Search Console 500 days, GA4 and Clarity aggregates 25 months, raw Clarity responses 400
  days, conversions 25 months, runs and AI logs 400 days (`web_prune`, run daily).
- `/cookie-policy` and `/privacy` describe all of this; the Clarity parts appear only when
  `VITE_CLARITY_PROJECT_ID` is set, so the published policy matches what the site does.

## Reuse for other sites

Everything business-specific is in `site-config.ts` (page groups and weights, conversion events, facts and
copy rules for the AI) and `classify.ts` (URL patterns). Tables carry `site_id`. A second business gets its
own config, its own credentials and, for isolation, its own Supabase project.
