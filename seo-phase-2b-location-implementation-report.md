# Auto-Cleanse SEO — Phase 2B Location Implementation Report

_Completed 2026-07-01. Scope: make the remaining useful ECU **location** pages genuinely unique and index-worthy — before any consolidation. Rewrote/deepened 4 priority town pages and 4 regional hub pages, lightly finished 2 near-strong town pages, and corrected several inaccurate claims found in existing location copy. **No** regionalisation/301s of the 18 small-town pages, **no** vehicle/DPF page changes, **no** redirect/canonical changes, and the Phase-2A removed routes stay removed. Build, prerender, sitemap and accuracy checks all pass._

## Build & verification status

| Check | Result |
|---|---|
| `npm run build` (clean → client → SSR → prerender) | ✅ **134 pages, 0 errors** |
| Rendered `index.html` files | ✅ 134 (unchanged) |
| Sitemap URLs | ✅ 134 (unchanged) |
| Orphan pages (rendered ∉ sitemap / sitemap ∉ rendered) | ✅ 0 / 0 |
| Self-referential canonicals | ✅ **134 / 134** |
| Pages with `noindex` | ✅ 0 (no leakage) |
| Phase-2A removed URLs still gone (`/ecu-tuning-devon`, `/performance-remapping-devon`, `/fuel-savings-calculator`) | ✅ not in sitemap, no dir |
| Internal links to `/ecu-tuning-devon` or `/performance-remapping-devon` | ✅ **0** |
| "mobile DPF" wording | ✅ 0 pages |
| "free diagnostic" wording | ✅ 0 pages |
| Map-authoring overclaim | ✅ 0 (only the *negated* "we don't write ECU files from scratch" on the Stage-1 page) |

---

## 1. Files changed

| File | Change |
|---|---|
| `src/data/remapping-locations.ts` | Deepened 8 location entries (4 towns + 4 regional hubs), lightly extended 2 (Torquay, Newton Abbot), fixed several inaccurate claims, tidied `relatedSlugs`, fixed a "Vivaros" typo. |
| `src/pages/RemappingLocation.tsx` | Added `ecu-remapping-barnstaple` to `MAJOR_TOWN_SLUGS` so its Popular-Vehicles heading is town-specific. |

No other files touched. (`ecu-remapping-exeter` left as-is — already a strong index candidate, no issue found.)

---

## 2. Pages rewritten / deepened

### Priority town pages (full local rewrite — 3 bespoke sections each)

| Page | Before WC | After WC | Δ | Before Uniq | After Uniq |
|---|--:|--:|--:|--:|--:|
| `/ecu-remapping-plymouth` | 973 | **1410** | +437 | 12 | **49** |
| `/ecu-remapping-paignton` | 964 | **1365** | +401 | 11 | **47** |
| `/ecu-remapping-totnes` | 954 | **1367** | +413 | 12 | **50** |
| `/ecu-remapping-barnstaple` | 852 | **1280** | +428 | 14 | **51** |

### Regional hub pages (genuine regional overviews — 3 sections each)

| Page | Before WC | After WC | Δ | Before Uniq | After Uniq |
|---|--:|--:|--:|--:|--:|
| `/ecu-remapping-torbay` | 854 | **1219** | +365 | 12 | **49** |
| `/ecu-remapping-south-hams` | 874 | **1267** | +393 | 14 | **48** |
| `/ecu-remapping-east-devon` | 861 | **1225** | +364 | 14 | **48** |
| `/ecu-remapping-north-devon` | 874 | **1216** | +342 | 14 | **47** |

### Light finish (one extra section + tailored vehicles)

| Page | Before WC | After WC | Δ | Before Uniq | After Uniq |
|---|--:|--:|--:|--:|--:|
| `/ecu-remapping-torquay` | 1336 | **1449** | +113 | 46 | **54** |
| `/ecu-remapping-newton-abbot` | 1233 | **1364** | +131 | 48 | **58** |

**Uniqueness measured with the post-Phase-1 audit's own method** (nearest-sibling 5-gram containment, place/vehicle names normalised out). The 8 near-duplicate pages moved from ~11–14 (doorway/near-duplicate territory, duplicate estimate ~85–89%) to ~47–51 (duplicate estimate ~55–60%) — the same band as the Phase-1 rewrites (Exeter 48, Mobile 50). They should now be viable index candidates rather than "Discovered – currently not indexed".

---

## 3. Sections added per page

**Plymouth** — (1) *Remapping for A38 commuting and Plymouth's roads*; (2) *Tradesman vans, delivery drivers and private hire*; (3) *Honest about the distance — mobile makes it easy*. + 2 local FAQs (A38 economy; taxis/private hire). Tailored vehicles: Transit Custom, Transit, Transporter, Sprinter, 320d, Vivaro.

**Paignton** — (1) *Short Torbay journeys and seafront traffic*; (2) *Taxis, private hire, trades and delivery vans*; (3) *Just up the road in Totnes — workshop or mobile*. + 2 local FAQs (short-journey/DPF; taxi/PH). Fixed "Viveths" → "Vivaros" typo. Tailored vehicles: Transporter, Transit Custom, Octavia, 320d, E220, A3.

**Totnes** — (1) *Our home workshop — drop off and collect the same day*; (2) *Built for South Hams roads — hills, towing and rural driving*; (3) *The 4x4s, vans and cars we remap locally*. + 2 local FAQs (same-day drop-off; 4x4/towing). Tailored vehicles: Ranger, Discovery, Hilux, Transporter, 320d, Defender.

**Barnstaple** — (1) *Mobile-first tuning for North Devon*; (2) *Long miles on the A361 and North Devon's roads*; (3) *Farm pickups, 4x4s and vans built for towing*. + 2 local FAQs (mobile vs Totnes; farm pickup/4x4). Softened an existing "up to 15%" economy claim. Tailored vehicles: Ranger, Hilux, Navara, Defender, Transit, Transporter.

**Torbay (hub)** — (1) *One service across the whole bay*; (2) *The Torbay driving profile*; (3) *Mobile across Torbay, or workshop in Totnes*. + navigation FAQ (which page to use). Positioned as overview, defers local detail to Torquay/Paignton pages.

**South Hams (hub)** — (1) *Based in the South Hams, covering the whole district*; (2) *Rural lanes, coastal climbs and load*; (3) *Mobile across the South Hams, or drop in to Totnes*. + navigation FAQ. Fixed the invented "'utility' maps" name and reworded the DPF FAQ to clarify DPF is workshop-based (off-vehicle), not roadside.

**East Devon (hub)** — (1) *Covering East Devon, from the Exe to the Blackdowns*; (2) *Built around East Devon's commuters and A-roads*; (3) *Coastal towns, rural hills and mobile coverage*. + navigation FAQ. Softened a "10–15% MPG" claim and fixed "optimizes" → "optimises".

**North Devon (hub)** — (1) *Full mobile coverage across North Devon*; (2) *Why mobile makes sense up here*; (3) *The vehicles North Devon runs*. + navigation FAQ. Removed an unverified "lifetime software warranty" claim, softened an "up to 15%" economy claim, and removed an invented "Stage 1 High Torque map" product name.

**Torquay (light)** — added *DPF health and short Torbay journeys* section + tailored vehicles (Transporter, Transit Custom, 320d, Octavia, A3, Ranger).

**Newton Abbot (light)** — added *Towing and Dartmoor-edge driving* section + tailored vehicles (320d, Transporter, Transit, Ranger, A3, Ducato).

---

## 4. Internal links added / changed

The shared template already links every location page to `/ecu-remapping`, `/mobile-ecu-remapping-devon` and `/stage-1-remaps-devon` (Related services block) — those remain. Phase 2B improved the **contextual** links:

- **Tailored vehicle links** (via `popularVehicles`): each of the 10 pages now links to 6 locally-relevant vehicle pages chosen by local demand (vans/taxis for Plymouth & Paignton; 4x4s/pickups for Totnes, Barnstaple, South Hams, North Devon; commuter diesels for East Devon) instead of the generic default set.
- **Town → nearby-town + region links** (via `relatedSlugs`):
  - Plymouth → Ivybridge, Tavistock, **South Hams (hub)**
  - Paignton → Torquay, **Brixham**, Torbay (hub)
  - Totnes → Newton Abbot, Kingsbridge, **South Hams (hub)**
  - Barnstaple → Bideford, Tiverton, North Devon (hub)
- **Region hub → main-town links** (via `relatedSlugs`):
  - Torbay → Torquay, Paignton, **Brixham**
  - South Hams → Kingsbridge, Totnes, Dartmouth
  - East Devon → Exeter, Sidmouth, Honiton, **Axminster**
  - North Devon → Barnstaple, Bideford (removed **Okehampton** — it's West Devon, not North Devon)

No excessive linking added — only contextually relevant town/region/vehicle links.

---

## 5. Accuracy corrections made (existing copy)

While deepening these pages I corrected claims that broke the accuracy rules:

| Page | Fixed |
|---|---|
| Paignton | "Viveths" typo → "Vivaros" |
| Barnstaple | "lower fuel consumption by up to 15%, paying for the remap rapidly" → hedged, no fixed % or ROI promise |
| South Hams | invented "'utility' maps" name → generic; DPF FAQ reworded to state DPF is workshop/off-vehicle (not roadside) |
| East Devon | "10–15% improvement in MPG" → hedged; "optimizes" → "optimises" |
| North Devon | removed unverified "lifetime software warranty"; softened "up to 15%" economy/ROI claim; removed invented "Stage 1 High Torque map" product name |

All new copy follows the rules: mobile = ECU remapping only; DPF cleaning is workshop/off-vehicle; diagnostics are paid; based in Totnes; "remap file matched to your vehicle", "applied carefully", "diagnostics before and after", "not a generic flash-and-go"; no invented jobs, prices, guarantees, dyno figures or exact MPG claims.

---

## 6. Claims needing owner review

1. **Same-day drop-off (Totnes town page).** New copy says a Totnes drop-off can *often* be collected the same day "where our schedule allows" — hedged, but please confirm it's realistic.
2. **Distances / drive times.** New copy repeats existing figures (Plymouth ~25 mi, Paignton ~12 mi/20 min via A385, Torbay ~12–15 mi, Barnstaple/North Devon ~50 mi). These match existing `distanceNote` data; confirm they're still accurate.
3. **Mobile reach to remote areas** (North Devon: Lynton/Combe Martin; South Hams: outlying villages). Confirm you genuinely cover these by mobile.
4. **"We can clean the DPF at the workshop and apply the remap in the same appointment"** (South Hams FAQ) — confirm this combined single-appointment workflow is accurate.
5. **Economy language.** All MPG/economy claims are now qualitative and hedged (no fixed % or ROI). Confirm you're comfortable with the wording.

_No prices, guarantees, dyno figures or customer jobs were invented anywhere in this phase._

---

## 7. Remaining ECU location pages still needing work (after Phase 2B)

**Now addressed (Phase 1 + 2B): 11 of 29** ECU location pages are genuinely local/index-worthy — Exeter, Torquay, Newton Abbot, Plymouth, Paignton, Totnes, Barnstaple, and the 4 regional hubs (Torbay, South Hams, East Devon, North Devon).

**Still near-duplicate (uniqueness ~1–14) — the 18 small-town pages, unchanged as instructed:**
Dawlish, Teignmouth, Ashburton, Brixham, Buckfastleigh, Salcombe, Axminster, Dartmouth, Tavistock, Crediton, Tiverton, Cullompton, Okehampton, Honiton, Sidmouth, Ivybridge, Kingsbridge, Bideford.

These remain the open decision from the audit — **Phase 2C**: for each, either (a) give it ≥200 words of genuinely unique local content and ≥3 in-body inbound links (now easier, since the 4 regional hubs link down to several of them), or (b) regionalise/301 into the relevant hub. Recommendation: with the hubs now built and strong, the thinnest small towns (Dawlish, Teignmouth, Ashburton, Brixham, Buckfastleigh, Salcombe, Dartmouth, Tavistock, Axminster, Crediton, Tiverton, Cullompton, Okehampton) are the natural regionalise/301 candidates; the larger ones (Ivybridge, Kingsbridge, Honiton, Sidmouth, Bideford) could be worth a light local rewrite first. **No action taken yet — awaiting your Phase 2C decision.**

Also still pending (from the Phase 2A follow-up, not an ECU location page): **`/petrol-remapping-devon`** — rewrite as a genuine petrol page vs 301 to `/ecu-remapping`.

---

## 8. Deliberately NOT done (as instructed)

- No regionalisation or 301 of the 18 small-town ECU pages.
- No removal of any location page.
- No vehicle-page or DPF-page changes.
- No changes to `/petrol-remapping-devon`, `/diesel-remapping-devon`, `/4x4-remapping-devon`, `/fleet-vehicle-remapping-devon`.
- No redirect/canonical changes.
- No AI-visibility audit.
- Exeter left as-is (already strong).

---

**Phase 2B complete and the build is green (134 pages, 0 errors, 134/134 self-canonical). 11 of 29 ECU location pages are now genuinely local and index-worthy. Awaiting your Phase 2C decision on the remaining 18 small-town pages.**
