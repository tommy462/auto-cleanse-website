# Auto-Cleanse SEO — Phase 2C Small-Town Location Implementation Report

_Completed 2026-07-01. Scope: make the remaining 18 small-town ECU location pages genuinely useful and more index-worthy **before** any regionalising/301ing. Each page kept its existing layout and template; added a unique local section, tailored vehicle links, a localised Popular-Vehicles intro, two local FAQs, and hub/nearby-town internal links. Several inaccurate claims in the existing copy were corrected. **No regionalise / 301 / canonical / noindex / removal** of any of these pages. No DPF or vehicle page changes. Build, prerender, sitemap and accuracy checks all pass._

## Build & verification status

| Check | Result |
|---|---|
| `npm run build` (clean → client → SSR → prerender) | ✅ **134 pages, 0 errors** |
| Rendered `index.html` files | ✅ 134 (unchanged) |
| Sitemap URLs | ✅ 134 (unchanged) |
| Orphan pages (rendered ∉ sitemap / sitemap ∉ rendered) | ✅ 0 / 0 |
| Self-referential canonicals | ✅ **134 / 134** |
| Pages with `noindex` | ✅ 0 (no leakage) |
| Internal links to `/ecu-tuning-devon` or `/performance-remapping-devon` | ✅ **0** |
| Phase-2A removed URLs still gone (incl. `/fuel-savings-calculator`) | ✅ not in sitemap |
| "mobile DPF" wording | ✅ 0 pages |
| "free diagnostic" wording | ✅ 0 pages |
| Map-authoring overclaim wording | ✅ 0 pages |

---

## 1. Files changed

| File | Change |
|---|---|
| `src/data/remapping-locations.ts` | Deepened all 18 small-town ECU entries: added one bespoke local `extraSection` each, tailored `popularVehicles` + `popularVehiclesIntro`, two new local FAQs each, and updated `relatedSlugs`. Corrected inaccurate claims in existing intros/FAQs (see §5). |

No template file was changed (the shared `RemappingLocation.tsx` layout was kept, as instructed). No DPF, vehicle, redirect or canonical changes.

---

## 2. Pages improved (18) — before/after

Word count = rendered `<main>`; uniqueness = the post-Phase-1 audit's own method (nearest-sibling 5-gram containment, place/vehicle names normalised out).

| Page | WC before | WC after | Δ | Uniq before | Uniq after | Dup% |
|---|--:|--:|--:|--:|--:|--:|
| `/ecu-remapping-dawlish` | 836 | 1060 | +224 | 1 | **35** | 69 |
| `/ecu-remapping-teignmouth` | 832 | 1023 | +191 | 1 | **34** | 71 |
| `/ecu-remapping-ashburton` | 842 | 1040 | +198 | 2 | **35** | 69 |
| `/ecu-remapping-brixham` | 839 | 1038 | +199 | 2 | **35** | 70 |
| `/ecu-remapping-buckfastleigh` | 840 | 1035 | +195 | 2 | **35** | 69 |
| `/ecu-remapping-salcombe` | 842 | 1030 | +188 | 2 | **34** | 71 |
| `/ecu-remapping-axminster` | 832 | 1024 | +192 | 3 | **33** | 72 |
| `/ecu-remapping-dartmouth` | 846 | 1046 | +200 | 2 | **35** | 70 |
| `/ecu-remapping-tavistock` | 847 | 1041 | +194 | 2 | **34** | 71 |
| `/ecu-remapping-crediton` | 830 | 1017 | +187 | 4 | **33** | 72 |
| `/ecu-remapping-tiverton` | 829 | 1035 | +206 | 4 | **35** | 70 |
| `/ecu-remapping-cullompton` | 842 | 1020 | +178 | 14 | **34** | 71 |
| `/ecu-remapping-okehampton` | 851 | 1060 | +209 | 14 | **36** | 68 |
| `/ecu-remapping-honiton` | 846 | 1030 | +184 | 14 | **34** | 71 |
| `/ecu-remapping-sidmouth` | 862 | 1068 | +206 | 14 | **38** | 66 |
| `/ecu-remapping-ivybridge` | 865 | 1056 | +191 | 12 | **34** | 71 |
| `/ecu-remapping-kingsbridge` | 857 | 1065 | +208 | 12 | **36** | 68 |
| `/ecu-remapping-bideford` | 859 | 1050 | +191 | 14 | **36** | 68 |

All 18 moved out of near-duplicate/doorway territory (uniqueness ~1–14, duplicate ~85–89%) into ~33–38 uniqueness (duplicate ~66–72%). This is a genuine, meaningful lift, though it does not reach the ~47–51 band of the fully-rewritten priority towns/hubs (which received ~400 words rather than ~190). See §7 for what would push them further.

---

## 3. Local sections added (one bespoke `extraSection` per page)

| Page | Section heading | Angle |
|---|---|---|
| Dawlish | "Coastal commuting from Dawlish – the Exeter run and short trips" | A379/A380 commute, short-journey DPF note, mobile |
| Teignmouth | "Teignmouth's coast roads, hills and the A380" | coast/estuary, A380 commute, hills, mobile |
| Ashburton | "A38 access and Dartmoor-edge driving" | A38, moor-edge, 4x4/van/towing, near workshop |
| Brixham | "Brixham's harbour hills and holiday traffic" | Torbay coastal, taxis/PH, hills, seasonal |
| Buckfastleigh | "A short hop up the A38 from our workshop" | closest town, drop-off, rural vans/towing |
| Salcombe | "Salcombe's lanes, seasonal traffic and coastal driving" | lanes/hills, seasonal, 4x4/boat towing, mobile |
| Axminster | "The eastern edge of our coverage – A35 and A358" | border route town, commuter/van, mobile-first |
| Dartmouth | "Dartmouth's hills, estuary and the ferry factor" | hills, ferry, mobile convenience, vans/4x4 |
| Tavistock | "West Devon and Dartmoor-edge tuning" | moor/Tamar, towing/4x4/pickup, mobile |
| Crediton | "Mid Devon commuting and Creedy Valley lanes" | A377 Exeter commute, rural, mobile |
| Tiverton | "M5 and A361 miles – built for commuters" | M5/A361, high-mileage economy, vans, mobile |
| Cullompton | "M5 corridor economy tuning" | M5 J28, commuter economy, trade vans, mobile |
| Okehampton | "A30 running and rural West Devon use" | A30, pickups/4x4/towing, mobile-first honesty |
| Honiton | "On the A30/A35 – East Devon commuting" | A30/A35 commute, vans, mobile |
| Sidmouth | "Sidmouth's hills, short trips and coastal miles" | short-trip DPF, hills, commuter, mobile |
| Ivybridge | "On the A38 between Plymouth and the South Hams" | A38 Plymouth commute, family diesels/vans |
| Kingsbridge | "The hub of the South Hams" | estuary hills, farm/trade/boat towing, seasonal |
| Bideford | "North Devon mobile tuning from Bideford to the border" | A39/A386, pickups/4x4/vans, mobile-first |

Each page also received **2 new local FAQs** and a **localised Popular-Vehicles intro** (see §6 caveat about FAQ rendering).

---

## 4. Internal links added / changed

- **Tailored vehicle links** (`popularVehicles`) on every page, chosen by local demand:
  - coastal/tourist/taxi towns (Dawlish, Teignmouth, Brixham, Sidmouth): vans, taxi/commuter diesels, some 4x4;
  - rural/moor towns (Ashburton, Buckfastleigh, Tavistock, Okehampton, Kingsbridge, Salcombe, Dartmouth, Bideford, Crediton): pickups, 4x4s, vans, towing vehicles;
  - commuter towns (Tiverton, Cullompton, Honiton, Axminster, Ivybridge): BMW 320d, Audi A3, VW Golf GTD, Transit Custom, Transporter + commuter diesels.
- **Regional-hub + nearby-town links** (`relatedSlugs`) — each small town now points to its correct hub and closest towns:
  - South Hams hub: Ivybridge, Kingsbridge, Salcombe, Dartmouth, Ashburton, Buckfastleigh
  - Torbay hub: Brixham
  - East Devon hub: Sidmouth, Honiton, Axminster
  - North Devon hub: Bideford
  - West/Mid Devon (no hub): Tavistock, Okehampton, Crediton, Tiverton, Cullompton keep tight local-town clusters; Dawlish/Teignmouth keep their Teignbridge neighbours.
  - Removed cross-region mismatches (e.g. Bideford → Okehampton, Kingsbridge → Paignton, Sidmouth/Honiton/Axminster → Exeter where the hub is the better link).
- The shared template continues to link every page to `/ecu-remapping`, `/mobile-ecu-remapping-devon` and `/stage-1-remaps-devon` (unchanged).

Note on cannibalisation: the small-town pages are framed as **specific local service-area pages** (local roads, local vehicle mix, honest distance/mobile framing), while the regional hubs remain the wider overviews. The hubs link *down* to towns and the towns link *up* to the hub, without duplicating each other's angle.

---

## 5. Accuracy corrections made (existing copy)

While deepening these pages I corrected claims that broke the accuracy rules:

| Page | Fixed |
|---|---|
| Okehampton | intro "custom map designed specifically" → "a remap file matched to your exact vehicle… within safe limits"; "minimal administration fee" → backup/re-flash, no fee implied |
| Tiverton | intro "rewriting the ECU data" → "apply a remap file matched to your exact vehicle"; "a well-written remap from AutoCleanse" → "a properly calibrated remap" |
| Axminster | intro "our software engineers provide the exact recalibration" → "our technicians provide the remap… a file matched to your exact car"; **EGR-delete FAQ** reworded to state we keep all emissions equipment functioning and don't offer deletes on road vehicles |
| Cullompton | intro "Our custom economy files are designed to…" → "The economy remap we apply adjusts…"; **"guarantee I'll save money" FAQ** softened (no promised MPG jump) |
| Honiton | **"lifetime guarantee on the software" FAQ** removed → reframed as original-file backup + re-flash (no invented guarantee) |
| Bideford | DPF FAQ clarified: DPF cleaning is carried out **off the vehicle at the Totnes workshop**, not as part of a mobile visit |

All new copy follows the rules: mobile = ECU remapping only; DPF cleaning is workshop/off-vehicle; diagnostics are paid; based in Totnes; "remap file matched to your vehicle", "applied carefully", "diagnostics before and after"; distances stated honestly and framed mobile-first where a town is far from Totnes; no invented jobs, prices, guarantees, dyno figures or exact MPG claims.

---

## 6. Claims / issues needing owner review

1. **⚠️ FAQ answers are not in the prerendered HTML (important, pre-existing).** On the ECU location pages the FAQ accordion (`FaqItem`) renders each **answer only when the user clicks** — so FAQ *questions* appear in the static HTML but **answers do not**, and these pages carry **no FAQPage schema**. That means the "2 local FAQs per page" added here (and in earlier phases) help users and accuracy but **do not currently contribute indexable content**, which is why the rendered word-count gain (~+190) is smaller than the copy written. This is a template behaviour, not something introduced in Phase 2C, and it was left unchanged because the task said to keep the template. **Recommendation (Phase 2D):** either server-render the FAQ answers (render in the DOM, collapse with CSS) or add FAQPage JSON-LD to the location template. Either change would add ~100–130 indexable words to **every** location page for a single template edit and lift uniqueness further.
2. **Distances / drive times.** New copy repeats existing `distanceNote` figures (e.g. Bideford ~55 mi, Barnstaple/Okehampton/Tiverton/Sidmouth/Honiton/Crediton ~35–45 mi, Ashburton ~12 mi, Buckfastleigh ~10 mi). Confirm they remain accurate.
3. **Mobile reach.** Several pages state mobile coverage to outlying/coastal villages (e.g. Lynton/Combe Martin not here but Salcombe's Hope Cove, Dartmouth's Torcross, Bideford towards Holsworthy/Bude). Confirm you genuinely cover these by mobile.
4. **Economy wording.** All MPG/economy claims are now qualitative and hedged (no fixed % or ROI). Confirm you're comfortable.
5. **Same-day / drop-off.** Buckfastleigh mentions "drop off… collect the same day where our schedule allows" — hedged; confirm realistic.

_No prices, guarantees, dyno figures or customer jobs were invented in this phase._

---

## 7. Small-town pages that still look weak after the rewrite

**All 18 are improved but remain the weakest ECU-location cluster.** Uniqueness is now ~33–38 (up from ~1–14) but the duplicate estimate is still ~66–72%, i.e. they still share a large majority of their rendered content with the shared template and with each other's parallel structure. In the audit's risk banding (Low ≥70, Medium 55–69, High 38–54, Critical <38 on the *uniqueness* scale) they sit around the High/Critical boundary — better, but not yet "strong". Their Index Worthiness is higher than uniqueness alone implies, because depth (~1,040 words) and internal importance both rose (the hubs now link down to them and each carries 6 tailored vehicle links), and cannibalisation dropped.

The most effective next levers, in order:
1. **Fix FAQ rendering (item 6.1)** — the single highest-impact change: it would add ~100–130 indexable words to every location page at once and push these towns toward the ~45–50 band.
2. **Add a second local `extraSection`** to the thinnest few if you want them clearly strong standalone pages — the same recipe used for the priority towns (which reached ~48).
3. **Otherwise, consolidation remains the fallback** — if after the above some towns still underperform in Search Console, the original audit's regionalise/301-into-hub option is still available (the hubs are now built and strong enough to absorb them). **Not done here, as instructed.**

Rough priority order if you want a second content pass (thinnest / lowest-demand first): Crediton, Axminster, Cullompton, Tavistock, Salcombe, Teignmouth, Buckfastleigh, then the rest.

---

## 8. Deliberately NOT done (as instructed)

- No regionalise / 301 / canonicalise / noindex / removal of any small-town page.
- No DPF or vehicle page changes.
- No template/layout changes (FAQ-rendering fix flagged, not applied).
- No redirect/canonical changes (and no broken links were found needing repair — 0 links to the Phase-2A removed routes).
- No AI-visibility audit.

---

**Phase 2C complete and the build is green (134 pages, 0 errors, 134/134 self-canonical). All 18 small-town ECU pages are now genuinely local (uniqueness ~1–14 → ~33–38, ~+190 words each). The biggest remaining lever is server-rendering the FAQ answers (or adding FAQPage schema) across the location template — recommended for Phase 2D. Awaiting your decision.**
