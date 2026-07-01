# Auto-Cleanse SEO — Post-Phase-1 Indexability Audit

_Generated 2026-07-01. Audit only — **no code, content, redirect, canonical or noindex changes were made.** Analysis is of the **rendered/prerendered HTML in `dist/`** after a clean `npm run build`, using current post-Phase-1 content. Word counts and inbound-link counts use the rendered `<main>` only (global header/footer/nav excluded). Companion machine-readable file: `seo-post-phase-1-indexability-audit.json`._

Goal of this pass: decide, page-by-page, whether each URL **deserves indexing as-is**, or whether it should be **improved, merged, canonicalised, regionalised, or left alone** — with a specific focus on why many pages are stuck at "Discovered – currently not indexed" in Search Console.

---

## 1. Build & render verification

Clean rebuild (`npm run clean && vite build && vite build --ssr && node scripts/prerender.mjs`):

| Check | Result |
|---|---|
| `npm run build` | ✅ **137 pages rendered, 0 errors** |
| Prerendered `index.html` files in `dist/` | ✅ **137** |
| Sitemap URLs (`dist/sitemap.xml`) | ✅ **137** — exactly matches rendered pages |
| Orphan rendered pages (rendered but not in sitemap) | ✅ **0** |
| Redirect URLs in sitemap (`/remapping`, `/remapping-devon`, `/vehicle-remapping`) | ✅ **0** (they are `<Navigate>` redirects, never prerendered) |
| Meta-refresh / redirect stubs in output | ✅ **0** |
| `noindex` pages in prerendered output | ✅ **0** |
| Self-referential canonical tags | ✅ **136 / 137** |
| **Canonical anomaly** | ⚠️ **1** — see below |
| Stale/removed routes lingering in `dist/` | ✅ **0** (`fuel-economy-remaps-devon` still gone) |
| Non-page asset dirs (`assets/`, `data/`, `logos/`, `customer/`) | ✅ present, correctly excluded from sitemap |
| RSS feed | ✅ 2 posts |

**The technical indexing foundation is clean — with one real bug:**

> ⚠️ **`/fuel-savings-calculator` sets `path="/calculator"` in its `<SEO>` component**, so its canonical renders as `https://www.auto-cleanse.co.uk/calculator` — **a URL that is not a route and is never served.** Google will try to consolidate the page onto a non-existent canonical target and will therefore **drop `/fuel-savings-calculator` from the index.** This is the one hard technical indexability defect found. (`src/pages/FuelSavingsCalculator.tsx:366`.) Fix regardless of any content decision.

Everything else that could block indexing at the HTML level (noindex leakage, redirect URLs in the sitemap, orphans, non-self canonicals, stale routes) is **clear**. The remaining problem is therefore almost entirely a **content-quality / uniqueness / internal-importance** problem — which is exactly what "Discovered – currently not indexed" usually signals.

---

## 2. How each score is calculated

- **Word count** — rendered `<main>` words (nav/footer excluded).
- **Uniqueness score (0–100)** — derived from **nearest-sibling shingle containment** (5-gram overlap with the single most-similar page, after normalising out place-names and vehicle-names so the shared *template* is detectable), with a depth adjustment. Higher = more genuinely unique.
- **Duplicate estimate (%)** — the share of *this* page's content that also appears on its most-similar sibling (the near-duplicate / shared-template signal).
- **Risk level** — Low ≥70, Medium 55–69, High 38–54, Critical <38 (content-uniqueness risk).
- **Index Worthiness (IW, 0–100)** — `0.30·uniqueness + 0.20·depth + 0.15·commercialIntent + 0.15·internalImportance + 0.20·(100−cannibalisationPenalty)`.
- **Indexing risk** — likelihood of staying "Discovered/not indexed": **Low** ≥72 IW, **Moderate** 58–71, **Elevated** 45–57, **High** <45.
- **Inbound internal links** — **in-body contextual links only** (site-wide footer/header nav excluded). A low number means weak *editorial* importance, not that the page is unreachable.

---

## 3. Executive summary

**Overall:** the site is technically indexable, and Phase 1 clearly moved the needle on the ~9 pages it touched. But the **dominant pattern is programmatic near-duplication**: ~100 of 137 pages are near-identical template pages that differ only by a town or vehicle name. That is the single biggest reason Google is leaving pages at "Discovered – currently not indexed."

Index Worthiness by cluster (post-Phase-1):

| Cluster | Pages | Avg WC | Avg Uniqueness | Avg IW | State |
|---|--:|--:|--:|--:|---|
| Homepage | 1 | 1746 | 100 | 97 | Excellent |
| ECU hubs | 2 | 549 | 86 | 83 | Strong |
| DPF core/hub | 6 | 785 | 84 | 80 | Strong |
| DPF town | 6 | 818 | 54 | 69 | Mostly good; 2 laggards |
| Core/informational | 8 | 462 | 87 | 68 | Good |
| Blog | 3 | 409 | 86 | 67 | Good but shallow index |
| Tools/conversion | 4 | 222 | 85 | 63 | Thin funnels (+1 canonical bug) |
| **Vehicle** | **69** | **414** | **39** | **56** | **2 strong, 67 thin template** |
| **Devon service-type** | **9** | **919** | **17** | **49** | **2 strong, 7 near-duplicate** |
| **ECU location** | **29** | **909** | **13** | **46** | **3 strong, 26 near-duplicate** |

**Recommended action split (all 137 URLs):**

| Action | Count |
|---|--:|
| Keep as-is | 62 |
| Rewrite/deepen | 40 |
| Regionalise | 18 |
| Improve internal links | 11 |
| Canonicalise | 3 |
| Human review required | 3 |
| Merge / Noindex / Remove stale route | 0 (see notes) |

**Index-worthiness classification:**

| Class | Count |
|---|--:|
| Strong index candidate | 19 |
| Needs improvement before indexing | 40 |
| Low priority but acceptable | 54 |
| Regionalise candidate | 18 |
| Merge/canonicalise candidate | 3 |
| Potentially not worth indexing | 3 |

**Indexing-risk distribution:** Low 19 · Moderate 28 · Elevated 71 · High 19.

The headline: **~90 pages sit at "Elevated" or "High" indexing risk**, and they are overwhelmingly the ECU-location, Devon-service and vehicle template pages. Phase 2 should be a **consolidation + selective-deepening** phase, not a "publish more pages" phase.

---

## 4. Pages most likely to remain non-indexed (highest priority to fix)

These 19 pages are at **High** indexing risk (IW < 45) — near-duplicate, thin-of-unique-content, and/or weakly linked. They are the most likely occupants of "Discovered – currently not indexed":

| URL | WC | Uniq | IW | Likely cause |
|---|--:|--:|--:|---|
| `/ecu-remapping-dawlish` | 836 | 1 | 35 | 89% duplicate of Teignmouth; 1 inbound |
| `/ecu-remapping-teignmouth` | 832 | 1 | 35 | 89% duplicate of Dawlish |
| `/ecu-remapping-ashburton` | 842 | 2 | 36 | 88% duplicate; 2 inbound |
| `/ecu-remapping-brixham` | 839 | 2 | 36 | 88% duplicate (Torbay overlap) |
| `/ecu-remapping-buckfastleigh` | 840 | 2 | 36 | 88% duplicate |
| `/ecu-remapping-salcombe` | 842 | 2 | 36 | 88% duplicate; 1 inbound |
| `/petrol-remapping-devon` | 838 | 3 | 37 | Synonym of hub; overlaps performance/Stage-1 |
| `/4x4-remapping-devon` | 842 | 4 | 37 | Near-duplicate template; 1 inbound |
| `/ecu-remapping-axminster` | 832 | 3 | 38 | 87% duplicate |
| `/ecu-remapping-dartmouth` | 846 | 2 | 38 | 88% duplicate |
| `/ecu-remapping-tavistock` | 847 | 2 | 38 | 88% duplicate |
| `/ecu-remapping-crediton` | 830 | 4 | 39 | 86% duplicate of Tiverton |
| `/ecu-remapping-tiverton` | 829 | 4 | 39 | 86% duplicate of Crediton |
| `/performance-remapping-devon` | 836 | 4 | 40 | ≈ Stage 1 duplicate |
| `/diesel-remapping-devon` | 823 | 4 | 42 | Near-duplicate template |
| `/ecu-remapping-cullompton` | 842 | 14 | 43 | 84% duplicate |
| `/ecu-remapping-okehampton` | 851 | 14 | 44 | 84% duplicate |
| `/ecu-tuning-devon` | 849 | 14 | 44 | Synonym of `/ecu-remapping` hub |
| `/fleet-vehicle-remapping-devon` | 833 | 14 | 44 | Near-duplicate template |

**Common causes, page-by-page pattern:**
- **Too similar to other town pages** — every small-town ECU page shares 83–89% of its body with a sibling (only the town name and nearby-area list differ). This is the classic doorway-page footprint.
- **No unique local detail** — no local roads, no local vehicle mix, no local job example; the "What we offer / Why AutoCleanse / FAQs" scaffolding is identical.
- **Weak internal importance** — most small towns have 1–4 in-body inbound links; several have 1.
- **Overlapping with a stronger hub** — `/ecu-tuning-devon`, `/petrol-remapping-devon`, `/performance-remapping-devon` restate `/ecu-remapping` or `/stage-1-remaps-devon`.
- **Thin-of-unique-content vehicle pages** (next tier down, IW 45–58) — 67 vehicle pages are ~360–500 words on a shared template; individually indexable but many will sit "Crawled/Discovered – not indexed" until deepened.

---

## 5. Pages now much stronger after Phase 1

Phase 1's rewrites and expansions are clearly reflected in the rendered output. Biggest measured gains:

| Page | WC before → after | Uniqueness before → after | Now |
|---|---|---|---|
| `/bmw-320d-remap` | 453 → **1153** | 54 → **81** (+27) | Strong index candidate (IW 90) |
| `/vw-transporter-remap` | 361 → **937** | 52 → **78** (+26) | Strong index candidate (IW 87) |
| `/ecu-remapping-newton-abbot` | 778 → **1233** | 32 → **48** (+16) | Near-strong (IW 71) |
| `/mobile-ecu-remapping-devon` | 780 → **1227** | 36 → **50** (+14) | Strong index candidate (IW 73) |
| `/ecu-remapping-exeter` | 878 → **1396** | 39 → **48** (+9) | Strong index candidate (IW 73) |
| `/ecu-remapping-torquay` | 874 → **1336** | 39 → **46** (+7) | Near-strong (IW 69) |
| `/dpf-cleaning-devon` | 707 → **794** | 75 → **77** | Strong (repositioned, cannibalisation fixed) |

Also confirmed strong/healthy and needing no work: `/` (IW 97), `/ecu-remapping` (93), `/dpf-diagnostics-devon` (87), `/adblue-repair-devon` (82), `/blocked-dpf-cleaning-devon` (84), `/dpf-cleaning` (81), `/ecu-cloning` (78, links-only tweak), `/pricing` (77), `/why-clean` (77).

**Takeaway:** the Phase-1 method *works* — a ~400-word bespoke local/model section lifts a page from ~35–39 uniqueness (near-duplicate) to ~46–50 (indexable) and from IW ~50 to ~70+. Phase 2 should apply the **same recipe** to the next tier of high-value pages.

---

## 6. Deep-dive: ECU location pages (29)

The previous audit's weakest cluster, and still the weakest. **3 rewritten pages (Exeter, Torquay, Newton Abbot) are now near-strong; the other 26 remain near-duplicate template pages.** The 4 "region" pages (Torbay, South Hams, East Devon, North Devon) are also templated but should become genuine **regional hubs** rather than be regionalised away.

### Priority-town verdicts

| Town / region | Now | Verdict | Target WC | Indexable? |
|---|---|---|--:|---|
| **Exeter** | IW 73 | **Keep** — largest city, best-developed page | maintain 1200–1400 | Yes |
| **Torquay** | IW 69 | **Keep + finish** — add 1 more local section + 1 FAQ to clear IW 72 | 1300–1450 | Yes |
| **Newton Abbot** | IW 71 | **Keep + finish** — nearest town (8 mi), strong candidate | 1200–1350 | Yes |
| **Plymouth** | IW 49 | **Rewrite (priority)** — biggest city in range, still pure template | 1100–1300 | Yes (after rewrite) |
| **Paignton** | IW 49 | **Rewrite (priority)** — Torbay demand, still template | 900–1100 | Yes (after rewrite) |
| **Totnes** | IW 51 | **Rewrite (priority)** — home town, should be flagship local page | 1000–1200 | Yes (after rewrite) |
| **Barnstaple** | IW 51 | **Rewrite** — main North Devon town; anchor for North Devon hub | 900–1100 | Yes (after rewrite) |
| **Torbay** | IW 46 | **Make regional hub** — aggregate Torquay/Paignton/Brixham; risk of cannibalising Torquay if left as town-clone | 800–1000 | Yes as hub |
| **South Hams** | IW 45 | **Make regional hub** — aggregate Kingsbridge/Salcombe/Dartmouth/Ivybridge | 800–1000 | Yes as hub |
| **East Devon** | IW 45 | **Make regional hub** — aggregate Sidmouth/Honiton/Axminster | 800–1000 | Yes as hub |
| **North Devon** | IW 48 | **Make regional hub** — aggregate Barnstaple/Bideford/Ilfracombe | 800–1000 | Yes as hub |

### Rewrite briefs (priority towns)

**Plymouth** (region: South West Devon, ~25 mi, mobile) — largest single market.
- *Local content ideas:* remapping for Plymouth's commuter/dual-carriageway mix (A38 Devon Expressway), naval-city taxi & private-hire fleets, high-mileage tradesman vans across the city, DPF/economy angle for stop-start city driving.
- *Nearby to mention:* Plympton, Plymstock, Saltash, Ivybridge, Tavistock, Roborough, Derriford, Crownhill.
- *Link to vehicles:* Ford Transit Custom, Ford Ranger, VW Transporter, BMW 320d, Mercedes Sprinter, Vauxhall Vivaro.
- *FAQ ideas:* "Do you come to Plymouth for mobile remapping?"; "How far is Plymouth from your Totnes workshop?"; "Can you remap a high-mileage delivery van in Plymouth?"; "Is a Stage 1 remap worth it for A38 commuting?"

**Paignton** (region: Torbay, ~12 mi, mobile).
- *Local content:* Torbay seafront stop-start & holiday-season traffic, taxi/PH trade, economy tuning for local delivery vans; distinguish clearly from the Torquay and Torbay pages (different angle, not a name-swap).
- *Nearby:* Torquay, Brixham, Totnes, Newton Abbot, Goodrington, Churston Ferrers, Galmpton, Stoke Gabriel.
- *Vehicles:* VW Transporter, Ford Transit Custom, BMW 320d, Audi A3, Ford Ranger, Toyota Hilux.
- *FAQ:* "Mobile remapping in Paignton?"; "Can you tune a taxi/private-hire diesel?"; "Will a remap help fuel economy on short Torbay journeys?"

**Totnes** (home town — should be the flagship local page).
- *Local content:* "this is our home workshop" credibility, walk-in/drop-off convenience, South Hams rural driving (hills, towing, 4x4s), local case studies.
- *Nearby:* Dartington, Buckfastleigh, Newton Abbot, Ashburton, Kingsbridge, Dartmouth, Ivybridge, South Brent.
- *Vehicles:* Land Rover Discovery, Ford Ranger, VW Transporter, BMW 320d, Toyota Hilux, Range Rover Sport.
- *FAQ:* "Where exactly is your Totnes workshop?"; "Can I drop off and collect same day?"; "Do you remap 4x4s and towing vehicles?"

**Barnstaple** (North Devon anchor, ~50 mi, mobile-led).
- *Local content:* be honest about the 50-mile distance → mobile-first framing; North Devon rural/agricultural vehicle mix, pickups & vans, long A361 commuting.
- *Nearby:* Bideford, Ilfracombe, Braunton, South Molton, Tiverton, Crediton, Great Torrington.
- *Vehicles:* Ford Ranger, Toyota Hilux, Nissan Navara, Land Rover Defender, Ford Transit, VW Transporter.
- *FAQ:* "Do you cover North Devon?"; "Is it mobile-only up here or can I come to you?"; "Can you remap an agricultural pickup / 4x4?"

### Regional-hub strategy (18 small towns → 4 hubs)

Rather than maintain 18 near-identical thin town pages (all at High/Elevated indexing risk), **build out the 4 regional hubs with genuine unique content and point the small towns at them.** Recommended grouping:

| Regional hub | Absorb / feed from (regionalise) |
|---|---|
| `/ecu-remapping-south-hams` | Kingsbridge, Salcombe, Dartmouth, Ivybridge |
| `/ecu-remapping-torbay` | Brixham (Torquay & Paignton stay as their own town pages) |
| `/ecu-remapping-east-devon` | Sidmouth, Honiton, Axminster · (Mid-Devon: Tiverton, Cullompton, Crediton) |
| `/ecu-remapping-north-devon` | Bideford · (Barnstaple stays as anchor town page) |
| Teignbridge (near Newton Abbot/Totnes) | Dawlish, Teignmouth, Ashburton, Buckfastleigh — fold into Newton Abbot/Totnes coverage or a new Teignbridge hub |
| West Devon | Okehampton, Tavistock — fold into Plymouth/Exeter coverage or a West Devon note |

**Per small town, choose one:**
- **Regionalise (recommended default):** keep the URL only if you can add ≥200 words of *genuinely* unique local detail; otherwise 301 into the regional hub and let the hub rank for "ECU remapping <region>". Do **not** simply noindex 15 pages and leave them orphaned — consolidate the value.
- **Improve internal links only:** if you keep a town page, it must earn ≥3 in-body inbound links (from the region hub + 2 nearest towns) or it will stay "Discovered".

> The 4 region pages are currently *also* near-duplicate (uniq 12–14). Regionalising only works if the hubs themselves get unique, aggregated regional content first — otherwise you are consolidating duplicates into a duplicate.

---

## 7. Deep-dive: Devon service-type pages (9)

Two clear winners, two synonyms to canonicalise, and a set of distinct-but-thin service pages.

| URL | WC | Uniq | IW | Verdict |
|---|--:|--:|--:|---|
| `/mobile-ecu-remapping-devon` | 1227 | 50 | 73 | **Keep** — rewritten in Phase 1; 107 in-body inbound; strong distinct intent. |
| `/van-remapping-devon` | 1178 | 49 | 67 | **Keep / light deepen** — already substantial; distinct van intent; add 1–2 model links & a van case study. |
| `/stage-1-remaps-devon` | 847 | 14 | 54 | **Rewrite/deepen (high value)** — **109 in-body inbound links** (the biggest internal magnet on the site) but only 14 uniqueness. Deepen to ~1100 words: what Stage 1 is, typical gains by fuel type, safety/DPF-intact, before/after. This page punches far below its internal importance. |
| `/diesel-remapping-devon` | 823 | 4 | 42 | **Rewrite/deepen** — big legitimate intent (diesel economy/torque); currently near-duplicate. Keep indexable, rewrite around diesel specifics. |
| `/4x4-remapping-devon` | 842 | 4 | 37 | **Rewrite/deepen** — distinct intent (Ranger/Hilux/Discovery/Defender owners, towing); currently near-duplicate. |
| `/fleet-vehicle-remapping-devon` | 833 | 14 | 44 | **Rewrite/deepen** — distinct B2B intent (fleet economy, downtime, trade accounts); currently near-duplicate. |
| `/ecu-tuning-devon` | 849 | 14 | 44 | **Canonicalise → `/ecu-remapping`** — "ECU tuning Devon" is a pure synonym of the hub; same intent, 1 in-body inbound. |
| `/performance-remapping-devon` | 836 | 4 | 40 | **Canonicalise/merge → `/stage-1-remaps-devon`** — "performance remapping" ≈ Stage 1; overlapping content, no distinct intent. |
| `/petrol-remapping-devon` | 838 | 3 | 37 | **Canonicalise → `/ecu-remapping`** — very low demand, overlaps hub + performance; handle petrol as a section on the hub. |

**Being critical, as requested:**
- **`/ecu-tuning-devon`** — no distinct search intent vs `/ecu-remapping`. Canonicalise or 301. Do not rewrite; it would just create a second hub.
- **`/petrol-remapping-devon`** — thinnest demand of the set; canonicalise to the hub.
- **`/performance-remapping-devon`** — overlaps Stage 1 directly; merge its content into `/stage-1-remaps-devon` (which already holds 109 inbound links) and 301.

Net: **6 of 9 stay** (2 strong + 4 distinct-but-need-rewrite), **3 canonicalise away**. This removes three near-duplicate competitors and concentrates authority on the hub and the Stage-1 page.

---

## 8. Deep-dive: DPF cluster (12) — cannibalisation re-check

**The DPF cluster is now largely healthy — the Phase-1 differentiation held.** Verified in rendered output:

- **Titles differentiated** — `/dpf-cleaning` = "DPF Cleaning Devon | Professional DPF Clean" (primary head term); `/dpf-cleaning-devon` = "DPF **Collection & Trade** Cleaning Across Devon" (no duplicate head term); every town title is distinct.
- **"mobile DPF" phrasing: 0 pages** ✅ — the wording that blurred the mobile-ECU vs workshop-DPF distinction is gone.
- **"free diagnostic": 0 pages** ✅.
- **Service accuracy preserved** — DPF described as workshop/off-vehicle throughout.

| URL | WC | Uniq | IW | Verdict |
|---|--:|--:|--:|---|
| `/dpf-diagnostics-devon` | 1132 | 82 | 87 | Keep — strong, distinct |
| `/blocked-dpf-cleaning-devon` | 1054 | 82 | 84 | Keep — strong, distinct |
| `/dpf-cleaning` | 761 | 76 | 81 | Keep — primary hub |
| `/dpf-cleaning-newton-abbot` | 1101 | 72 | 79 | Keep — deepest town page |
| `/dpf-cleaning-devon` | 794 | 77 | 78 | Keep — repositioned as collection/trade |
| `/why-clean` | 675 | 97 | 77 | Keep — informational support |
| `/postal-dpf` | 291 | 88 | 74 | Keep — distinct service (short but unique) |
| `/dpf-cleaning-torquay` | 814 | 55 | 70 | Light deepen — Phase-1 rewrite, nearly there |
| `/dpf-cleaning-totnes` | 847 | 60 | 69 | Light deepen — see same-day note |
| `/dpf-cleaning-exeter` | 826 | 54 | 67 | Light deepen — Phase-1 rewrite |
| `/dpf-cleaning-paignton` | 651 | 43 | 66 | **Rewrite/deepen** — link-only in Phase 1; thinnest of the cluster |
| `/dpf-cleaning-plymouth` | 670 | 41 | 63 | **Rewrite/deepen** — link-only in Phase 1; 57% overlap with Paignton |

**Remaining DPF items (all minor):**
1. **Paignton & Plymouth are the laggards** — they received link-only fixes in Phase 1, not content rewrites. They are now the two thinnest DPF town pages (uniq 41–43) and share 57% of body copy. Deepen both to ~850 words to match Torquay/Totnes/Exeter.
2. **Same-day wording** — body copy is hedged everywhere, but `/dpf-cleaning-totnes` (title "Same-Day Drop-Off", 11 body mentions) and `/dpf-cleaning-newton-abbot` (title "Same-Day Turnaround", 10 mentions) still carry same-day in the **title tag**. Confirm deliverability or soften these two titles (flagged in Phase 1, deferred).
3. **Pricing consistency** — Torquay/Totnes/Exeter quote **£210 + £230** (local + postal); Paignton/Plymouth/Newton Abbot quote **only £210**; the hub pages quote no price. Align the postal figure across town pages (owner to confirm current prices).
4. **Cannibalisation:** no head-term title collisions remain. All 12 DPF pages are safe to keep indexable.

---

## 9. Deep-dive: vehicle pages (69) & Top-20 rewrite list

**State:** only the 2 Phase-1 rewrites (BMW 320d, VW Transporter) are strong. **66 of 69 vehicle pages are under 500 words**; 67 are ~360–500-word template pages (uniqueness ~29–43, IW ~49–58). They carry genuinely unique *data tables* (engine variants, gains) but too little supporting copy to be confident indexes — most will sit at "Elevated" indexing risk until deepened.

Findings:
- **Thin (<500 words): 66 of 69.** Only `/bmw-320d-remap` (1153), `/vw-transporter-remap` (937) and `/audi-s4-remap` (508) exceed it.
- **Good unique data, not enough copy:** essentially every vehicle page — the tables differentiate them (that's why uniqueness isn't rock-bottom), but they need ~400–500 words of model-specific prose to become confident indexes.
- **Internal-link gaps:** several vehicle pages have only 1 in-body inbound link (e.g. `/audi-s4`, `/porsche-macan`, `/seat-ibiza`, `/toyota-land-cruiser`, `/audi-a5`, `/dacia-duster`, `/fiat-500`, `/fiat-ducato`, `/ford-mondeo`) — link these from the relevant location "Popular vehicles" blocks and from `/vehicle-performance-lookup`.
- **Lower-priority long tail:** niche models (e.g. `/fiat-500`, `/renault-clio`, `/vauxhall-corsa`, `/peugeot-208`) are acceptable/indexable but low commercial priority — leave as-is and batch-deepen later.

**Top-20 vehicle rewrite priority** (expand each to 700–900 words using the proven 320d/Transporter recipe: engine codes, gearbox notes, real-world gains, economy expectations, Stage-1 suitability, diagnostics-first, insurance/legal note, plus a mobile/location link):

| # | Vehicle page | WC now | Uniq | IW | Why prioritise |
|--:|---|--:|--:|--:|---|
| 1 | `/ford-transit-remap` | 497 | 33 | 57 | Huge commercial/van search volume |
| 2 | `/bmw-m140i-remap` | 365 | 36 | 53 | High-intent enthusiast search |
| 3 | `/mercedes-c220-remap` | 372 | 36 | 56 | Very common diesel |
| 4 | `/toyota-hilux-remap` | 403 | 41 | 57 | Pickup/4x4 demand |
| 5 | `/bmw-520d-remap` | 379 | 37 | 58 | Common exec diesel |
| 6 | `/nissan-navara-remap` | 400 | 41 | 59 | Pickup/4x4 demand |
| 7 | `/vw-golf-r-remap` | 379 | 39 | 59 | High-intent enthusiast |
| 8 | `/audi-s3-remap` | 384 | 40 | 61 | High-intent enthusiast |
| 9 | `/bmw-330d-remap` | 391 | 42 | 60 | Common performance diesel |
| 10 | `/land-rover-discovery-remap` | 413 | 37 | 60 | 4x4/towing demand |
| 11 | `/mercedes-sprinter-remap` | 415 | 43 | 60 | Van/fleet demand |
| 12 | `/range-rover-sport-remap` | 411 | 38 | 60 | High-value SUV |
| 13 | `/ford-transit-custom-remap` | 393 | 37 | 63 | Top van search |
| 14 | `/vw-golf-gtd-remap` | 383 | 32 | 62 | Popular diesel hot-hatch |
| 15 | `/audi-a3-remap` | 410 | 39 | 64 | Very high volume |
| 16 | `/ford-ranger-remap` | 394 | 39 | 64 | Top pickup search |
| 17 | `/vw-golf-gti-remap` | 380 | 33 | 56 | High-volume hot-hatch |
| 18 | `/audi-rs3-remap` | 377 | 38 | 56 | Halo/enthusiast |
| 19 | `/bmw-x5-remap` | 381 | 39 | 56 | High-value SUV |
| 20 | `/ford-kuga-remap` | 383 | 35 | 57 | High-volume family SUV |

_(BMW 320d and VW Transporter already done — reference templates for the rewrite style.)_

---

## 10. Action matrix — all 137 URLs

Actions are one of: **Keep as-is · Improve internal links · Rewrite/deepen · Merge · Canonicalise · Regionalise · Noindex · Remove stale/dead route · Human review required.**

_Notes:_ (a) **No page was assigned "Merge"** outright — the near-duplicate small-town pages are better handled as **Regionalise** (consolidate into a hub with 301s) and the 3 synonym service pages as **Canonicalise**; a merge is the mechanism you'd use when executing a Regionalise/Canonicalise. (b) **No page was assigned "Noindex"** — every page currently has enough potential value to save via consolidation or deepening; the 3 thin funnel/tool pages are flagged **Human review required** because noindex-vs-deepen is an owner judgment call. (c) **No "Remove stale/dead route"** is needed in `dist/` — but two **dead source files** (`src/pages/Remapping.tsx`, `src/pages/RemappingDevon.tsx`) are unused and can be deleted in a code-hygiene pass (they render no route). (d) Priority = urgency (commercial value × index-worthiness gap), not importance.

#### Homepage (1)

| URL | WC | Uniq | IW | Risk | Action | Priority | Reason |
|---|--:|--:|--:|---|---|---|---|
| `/` | 1746 | 100 | 97 | Low | Keep as-is | Low | unique+deep (uniq 100, 1746w) |

#### ECU hubs (2)

| URL | WC | Uniq | IW | Risk | Action | Priority | Reason |
|---|--:|--:|--:|---|---|---|---|
| `/ecu-remapping-locations` | 110 | 74 | 72 | Low | Keep as-is | Low | unique+deep (uniq 74, 110w) |
| `/ecu-remapping` | 987 | 97 | 93 | Low | Keep as-is | Low | unique+deep (uniq 97, 987w) |

#### DPF core / hub (6)

| URL | WC | Uniq | IW | Risk | Action | Priority | Reason |
|---|--:|--:|--:|---|---|---|---|
| `/dpf-cleaning` | 761 | 76 | 81 | Low | Keep as-is | Low | unique+deep (uniq 76, 761w) |
| `/postal-dpf` | 291 | 88 | 74 | Low | Keep as-is | Low | unique+deep (uniq 88, 291w) |
| `/dpf-cleaning-devon` | 794 | 77 | 78 | Low | Keep as-is | Low | unique+deep (uniq 77, 794w) |
| `/blocked-dpf-cleaning-devon` | 1054 | 82 | 84 | Low | Keep as-is | Low | unique+deep (uniq 82, 1054w) |
| `/dpf-diagnostics-devon` | 1132 | 82 | 87 | Low | Keep as-is | Low | unique+deep (uniq 82, 1132w) |
| `/why-clean` | 675 | 97 | 77 | Low | Keep as-is | Low | unique+deep (uniq 97, 675w) |

#### DPF town pages (6)

| URL | WC | Uniq | IW | Risk | Action | Priority | Reason |
|---|--:|--:|--:|---|---|---|---|
| `/dpf-cleaning-plymouth` | 670 | 41 | 63 | Moderate | Rewrite/deepen | Medium | 57% template overlap w/ /dpf-cleaning-paignton |
| `/dpf-cleaning-exeter` | 826 | 54 | 67 | Moderate | Rewrite/deepen | Medium | IW 67 |
| `/dpf-cleaning-paignton` | 651 | 43 | 66 | Moderate | Rewrite/deepen | Medium | IW 66 |
| `/dpf-cleaning-totnes` | 847 | 60 | 69 | Moderate | Rewrite/deepen | Medium | IW 69 |
| `/dpf-cleaning-torquay` | 814 | 55 | 70 | Moderate | Rewrite/deepen | Medium | IW 70 |
| `/dpf-cleaning-newton-abbot` | 1101 | 72 | 79 | Low | Keep as-is | Low | unique+deep (uniq 72, 1101w) |

#### ECU location pages (towns + regions) (29)

| URL | WC | Uniq | IW | Risk | Action | Priority | Reason |
|---|--:|--:|--:|---|---|---|---|
| `/ecu-remapping-paignton` | 964 | 11 | 49 | Elevated | Rewrite/deepen | High | ~87% duplicate of /ecu-remapping-plymouth; near-duplicate/low unique value |
| `/ecu-remapping-plymouth` | 973 | 12 | 49 | Elevated | Rewrite/deepen | High | ~86% duplicate of /ecu-remapping-paignton; near-duplicate/low unique value |
| `/ecu-remapping-barnstaple` | 852 | 14 | 51 | Elevated | Rewrite/deepen | Medium | ~84% duplicate of /ecu-remapping-teignmouth; near-duplicate/low unique value |
| `/ecu-remapping-totnes` | 954 | 12 | 51 | Elevated | Rewrite/deepen | Medium | ~86% duplicate of /ecu-remapping-paignton; near-duplicate/low unique value |
| `/ecu-remapping-dawlish` | 836 | 1 | 35 | High | Regionalise | Medium | ~89% duplicate of /ecu-remapping-teignmouth; near-duplicate/low unique value |
| `/ecu-remapping-teignmouth` | 832 | 1 | 35 | High | Regionalise | Medium | ~89% duplicate of /ecu-remapping-dawlish; near-duplicate/low unique value |
| `/ecu-remapping-ashburton` | 842 | 2 | 36 | High | Regionalise | Medium | ~88% duplicate of /ecu-remapping-dawlish; near-duplicate/low unique value |
| `/ecu-remapping-brixham` | 839 | 2 | 36 | High | Regionalise | Medium | ~88% duplicate of /ecu-remapping-tavistock; near-duplicate/low unique value |
| `/ecu-remapping-buckfastleigh` | 840 | 2 | 36 | High | Regionalise | Medium | ~88% duplicate of /ecu-remapping-teignmouth; near-duplicate/low unique value |
| `/ecu-remapping-salcombe` | 842 | 2 | 36 | High | Regionalise | Medium | ~88% duplicate of /ecu-remapping-teignmouth; near-duplicate/low unique value |
| `/ecu-remapping-axminster` | 832 | 3 | 38 | High | Regionalise | Medium | ~87% duplicate of /ecu-remapping-teignmouth; near-duplicate/low unique value |
| `/ecu-remapping-crediton` | 830 | 4 | 39 | High | Regionalise | Medium | ~86% duplicate of /ecu-remapping-tiverton; near-duplicate/low unique value |
| `/ecu-remapping-dartmouth` | 846 | 2 | 38 | High | Regionalise | Medium | ~88% duplicate of /ecu-remapping-tavistock; near-duplicate/low unique value |
| `/ecu-remapping-tavistock` | 847 | 2 | 38 | High | Regionalise | Medium | ~88% duplicate of /ecu-remapping-brixham; near-duplicate/low unique value |
| `/ecu-remapping-tiverton` | 829 | 4 | 39 | High | Regionalise | Medium | ~86% duplicate of /ecu-remapping-crediton; near-duplicate/low unique value |
| `/ecu-remapping-cullompton` | 842 | 14 | 43 | High | Regionalise | Medium | ~84% duplicate of /ecu-remapping-teignmouth; near-duplicate/low unique value |
| `/ecu-remapping-east-devon` | 861 | 14 | 45 | Elevated | Rewrite/deepen | Medium | ~84% duplicate of /ecu-remapping-teignmouth; near-duplicate/low unique value |
| `/ecu-remapping-okehampton` | 851 | 14 | 44 | High | Regionalise | Medium | ~84% duplicate of /ecu-remapping-teignmouth; near-duplicate/low unique value |
| `/ecu-remapping-south-hams` | 874 | 14 | 45 | Elevated | Rewrite/deepen | Medium | ~84% duplicate of /ecu-remapping-teignmouth; near-duplicate/low unique value |
| `/ecu-remapping-honiton` | 846 | 14 | 47 | Elevated | Regionalise | Medium | ~84% duplicate of /ecu-remapping-teignmouth; near-duplicate/low unique value |
| `/ecu-remapping-ivybridge` | 865 | 12 | 46 | Elevated | Regionalise | Medium | ~86% duplicate of /ecu-remapping-dawlish; near-duplicate/low unique value |
| `/ecu-remapping-kingsbridge` | 857 | 12 | 46 | Elevated | Regionalise | Medium | ~86% duplicate of /ecu-remapping-salcombe; near-duplicate/low unique value |
| `/ecu-remapping-torbay` | 854 | 12 | 46 | Elevated | Rewrite/deepen | Medium | ~86% duplicate of /ecu-remapping-teignmouth; near-duplicate/low unique value |
| `/ecu-remapping-torquay` | 1336 | 46 | 69 | Moderate | Rewrite/deepen | Medium | 61% template overlap w/ /ecu-remapping-plymouth |
| `/ecu-remapping-bideford` | 859 | 14 | 48 | Elevated | Regionalise | Medium | ~83% duplicate of /ecu-remapping-teignmouth; near-duplicate/low unique value |
| `/ecu-remapping-newton-abbot` | 1233 | 48 | 71 | Moderate | Rewrite/deepen | Medium | 59% template overlap w/ /ecu-remapping-buckfastleigh |
| `/ecu-remapping-north-devon` | 874 | 14 | 48 | Elevated | Rewrite/deepen | Medium | ~84% duplicate of /ecu-remapping-teignmouth; near-duplicate/low unique value |
| `/ecu-remapping-sidmouth` | 862 | 14 | 48 | Elevated | Regionalise | Medium | ~83% duplicate of /ecu-remapping-teignmouth; near-duplicate/low unique value |
| `/ecu-remapping-exeter` | 1396 | 48 | 73 | Low | Keep as-is | Low | 59% template overlap w/ /ecu-remapping-paignton; unique+deep (uniq 48, 1396w) |

#### Devon service-type pages (9)

| URL | WC | Uniq | IW | Risk | Action | Priority | Reason |
|---|--:|--:|--:|---|---|---|---|
| `/4x4-remapping-devon` | 842 | 4 | 37 | High | Rewrite/deepen | Medium | ~86% duplicate of /petrol-remapping-devon; near-duplicate/low unique value |
| `/petrol-remapping-devon` | 838 | 3 | 37 | High | Canonicalise | Medium | Very low demand + 3 uniq + 1 inbound; overlaps /ecu-remapping and /performance-remapping-devon. Canonicalise to /ecu-remapping (petrol handled as a section there). |
| `/performance-remapping-devon` | 836 | 4 | 40 | High | Canonicalise | Medium | "Performance remapping" ≈ Stage 1 — overlaps /stage-1-remaps-devon (which has 109 inbound). Canonicalise/merge into the Stage-1 page. |
| `/diesel-remapping-devon` | 823 | 4 | 42 | High | Rewrite/deepen | Medium | ~86% duplicate of /4x4-remapping-devon; near-duplicate/low unique value |
| `/ecu-tuning-devon` | 849 | 14 | 44 | High | Canonicalise | Medium | "ECU tuning Devon" is a synonym of the /ecu-remapping hub — same intent, 14 uniq, 1 in-body inbound. Canonicalise (or 301) to /ecu-remapping. |
| `/fleet-vehicle-remapping-devon` | 833 | 14 | 44 | High | Rewrite/deepen | Medium | ~83% duplicate of /diesel-remapping-devon; near-duplicate/low unique value |
| `/stage-1-remaps-devon` | 847 | 14 | 54 | Elevated | Rewrite/deepen | Medium | ~83% duplicate of /performance-remapping-devon; near-duplicate/low unique value |
| `/van-remapping-devon` | 1178 | 49 | 67 | Moderate | Rewrite/deepen | Low | 58% template overlap w/ /diesel-remapping-devon |
| `/mobile-ecu-remapping-devon` | 1227 | 50 | 73 | Low | Keep as-is | Low | 56% template overlap w/ /petrol-remapping-devon; unique+deep (uniq 50, 1227w) |

#### Vehicle remap pages (69)

| URL | WC | Uniq | IW | Risk | Action | Priority | Reason |
|---|--:|--:|--:|---|---|---|---|
| `/bmw-m140i-remap` | 365 | 36 | 53 | Elevated | Keep as-is | Low | 58% template overlap w/ /audi-rs3-remap; thin (365w); near-duplicate/low unique value; unique+deep (uniq 36, 365w) |
| `/ford-transit-remap` | 497 | 33 | 57 | Elevated | Rewrite/deepen | Medium | 61% template overlap w/ /mercedes-glc63-remap; thin (497w); near-duplicate/low unique value |
| `/mercedes-c220-remap` | 372 | 36 | 56 | Elevated | Keep as-is | Low | 58% template overlap w/ /bmw-120d-remap; thin (372w); near-duplicate/low unique value; unique+deep (uniq 36, 372w) |
| `/toyota-hilux-remap` | 403 | 41 | 57 | Elevated | Keep as-is | Low | thin (403w); unique+deep (uniq 41, 403w) |
| `/bmw-520d-remap` | 379 | 37 | 58 | Moderate | Rewrite/deepen | Medium | 57% template overlap w/ /vw-passat-remap; thin (379w); near-duplicate/low unique value |
| `/nissan-navara-remap` | 400 | 41 | 59 | Moderate | Rewrite/deepen | Medium | thin (400w) |
| `/vw-golf-r-remap` | 379 | 39 | 59 | Moderate | Rewrite/deepen | Medium | thin (379w) |
| `/audi-s3-remap` | 384 | 40 | 61 | Moderate | Rewrite/deepen | Medium | thin (384w) |
| `/bmw-330d-remap` | 391 | 42 | 60 | Moderate | Rewrite/deepen | Medium | thin (391w) |
| `/land-rover-discovery-remap` | 413 | 37 | 60 | Moderate | Rewrite/deepen | Medium | 56% template overlap w/ /peugeot-208-remap; thin (413w); near-duplicate/low unique value |
| `/mercedes-sprinter-remap` | 415 | 43 | 60 | Moderate | Rewrite/deepen | Medium | thin (415w) |
| `/range-rover-sport-remap` | 411 | 38 | 60 | Moderate | Rewrite/deepen | Medium | 55% template overlap w/ /range-rover-vogue-remap; thin (411w) |
| `/ford-transit-custom-remap` | 393 | 37 | 63 | Moderate | Rewrite/deepen | Medium | 57% template overlap w/ /mercedes-c220-remap; thin (393w); near-duplicate/low unique value |
| `/vw-golf-gtd-remap` | 383 | 32 | 62 | Moderate | Rewrite/deepen | Medium | 62% template overlap w/ /vw-golf-gti-remap; thin (383w); near-duplicate/low unique value |
| `/audi-a3-remap` | 410 | 39 | 64 | Moderate | Rewrite/deepen | Medium | thin (410w) |
| `/ford-ranger-remap` | 394 | 39 | 64 | Moderate | Rewrite/deepen | Medium | thin (394w) |
| `/mercedes-glc63-remap` | 489 | 31 | 49 | Elevated | Rewrite/deepen | Medium | 64% template overlap w/ /audi-s4-remap; thin (489w); near-duplicate/low unique value |
| `/bmw-120d-remap` | 365 | 37 | 51 | Elevated | Keep as-is | Low | 56% template overlap w/ /mercedes-c220-remap; thin (365w); near-duplicate/low unique value; unique+deep (uniq 37, 365w) |
| `/bmw-m340i-remap` | 359 | 37 | 51 | Elevated | Keep as-is | Low | 56% template overlap w/ /mercedes-c63-remap; thin (359w); near-duplicate/low unique value; unique+deep (uniq 37, 359w) |
| `/dacia-duster-remap` | 382 | 37 | 51 | Elevated | Improve internal links | Medium | 57% template overlap w/ /nissan-qashqai-remap; thin (382w); near-duplicate/low unique value; only 1 in-body inbound links |
| `/fiat-500-remap` | 397 | 35 | 51 | Elevated | Improve internal links | Medium | 59% template overlap w/ /peugeot-208-remap; thin (397w); near-duplicate/low unique value; only 1 in-body inbound links |
| `/fiat-ducato-remap` | 393 | 37 | 51 | Elevated | Improve internal links | Medium | 56% template overlap w/ /peugeot-boxer-remap; thin (393w); near-duplicate/low unique value; only 1 in-body inbound links |
| `/ford-mondeo-remap` | 387 | 35 | 51 | Elevated | Improve internal links | Medium | 59% template overlap w/ /ford-kuga-remap; thin (387w); near-duplicate/low unique value; only 1 in-body inbound links |
| `/mercedes-a35-remap` | 362 | 37 | 51 | Elevated | Keep as-is | Low | 56% template overlap w/ /mercedes-c63-remap; thin (362w); near-duplicate/low unique value; unique+deep (uniq 37, 362w) |
| `/mercedes-a45-remap` | 390 | 33 | 50 | Elevated | Keep as-is | Low | 61% template overlap w/ /mercedes-c63-remap; thin (390w); near-duplicate/low unique value; unique+deep (uniq 33, 390w) |
| `/mercedes-e220-remap` | 369 | 38 | 51 | Elevated | Keep as-is | Low | 55% template overlap w/ /mercedes-c220-remap; thin (369w); unique+deep (uniq 38, 369w) |
| `/peugeot-3008-remap` | 385 | 35 | 51 | Elevated | Keep as-is | Low | 59% template overlap w/ /peugeot-208-remap; thin (385w); near-duplicate/low unique value; unique+deep (uniq 35, 385w) |
| `/range-rover-evoque-remap` | 405 | 38 | 51 | Elevated | Keep as-is | Low | 55% template overlap w/ /ford-mondeo-remap; thin (405w); unique+deep (uniq 38, 405w) |
| `/range-rover-vogue-remap` | 399 | 37 | 51 | Elevated | Keep as-is | Low | 56% template overlap w/ /range-rover-sport-remap; thin (399w); near-duplicate/low unique value; unique+deep (uniq 37, 399w) |
| `/renault-trafic-remap` | 403 | 37 | 51 | Elevated | Keep as-is | Low | 57% template overlap w/ /vauxhall-vivaro-remap; thin (403w); near-duplicate/low unique value; unique+deep (uniq 37, 403w) |
| `/skoda-superb-remap` | 382 | 38 | 51 | Elevated | Keep as-is | Low | 55% template overlap w/ /seat-leon-remap; thin (382w); unique+deep (uniq 38, 382w) |
| `/audi-a5-remap` | 413 | 39 | 52 | Elevated | Improve internal links | Medium | thin (413w); only 1 in-body inbound links |
| `/bmw-118d-remap` | 384 | 41 | 52 | Elevated | Keep as-is | Low | thin (384w); unique+deep (uniq 41, 384w) |
| `/land-rover-defender-remap` | 400 | 41 | 52 | Elevated | Keep as-is | Low | thin (400w); unique+deep (uniq 41, 400w) |
| `/mazda-cx-5-remap` | 390 | 41 | 52 | Elevated | Keep as-is | Low | thin (390w); unique+deep (uniq 41, 390w) |
| `/mercedes-c63-remap` | 386 | 29 | 53 | Elevated | Keep as-is | Low | 66% template overlap w/ /mercedes-a45-remap; thin (386w); near-duplicate/low unique value; unique+deep (uniq 29, 386w) |
| `/nissan-juke-remap` | 396 | 40 | 52 | Elevated | Keep as-is | Low | thin (396w); unique+deep (uniq 40, 396w) |
| `/peugeot-208-remap` | 372 | 32 | 52 | Elevated | Keep as-is | Low | 62% template overlap w/ /peugeot-3008-remap; thin (372w); near-duplicate/low unique value; unique+deep (uniq 32, 372w) |
| `/porsche-macan-remap` | 389 | 41 | 52 | Elevated | Improve internal links | Medium | thin (389w); only 1 in-body inbound links |
| `/seat-ibiza-remap` | 377 | 39 | 52 | Elevated | Improve internal links | Medium | thin (377w); only 1 in-body inbound links |
| `/toyota-land-cruiser-remap` | 413 | 40 | 52 | Elevated | Improve internal links | Medium | thin (413w); only 1 in-body inbound links |
| `/vauxhall-astra-remap` | 392 | 39 | 52 | Elevated | Keep as-is | Low | thin (392w); unique+deep (uniq 39, 392w) |
| `/volvo-xc60-remap` | 390 | 40 | 52 | Elevated | Keep as-is | Low | thin (390w); unique+deep (uniq 40, 390w) |
| `/volvo-xc90-remap` | 379 | 40 | 52 | Elevated | Keep as-is | Low | thin (379w); unique+deep (uniq 40, 379w) |
| `/vw-tiguan-remap` | 392 | 35 | 53 | Elevated | Keep as-is | Low | 59% template overlap w/ /vw-passat-remap; thin (392w); near-duplicate/low unique value; unique+deep (uniq 35, 392w) |
| `/citroen-berlingo-remap` | 399 | 41 | 55 | Elevated | Keep as-is | Low | thin (399w); unique+deep (uniq 41, 399w) |
| `/ford-fiesta-st-remap` | 385 | 40 | 54 | Elevated | Keep as-is | Low | thin (385w); unique+deep (uniq 40, 385w) |
| `/nissan-qashqai-remap` | 395 | 38 | 54 | Elevated | Keep as-is | Low | 55% template overlap w/ /dacia-duster-remap; thin (395w); unique+deep (uniq 38, 395w) |
| `/peugeot-boxer-remap` | 406 | 37 | 54 | Elevated | Keep as-is | Low | 56% template overlap w/ /fiat-ducato-remap; thin (406w); near-duplicate/low unique value; unique+deep (uniq 37, 406w) |
| `/range-rover-velar-remap` | 402 | 38 | 54 | Elevated | Keep as-is | Low | 55% template overlap w/ /land-rover-discovery-remap; thin (402w); unique+deep (uniq 38, 402w) |
| `/renault-megane-remap` | 388 | 38 | 54 | Elevated | Keep as-is | Low | 55% template overlap w/ /dacia-duster-remap; thin (388w); unique+deep (uniq 38, 388w) |
| `/seat-leon-remap` | 387 | 37 | 54 | Elevated | Keep as-is | Low | 56% template overlap w/ /skoda-superb-remap; thin (387w); near-duplicate/low unique value; unique+deep (uniq 37, 387w) |
| `/skoda-octavia-remap` | 390 | 38 | 54 | Elevated | Keep as-is | Low | 55% template overlap w/ /audi-a3-remap; thin (390w); unique+deep (uniq 38, 390w) |
| `/vauxhall-corsa-remap` | 382 | 35 | 55 | Elevated | Keep as-is | Low | 59% template overlap w/ /peugeot-208-remap; thin (382w); near-duplicate/low unique value; unique+deep (uniq 35, 382w) |
| `/vauxhall-vivaro-remap` | 400 | 36 | 55 | Elevated | Keep as-is | Low | 58% template overlap w/ /renault-trafic-remap; thin (400w); near-duplicate/low unique value; unique+deep (uniq 36, 400w) |
| `/audi-a4-remap` | 411 | 40 | 57 | Elevated | Keep as-is | Low | thin (411w); unique+deep (uniq 40, 411w) |
| `/audi-a6-remap` | 386 | 39 | 56 | Elevated | Keep as-is | Low | thin (386w); unique+deep (uniq 39, 386w) |
| `/audi-q5-remap` | 403 | 38 | 56 | Elevated | Keep as-is | Low | 55% template overlap w/ /vw-tiguan-remap; thin (403w); unique+deep (uniq 38, 403w) |
| `/audi-rs3-remap` | 377 | 38 | 56 | Elevated | Keep as-is | Low | 55% template overlap w/ /bmw-m140i-remap; thin (377w); unique+deep (uniq 38, 377w) |
| `/bmw-x5-remap` | 381 | 39 | 56 | Elevated | Keep as-is | Low | thin (381w); unique+deep (uniq 39, 381w) |
| `/ford-focus-st-remap` | 403 | 42 | 57 | Elevated | Keep as-is | Low | thin (403w); unique+deep (uniq 42, 403w) |
| `/ford-kuga-remap` | 383 | 35 | 57 | Elevated | Keep as-is | Low | 59% template overlap w/ /ford-mondeo-remap; thin (383w); near-duplicate/low unique value; unique+deep (uniq 35, 383w) |
| `/renault-clio-remap` | 383 | 38 | 56 | Elevated | Keep as-is | Low | 55% template overlap w/ /fiat-500-remap; thin (383w); unique+deep (uniq 38, 383w) |
| `/vw-amarok-remap` | 388 | 37 | 56 | Elevated | Keep as-is | Low | 56% template overlap w/ /bmw-520d-remap; thin (388w); near-duplicate/low unique value; unique+deep (uniq 37, 388w) |
| `/vw-golf-gti-remap` | 380 | 33 | 56 | Elevated | Keep as-is | Low | 61% template overlap w/ /vw-golf-gtd-remap; thin (380w); near-duplicate/low unique value; unique+deep (uniq 33, 380w) |
| `/vw-passat-remap` | 402 | 37 | 56 | Elevated | Keep as-is | Low | 57% template overlap w/ /vw-tiguan-remap; thin (402w); near-duplicate/low unique value; unique+deep (uniq 37, 402w) |
| `/audi-s4-remap` | 508 | 33 | 58 | Moderate | Rewrite/deepen | Medium | 61% template overlap w/ /mercedes-glc63-remap; near-duplicate/low unique value |
| `/vw-transporter-remap` | 937 | 78 | 87 | Low | Keep as-is | Low | unique+deep (uniq 78, 937w) |
| `/bmw-320d-remap` | 1153 | 81 | 90 | Low | Keep as-is | Low | unique+deep (uniq 81, 1153w) |

#### Core & informational (8)

| URL | WC | Uniq | IW | Risk | Action | Priority | Reason |
|---|--:|--:|--:|---|---|---|---|
| `/services` | 388 | 86 | 72 | Low | Keep as-is | Low | unique+deep (uniq 86, 388w) |
| `/pricing` | 421 | 91 | 77 | Low | Keep as-is | Low | unique+deep (uniq 91, 421w) |
| `/ecu-cloning` | 800 | 97 | 78 | Low | Improve internal links | Low | only 1 in-body inbound links |
| `/about` | 214 | 82 | 54 | Elevated | Improve internal links | Low | only 0 in-body inbound links |
| `/how-it-works` | 157 | 79 | 57 | Elevated | Improve internal links | Low | only 1 in-body inbound links |
| `/maintenance` | 328 | 89 | 62 | Moderate | Rewrite/deepen | Low | IW 62 |
| `/contact` | 94 | 71 | 58 | Moderate | Rewrite/deepen | Low | IW 58 |
| `/adblue-repair-devon` | 1290 | 99 | 82 | Low | Keep as-is | Low | unique+deep (uniq 99, 1290w) |

#### Tools / conversion (4)

| URL | WC | Uniq | IW | Risk | Action | Priority | Reason |
|---|--:|--:|--:|---|---|---|---|
| `/fuel-savings-calculator` | 197 | 85 | 53 | Elevated | Human review required | Low | BUG: canonical points to /calculator (non-existent route) so this page cannot self-canonicalise — Google will drop it. Fix canonical to /fuel-savings-calculator first, then decide index vs noindex for the thin tool page. |
| `/book` | 134 | 85 | 61 | Moderate | Human review required | Low | Thin booking funnel (134 words). Decide: add supporting copy to justify indexing, or noindex as a transactional funnel. |
| `/remapping-booking` | 95 | 77 | 64 | Moderate | Human review required | Low | Thin booking funnel (95 words) with 112 inbound. Decide: deepen or noindex the funnel step. |
| `/vehicle-performance-lookup` | 460 | 93 | 74 | Low | Keep as-is | Low | unique+deep (uniq 93, 460w) |

#### Blog (3)

| URL | WC | Uniq | IW | Risk | Action | Priority | Reason |
|---|--:|--:|--:|---|---|---|---|
| `/blog` | 138 | 78 | 60 | Moderate | Rewrite/deepen | Low | IW 60 |
| `/blog/adblue-no-start-countdown-sprinter` | 501 | 90 | 71 | Moderate | Rewrite/deepen | Low | IW 71 |
| `/blog/blocked-dpf-ford-transit-custom` | 589 | 90 | 71 | Moderate | Rewrite/deepen | Low | IW 71 |

---

## 11. Top 20 next SEO improvements (Phase 2 backlog, ordered)

1. **Fix the `/fuel-savings-calculator` canonical** (`path="/calculator"` → `/fuel-savings-calculator`). One-line fix; unblocks indexing of that page. (Only hard technical defect.)
2. **Deepen `/stage-1-remaps-devon`** to ~1100 words — it has 109 inbound links but 14 uniqueness; highest ROI single page on the site.
3. **Canonicalise the 3 synonym service pages** — `/ecu-tuning-devon` & `/petrol-remapping-devon` → `/ecu-remapping`; `/performance-remapping-devon` → `/stage-1-remaps-devon`.
4. **Rewrite `/ecu-remapping-plymouth`** (largest city market, still pure template).
5. **Rewrite `/ecu-remapping-paignton`** (Torbay demand).
6. **Rewrite `/ecu-remapping-totnes`** (home-town flagship).
7. **Finish Torquay & Newton Abbot** — one more local section + 1 FAQ each to clear IW 72.
8. **Rewrite `/ecu-remapping-barnstaple`** as the North Devon anchor.
9. **Build the 4 regional hubs** (Torbay, South Hams, East Devon, North Devon) with unique aggregated content.
10. **Regionalise the 18 small-town ECU pages** into those hubs (301 the thinnest; keep only those given ≥200 unique local words + ≥3 inbound links).
11. **Rewrite vehicle Top-20 #1–8** (Transit, M140i, C220d, Hilux, 520d, Navara, Golf R, S3).
12. **Rewrite vehicle Top-20 #9–16** (330d, Discovery, Sprinter, RR Sport, Transit Custom, Golf GTD, A3, Ranger).
13. **Deepen `/dpf-cleaning-paignton` and `/dpf-cleaning-plymouth`** to ~850 words (the DPF laggards).
14. **Rewrite `/diesel-remapping-devon`, `/4x4-remapping-devon`, `/fleet-vehicle-remapping-devon`** around their distinct intents.
15. **Fix vehicle-page internal-link gaps** — ensure every vehicle page has ≥3 in-body inbound links (from location "Popular vehicles" blocks + `/vehicle-performance-lookup`).
16. **Roll a short vehicle template block** (insurance/legal + diagnostics-first + mobile/location link) into all 69 vehicle pages to lift baseline depth and consistency.
17. **Add per-town "Popular vehicles" tailoring** (data field already supports it) so location→vehicle links match local demand (vans for Plymouth/Barnstaple, taxis/SUVs for Torbay).
18. **Soften the two DPF "Same-Day" title tags** (Totnes, Newton Abbot) and align postal pricing (£230) across DPF town pages — pending owner confirmation.
19. **Deepen the thin core pages** (`/contact`, `/how-it-works`, `/maintenance`, `/about`) and add in-body links to `/how-it-works` and `/fuel-savings-calculator` (not currently in the footer).
20. **Grow the blog** — only 2 posts; add ~6–8 DPF/AdBlue/remap advice posts to build topical support and internal links into the hubs.

---

## 12. Exact Phase 2 recommendation

**Frame Phase 2 as consolidation + selective deepening, not expansion.** The site does not need more pages; it needs the ~90 near-duplicate/thin pages resolved. In order:

1. **Quick technical win (1 change):** fix the calculator canonical.
2. **Concentrate authority (3 canonicalises + 1 deepen):** canonicalise the 3 synonym service pages; deepen `/stage-1-remaps-devon`.
3. **Consolidate the ECU long tail (biggest lever):** build the 4 regional hubs, then regionalise/301 the 18 thin small-town pages into them. This directly attacks the "Discovered – currently not indexed" backlog by removing the doorway footprint.
4. **Deepen the high-value locals:** Plymouth, Paignton, Totnes, Barnstaple (+ finish Torquay/Newton Abbot).
5. **Deepen vehicles in priority order:** Top-20 list, using the 320d/Transporter recipe.
6. **Tidy DPF:** deepen Paignton/Plymouth; soften 2 same-day titles; align pricing.

**Expected effect:** fewer, stronger URLs; the near-duplicate footprint that keeps pages in "Discovered/not indexed" is removed; internal authority concentrates on hubs + the Stage-1 magnet; and the deepened town/vehicle pages cross the ~IW-72 threshold that (on the evidence of the Phase-1 pages) corresponds to confident indexing.

---

## 13. Reminder — nothing was changed

This is an **audit only**. No code, content, redirects, canonicals, merges, deletions or noindex tags were applied. The build was run to inspect rendered output; `dist/` reflects the current committed source. **Awaiting approval before any Phase 2 work.**

_Machine-readable per-URL data (all fields, issues, recommendations, before/after deltas): `seo-post-phase-1-indexability-audit.json`._
