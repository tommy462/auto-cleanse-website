# SEO changelog

Branch `seo/gsc-2026-08-21`.

**Baseline data:** `gsc-data/2026-08-21-baseline/` — Google Search Console
"Performance on Search" export, Search type = Web, **2026-05-19 → 2026-08-18
(91 days)**, pulled 2026-08-21.

Site totals for that window: **500 clicks · 24,980 impressions · 2.00% CTR**.
Mobile 355/13,763 (pos 7.76) · Desktop 131/10,988 (pos 23.91) · Tablet 14/229
(pos 7.55).

Two limits that apply to every baseline below:

- The visible query set covers **84 of 500 clicks (17%)** and **5,779 of 24,980
  impressions (23%)**. The rest is anonymised by Google.
- The export has **no query-to-URL join**, so "the page that ranks for query X"
  is inference from the codebase, not GSC fact. Page-level rows are GSC fact.

---

## 2026-08-21 — Batch 1

Seven items from the Phase 1 prioritised table. Two are held; see
[Held](#held) at the bottom.

---

### 1. Blog index now exposes every published post to crawlers

**Commit:** `c75bfd5`
**File:** `src/pages/BlogIndex.tsx`

**What changed.** The index called `filtered.slice(0, visible)` before
rendering, so only `PAGE_SIZE` (9) post links existed in the prerendered HTML.
All published posts now render; "Load more" reveals cards already in the DOM.
Visible cards use `display: contents` so `BlogCard` remains the grid item and
the layout is unchanged.

| | Before | After |
|---|---|---|
| Post links in `dist/blog/index.html` | 9 | **32** |
| Published posts with 0 inbound internal links | 17 | **0** |

> **Correction to the commit message.** It says "38 posts". The correct figure
> is **32 published posts** (`draft: false`); 38 was a count of directories in
> `dist/blog`, which includes the index and prerendered drafts. The code change
> is unaffected — it renders all published posts whatever the count.

**Baseline (2026-08-21) — orphaned posts that were still earning impressions:**

| Page | Clicks | Impr | CTR | Pos |
|---|---|---|---|---|
| `/blog/temperature-data-and-failed-dpf-regeneration` | 4 | 522 | 0.77% | 6.1 |
| `/blog/short-journeys-driving-style-and-dpf-health` | 0 | 125 | 0% | 9.0 |
| `/blog/engine-oil-ash-and-dpf-service-life` | 0 | 122 | 0% | 7.8 |
| `/blog/adblue-crystallisation-and-dosing-faults` | 0 | 133 | 0% | 7.7 |
| `/blog/dpf-pressure-sensor-and-pipe-faults` | 1 | 68 | 1.47% | 7.7 |

**Expected outcome.** These pages were already indexed via the sitemap, so this
is about internal link equity and anchor text, not discovery. Expect gradual
position improvement on the orphaned posts. **Testable:** average position
across the five pages above should improve; if it is flat in six weeks,
internal linking was not the constraint.

**Known caveat.** Cards beyond `visible` are `display: none`. Google crawls and
follows such links but may discount them relative to visible ones. If the
position needle does not move, the next step is a visible archive listing
rather than a hidden one.

---

### 2. Removed incomplete `Offer` markup from 69 vehicle pages

**Commit:** `2d825df`
**Files:** `src/pages/VehicleRemap.tsx`, `src/pages/VehiclePerformanceLookup.tsx`

**What changed.**

```
before   offers: { '@type': 'Offer', availability: 'InStock',
                   priceSpecification: { '@type': 'PriceSpecification',
                                         priceCurrency: 'GBP' } }
after    (node removed)
```

**Deviation from the runbook.** The item was written as "add `price`". These
pages render no price anywhere in their copy, and the brief says to mark up
only content that appears on the page. Adding a number the page does not state
would be worse than removing an incomplete node, and on-page pricing is gated
on Alex and Ray. Removed instead.

**Baseline (2026-08-21).** `Search appearance.csv` has exactly one row:

| Appearance | Clicks | Impr | CTR | Pos |
|---|---|---|---|---|
| Product snippets | 1 | 292 | 0.34% | 11.59 |

That row is fed by this markup.

**Expected outcome.** The Product snippets row should **disappear**, costing
about 1 click and 292 impressions per 91 days. In exchange, 70 pages stop
emitting structured data that Google discards. **Testable:** re-pull
`Search appearance.csv`; the row should be gone or near zero. If overall clicks
on vehicle pages drop by more than a click or two, revisit.

---

### 3. VW Transporter: named T5/T6 in the title and H1

**Commit:** `e2d43df`
**File:** `src/data/vehicle-remapping.ts` (`slug: 'vw-transporter-remap'`)

| | Before | After |
|---|---|---|
| Title | `VW Transporter Remap \| Van Tuning Devon \| AutoCleanse` (53) | `VW Transporter T5/T6 Remap \| Van Tuning Devon \| AutoCleanse` (59) |
| H1 | `VW Transporter Remap` | `VW Transporter T5 & T6 Remap` |
| Meta | unchanged (already said "T5/T6") | unchanged |

**Baseline (2026-08-21).**

| Item | Clicks | Impr | CTR | Pos |
|---|---|---|---|---|
| page `/vw-transporter-remap` | 6 | 884 | 0.68% | 13.6 |
| query `vw t5 remap` | 0 | 98 | 0% | 33.2 |
| query `vw t5 remap cost` | 0 | 42 | 0% | 26.6 |

**Expected outcome.** `vw t5 remap` should move from position 33.2 toward the
page's own 13.6, because the page now contains the generation term in its two
strongest on-page signals. **Testable:** position on `vw t5 remap`. Page CTR
should also lift from 0.68%.

---

### 4. Trimmed five meta descriptions that were truncating

**Commit:** `d6baba3`
**Files:** `src/pages/EcuCloning.tsx`, `src/pages/TradeFileService.tsx`,
`src/pages/About.tsx`, `src/data/dpf-locations.ts`,
`src/data/remapping-locations.ts`

| Page | Before | After |
|---|---|---|
| `/ecu-cloning` | 216 | 153 |
| `/trade-file-service` | 212 | 151 |
| `/about` | 207 | 155 |
| `/dpf-cleaning-south-hams` | 207 | 155 |
| `/stage-1-remaps-devon` | 207 | 156 |

**Baseline (2026-08-21).**

| Page | Clicks | Impr | CTR | Pos |
|---|---|---|---|---|
| `/ecu-cloning` | 3 | 113 | 2.65% | 22.3 |
| `/trade-file-service` | 1 | 68 | 1.47% | 10.5 |
| `/about` | 0 | 298 | 0% | 12.5 |
| `/dpf-cleaning-south-hams` | 1 | 35 | 2.86% | 15.3 |
| `/stage-1-remaps-devon` | 2 | 47 | 4.26% | 10.1 |

**Expected outcome.** CTR only — descriptions do not affect ranking. Positions
should be unchanged; if a position moves, it was not this change.
**Honest note:** `/about` at 298 impressions and 0 clicks is an intent problem,
not a snippet problem. Do not expect it to convert.

---

### 5. Gave `/remapping-booking` an H1

**Commit:** `f886a47`
**File:** `src/pages/RemappingBooking.tsx`

**What changed.** Added `<h1 className="sr-only">Book an ECU remap with
AutoCleanse</h1>`. It was the only one of 186 prerendered routes with zero H1
elements; the wizard's step headings were `h2`s with nothing above them. The
booking card has no visible title by design, so the heading is screen-reader
only. **No visual change.**

**Baseline (2026-08-21).** `/remapping-booking` — 0 clicks, 26 impressions, 0%
CTR, pos 22.9.

**Expected outcome.** Effectively none for search. This is a document-outline
and accessibility fix on a page with 26 impressions per quarter. Logged for
completeness, not because it will move a number.

---

### 6. Trimmed 12 titles that were truncating

**Commit:** `787debb`
**Files:** `src/pages/DPFCleaningNearMe.tsx`,
`src/pages/BlockedDPFCleaningDevon.tsx`, `src/data/remapping-locations.ts`,
`src/data/dpf-locations.ts`

| Page | Before | After |
|---|---|---|
| `/dpf-cleaning-near-me` | 75 | 64 |
| `/blocked-dpf-cleaning-devon` | 74 | 58 |
| `/ecu-remapping-bideford` | 73 | 58 |
| `/ecu-remapping-south-hams` | 72 | 60 |
| `/ecu-remapping-tiverton` | 71 | 56 |
| `/ecu-remapping-north-devon` | 71 | 63 |
| `/ecu-remapping-exeter` | 70 | 60 |
| `/dpf-cleaning-dartmouth` | 70 | 59 |
| `/4x4-remapping-devon` | 70 | 60 |
| `/van-remapping-devon` | 69 | 60 |
| `/petrol-remapping-devon` | 69 | 60 |
| `/fleet-vehicle-remapping-devon` | 69 | 61 |

Full before/after strings are in the commit body. Site-wide, titles over 60
characters went from **72 to 63** — the remainder were left because trimming
them would have cost readability for a character or two.

**Baseline (2026-08-21) — pages with data:**

| Item | Clicks | Impr | CTR | Pos |
|---|---|---|---|---|
| `/ecu-remapping-exeter` | 13 | 1,076 | 1.21% | 15.1 |
| query `remapping exeter` | 0 | 49 | 0% | 15.2 |
| query `remap exeter` | 0 | 30 | 0% | 13.8 |
| `/blocked-dpf-cleaning-devon` | 1 | 157 | 0.64% | 7.8 |
| query `blocked dpf symptoms` | 0 | 37 | 0% | 9.6 |
| `/ecu-remapping-north-devon` | 2 | 141 | 1.42% | 22.2 |
| `/dpf-cleaning-near-me` | 4 | 90 | 4.44% | 34.0 |
| `/ecu-remapping-south-hams` | 3 | 76 | 3.95% | 18.9 |

The other four pages had no rows in `Pages.csv` — **not enough data** to set a
baseline for them.

**Expected outcome.** CTR on `/ecu-remapping-exeter` (1,076 impressions at
1.21%) is the only one large enough to read clearly. **Testable:** that page's
CTR, and clicks on `remapping exeter` / `remap exeter`, both currently zero.

---

## Held

Not implemented. Each needs a decision.

| Item | Why held |
|---|---|
| **H1 word-spacing** (runbook item 2) | `splitText` is duplicated across 23 page files and drops the spaces between words. `src/index.css`, `src/pages/Home.tsx` and `src/pages/PostalDPF.tsx` carry uncommitted work-in-progress that is mid-refactor on this exact animation. Fixing it now would either build on unstable code or sweep unrelated changes into an SEO commit. |
| **Eco-safe wording** (runbook item 13) | Findings below. The worst instance is in `src/pages/Home.tsx`, one of the uncommitted files. Wording needs sign-off regardless. |
| **Six blog titles over 68 chars** | Frontmatter `title` is also the visible H1, the breadcrumb and the `Article` headline, so trimming rewrites published copy. |
| **BMW 320d title/meta** (item 3) | Deliberately held per runbook. |
| **Items 5, 7, 11, 12** | Gated on the Step 4 exports, or on Alex and Ray. |

### Item 13 — factual accuracy findings (no edits made)

The process is **water only, no chemicals.** One place on the site contradicts
that outright:

| File | Line | Current text |
|---|---|---|
| `src/pages/Home.tsx` | 524 | `"Eco-safe solutions break down compacted soot, ash, and oil."` |
| `src/pages/Home.tsx` | 363 | `"Our METclean XL process uses a combination of aqueous solutions and high-pressure pneumatics…"` (inside FAQPage JSON-LD) |

`src/pages/WhyClean.tsx:71` already states it correctly — *"Our process uses
only high-pressure water with no harmful chemicals"* — so the site currently
contradicts itself.

Eleven further places use "aqueous" as a process word. "Aqueous" literally
means water-based and is defensible; paired with "solutions" it implies
additives. Full list is in the Phase 2 report.

### Also found, not acted on

Three posts marked `draft: true` are prerendered and live, and are among the
better performers. They are correctly excluded from the sitemap and the blog
index, so they are unlisted and orphaned yet still ranking:

| Page | Clicks | Impr | CTR | Pos |
|---|---|---|---|---|
| `/blog/adblue-no-start-countdown-sprinter` | 8 | 406 | 1.97% | 7.3 |
| `/blog/bmw-m140i-stage-1-remap` | 6 | 337 | 1.78% | 8.8 |
| `/blog/blocked-dpf-ford-transit-custom` | 8 | 309 | 2.59% | 6.2 |

Either they should be `draft: false` (linked and sitemapped) or they should not
be prerendered. Editorial call.

---

## Check back in 4–6 weeks (early October 2026)

Pull the same export — Search type = Web, last 3 months — plus the per-query
URL exports from Step 4. Then check, in order of how readable the signal will
be:

**Queries — position is the number that matters**

| Query | Baseline pos | Baseline clicks / impr | Change being tested |
|---|---|---|---|
| `vw t5 remap` | 33.2 | 0 / 98 | T5/T6 in title + H1 |
| `vw t5 remap cost` | 26.6 | 0 / 42 | same |
| `remapping exeter` | 15.2 | 0 / 49 | shorter title |
| `remap exeter` | 13.8 | 0 / 30 | same |
| `blocked dpf symptoms` | 9.6 | 0 / 37 | shorter title |
| `remapping plymouth` | 20.0 | 0 / 43 | *control — nothing changed* |
| `dpf cleaning exeter` | 11.0 | 0 / 44 | *control — H1 fix held* |
| `dpf cleaning plymouth` | 13.8 | 3 / 48 | *control — H1 fix held* |
| `dpf symbol` | 11.6 | 0 / 39 | *control — item 11 not done* |

**Pages — CTR is the number that matters**

| Page | Baseline CTR | Baseline clicks / impr / pos | Change being tested |
|---|---|---|---|
| `/vw-transporter-remap` | 0.68% | 6 / 884 / 13.6 | title + H1 |
| `/ecu-remapping-exeter` | 1.21% | 13 / 1,076 / 15.1 | shorter title |
| `/blog/temperature-data-and-failed-dpf-regeneration` | 0.77% | 4 / 522 / 6.1 | de-orphaned |
| `/blog/engine-oil-ash-and-dpf-service-life` | 0% | 0 / 122 / 7.8 | de-orphaned |
| `/blog/short-journeys-driving-style-and-dpf-health` | 0% | 0 / 125 / 9.0 | de-orphaned |
| `/blog/adblue-crystallisation-and-dosing-faults` | 0% | 0 / 133 / 7.7 | de-orphaned |
| `/ecu-cloning` | 2.65% | 3 / 113 / 22.3 | shorter meta |
| `/trade-file-service` | 1.47% | 1 / 68 / 10.5 | shorter meta |
| `/bmw-320d-remap` | 0.96% | 46 / 4,775 / 7.7 | *control — deliberately untouched* |

**Search appearance**

`Product snippets` — baseline 1 click / 292 impr / 0.34% / pos 11.59. Expect it
to vanish. That is the intended result of removing invalid markup, not a
regression.

**Reading the result honestly.** Most of these baselines are small. A query
going from 0 to 2 clicks is noise, not proof. The three numbers big enough to
carry a real signal are `/bmw-320d-remap` (4,775 impr, untouched control),
`/ecu-remapping-exeter` (1,076 impr) and `/vw-transporter-remap` (884 impr).
Judge the batch mainly on those, and use the controls to check whether any
movement is site-wide drift rather than the change.
