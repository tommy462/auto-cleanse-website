# Auto-Cleanse SEO — Phase 1 Implementation Report

_Completed 2026-07-01. Scope: the controlled Phase 1 tasks only (redirect links, internal linking, DPF cannibalisation differentiation, 9 priority page rewrites, 2 vehicle expansions, build/prerender hardening). No merges, deletions, canonicals or noindex beyond the DPF differentiation. Build, prerender, sitemap and link checks all pass._

## Build & verification status

| Check | Result |
|---|---|
| `npm run build` (clean → client → SSR → prerender) | ✅ 137 pages rendered, 0 errors |
| Prerendered `index.html` files | ✅ 137 (was 138 — stale orphan removed) |
| `dist/fuel-economy-remaps-devon/` orphan | ✅ Gone |
| Sitemap URLs | ✅ 137, no orphan, no redirect URLs, robots.txt still references it |
| Redirect links (`/remapping`, `/remapping-devon`, `/vehicle-remapping`) in rendered `<main>` | ✅ 0 |
| `href="/vehicle-remapping"` anywhere (incl. footer) | ✅ 0 |
| "mobile DPF clean" phrasing | ✅ 0 pages |
| "free diagnostic" phrasing | ✅ 0 pages |
| DPF rewrite pages still describe workshop/off-vehicle service | ✅ Yes |

---

## 1. Files changed

**Templates & components (affect many rendered pages):**
- `src/pages/RemappingLocation.tsx` — powers all 29 ECU-location + 9 Devon-service pages
- `src/pages/VehicleRemap.tsx` — powers all 69 vehicle pages
- `src/components/Footer.tsx` — renders on every page

**Data files:**
- `src/data/remapping-locations.ts` — added `extraSections`/`popularVehicles` to the interface; rewrote Torquay, Exeter, Newton Abbot and Mobile ECU entries
- `src/data/vehicle-remapping.ts` — added `contentSections` to the interface; expanded BMW 320d and VW Transporter entries

**Individual pages:**
- `src/pages/Home.tsx`, `src/pages/Services.tsx`, `src/pages/Pricing.tsx`, `src/pages/RemappingBooking.tsx` — redirect-link fixes
- `src/pages/DPFCleaningHub.tsx` — CTA now links to `/book`
- `src/pages/DPFCleaningDevon.tsx` — repositioned (cannibalisation fix)
- `src/pages/DPFCleaningTorquay.tsx`, `DPFCleaningTotnes.tsx`, `DPFCleaningExeter.tsx` — rewrites
- `src/pages/DPFCleaningPaignton.tsx`, `DPFCleaningPlymouth.tsx` — redirect fix + DPF cluster links (link-only, no content rewrite)

**Build / tooling:**
- `scripts/clean-dist.mjs` — **new**: removes `dist/` and `dist-server/` before a build
- `scripts/prerender.mjs` — added defensive removal of stale prerendered routes
- `package.json` — added `clean` script; `build` now runs the clean step first

---

## 2. Pages changed (rendered output)

- **9 priority rewrites** (genuine new content): `/ecu-remapping-torquay`, `/ecu-remapping-exeter`, `/ecu-remapping-newton-abbot`, `/mobile-ecu-remapping-devon`, `/dpf-cleaning-torquay`, `/dpf-cleaning-totnes`, `/dpf-cleaning-exeter`, `/bmw-320d-remap`, `/vw-transporter-remap`.
- **1 repositioned page**: `/dpf-cleaning-devon` (differentiated from `/dpf-cleaning`).
- **Template-level internal-linking additions** (as required by tasks 2 & 3) touched the rendered output of all **69 vehicle pages** and all **38 RemappingLocation pages** (29 ECU-location + 9 Devon-service). These pages received new contextual links and a "Popular vehicles" / "Related services" block, but their **existing body copy was not rewritten** — only the 9 pages above had content changes.
- **Redirect-link fixes** changed a link on Home, Services, Pricing, RemappingBooking, both remaining DPF town pages (Paignton, Plymouth), and the Footer (which renders site-wide).

---

## 3. Redirect links fixed (task 1)

All internal links now point to final canonical URLs. `/remapping` → `/ecu-remapping`; `/vehicle-remapping` → `/vehicle-performance-lookup`.

| File | Link fixed |
|---|---|
| `Footer.tsx` | `/vehicle-remapping` → `/vehicle-performance-lookup` (site-wide "View All" vehicles) |
| `Home.tsx` | 2× `/remapping` → `/ecu-remapping` |
| `Services.tsx` | `/remapping` → `/ecu-remapping` |
| `Pricing.tsx` | `/remapping` → `/ecu-remapping` |
| `RemappingBooking.tsx` | `/remapping` → `/ecu-remapping` (back link) |
| `VehicleRemap.tsx` | 2× breadcrumb `/vehicle-remapping` → `/vehicle-performance-lookup` (all 69 vehicle pages) |
| `RemappingLocation.tsx` | fallback `<Navigate to="/remapping">` → `/ecu-remapping` |
| `DPFCleaningTorquay/Exeter/Paignton/Plymouth.tsx` | inline + related-list `/remapping` → `/ecu-remapping` |

Verified: **0** `/remapping`, `/remapping-devon` or `/vehicle-remapping` links remain in any rendered page (main content or footer).

> Not changed on purpose: `src/pages/Remapping.tsx` and `src/pages/RemappingDevon.tsx` still contain `/remapping` references, but these files are **dead code** — they are not imported by the router (`/remapping` and `/remapping-devon` are `<Navigate>` redirects) and never render. Left untouched to avoid editing unused files.

---

## 4. Internal-linking improvements (tasks 2, 3, 4)

**Vehicle pages (task 2)** — `VehicleRemap.tsx` now includes a "Remapping services" block plus an updated mobile card. Verified **69/69** vehicle pages now link to:
`/ecu-remapping`, `/mobile-ecu-remapping-devon`, `/stage-1-remaps-devon`, `/ecu-remapping-locations`, `/remapping-booking`. (Previously 0/69 linked to the mobile page.)

**ECU location pages (task 3)** — `RemappingLocation.tsx` now renders a "Related services" block and a "Popular vehicles we remap" section. Verified **29/29** ECU-location pages now link to `/ecu-remapping`, `/mobile-ecu-remapping-devon`, `/stage-1-remaps-devon`, their 3 nearby sibling towns, and **≥4 vehicle remap pages** (previously 0 linked to any vehicle page).
- The dedicated **"Popular Vehicles We Remap in {town}"** card section renders only for the 6 major towns (Torquay, Exeter, Newton Abbot, Paignton, Plymouth, Totnes) — verified 6 vehicle links each. Other location pages get a generically-headed version of the same block.

**DPF pages (task 4)** — DPF town pages now link into the DPF cluster (`/dpf-cleaning`, `/dpf-diagnostics-devon`, `/blocked-dpf-cleaning-devon`, `/pricing`, `/postal-dpf`, `/book` where relevant). Verified the hub `/dpf-cleaning` links to **6/6** DPF town pages (it already did, via its "DPF Cleaning by Location" section).

---

## 5. DPF cannibalisation fix (task 5)

`/dpf-cleaning` remains the **primary** page for "DPF cleaning Devon / near me / professional DPF cleaning Devon" (title *"DPF Cleaning Devon | Professional DPF Clean"*, H1 *"Professional DPF Cleaning Devon."* — unchanged, already correct).

`/dpf-cleaning-devon` was **differentiated** (not merged, not canonicalised) into a Devon-wide collection / trade & fleet coverage page:
- **Title:** `DPF Cleaning Devon | Same-Day Return` → **`DPF Collection & Trade Cleaning Across Devon`** (removes the duplicate "DPF Cleaning Devon" head-term title).
- **Meta:** now about Devon-wide collection/return for garages, fleets and trade, workshop drop-off and postal — not the generic head term.
- **H1:** `DPF Cleaning Across Devon.` → **`DPF Collection Across Devon.`**
- **Intro:** explicitly frames the page as coverage/collection and **links the "cleaning process" head term to `/dpf-cleaning`** as the main page.
- **New content:** an "Areas We Collect Across Devon" grid (links to all 6 DPF town pages) and a "DPF Services & Booking" cluster (`/dpf-cleaning`, `/dpf-diagnostics-devon`, `/blocked-dpf-cleaning-devon`, `/postal-dpf`, `/pricing`, `/book`).

The two pages now target distinct intent (transactional "DPF cleaning" vs "Devon-wide collection / trade & fleet").

---

## 6. Pages rewritten & before/after word counts

Rendered main-content word counts (nav/footer excluded):

| Page | Before | After | Δ | Notes |
|---|---:|---:|---:|---|
| `/bmw-320d-remap` | 453 | 1126 | +673 | Full expansion (see task 7) |
| `/vw-transporter-remap` | 361 | 918 | +557 | Full expansion (see task 7) |
| `/mobile-ecu-remapping-devon` | 780 | 1215 | +435 | Distinct mobile-process content |
| `/ecu-remapping-torquay` | 874 | 1222 | +348 | Local Torbay content + FAQs |
| `/ecu-remapping-newton-abbot` | 778 | 1083 | +305 | Local content |
| `/ecu-remapping-exeter` | 878 | 1180 | +302 | Local East-Devon content |
| `/dpf-cleaning-totnes` | 633 | 828 | +195 | Price line, workshop drop-off, FAQs |
| `/dpf-cleaning-exeter` | 654 | 821 | +167 | FAQs + cluster links |
| `/dpf-cleaning-torquay` | 647 | 803 | +156 | FAQs + cluster links |
| `/dpf-cleaning-devon` | 707 | 785 | +78 | Repositioned (coverage/collection) |

_(Counts include the new template "Popular vehicles" + "Related services" blocks on location/vehicle pages, which add ~40–60 words. The unique-prose additions are the larger share.)_

**Reduced templated duplication:** the rewritten ECU-location and mobile pages now carry 250–450 words of genuinely page-specific prose (`extraSections`) above the shared template, materially lowering the shared-boilerplate ratio those pages had in the audit. Honesty was preserved throughout — the new ECU/mobile copy explicitly states DPF cleaning is workshop-based (not roadside), diagnostics are paid (not free), and same-day is hedged ("where possible").

---

## 7. Vehicle page expansions (BMW 320d, VW Transporter)

Both now use the new optional `contentSections` field on `VehicleRemapData` (rendered below the existing engine/gains tables, which were kept). Each covers the requested topics:

- **What to expect from the remap** + real-world driving benefits
- **Engine variants** (320d: N47 vs B47; Transporter: T5/T6/T6.1)
- **Gearbox considerations** (ZF8 auto / DSG / manual clutch)
- **Economy expectations** (hedged, real-world %)
- **Stage 1 suitability** (why Stage 1 is recommended)
- **Diagnostics-first process** (explicitly stated as a *paid* health check, not free)
- **Insurance / legal reminder** (declare to insurer; Stage 1 keeps DPF/emissions intact and is road-legal; no DPF/emissions removal offered)
- Internal links to `/mobile-ecu-remapping-devon` and relevant location pages (via the new template block)

Result: BMW 320d 453→1126 words; VW Transporter 361→918 words.

---

## 8. Stale orphan / build hardening (task 8)

- **`dist/fuel-economy-remaps-devon/` is gone** — confirmed absent after the build, and absent from the sitemap.
- **`scripts/clean-dist.mjs`** (new) removes `dist/` and `dist-server/` before every build; wired into `npm run build` as the first step.
- **`scripts/prerender.mjs`** now also removes any prerendered route directory that carries our SSR app-root marker but is no longer in the `routes` list. This protects standalone `npm run prerender` runs (the original cause of the orphan) without ever touching genuine static assets.
- No live route was created for `fuel-economy-remaps-devon`.

---

## 9. Risks / pages needing human review

1. **Confirm current DPF pricing.** The Totnes rewrite now states "from £210" (local) / "from £230" (postal), matching figures already used on the Torquay/Exeter/Paignton pages. Please confirm these are current.
2. **"Same-Day" in two DPF title tags remains.** `/dpf-cleaning-totnes` ("Same-Day Drop-Off") and `/dpf-cleaning-newton-abbot` ("Same-Day Turnaround") titles were **not** changed (out of Phase 1 scope). Body copy everywhere is hedged ("where possible", "before 10am"). Recommend verifying deliverability or softening these two titles in a later pass. (`/dpf-cleaning-devon`'s "Same-Day Return" title *was* removed as part of the repositioning.)
3. **BMW 320d is ~1126 words** — above the 700–900 target. The extra length is genuine, useful content (engine-code and gearbox detail); flagged only for awareness.
4. **"Popular vehicles" list is a fixed curated set** (320d, Transporter, Transit Custom, Ranger, A3, Golf GTD) shown on every location page rather than town-tailored. Fine for Phase 1; could be tailored per area later. It also renders on the 9 Devon-service pages and 23 non-major town pages as a side-effect of the shared template — this is a beneficial linking change, not a content rewrite.
5. **Content accuracy of new local claims** (collection routes, drive times, "trade accounts", METclean process) should get a quick owner read-through to confirm they match how the business actually operates.

---

## 10. Deliberately NOT done (deferred to later phases)

- **No merges / canonicalisation / noindex** beyond the DPF differentiation — as instructed. `/ecu-tuning-devon`, `/petrol-remapping-devon` and the small-town ECU long tail were left exactly as-is (still flagged in the audit for a future phase).
- **No body-content rewrite of the other ~100 pages** — only internal-linking (template) changes reached them, as tasks 2–4 required.
- **No global vehicle legal disclaimer** added to the other 67 vehicle pages — the insurance/legal reminder was added only within the two expanded pages' content to avoid altering pages outside the rewrite scope. (Recommend rolling a short disclaimer into the vehicle template in a later phase.)
- **No changes to routes, canonicals, schema types or the sitemap generator logic** — only the stale-route cleanup was added to prerender.
- **Dead files** `Remapping.tsx` / `RemappingDevon.tsx` left untouched (not rendered).

---

**Phase 1 is complete and the build is green. Awaiting approval before proceeding to Phase 2.**
