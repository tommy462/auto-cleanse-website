# Auto-Cleanse SEO — Phase 2A Follow-up Report

_Completed 2026-07-01. Small approved follow-up to Phase 2A: DPF pricing consistency, synonym-page consolidation (ecu-tuning + performance), and kept the fuel-calculator redirect. `/petrol-remapping-devon` deliberately left live for a Phase 2B decision. Build, prerender, sitemap and canonical checks all pass._

## Build & verification status

| Check | Before (Phase 2A) | After | Result |
|---|--:|--:|---|
| `npm run build` | 136 pages | **134 pages, 0 errors** | ✅ |
| Rendered `index.html` files | 136 | **134** | ✅ (2 retired) |
| Sitemap URLs | 136 | **134** | ✅ matches rendered pages |
| `/ecu-tuning-devon` in dist & sitemap | yes | **no** | ✅ removed |
| `/performance-remapping-devon` in dist & sitemap | yes | **no** | ✅ removed |
| `/petrol-remapping-devon` still live & in sitemap | yes | **yes** | ✅ kept (Phase 2B) |
| Orphan rendered pages (rendered ∉ sitemap) | 0 | 0 | ✅ |
| Pages with `noindex` | 0 | 0 | ✅ no leakage |
| Self-referential canonicals | 136/136 | **134/134** | ✅ 100% |
| Canonical pointing to a removed/retired URL | 0 | **0** | ✅ |
| Redirects in `vercel.json` | 5 | **7** (all 301) | ✅ |
| DPF pricing wording consistent across 6 town pages | ❌ inconsistent | ✅ **standardised** | ✅ |

---

## 1. Files changed

| File | Change |
|---|---|
| `src/data/remapping-locations.ts` | Removed the `performance-remapping-devon` and `ecu-tuning-devon` entries from `REMAP_LOCATIONS` (de-registers them from routes + sitemap). Cleaned the two now-dangling `performance-remapping-devon` links out of the `petrol-remapping-devon` and `4x4-remapping-devon` `relatedSlugs`. |
| `vercel.json` | Added two permanent (301) redirects (see §3). |
| `src/pages/DPFCleaningTorquay.tsx` | Standardised pricing wording. |
| `src/pages/DPFCleaningTotnes.tsx` | Standardised pricing wording (prose + FAQ answer). |
| `src/pages/DPFCleaningExeter.tsx` | Standardised pricing wording (was a `£210–£230` range). |
| `src/pages/DPFCleaningPaignton.tsx` | Standardised pricing wording (two spots; removed the "within 10 miles / lowest collection rate" framing). |
| `src/pages/DPFCleaningPlymouth.tsx` | Standardised pricing wording (added postal + collection-varies; important as Plymouth is ~25 mi from Totnes). |
| `src/pages/DPFCleaningNewtonAbbot.tsx` | Standardised pricing wording (FAQ answer + prose). |

No other pages were touched. The fuel-calculator retirement from the earlier Phase 2A step is unchanged.

---

## 2. Routes removed

Both removed from indexable routes (`REMAP_LOCATIONS`), so they no longer prerender and are **gone from `sitemap.xml`**; the clean-build removed their old `dist/` directories.

| Removed route | Was | Now handled by |
|---|---|---|
| `/ecu-tuning-devon` | ECU-tuning synonym landing page | 301 → `/ecu-remapping` |
| `/performance-remapping-devon` | Performance-remapping synonym landing page | 301 → `/stage-1-remaps-devon` |

Confirmed: neither appears in `dist/`, the sitemap, or as a canonical target anywhere. No internal links to them remain (the only references were `relatedSlugs`, now cleaned; there were no hardcoded `to=`/`href=` links in components).

**Final page count: 137 (Phase 1) → 136 (Phase 2A) → 134 (this follow-up).**

---

## 3. Redirects added (`vercel.json`)

```json
{ "source": "/ecu-tuning-devon",          "destination": "https://www.auto-cleanse.co.uk/ecu-remapping",        "permanent": true },
{ "source": "/performance-remapping-devon","destination": "https://www.auto-cleanse.co.uk/stage-1-remaps-devon", "permanent": true }
```

Full redirect list now in `vercel.json` (all 301):
- `auto-cleanse.co.uk/*` → `www.` (host canonicalisation)
- `/home` → `/`
- `/remapping` → `/ecu-remapping`
- `/remapping-devon` → `/ecu-remapping`
- `/fuel-savings-calculator` → `/dpf-cleaning` _(kept, as instructed)_
- **`/ecu-tuning-devon` → `/ecu-remapping`** _(new)_
- **`/performance-remapping-devon` → `/stage-1-remaps-devon`** _(new)_

> Redirects take effect on the next Vercel deploy, which regenerates the build. `dist/`, `dist-server/` and `.vercel/` are git-ignored artifacts.

---

## 4. DPF pricing wording changed

Applied the approved rule consistently to all six DPF town pages:
- **DPF cleaning from £210**
- **Postal DPF cleaning from £230**
- **Collection and return may vary depending on location and availability**

| Page | Before | After |
|---|---|---|
| Torquay | £210 "for vehicles within 10 miles"; postal £230 | from £210; postal from £230; **collection/return may vary** |
| Totnes | £210 local + postal £230 (prose + FAQ) | from £210; postal from £230; **collection/return may vary** (prose + FAQ) |
| Exeter | "typically costs £210–£230" (range) | from £210; postal from £230; **collection/return may vary** |
| Paignton | £210 only ("lowest collection rate"/"within 10 miles"); no postal | from £210; **postal from £230**; **collection/return may vary** |
| Plymouth | £210 only; no postal | from £210; **postal from £230**; **collection/return may vary** |
| Newton Abbot | £210 only (FAQ + prose); no postal | from £210; **postal from £230**; **collection/return may vary** (FAQ + prose) |

Notes:
- Replacement-cost comparison figures (e.g. "£500–£2,000+ fitted") were **left unchanged** — they describe the cost of *replacing* a DPF, not our service price, and are illustrative ranges.
- The **Plymouth** fix is the most important: it previously implied a flat "from £210" without acknowledging the ~25-mile distance. It now states the base £210 cleaning price plus postal £230, with collection/return varying by location — accurate for a driver outside the local radius.
- No prices were invented; only the two figures already in use on the site (£210 / £230) plus the collection-varies caveat.

---

## 5. `/petrol-remapping-devon` — left live (Phase 2B decision)

As instructed, this page was **not** changed or redirected. It remains live and in the sitemap. Its `relatedSlugs` were tidied only to drop the now-removed `performance-remapping-devon` link (it now links to `/stage-1-remaps-devon` and `/ecu-remapping-exeter`).

**Phase 2B decision required — one of:**
- **(a) Rewrite** as a genuinely petrol-specific page (TSI/TFSI/T-GDI/EcoBoost specifics, petrol Stage-1 gains, hot-hatch examples, ~700+ unique words) to target "petrol remapping Devon"; **or**
- **(b) 301 → `/ecu-remapping`** if petrol demand doesn't justify a standalone page (current state: ~3 uniqueness, 1 in-body inbound link, low demand).

_Current status: it is a near-duplicate template page, so if left as-is indefinitely it will likely remain "Discovered – currently not indexed." No harm in it staying live short-term while you decide._

---

## 6. Anything needing owner review

1. **DPF pricing accuracy** — the wording is now consistent, but please confirm the underlying facts are correct: **£210** base DPF clean, **£230** postal, and that collection/return genuinely "varies by location and availability" (rather than a fixed collection fee). If there's a specific collection charge or radius, tell me and I'll reflect it precisely.
2. **Redirect targets** — confirm the two new 301s are the intended destinations (`/ecu-tuning-devon` → `/ecu-remapping`; `/performance-remapping-devon` → `/stage-1-remaps-devon`). Both are live, strong pages.
3. **`/petrol-remapping-devon`** — pick option (a) rewrite or (b) 301 for Phase 2B (§5).
4. **Optional cleanup (no live-site effect):** the dead `src/pages/FuelSavingsCalculator.tsx` file (unimported since Phase 2A) can be deleted in a code-hygiene pass. Also note a pre-existing dead `relatedSlug` `"ecu-remapping-devon"` in the `diesel-remapping-devon` entry (no such page exists; the template silently skips it) — harmless, flagged for tidiness.

---

## 7. Deliberately NOT done

- **No change to `/petrol-remapping-devon`** — deferred to Phase 2B, as instructed.
- **No changes to the 18 small-town ECU pages** — still awaiting the Phase 2B "make useful vs consolidate" decision.
- **No new prices invented** — only standardised the existing £210/£230 figures plus the collection caveat.
- **No AI-visibility audit** — not run.

---

**Phase 2A follow-up complete and the build is green (134 pages, 0 errors, 134/134 self-canonical, 7 × 301 redirects). Awaiting your Phase 2B decisions.**
