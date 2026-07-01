# Auto-Cleanse SEO — Phase 2A Implementation Report

_Completed 2026-07-01. Source of truth: `seo-post-phase-1-indexability-audit.md` / `.json`. Scope was **Phase 2A only**: retire `/fuel-savings-calculator`, rewrite `/stage-1-remaps-devon`, recommend (not implement) actions for the 3 synonym Devon-service pages, and two DPF quick fixes (same-day titles + pricing consistency check). No regionalisation, no 301s/canonicals on the 18 small-town ECU pages, and no changes to the 3 synonym pages. Build, prerender, sitemap and content checks all pass._

## Build & verification status

Clean rebuild (`npm run build` → clean → client → SSR → prerender → sitemap):

| Check | Before | After | Result |
|---|--:|--:|---|
| `npm run build` | — | — | ✅ 136 pages rendered, 0 errors |
| Rendered `index.html` files | 137 | **136** | ✅ (one retired) |
| Sitemap URLs | 137 | **136** | ✅ matches rendered pages |
| `/fuel-savings-calculator` directory in `dist/` | present | **absent** | ✅ removed |
| `/fuel-savings-calculator` in sitemap | yes | **no** | ✅ |
| `…/calculator` canonical anywhere in output | 1 | **0** | ✅ gone |
| Pages with `noindex` | 0 | 0 | ✅ no leakage |
| Orphan rendered pages (rendered ∉ sitemap) | 0 | 0 | ✅ |
| Self-referential canonicals | 136/137 | **136/136** | ✅ 100% |
| `/stage-1-remaps-devon` word count | 847 | **1650** | ✅ improved |
| `/stage-1-remaps-devon` uniqueness (audit method) | 14 | **~68** | ✅ improved |
| "mobile DPF" phrasing | 0 | 0 | ✅ |
| "free diagnostic" phrasing | 0 | 0 | ✅ |
| Map-authoring overclaim ("write files from scratch" as a claim) | — | **0** | ✅ (only the *negated* "we don't write ECU files from scratch" appears) |

---

## 1. Files changed

| File | Change |
|---|---|
| `src/entry-server.tsx` | Removed `'/fuel-savings-calculator'` from `STATIC_ROUTES` → no longer prerendered or in the sitemap. |
| `src/components/PageTransition.tsx` | Removed the `FuelSavingsCalculator` import and its `<Route path="/fuel-savings-calculator">` → no longer a live client route (and tree-shaken from the bundle). |
| `vercel.json` | Added a permanent (301) redirect `/fuel-savings-calculator` → `https://www.auto-cleanse.co.uk/dpf-cleaning`. |
| `src/data/remapping-locations.ts` | Full rewrite of the `stage-1-remaps-devon` entry (meta, intro, 6 unique `extraSections`, 8 Stage-1-specific FAQs, 6 vehicle links, 6 ECU-location links). |
| `src/pages/DPFCleaningTotnes.tsx` | Softened title `Same-Day Drop-Off` → `Fast Turnaround`; hedged the meta-description same-day wording. |
| `src/pages/DPFCleaningNewtonAbbot.tsx` | Softened title `Same-Day Turnaround` → `Fast Turnaround`. |

**Not changed (deliberately):**
- The 18 small-town ECU pages — left unchanged, as instructed (we're trying to make them useful before consolidating).
- `/ecu-tuning-devon`, `/petrol-remapping-devon`, `/performance-remapping-devon` — recommendations only (section 5), no code changes.
- `src/pages/FuelSavingsCalculator.tsx` — the component file was **not deleted**, only unimported. It is now dead code (matches the existing `Remapping.tsx` / `RemappingDevon.tsx` precedent). Safe to delete in a later code-hygiene pass; leaving it changes nothing in the rendered site or bundle.

---

## 2. `/fuel-savings-calculator` retirement summary

The audit found this page's canonical pointed to `/calculator` (a non-existent route), and the tool is old and no longer needed. It has been **retired as a live page**, not patched:

1. **De-registered from indexable routes** — removed from `STATIC_ROUTES`, so the prerender no longer generates it and it is not written to `sitemap.xml`. The prerender's stale-route cleanup + the clean-dist step removed the old `dist/fuel-savings-calculator/` directory (confirmed absent).
2. **Removed from the client router** — the `<Route>` and component import were deleted from `PageTransition.tsx`. There is no longer any live route that renders the page, so its `path="/calculator"` SEO tag never renders — **the `/calculator` canonical no longer appears anywhere in the output** (verified: 0 occurrences).
3. **Internal links** — there were **none**. A project-wide search found no `to=`/`href=` link to `/fuel-savings-calculator` anywhere in `src` (nav, footer, or body), confirming the audit's "0 in-body inbound links". Nothing to remove.
4. **Nav/footer/body** — confirmed not present in `Header.tsx`, `Footer.tsx`, or any page body.
5. **No sitemap 404** — the URL is gone from the sitemap, so there is no dead entry left behind.
6. **No self-canonical / no `/calculator` canonical** — the page no longer renders, so it neither self-canonicalises nor points to `/calculator`.

### Redirect implemented

The project uses a **Vercel** redirect system (`vercel.json` → `redirects[]`, already used for `/remapping`, `/remapping-devon`, `/home`). A matching 301 was added:

```json
{
  "source": "/fuel-savings-calculator",
  "destination": "https://www.auto-cleanse.co.uk/dpf-cleaning",
  "permanent": true
}
```

**Why `/dpf-cleaning`:** the calculator's purpose was estimating fuel/MPG savings from a clean DPF, so the DPF hub is the closest live intent match (and the strongest DPF page). Alternatives considered: `/why-clean` (also on-topic — DPF cleaning benefits/MPG — a reasonable second choice) and `/pricing`/`/ecu-remapping` (less aligned). If you'd prefer the redirect to land on `/why-clean` instead, it's a one-line change — flag it and I'll switch it.

> **Deploy note:** `dist/`, `dist-server/` and `.vercel/` are git-ignored build artifacts. The retirement + redirect take effect on the next deploy, which regenerates the build. The stale `.vercel/output/static/fuel-savings-calculator/` seen locally is a leftover artifact and is not deployed as-is — no manual cleanup needed.

---

## 3. `/stage-1-remaps-devon` rewrite summary

This page had the **highest internal-link value on the site (≈109 in-body inbound links)** but only 14/100 uniqueness — the single highest-ROI page in the audit. It is now a genuinely strong, standalone Stage 1 page.

**Before → after:**

| Metric | Before | After |
|---|--:|--:|
| Rendered word count (`<main>`) | 847 | **1650** |
| Uniqueness (audit method) | 14 | **~68** |
| Duplicate estimate vs nearest sibling | ~83% | **40%** |
| `<h2>` sections | ~8 (template) | **14** |
| Stage-1-specific FAQs | 5 (generic) | **8** |
| In-body links to vehicle pages | 6 (generic set) | **6 (Stage-1-tailored)** |
| In-body links to ECU location pages | 2 | **6 major towns + locations hub** |

**Terms the page now clearly owns:** stage 1 remaps Devon · stage 1 ECU remapping Devon · safe software-only remapping · petrol and diesel Stage 1 tuning · cars, vans and 4x4s.

**New unique content (`extraSections`, rendered before the shared template):**
1. **What a Stage 1 remap actually involves** — software-only, ECU read via OBD/bench, *file matched to your vehicle*, original map saved.
2. **Who Stage 1 tuning is suitable for** — standard petrol/diesel cars, vans and 4x4s; commuters, tradespeople, towing, enthusiasts.
3. **What a Stage 1 remap changes — and what it doesn't** — changes power/torque/response/economy; does **not** need hardware, does **not** remove DPF/EGR/AdBlue, doesn't replace maintenance.
4. **Diagnostics before and after — every time** — paid health check first, fault-code read, post-remap re-check + road test.
5. **Workshop or mobile Stage 1 remapping across Devon** — Totnes workshop or mobile with the same OBD/bench equipment; ~1–2 hrs.
6. **Insurance, legality and reversibility** — declare to insurer, road-legal with emissions intact, fully reversible to factory map.

**8 Stage-1-specific FAQs:** what Stage 1 is · power/torque gains · engine safety · fuel-economy honesty · petrol/diesel/van/4x4 coverage · **does it remove my DPF / affect emissions (No)** · insurance + reversibility · workshop vs mobile.

**Safe wording used throughout (no file-authoring overclaim):** "a remap file matched to your vehicle", "matched to your make, model, engine variant and gearbox", "applied carefully and checked", "not a generic flash-and-go job", "diagnostics before and after", and explicitly **"We don't write ECU files from scratch or use a one-size-fits-all download."** No claim that AutoCleanse authors ECU files.

### Title / meta / H1 changes

| | Before | After |
|---|---|---|
| **Title** | `Stage 1 Remaps Devon \| ECU Tuning \| AutoCleanse` | `Stage 1 Remaps Devon \| Safe ECU Remapping \| AutoCleanse` |
| **Meta description** | "Stage 1 ECU remapping across Devon - more power, better torque, improved fuel economy. Cars, vans and 4x4s…" | "Safe, software-only Stage 1 ECU remapping across Devon for petrol and diesel cars, vans and 4x4s. More power, torque and economy, with diagnostics before and after. Workshop in Totnes or mobile across Devon." |
| **H1** | `Stage 1 Remaps Across Devon` | `Stage 1 Remaps Across Devon` (unchanged — already correct) |

### Internal links added (rendered)

- **6 ECU location pages** (via `relatedSlugs`): Exeter, Plymouth, Torquay, Newton Abbot, Totnes, Barnstaple (+ the Locations hub in breadcrumb).
- **6 vehicle pages** (via `popularVehicles`): BMW 320d, Audi S3, VW Golf GTD, Ford Transit Custom, Ford Ranger, VW Transporter — a Stage-1-relevant spread across petrol/diesel/van/4x4.
- **3 service links** (template): `/ecu-remapping`, `/mobile-ecu-remapping-devon`, `/remapping-booking`.

_(The page continues to receive its ~109 inbound links from vehicle and location templates — those were not changed.)_

---

## 4. DPF quick fixes

### Same-day title wording (softened)

Both titles previously read as guaranteed and were softened per instruction; hedged body copy ("often same-day where possible", "before 10am") was already in place from Phase 1.

| Page | Title before | Title after |
|---|---|---|
| `/dpf-cleaning-totnes` | `DPF Cleaning Totnes \| Same-Day Drop-Off \| AutoCleanse` | `DPF Cleaning Totnes \| Fast Turnaround \| AutoCleanse` |
| `/dpf-cleaning-newton-abbot` | `DPF Cleaning Newton Abbot \| Same-Day Turnaround \| AutoCleanse` | `DPF Cleaning Newton Abbot \| Fast Turnaround \| AutoCleanse` |

The Totnes **meta description** was also softened ("Drop off before 10am for same-day return" → "Fast turnaround, often same-day where possible when the filter is with us before 10am"). The Totnes JSON-LD `description` still contains a conditional "before 10am for same-day return" — it is already qualified, so it was left as-is (flag for owner if you want it softened too).

### DPF pricing consistency (flagged — not changed)

No prices were invented or altered. Current rendered pricing across the six DPF town pages is **inconsistent** and needs owner confirmation:

| Page | Distance from Totnes | Local price stated | Postal price stated |
|---|---|---|---|
| `/dpf-cleaning-torquay` | ~15 mi | **from £210** (within 10 miles) | **from £230** |
| `/dpf-cleaning-totnes` | 0 (workshop) | **from £210** | **from £230** |
| `/dpf-cleaning-exeter` | ~27 mi | **£210–£230** (as a range) | (covered by range) |
| `/dpf-cleaning-paignton` | ~12 mi | **£210** (within 10 miles) | ❌ not stated |
| `/dpf-cleaning-plymouth` | ~25 mi | **from £210** | ❌ not stated |
| `/dpf-cleaning-newton-abbot` | ~8 mi | **from £210** | ❌ not stated |

**Two issues to confirm:**
1. **Postal £230 is stated on Torquay/Totnes/Exeter but omitted on Paignton/Plymouth/Newton Abbot.** If postal cleaning is £230 everywhere, add it to the three that omit it for consistency.
2. **Plymouth (~25 mi) quotes "from £210"** with no qualifier, but Torquay/Paignton tie the £210 rate to "within 10 miles of Totnes". Plymouth is well outside 10 miles, so the £210 claim there may be misleading — confirm whether Plymouth qualifies for £210 (e.g. via collection) or whether it should reference the postal/collection price instead.

**→ Owner review required before any pricing edit.** I did not guess.

---

## 5. Recommendations for the 3 synonym Devon-service pages (no changes made)

All three remain live and unchanged. Each restates an existing stronger page rather than serving a distinct intent. Recommendations below — **awaiting your approval before implementing anything.**

### `/ecu-tuning-devon` — **Recommended: 301 redirect → `/ecu-remapping`**
- **Why:** "ECU tuning Devon" is a pure synonym of the `/ecu-remapping` hub (same intent, same content angle). Audit: uniqueness 14, 1 in-body inbound link, IW 44.
- **Options:** (a) **301 redirect to `/ecu-remapping`** *(recommended — no unique content worth keeping)*; (b) `rel=canonical` to `/ecu-remapping` if you'd rather keep the URL live but non-competing; (c) rewrite as a distinct page — **not advised**, it would just create a second hub competing with `/ecu-remapping`.
- **Verdict:** consolidate into the hub. Do **not** rewrite.

### `/petrol-remapping-devon` — **Recommended: canonicalise/301 → `/ecu-remapping`, unless you want to invest in a genuine petrol page**
- **Why:** overlaps both the hub and `/performance-remapping-devon`. Audit: uniqueness 3, 1 inbound, IW 37, very low demand.
- **Options:** (a) **301/canonicalise to `/ecu-remapping`** *(recommended default)*; (b) **reposition** as a genuinely petrol-specific page (TSI/TFSI/EcoBoost/T-GDI specifics, petrol Stage-1 gains, hot-hatch examples) **only if** you actively want to rank for "petrol remapping Devon" and will give it ~700+ unique words. Petrol *is* a technically distinct sub-intent, but current demand doesn't justify a standalone page as-is.
- **Verdict:** canonicalise/301 unless you commit to a distinct rewrite.

### `/performance-remapping-devon` — **Recommended: 301 redirect → `/stage-1-remaps-devon`** (or reposition as a Stage-2 page)
- **Why:** "performance remapping" ≈ Stage 1/Stage 2 and overlaps the now-strong `/stage-1-remaps-devon`. Audit: uniqueness 4, 4 inbound, IW 40.
- **Options:** (a) **301 to `/stage-1-remaps-devon`** *(recommended — now that Stage-1 is a strong, comprehensive page, this one is redundant)*; (b) **reposition as a dedicated Stage-2 page** ("Stage 2 remapping Devon", hardware-required tuning) if you want to own the Stage-2 term separately — that would be a genuinely distinct page and a reasonable keep; (c) canonicalise to Stage-1 as a lighter-touch alternative to a 301.
- **Verdict:** 301 into Stage-1, **or** pivot it to a distinct Stage-2 page — your call on whether Stage-2 demand justifies the second page.

> Note: these three currently link *to* `/stage-1-remaps-devon` and each other. That's fine while they remain live and now feeds link equity into the strengthened Stage-1 page. When you approve consolidation, the 301s should be added to `vercel.json` (same pattern as the fuel-calculator redirect) and the entries removed from `REMAP_LOCATIONS` so they leave the sitemap cleanly.

---

## 6. Items needing owner review

1. **DPF pricing (section 4)** — confirm postal £230 across all town pages, and whether Plymouth's "from £210" is accurate given the ~25-mile distance. No prices changed pending your confirmation.
2. **Fuel-calculator redirect target** — currently `/dpf-cleaning`. Confirm, or switch to `/why-clean` if you prefer.
3. **Synonym-page consolidation (section 5)** — approve the recommended 301s/canonicals for `/ecu-tuning-devon`, `/petrol-remapping-devon`, `/performance-remapping-devon` (or the reposition alternatives) before I implement.
4. **Stage-1 factual claims** — the new copy states diagnostics are *paid*, mobile carries the same equipment, remaps are reversible, and DPF/EGR/AdBlue are never removed on road cars. Please confirm these match how you operate (they align with existing site wording).
5. **Dead component file** — `src/pages/FuelSavingsCalculator.tsx` is now unimported. Confirm if you'd like it deleted in a hygiene pass (optional; no effect on the live site).

---

## 7. Deliberately NOT done (deferred, as instructed)

- **No regionalisation / 301 / canonical on the 18 small-town ECU pages** — left unchanged so they can be improved before any consolidation.
- **No changes to the 3 synonym pages** — recommendations only.
- **No AI-visibility audit** — not run, as instructed.
- **No pricing edits** — flagged for owner review instead of guessing.

---

**Phase 2A is complete and the build is green (136 pages, 0 errors). Awaiting approval before Phase 2B (small-town ECU pages) and the synonym-page consolidation.**
