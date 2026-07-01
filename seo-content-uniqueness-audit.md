# Auto-Cleanse Content Uniqueness & Doorway Risk Audit

_Generated 2026-07-01. Analysis of the **rendered/prerendered HTML** in `dist/` (main `<main>` content only — header, nav and footer excluded from scoring). 137 sitemap pages audited. The sitemap/indexation state is treated as already-audited and correct._

---

## How this was measured (methodology)

- The site was already built (`npm run build` → Vite client build + SSR build + `scripts/prerender.mjs`). I parsed all 138 prerendered `index.html` files directly rather than reading React components, because the location, Devon-service and vehicle pages are all generated from shared templates + data files (`RemappingLocation.tsx` + `remapping-locations.ts`, `VehicleRemap.tsx` + `vehicle-remapping.ts`).
- For each page I extracted: title, meta description, canonical, robots, JSON-LD `@type`s, H1, all H2/H3s, rendered main-content word count, and all internal links inside `<main>` (nav/footer excluded so link counts are *editorial/contextual*, not chrome).
- **Duplication method:** each page's main text was normalised (lower-cased, punctuation/number-stripped) and then **town, region and vehicle names were removed** so that "only the place/vehicle name changes" pages collapse onto each other. I then compared 6-word shingles (Jaccard similarity) between every pair of pages in a cluster, and detected per-template boilerplate (6-word shingles shared by ≥60% of a template's pages).
- **Scores:** `uniquenessScore` 0–100 (higher = more genuinely unique). `duplicateEstimate` = % of the page that is shared template / near-duplicate scaffolding. **Risk bands:** Low ≥70, Medium 55–69, High 38–54, Critical <38.
- Machine-readable data for every URL is in `seo-content-uniqueness-audit.json`.

> **Note on page count.** There are **138** prerendered folders but only **137** live routes. `/fuel-economy-remaps-devon` exists on disk but is **not** in the current route list (`entry-server.tsx`), not in `remapping-locations.ts`, and not in the vehicle data — it is a **stale orphan** from an older build (the prerender step never cleans `dist/`). It is excluded from all tables below and listed as a prune candidate.

---

## Executive Summary

**Overall content-uniqueness risk: MEDIUM–HIGH, and highly concentrated.** The site is not a low-value doorway site as a whole — the core service pages, DPF hub pages, blog, tools and homepage are genuinely unique, well-written and honest. The risk lives almost entirely in three programmatic clusters that make up **107 of the 137 pages (78%)**:

1. **ECU remapping location pages (29) — CRITICAL.** These are the biggest problem. Any two town pages share **67–75% of their body copy even after town names are removed**, and *every* H2 heading is identical across all 29 pages. The genuinely-unique portion of each page is essentially one intro paragraph (~90 words) and 5 FAQs — the rest (6 service cards, "Why AutoCleanse", trust list, mobile callout, CTA, enquiry form) is byte-for-byte identical. This is the classic "programmatic town page" pattern Google's [doorway-page guidance](https://developers.google.com/search/docs/essentials/spam-policies#doorways) targets. To their credit, the *intros* are often genuinely locally-written (Dartmoor, the Creedy Valley, the M5 corridor, Jurassic Coast) — but they are ~10% of the page.

2. **Devon service-type remap pages (9) — CRITICAL.** These use the **exact same template** as the town pages, so a "diesel remapping" page and a "4x4 remapping" page and a "petrol remapping" page render ~70% identically to each other *and* to all 29 town pages. Worse, the 6 on-page service cards are **not tailored to the page's own service** — the petrol page still leads with "Economy Remap – diesel-focused tuning". Search intent is differentiated only in the intro. `/ecu-tuning-devon` is effectively a synonym of the `/ecu-remapping` hub.

3. **Vehicle remap pages (69) — HIGH, but a different problem.** These are **thin, not doorway.** Each carries a genuinely unique, useful data core (per-engine stock-vs-remap power/torque tables, MPG gains, and mostly model-specific FAQs), which is real buyer value. But the pages are short (avg **359 words**) so the shared scaffolding still makes up ~50% of the text. The fix is *depth*, not *deduplication* — and the unique data means they are far less risky than the location pages.

**Biggest opportunities:**
- **Resolve the flagship DPF cannibalisation:** `/dpf-cleaning` and `/dpf-cleaning-devon` **both** target "DPF Cleaning Devon" in their title tag. Pick one primary, differentiate or canonicalise the other. This is a fast, high-value win.
- **Rewrite the ~6 major-town ECU pages** (Torquay, Exeter, Newton Abbot, Plymouth, Paignton, Totnes) into genuinely local, deeper pages, and **thin/regionalise the long tail** of small-town ECU pages that will struggle to rank as near-duplicates.
- **Differentiate or prune the Devon service-type set** — keep the ones with distinct intent (mobile, diesel, van, stage-1), merge/canonicalise the weak ones (ecu-tuning, petrol).
- **Fix internal linking:** the DPF cluster is weakly interlinked, 0/69 vehicle pages link to the mobile-remapping page, and 0/29 location pages link to any vehicle page.

**Honesty/accuracy: GOOD.** No page implies mobile DPF cleaning, no page offers "free diagnostics", and DPF pages clearly explain workshop-based / off-vehicle / collect-clean-return service. The only wording to sanity-check is the flat "Same-Day" claims in a few DPF title tags (the body copy is properly hedged with "where possible / before 10am").

---

## Site Page Cluster Overview

| Cluster | Pages | Avg uniqueness | Avg duplicate est. | Overall risk |
|---|---:|---:|---:|---|
| DPF core/hub pages | 6 | 85/100 | 16% | Low |
| DPF town/location pages | 6 | 64/100 | 45% | Medium |
| ECU remapping location pages | 29 | 34/100 | 80% | **Critical** |
| Devon service-type remap pages | 9 | 37/100 | 77% | **Critical** |
| Vehicle remap pages | 69 | 51/100 | 54% | High |
| ECU hubs | 2 | 90/100 | 3% | Low |
| Core service/company pages | 8 | 89/100 | 3% | Low |
| Utility/conversion pages | 4 | 83/100 | 3% | Low |
| Blog | 3 | 86/100 | 6% | Low |
| Home | 1 | 100/100 | 3% | Low |
| **Total** | **137** | — | — | — |

**Worst cluster: ECU remapping location pages.** **Best-opportunity cluster: DPF cleaning (town + core)** — high commercial value, already reasonably unique, and quick to push from "good" to "market-leading".

---

## Full URL Audit Table

_Sorted by cluster, then worst → best within cluster. Full detail (H2s, schema, all internal links, cannibalisation notes) is in the JSON file._

| URL | Cluster | Service | Location | Vehicle | Title (truncated) | H1 | Words | Uniq | Dup% | Risk | Main issue | Recommended action |
|---|---|---|---|---|---|---|---:|---:|---:|---|---|---|
| /dpf-cleaning-devon | DPF-core | DPF cleaning | Devon | — | DPF Cleaning Devon \| Same-Day Return | DPF Cleaning Across Devon. | 707 | 75 | 27 | Low | Title clashes with /dpf-cleaning | Differentiate title/angle or canonicalise to /dpf-cleaning |
| /dpf-cleaning | DPF-core | DPF cleaning | — | — | DPF Cleaning Devon \| Professional DPF Clean | Professional DPF Cleaning Devon. | 745 | 76 | 27 | Low | Title clashes with /dpf-cleaning-devon | Make this the single canonical "DPF cleaning Devon / near me" page |
| /blocked-dpf-cleaning-devon | DPF-core | Blocked DPF cleaning | Devon | — | Blocked DPF Cleaning Devon \| Warning Light | Blocked DPF Cleaning in Devon | 1036 | 85 | 19 | Low | Slight overlap w/ diagnostics | Keep; sharpen to symptom/limp-mode intent, link tightly |
| /dpf-diagnostics-devon | DPF-core | DPF diagnostics | Devon | — | DPF Diagnostics Devon \| Diagnose Before You | DPF Diagnostics in Devon | 1115 | 86 | 17 | Low | — | Keep; strong distinct page |
| /postal-dpf | DPF-core | Postal DPF cleaning | — | — | Postal DPF Cleaning UK \| AutoCleanse | Postal DPF Cleaning – Nationwide | 290 | 90 | 3 | Low | A little thin | Keep; could add process/turnaround detail |
| /why-clean | DPF-core | DPF info | — | — | DPF Cleaning vs Replacement \| AutoCleanse | Why Clean Your DPF Instead of Replace | 660 | 96 | 3 | Low | — | Keep; strong informational asset |
| /dpf-cleaning-torquay | DPF-town | DPF cleaning | Torquay | — | DPF Cleaning Torquay \| AutoCleanse Devon | DPF Cleaning in Torquay. | 647 | 60 | 50 | Medium | Links to redirect /remapping | Keep — well localised; add price line + 2 unique FAQs |
| /dpf-cleaning-paignton | DPF-town | DPF cleaning | Paignton | — | DPF Cleaning Paignton \| AutoCleanse Devon | DPF Cleaning in Paignton. | 630 | 60 | 51 | Medium | Links to redirect /remapping | Keep; strengthen local detail; fix redirect link |
| /dpf-cleaning-plymouth | DPF-town | DPF cleaning | Plymouth | — | DPF Cleaning Plymouth \| AutoCleanse Devon | DPF Cleaning Near Plymouth. | 650 | 60 | 49 | Medium | Links to redirect /remapping | Keep; strengthen local detail; fix redirect link |
| /dpf-cleaning-exeter | DPF-town | DPF cleaning | Exeter | — | DPF Cleaning Exeter \| AutoCleanse Devon | DPF Cleaning Near Exeter. | 654 | 61 | 48 | Medium | Links to redirect /remapping | Keep — priority town; deepen + fix redirect link |
| /dpf-cleaning-totnes | DPF-town | DPF cleaning | Totnes | — | DPF Cleaning Totnes \| Same-Day Drop-Off | DPF Cleaning in Totnes. | 633 | 64 | 45 | Medium | Weakly linked (1 inbound) | Keep — home town; deepen + interlink |
| /dpf-cleaning-newton-abbot | DPF-town | DPF cleaning | Newton Abbot | — | DPF Cleaning Newton Abbot \| Same-Day Turn. | DPF Cleaning Near Newton Abbot. | 1082 | 77 | 28 | Low | — | Best-in-class DPF town page; use as template |
| /ecu-remapping-dawlish | ECU-loc | ECU remapping | Dawlish | — | ECU Remapping Dawlish \| Mobile & Workshop | ECU Remapping in Dawlish | 748 | 30 | 83 | **Critical** | 83% dup; every H2 templated | Rewrite local body or regionalise |
| /ecu-remapping-teignmouth | ECU-loc | ECU remapping | Teignmouth | — | ECU Remapping Teignmouth \| Stage 1 & Mobile | ECU Remapping in Teignmouth | 747 | 30 | 84 | **Critical** | 84% dup | Rewrite local body or regionalise |
| /ecu-remapping-tavistock | ECU-loc | ECU remapping | Tavistock | — | ECU Remapping Tavistock \| Stage 1 & Mobile | ECU Remapping in Tavistock | 761 | 31 | 82 | **Critical** | 82% dup | Rewrite local body or regionalise |
| /ecu-remapping-ashburton | ECU-loc | ECU remapping | Ashburton | — | ECU Remapping Ashburton \| Dartmoor Edge | ECU Remapping in Ashburton | 754 | 31 | 82 | **Critical** | 82% dup | Rewrite local body or regionalise |
| /ecu-remapping-brixham | ECU-loc | ECU remapping | Brixham | — | ECU Remapping Brixham \| Stage 1 & Mobile | ECU Remapping in Brixham | 749 | 31 | 83 | **Critical** | 83% dup | Rewrite local body or regionalise |
| /ecu-remapping-buckfastleigh | ECU-loc | ECU remapping | Buckfastleigh | — | ECU Remapping Buckfastleigh \| Stage 1 | ECU Remapping in Buckfastleigh | 756 | 31 | 83 | **Critical** | 83% dup | Regionalise (near Totnes) |
| /ecu-remapping-dartmouth | ECU-loc | ECU remapping | Dartmouth | — | ECU Remapping Dartmouth \| Mobile & Workshop | ECU Remapping in Dartmouth | 753 | 31 | 82 | **Critical** | 82% dup | Rewrite local body or regionalise |
| /ecu-remapping-salcombe | ECU-loc | ECU remapping | Salcombe | — | ECU Remapping Salcombe \| Mobile Remap | ECU Remapping in Salcombe | 755 | 31 | 83 | **Critical** | 83% dup | Regionalise into South Hams |
| /ecu-remapping-newton-abbot | ECU-loc | ECU remapping | Newton Abbot | — | ECU Remapping Newton Abbot \| Stage 1 & Eco. | ECU Remapping in Newton Abbot | 778 | 32 | 82 | **Critical** | Major town but 82% dup | **Priority rewrite** — bespoke local page |
| /ecu-remapping-ivybridge | ECU-loc | ECU remapping | Ivybridge | — | ECU Remapping Ivybridge \| Stage 1 & Mobile | ECU Remapping in Ivybridge | 774 | 32 | 81 | **Critical** | 81% dup | Rewrite or regionalise |
| /ecu-remapping-kingsbridge | ECU-loc | ECU remapping | Kingsbridge | — | ECU Remapping Kingsbridge \| South Hams | ECU Remapping in Kingsbridge | 768 | 33 | 81 | **Critical** | 81% dup | Regionalise into South Hams |
| /ecu-remapping-tiverton | ECU-loc | ECU remapping | Tiverton | — | ECU Remapping Tiverton \| Mid Devon Stage 1 | ECU Remapping in Tiverton | 742 | 33 | 81 | **Critical** | 81% dup | Rewrite local body |
| /ecu-remapping-axminster | ECU-loc | ECU remapping | Axminster | — | ECU Remapping Axminster \| East Devon Mobile | ECU Remapping in Axminster | 745 | 33 | 82 | **Critical** | 82% dup | Regionalise into East Devon |
| /ecu-remapping-torbay | ECU-loc | ECU remapping | Torbay | — | ECU Remapping Torbay \| Torquay, Paignton | ECU Remapping in Torbay | 768 | 33 | 81 | **Critical** | Overlaps Torquay/Paignton/Brixham | Keep as area hub; differentiate from town pages |
| /ecu-remapping-barnstaple | ECU-loc | ECU remapping | Barnstaple | — | ECU Remapping Barnstaple \| North Devon | ECU Remapping in Barnstaple | 766 | 34 | 80 | **Critical** | 80% dup | North Devon flagship — deepen |
| /ecu-remapping-okehampton | ECU-loc | ECU remapping | Okehampton | — | ECU Remapping Okehampton \| Stage 1 & Mobile | ECU Remapping in Okehampton | 762 | 34 | 80 | **Critical** | 80% dup | Rewrite or regionalise |
| /ecu-remapping-crediton | ECU-loc | ECU remapping | Crediton | — | ECU Remapping Crediton \| Mid Devon Mobile | ECU Remapping in Crediton | 742 | 34 | 81 | **Critical** | 81% dup (good intro though) | Rewrite body to match strong intro |
| /ecu-remapping-cullompton | ECU-loc | ECU remapping | Cullompton | — | ECU Remapping Cullompton \| M5 Corridor | ECU Remapping in Cullompton | 750 | 34 | 81 | **Critical** | 81% dup | Regionalise into Mid Devon |
| /ecu-remapping-east-devon | ECU-loc | ECU remapping | East Devon | — | ECU Remapping East Devon \| Exeter, Sidmouth | ECU Remapping Across East Devon | 771 | 34 | 81 | **Critical** | Area page; overlaps towns | Keep as area hub; differentiate |
| /ecu-remapping-honiton | ECU-loc | ECU remapping | Honiton | — | ECU Remapping Honiton \| East Devon Mobile | ECU Remapping in Honiton | 758 | 34 | 81 | **Critical** | 81% dup | Regionalise into East Devon |
| /ecu-remapping-sidmouth | ECU-loc | ECU remapping | Sidmouth | — | ECU Remapping Sidmouth \| Mobile & Workshop | ECU Remapping in Sidmouth | 770 | 34 | 81 | **Critical** | 81% dup | Regionalise into East Devon |
| /ecu-remapping-south-hams | ECU-loc | ECU remapping | South Hams | — | ECU Remapping South Hams \| Mobile Remap | ECU Remapping Across the South Hams | 785 | 35 | 79 | **Critical** | Area page; overlaps towns | Keep as area hub; differentiate |
| /ecu-remapping-bideford | ECU-loc | ECU remapping | Bideford | — | ECU Remapping Bideford \| North Devon Stage | ECU Remapping in Bideford | 764 | 36 | 79 | **Critical** | 79% dup | Regionalise into North Devon |
| /ecu-remapping-north-devon | ECU-loc | ECU remapping | North Devon | — | ECU Remapping North Devon \| Barnstaple | ECU Remapping Across North Devon | 784 | 37 | 78 | **Critical** | Area page; overlaps towns | Keep as area hub; differentiate |
| /ecu-remapping-exeter | ECU-loc | ECU remapping | Exeter | — | ECU Remapping Exeter \| Stage 1 Tuning & Mob | ECU Remapping in Exeter | 878 | 39 | 72 | High | Major town, 72% dup | **Priority rewrite** — bespoke local page |
| /ecu-remapping-paignton | ECU-loc | ECU remapping | Paignton | — | ECU Remapping Paignton \| Stage 1 Tuning | ECU Remapping in Paignton | 871 | 39 | 72 | High | Major town, 72% dup | **Priority rewrite** |
| /ecu-remapping-plymouth | ECU-loc | ECU remapping | Plymouth | — | ECU Remapping Plymouth \| Stage 1 & Mobile | ECU Remapping in Plymouth | 884 | 39 | 72 | High | Major city, 72% dup | **Priority rewrite** |
| /ecu-remapping-torquay | ECU-loc | ECU remapping | Torquay | — | ECU Remapping Torquay \| Stage 1 & Mobile | ECU Remapping in Torquay | 874 | 39 | 72 | High | Major town, 72% dup | **Priority rewrite** |
| /ecu-remapping-totnes | ECU-loc | ECU remapping | Totnes | — | ECU Remapping Totnes \| Local Workshop | ECU Remapping in Totnes | 864 | 39 | 71 | High | Home town, 71% dup | **Priority rewrite** — strongest local proof available |
| /diesel-remapping-devon | Devon-svc | Diesel remapping | Devon | — | Diesel Remapping Devon \| Cars, Vans & 4x4s | Diesel Remapping Across Devon | 735 | 34 | 81 | **Critical** | Same template as towns | Tailor body to diesel; keep (high volume) |
| /performance-remapping-devon | Devon-svc | Performance remapping | Devon | — | Performance Remapping Devon \| Stage 1 & 2 | Performance Remapping Across Devon | 747 | 34 | 81 | **Critical** | Overlaps stage-1 page | Refocus on Stage 2 / hardware to differentiate |
| /4x4-remapping-devon | Devon-svc | 4x4 remapping | Devon | — | 4x4 Remapping Devon \| Land Rover, Hilux | 4x4 Remapping Across Devon | 752 | 34 | 80 | **Critical** | Same template | Tailor body to 4x4/towing; link to 4x4 vehicle pages |
| /petrol-remapping-devon | Devon-svc | Petrol remapping | Devon | — | Petrol Remapping Devon \| Stage 1 Tuning | Petrol Remapping Across Devon | 753 | 34 | 80 | **Critical** | Thin pair with diesel | Merge into diesel/petrol page or section; low standalone value |
| /stage-1-remaps-devon | Devon-svc | Stage 1 remap | Devon | — | Stage 1 Remaps Devon \| ECU Tuning | Stage 1 Remaps Across Devon | 762 | 35 | 79 | **Critical** | Overlaps hub+performance | Keep as primary "Stage 1 Devon"; tailor body |
| /fleet-vehicle-remapping-devon | Devon-svc | Fleet remapping | Devon | — | Fleet Vehicle Remapping Devon \| Commercial | Fleet Vehicle Remapping Across Devon | 744 | 35 | 80 | **Critical** | Same template | Keep (distinct B2B intent); tailor to fleet |
| /ecu-tuning-devon | Devon-svc | ECU tuning | Devon | — | ECU Tuning Devon \| Professional ECU Remap | ECU Tuning Across Devon | 756 | 35 | 79 | **Critical** | Synonym of /ecu-remapping | **Merge/canonicalise into /ecu-remapping** |
| /mobile-ecu-remapping-devon | Devon-svc | Mobile ECU remapping | Devon | — | Mobile ECU Remapping Devon \| We Come to You | Mobile ECU Remapping Across Devon | 780 | 36 | 79 | **Critical** | High value, high dup | **Priority rewrite** — make the canonical mobile page |
| /van-remapping-devon | Devon-svc | Van remapping | Devon | — | Van Remapping Devon \| Transit, Sprinter | Van Remapping Across Devon | 1084 | 56 | 54 | Medium | Best of the Devon-svc set | Keep; use as the template for the others |
| /bmw-m340i-remap | Vehicle | ECU remapping | — | BMW M340i | BMW M340i Remap \| Stage 1 Performance | BMW M340i Remap | 325 | 46 | 58 | High | Thin (325w) | Add depth (gains, gearbox, economy, Stage 2) |
| /ford-kuga-remap | Vehicle | ECU remapping | — | Ford Kuga | Ford Kuga Remap \| Stage 1 ECU Tuning Devon | Ford Kuga Remap | 347 | 46 | 55 | High | Thin | Add depth |
| /mercedes-a35-remap | Vehicle | ECU remapping | — | Mercedes A35 AMG | Mercedes A35 AMG Remap \| Stage 1 Tuning | Mercedes A35 AMG Remap | 329 | 46 | 60 | High | Thin | Add depth |
| /bmw-m140i-remap | Vehicle | ECU remapping | — | BMW M140i | BMW M140i Remap \| Stage 1 Performance | BMW M140i Remap | 328 | 47 | 56 | High | Priority vehicle but thin | **Priority rewrite** to 700–900w |
| /audi-rs3-remap | Vehicle | ECU remapping | — | Audi RS3 | Audi RS3 Remap \| Stage 1 Performance Tuning | Audi RS3 Remap | 336 | 47 | 55 | High | Thin | Add depth |
| /ford-mondeo-remap | Vehicle | ECU remapping | — | Ford Mondeo | Ford Mondeo Remap \| Stage 1 ECU Tuning | Ford Mondeo Remap | 349 | 47 | 55 | High | Thin | Add depth |
| /bmw-120d-remap | Vehicle | ECU remapping | — | BMW 120d | BMW 120d Remap \| Stage 1 ECU Tuning Devon | BMW 120d Remap | 329 | 48 | 57 | High | Thin | Add depth |
| /dacia-duster-remap | Vehicle | ECU remapping | — | Dacia Duster | Dacia Duster Remap \| Stage 1 Tuning Devon | Dacia Duster Remap | 344 | 48 | 56 | High | Thin, low search volume | Add depth or de-prioritise |
| /ford-fiesta-st-remap | Vehicle | ECU remapping | — | Ford Fiesta ST | Ford Fiesta ST Remap \| Stage 1 Performance | Ford Fiesta ST Remap | 344 | 49 | 57 | High | Thin | Add depth |
| /mercedes-a45-remap | Vehicle | ECU remapping | — | Mercedes A45 AMG | Mercedes A45 AMG Remap \| Stage 1 Tuning | Mercedes A45 AMG Remap | 353 | 49 | 55 | High | Thin | Add depth |
| /mercedes-c220-remap | Vehicle | ECU remapping | — | Mercedes C220d | Mercedes C220d Remap \| Stage 1 ECU Tuning | Mercedes C220d Remap | 338 | 49 | 56 | High | Thin | Add depth |
| /mercedes-c63-remap | Vehicle | ECU remapping | — | Mercedes C63 AMG | Mercedes C63 AMG Remap \| Stage 1 Tuning | Mercedes C63 AMG Remap | 346 | 49 | 55 | High | Thin | Add depth |
| /mercedes-e220-remap | Vehicle | ECU remapping | — | Mercedes E220d | Mercedes E220d Remap \| Stage 1 ECU Tuning | Mercedes E220d Remap | 335 | 49 | 56 | High | Thin | Add depth |
| /nissan-qashqai-remap | Vehicle | ECU remapping | — | Nissan Qashqai | Nissan Qashqai Remap \| Stage 1 Tuning | Nissan Qashqai Remap | 350 | 49 | 54 | High | Thin | Add depth |
| /peugeot-208-remap | Vehicle | ECU remapping | — | Peugeot 208 | Peugeot 208 Remap \| Stage 1 Tuning Devon | Peugeot 208 Remap | 335 | 49 | 57 | High | Thin | Add depth |
| /skoda-superb-remap | Vehicle | ECU remapping | — | Skoda Superb | Skoda Superb Remap \| Stage 1 Tuning Devon | Skoda Superb Remap | 345 | 49 | 56 | High | Thin | Add depth |
| /bmw-520d-remap | Vehicle | ECU remapping | — | BMW 520d | BMW 520d Remap \| Stage 1 ECU Tuning Devon | BMW 520d Remap | 342 | 50 | 55 | High | Thin | Add depth |
| /audi-a6-remap | Vehicle | ECU remapping | — | Audi A6 | Audi A6 Remap \| Stage 1 ECU Tuning Devon | Audi A6 Remap | 353 | 50 | 56 | High | Thin | Add depth |
| /mazda-cx-5-remap | Vehicle | ECU remapping | — | Mazda CX-5 | Mazda CX-5 Remap \| Stage 1 Tuning Devon | Mazda CX-5 Remap | 343 | 50 | 55 | High | Thin | Add depth |
| /peugeot-3008-remap | Vehicle | ECU remapping | — | Peugeot 3008 | Peugeot 3008 Remap \| Stage 1 Tuning Devon | Peugeot 3008 Remap | 347 | 50 | 55 | High | Thin | Add depth |
| /renault-clio-remap | Vehicle | ECU remapping | — | Renault Clio | Renault Clio Remap \| Stage 1 Tuning Devon | Renault Clio Remap | 341 | 50 | 56 | High | Thin | Add depth |
| /seat-ibiza-remap | Vehicle | ECU remapping | — | Seat Ibiza | Seat Ibiza Remap \| Stage 1 Tuning Devon | Seat Ibiza Remap | 336 | 50 | 57 | High | Thin | Add depth |
| /vauxhall-corsa-remap | Vehicle | ECU remapping | — | Vauxhall Corsa | Vauxhall Corsa Remap \| Stage 1 Tuning | Vauxhall Corsa Remap | 345 | 50 | 56 | High | Thin | Add depth |
| /audi-s3-remap | Vehicle | ECU remapping | — | Audi S3 | Audi S3 Remap \| Stage 1 Performance Tuning | Audi S3 Remap | 348 | 51 | 54 | High | Priority vehicle but thin | **Priority rewrite** to 700–900w |
| /ford-ranger-remap | Vehicle | ECU remapping | — | Ford Ranger | Ford Ranger Remap \| Stage 1 Tuning Devon | Ford Ranger Remap | 352 | 51 | 55 | High | Priority vehicle but thin | **Priority rewrite** |
| /ford-transit-custom-remap | Vehicle | ECU remapping | — | Ford Transit Custom | Ford Transit Custom Remap \| Van Tuning | Ford Transit Custom Remap | 357 | 51 | 55 | High | Priority vehicle but thin | **Priority rewrite** |
| /vw-golf-gtd-remap | Vehicle | ECU remapping | — | VW Golf GTD | VW Golf GTD Remap \| Stage 1 ECU Tuning | VW Golf GTD Remap | 347 | 51 | 53 | High | Thin | Add depth |
| /bmw-330d-remap | Vehicle | ECU remapping | — | BMW 330d | BMW 330d Remap \| Stage 1 ECU Tuning Devon | BMW 330d Remap | 355 | 51 | 53 | High | Thin; no mobile link | Add depth + link mobile |
| /bmw-x5-remap | Vehicle | ECU remapping | — | BMW X5 | BMW X5 Remap \| Stage 1 ECU Tuning Devon | BMW X5 Remap | 349 | 51 | 55 | High | Thin | Add depth |
| /ford-focus-st-remap | Vehicle | ECU remapping | — | Ford Focus ST | Ford Focus ST Remap \| Stage 1 Performance | Ford Focus ST Remap | 361 | 51 | 53 | High | Thin | Add depth |
| /vw-golf-gti-remap | Vehicle | ECU remapping | — | VW Golf GTI | VW Golf GTI Remap \| Stage 1 Tuning Devon | VW Golf GTI Remap | 343 | 51 | 52 | High | Thin | Add depth |
| /audi-q5-remap | Vehicle | ECU remapping | — | Audi Q5 | Audi Q5 Remap \| Stage 1 ECU Tuning Devon | Audi Q5 Remap | 369 | 51 | 53 | High | Thin | Add depth |
| /bmw-118d-remap | Vehicle | ECU remapping | — | BMW 118d | BMW 118d Remap \| Stage 1 ECU Tuning Devon | BMW 118d Remap | 349 | 51 | 54 | High | Thin | Add depth |
| /fiat-500-remap | Vehicle | ECU remapping | — | Fiat 500 & Abarth | Fiat 500 & Abarth Remap \| Stage 1 Tuning | Fiat 500 & Abarth Remap | 359 | 51 | 55 | High | Thin | Add depth |
| /fiat-ducato-remap | Vehicle | ECU remapping | — | Fiat Ducato | Fiat Ducato Remap \| Motorhome & Van Tuning | Fiat Ducato Remap | 359 | 51 | 53 | High | Thin | Add depth (motorhome angle) |
| /nissan-juke-remap | Vehicle | ECU remapping | — | Nissan Juke | Nissan Juke Remap \| Stage 1 Tuning Devon | Nissan Juke Remap | 352 | 51 | 53 | High | Thin | Add depth |
| /porsche-macan-remap | Vehicle | ECU remapping | — | Porsche Macan | Porsche Macan Remap \| Stage 1 Tuning Devon | Porsche Macan Remap | 349 | 51 | 53 | High | Thin | Add depth |
| /range-rover-evoque-remap | Vehicle | ECU remapping | — | Range Rover Evoque | Range Rover Evoque Remap \| Stage 1 Tuning | Range Rover Evoque Remap | 368 | 51 | 54 | High | Thin | Add depth |
| /range-rover-velar-remap | Vehicle | ECU remapping | — | Range Rover Velar | Range Rover Velar Remap \| Stage 1 Tuning | Range Rover Velar Remap | 365 | 51 | 54 | High | Thin | Add depth |
| /range-rover-vogue-remap | Vehicle | ECU remapping | — | Range Rover Vogue | Range Rover Vogue Remap \| Stage 1 Tuning | Range Rover Vogue Remap | 360 | 51 | 54 | High | Thin | Add depth |
| /renault-megane-remap | Vehicle | ECU remapping | — | Renault Megane | Renault Megane Remap \| Stage 1 Tuning | Renault Megane Remap | 351 | 51 | 54 | High | Thin | Add depth |
| /seat-leon-remap | Vehicle | ECU remapping | — | Seat Leon | Seat Leon Remap \| Stage 1 Tuning Devon | Seat Leon Remap | 347 | 51 | 54 | High | Thin | Add depth |
| /skoda-octavia-remap | Vehicle | ECU remapping | — | Skoda Octavia | Skoda Octavia Remap \| Stage 1 Tuning | Skoda Octavia Remap | 354 | 51 | 54 | High | Thin | Add depth |
| /toyota-hilux-remap | Vehicle | ECU remapping | — | Toyota Hilux | Toyota Hilux Remap \| Stage 1 Tuning Devon | Toyota Hilux Remap | 361 | 51 | 53 | High | Thin | Add depth (towing/off-road) |
| /toyota-land-cruiser-remap | Vehicle | ECU remapping | — | Toyota Land Cruiser | Toyota Land Cruiser Remap \| 4x4 Tuning | Toyota Land Cruiser Remap | 373 | 51 | 54 | High | Thin | Add depth |
| /vauxhall-astra-remap | Vehicle | ECU remapping | — | Vauxhall Astra | Vauxhall Astra Remap \| Stage 1 Tuning | Vauxhall Astra Remap | 353 | 51 | 55 | High | Thin | Add depth |
| /volvo-xc60-remap | Vehicle | ECU remapping | — | Volvo XC60 | Volvo XC60 Remap \| Stage 1 Tuning Devon | Volvo XC60 Remap | 357 | 51 | 54 | High | Thin | Add depth |
| /volvo-xc90-remap | Vehicle | ECU remapping | — | Volvo XC90 | Volvo XC90 Remap \| Stage 1 Tuning Devon | Volvo XC90 Remap | 343 | 51 | 54 | High | Thin | Add depth |
| /vw-tiguan-remap | Vehicle | ECU remapping | — | VW Tiguan | VW Tiguan Remap \| Stage 1 ECU Tuning Devon | VW Tiguan Remap | 358 | 51 | 49 | High | Thin | Add depth |
| /vw-transporter-remap | Vehicle | ECU remapping | — | VW Transporter | VW Transporter Remap \| Van Tuning Devon | VW Transporter Remap | 361 | 52 | 48 | High | Priority vehicle but thin | **Priority rewrite** |
| /audi-a3-remap | Vehicle | ECU remapping | — | Audi A3 | Audi A3 Remap \| Stage 1 ECU Tuning Devon | Audi A3 Remap | 373 | 52 | 52 | High | Thin | Add depth |
| /audi-a4-remap | Vehicle | ECU remapping | — | Audi A4 | Audi A4 Remap \| Stage 1 ECU Tuning Devon | Audi A4 Remap | 375 | 52 | 52 | High | Thin | Add depth |
| /range-rover-sport-remap | Vehicle | ECU remapping | — | Range Rover Sport | Range Rover Sport Remap \| Stage 1 Tuning | Range Rover Sport Remap | 377 | 52 | 52 | High | Thin | Add depth |
| /audi-a5-remap | Vehicle | ECU remapping | — | Audi A5 | Audi A5 Remap \| Stage 1 ECU Tuning Devon | Audi A5 Remap | 376 | 52 | 51 | High | Thin | Add depth |
| /citroen-berlingo-remap | Vehicle | ECU remapping | — | Citroen Berlingo | Citroen Berlingo Remap \| Van Tuning Devon | Citroen Berlingo Remap | 364 | 52 | 52 | High | Thin | Add depth |
| /land-rover-discovery-remap | Vehicle | ECU remapping | — | Land Rover Discovery | Land Rover Discovery Remap \| 4x4 Tuning | Land Rover Discovery Remap | 376 | 52 | 53 | High | Thin | Add depth |
| /nissan-navara-remap | Vehicle | ECU remapping | — | Nissan Navara | Nissan Navara Remap \| 4x4 Tuning Devon | Nissan Navara Remap | 361 | 52 | 52 | High | Thin | Add depth |
| /peugeot-boxer-remap | Vehicle | ECU remapping | — | Peugeot Boxer | Peugeot Boxer Remap \| Motorhome & Van | Peugeot Boxer Remap | 370 | 52 | 52 | High | Thin | Add depth |
| /renault-trafic-remap | Vehicle | ECU remapping | — | Renault Trafic | Renault Trafic Remap \| Van Tuning Devon | Renault Trafic Remap | 367 | 52 | 53 | High | Thin | Add depth |
| /vauxhall-vivaro-remap | Vehicle | ECU remapping | — | Vauxhall Vivaro | Vauxhall Vivaro Remap \| Van Tuning Devon | Vauxhall Vivaro Remap | 366 | 52 | 53 | High | Thin | Add depth |
| /vw-amarok-remap | Vehicle | ECU remapping | — | VW Amarok | VW Amarok Remap \| Stage 1 Diesel Tuning | VW Amarok Remap | 353 | 52 | 50 | High | Thin | Add depth |
| /vw-passat-remap | Vehicle | ECU remapping | — | VW Passat | VW Passat Remap \| Stage 1 ECU Tuning Devon | VW Passat Remap | 366 | 52 | 48 | High | Thin | Add depth |
| /mercedes-sprinter-remap | Vehicle | ECU remapping | — | Mercedes Sprinter | Mercedes Sprinter Remap \| Commercial Van | Mercedes Sprinter Remap | 381 | 53 | 51 | High | Priority vehicle but thin | **Priority rewrite** |
| /land-rover-defender-remap | Vehicle | ECU remapping | — | Land Rover Defender | Land Rover Defender Remap \| Stage 1 Tuning | Land Rover Defender Remap | 363 | 53 | 52 | High | Thin | Add depth |
| /mercedes-glc63-remap | Vehicle | ECU remapping | — | Mercedes GLC63 AMG | Mercedes GLC63 AMG Remap \| Stage 1 Tuning | Mercedes GLC63 AMG Remap | 450 | 53 | 50 | High | Thin | Add depth |
| /bmw-320d-remap | Vehicle | ECU remapping | — | BMW 320d | BMW 320d Remap \| Stage 1 ECU Tuning Devon | BMW 320d Remap | 453 | 54 | 50 | High | **#1 priority vehicle** | **Priority rewrite** to 800–1000w |
| /ford-transit-remap | Vehicle | ECU remapping | — | Ford Transit | Ford Transit Remap \| Commercial Van Tuning | Ford Transit Remap | 461 | 54 | 49 | High | Priority vehicle | **Priority rewrite** |
| /audi-s4-remap | Vehicle | ECU remapping | — | Audi S4 | Audi S4 Remap \| Stage 1 Performance Tuning | Audi S4 Remap | 469 | 54 | 50 | High | Thin | Add depth |
| /vw-golf-r-remap | Vehicle | ECU remapping | — | VW Golf R | VW Golf R Remap \| Stage 1 Performance | VW Golf R Remap | 345 | 57 | 46 | Medium | Least duplicate vehicle | Add depth |
| /ecu-remapping-locations | ECU-hub | ECU remapping | — | — | Mobile ECU Remapping Locations in Devon | Remapping Locations | 111 | 79 | 3 | Low | Thin hub (link index) | Add intro copy; it's a nav index |
| /ecu-remapping | ECU-hub | ECU remapping | — | — | ECU Remapping Devon \| Stage 1 & 2 Tuning | Professional ECU Remapping. | 1021 | 100 | 3 | Low | — | Keep as primary ECU hub |
| /contact | Core | — | — | — | Contact AutoCleanse \| DPF & Remapping | Contact AutoCleanse. | 94 | 77 | 3 | Low | Thin (conversion page) | Fine as-is |
| /how-it-works | Core | — | — | — | How DPF Cleaning Works \| AutoCleanse | How It Works. | 148 | 79 | 3 | Low | Thin | Could expand process detail |
| /about | Core | — | — | — | About AutoCleanse \| DPF & Remapping Devon | About AutoCleanse | 205 | 88 | 3 | Low | 0 inbound contextual links | Add trust content + link from key pages |
| /maintenance | Core | — | — | — | DPF Maintenance Guide \| AutoCleanse Devon | Why Annual DPF Maintenance Matters | 318 | 90 | 3 | Low | — | Keep |
| /services | Core | — | — | — | DPF Cleaning & ECU Remapping Services | Professional filter refurbishment | 389 | 91 | 3 | Low | Links to redirect /remapping | Keep; fix redirect link |
| /pricing | Core | — | — | — | DPF Cleaning & Remap Prices \| AutoCleanse | Straightforward pricing. | 415 | 92 | 3 | Low | Links to redirect /remapping | Keep; fix redirect link |
| /ecu-cloning | Core | — | — | — | ECU Cloning Devon \| Faulty ECU Replacement | ECU Cloning Devon. | 783 | 98 | 3 | Low | — | Keep; strong unique page |
| /adblue-repair-devon | Core | AdBlue | Devon | — | AdBlue Repair & Diagnostics Devon \| SCR | AdBlue Repair & Diagnostics in Devon | 1272 | 99 | 3 | Low | — | Keep; strong unique page |
| /book | Utility | — | — | — | Book Now \| AutoCleanse | What would you like to book? | 131 | 79 | 3 | Low | 0 inbound contextual links | Fine; add contextual links to it |
| /remapping-booking | Utility | — | — | — | Book a Remap \| ECU Remapping Booking | (none) | 101 | 79 | 3 | Low | No H1; links to redirect | Add H1; fix redirect link |
| /fuel-savings-calculator | Utility | — | — | — | Fuel Savings Calculator \| AutoCleanse | DPF Fuel Savings Calculator. | 191 | 80 | 3 | Low | 0 inbound contextual links | Link from DPF pages |
| /vehicle-performance-lookup | Utility | — | — | — | Vehicle Performance Lookup \| ECU Remap Data | Vehicle Performance Lookup. | 529 | 94 | 3 | Low | — | Keep; useful tool |
| /blog | Blog | — | — | — | Workshop Blog \| DPF, AdBlue & Remapping | Workshop Blog | 137 | 75 | 11 | Low | Thin index | Fine; grows with posts |
| /blog/adblue-no-start-countdown-sprinter | Blog | — | — | — | AdBlue no-start countdown on a Mercedes | AdBlue no-start countdown… | 498 | 91 | 3 | Low | — | Keep; strong unique post |
| /blog/blocked-dpf-ford-transit-custom | Blog | — | — | — | Blocked DPF on a Ford Transit Custom | Blocked DPF on a Ford Transit… | 581 | 93 | 4 | Low | — | Keep; strong unique post |
| / | Home | — | — | — | DPF Cleaning & ECU Remapping Devon | DPF Cleaning. Done right. | 1762 | 100 | 3 | Low | Links to redirect /remapping | Keep; fix redirect link |

---

## Highest Risk Pages

The 30 most thin/duplicate/doorway-style pages. **All 30 are from the two "RemappingLocation template" clusters** (ECU location + Devon service). Not a single hand-built page (DPF, core, blog, tools) appears here.

| # | URL | Cluster | Words | Uniq | Dup% | Risk | Nearest sibling (overlap) |
|---:|---|---|---:|---:|---:|---|---|
| 1 | /ecu-remapping-dawlish | ECU-loc | 748 | 30 | 83 | Critical | /ecu-remapping-teignmouth (75%) |
| 2 | /ecu-remapping-teignmouth | ECU-loc | 747 | 30 | 84 | Critical | /ecu-remapping-dawlish (75%) |
| 3 | /ecu-remapping-tavistock | ECU-loc | 761 | 31 | 82 | Critical | /ecu-remapping-brixham (74%) |
| 4 | /ecu-remapping-ashburton | ECU-loc | 754 | 31 | 82 | Critical | /ecu-remapping-dawlish (74%) |
| 5 | /ecu-remapping-brixham | ECU-loc | 749 | 31 | 83 | Critical | /ecu-remapping-tavistock (74%) |
| 6 | /ecu-remapping-buckfastleigh | ECU-loc | 756 | 31 | 83 | Critical | /ecu-remapping-newton-abbot (75%) |
| 7 | /ecu-remapping-dartmouth | ECU-loc | 753 | 31 | 82 | Critical | /ecu-remapping-salcombe (75%) |
| 8 | /ecu-remapping-salcombe | ECU-loc | 755 | 31 | 83 | Critical | /ecu-remapping-dartmouth (75%) |
| 9 | /ecu-remapping-newton-abbot | ECU-loc | 778 | 32 | 82 | Critical | /ecu-remapping-buckfastleigh (75%) |
| 10 | /ecu-remapping-ivybridge | ECU-loc | 774 | 32 | 81 | Critical | /ecu-remapping-brixham (73%) |
| 11 | /ecu-remapping-kingsbridge | ECU-loc | 768 | 33 | 81 | Critical | /ecu-remapping-salcombe (72%) |
| 12 | /ecu-remapping-tiverton | ECU-loc | 742 | 33 | 81 | Critical | /ecu-remapping-crediton (70%) |
| 13 | /ecu-remapping-axminster | ECU-loc | 745 | 33 | 82 | Critical | /ecu-remapping-brixham (71%) |
| 14 | /ecu-remapping-torbay | ECU-loc | 768 | 33 | 81 | Critical | /ecu-remapping-salcombe (72%) |
| 15 | /diesel-remapping-devon | Devon-svc | 735 | 34 | 81 | Critical | /4x4-remapping-devon (70%) |
| 16 | /performance-remapping-devon | Devon-svc | 747 | 34 | 81 | Critical | /petrol-remapping-devon (70%) |
| 17 | /4x4-remapping-devon | Devon-svc | 752 | 34 | 80 | Critical | /diesel-remapping-devon (70%) |
| 18 | /petrol-remapping-devon | Devon-svc | 753 | 34 | 80 | Critical | /performance-remapping-devon (70%) |
| 19 | /ecu-remapping-barnstaple | ECU-loc | 766 | 34 | 80 | Critical | /ecu-remapping-brixham (70%) |
| 20 | /ecu-remapping-okehampton | ECU-loc | 762 | 34 | 80 | Critical | /ecu-remapping-teignmouth (70%) |
| 21 | /ecu-remapping-crediton | ECU-loc | 742 | 34 | 81 | Critical | /ecu-remapping-tiverton (70%) |
| 22 | /ecu-remapping-cullompton | ECU-loc | 750 | 34 | 81 | Critical | /ecu-remapping-teignmouth (70%) |
| 23 | /ecu-remapping-east-devon | ECU-loc | 771 | 34 | 81 | Critical | /ecu-remapping-brixham (70%) |
| 24 | /ecu-remapping-honiton | ECU-loc | 758 | 34 | 81 | Critical | /ecu-remapping-brixham (71%) |
| 25 | /ecu-remapping-sidmouth | ECU-loc | 770 | 34 | 81 | Critical | /ecu-remapping-brixham (71%) |
| 26 | /stage-1-remaps-devon | Devon-svc | 762 | 35 | 79 | Critical | /performance-remapping-devon (70%) |
| 27 | /fleet-vehicle-remapping-devon | Devon-svc | 744 | 35 | 80 | Critical | /diesel-remapping-devon (69%) |
| 28 | /ecu-tuning-devon | Devon-svc | 756 | 35 | 79 | Critical | /petrol-remapping-devon (69%) |
| 29 | /ecu-remapping-south-hams | ECU-loc | 785 | 35 | 79 | Critical | /ecu-remapping-dawlish (69%) |
| 30 | /mobile-ecu-remapping-devon | Devon-svc | 780 | 36 | 79 | Critical | /performance-remapping-devon (67%) |

The 69 vehicle pages sit just below this list (uniqueness 46–57, "High"). They are **thin** rather than **doorway** — see the Vehicle audit below.

---

## Best Opportunity Pages

Ranked by **priority score = commercial value × improvement gap** (where a page can move the needle most for leads). This intentionally floats up pages that are both valuable *and* currently weak.

| # | URL | Cluster | Priority | Uniq | Risk |
|---:|---|---|---:|---:|---|
| 1 | /ecu-remapping-newton-abbot | ECU-loc | 72 | 32 | Critical |
| 2 | /mobile-ecu-remapping-devon | Devon-svc | 72 | 36 | Critical |
| 3 | /ecu-remapping-exeter | ECU-loc | 69 | 39 | High |
| 4 | /ecu-remapping-paignton | ECU-loc | 69 | 39 | High |
| 5 | /ecu-remapping-plymouth | ECU-loc | 69 | 39 | High |
| 6 | /ecu-remapping-torquay | ECU-loc | 69 | 39 | High |
| 7 | /ecu-remapping-totnes | ECU-loc | 69 | 39 | High |
| 8 | /stage-1-remaps-devon | Devon-svc | 67 | 35 | Critical |
| 9 | /dpf-cleaning-torquay | DPF-town | 66 | 60 | Medium |
| 10 | /dpf-cleaning-exeter | DPF-town | 65 | 61 | Medium |
| 11 | /dpf-cleaning-totnes | DPF-town | 64 | 64 | Medium |
| 12 | /dpf-cleaning | DPF-core | 64 | 76 | Low |
| 13 | /bmw-m140i-remap | Vehicle | 62 | 47 | High |
| 14 | /diesel-remapping-devon | Devon-svc | 61 | 34 | Critical |
| 15 | /dpf-cleaning-devon | DPF-core | 61 | 75 | Low |
| 16 | /audi-s3-remap | Vehicle | 60 | 51 | High |
| 17 | /ford-ranger-remap | Vehicle | 60 | 51 | High |
| 18 | /ford-transit-custom-remap | Vehicle | 60 | 51 | High |
| 19 | /vw-golf-gtd-remap | Vehicle | 60 | 51 | High |
| 20 | /vw-transporter-remap | Vehicle | 60 | 52 | High |

---

## Duplicate Content Patterns

**Pattern 1 — the RemappingLocation shell (affects all 29 ECU-location + all 9 Devon-service pages = 38 pages).** Source: `src/pages/RemappingLocation.tsx`. Every one of these pages renders the following **identical** blocks (only the town/service name is substituted):

- **6 service cards, verbatim:** "Stage 1 Remap / Stage 2 Remap / Economy Remap / Van & Commercial / Custom / Fleet Map / DPF Clean + Remap Bundle" — ~90 identical words. (These cards are *not* tailored to the page, so the petrol page shows "Economy Remap – diesel-focused" and the 4x4 page shows "Van & Commercial".)
- **"Professional ECU Tuning – Not Just a Flash and Go"** why-us block — ~110 identical words.
- **6-item trust list** ("Pre and post-remap diagnostic check included", "Real vehicle footage…", etc.) — identical.
- **Mobile callout** ("Mobile Remapping Available in {X}") — identical except the town name + one distance phrase.
- **"Areas Near {X} We Also Cover"** heading + tag chips — identical structure.
- **CTA + "Request a Callback"** enquiry form — identical.
- **Repeated H2s:** `repeatedH2Frac = 1.0` for all 24 small-town/service pages (every heading is templated). The 5 major towns score 0.88 only because they get two extra sections (`DpfTrustSignal`, `RecentRemaps`).

Net effect: only the **intro paragraph (~90 words)** and the **5 FAQs** are page-specific. Roughly **70–84% of the rendered body is shared** with sibling pages after names are stripped.

**Pattern 2 — the VehicleRemap shell (affects all 69 vehicle pages).** Source: `src/pages/VehicleRemap.tsx`. Identical blocks: the "Professional ECU Tuning in Devon / What's Included" section (5 process bullets), the "Mobile Remapping Available" card, and the CTA ("Transform Your {make} Today"). Shared ≈ 50% of the (short) body. **Unlike Pattern 1, the unique core is substantial and genuinely useful:** a per-engine stock-vs-remap power/torque table with MPG gains, plus mostly model-specific FAQs. This is why these are "thin" not "doorway".

**Pattern 3 — repeated FAQ answers.** A handful of generic FAQs recur across pages with only light edits: "Is ECU remapping safe?", "What's the difference between Stage 1 and Stage 2?", "Will remapping void my insurance?", and "Do you offer mobile remapping in {X}?". On the location pages these generic FAQs are ~2 of every 5–6; the rest are genuinely local. On vehicle pages the recurring one is "Do you offer mobile remapping across Devon?".

**Pattern 4 — repeated trust/review block.** The Google review quote _"Auto Cleanse removed, cleaned and replaced my dpf effectively and promptly…"_ and a "Trusted for DPF Cleaning" block appear on all 6 DPF town pages (fine as a trust element, but it's the same proof everywhere).

**Meta patterns:** Location meta descriptions almost all open "ECU remapping in {Town}…"; vehicle meta descriptions open "{Vehicle} ECU remapping…". Titles are actually reasonably varied (14 distinct title shapes across 27 ECU-location pages; 9/9 distinct across Devon-service). **Titles/metas are not the core problem — the body copy is.**

---

## Keyword Cannibalisation Risks

| Overlapping pages | Nature of overlap | Which should be primary | Recommendation |
|---|---|---|---|
| **`/dpf-cleaning` vs `/dpf-cleaning-devon`** | **Both title tags literally say "DPF Cleaning Devon".** Both target the money term. | `/dpf-cleaning` (the hub — higher priority, nav-linked, contains the "DPF Cleaning by Location" section). | **Fix now.** Keep `/dpf-cleaning` as the "DPF cleaning Devon / near me" primary. Re-angle `/dpf-cleaning-devon` to a *Devon-wide collection / trade & fleet* page with a different title, **or** 301/canonical it into `/dpf-cleaning`. |
| **`/blocked-dpf-cleaning-devon` vs `/dpf-cleaning-devon` vs `/dpf-diagnostics-devon`** | Three Devon DPF pages with overlapping "blocked/clean/diagnose" intent. Currently *reasonably* differentiated (uniqueness 85/86/75). | `/dpf-cleaning` for the transactional term; `/blocked-…` for symptom/limp-mode queries; `/dpf-diagnostics-…` for "diagnose before replace". | Keep all three but sharpen each to one intent and interlink them explicitly. Low urgency. |
| **`/ecu-remapping` vs `/ecu-tuning-devon`** | `/ecu-tuning-devon` is a near-synonym landing page with the same template. | `/ecu-remapping` (the hub, 1021 words, uniqueness 100). | **Merge/canonicalise `/ecu-tuning-devon` into `/ecu-remapping`** (add a "also called ECU tuning/chip tuning" section). Weakest of the Devon-service set. |
| **`/ecu-remapping` vs `/mobile-ecu-remapping-devon`** | Every ECU-location page *and* the hub already advertise mobile; the dedicated mobile page competes with all of them. | `/mobile-ecu-remapping-devon` should own the "mobile" query specifically; `/ecu-remapping` owns the head term. | Keep the mobile page but make it genuinely distinct (mobile process, what's needed on-site, coverage map). Point the "Mobile Remapping Available" callouts on the 29 location pages **to it**. |
| **`/stage-1-remaps-devon` vs `/performance-remapping-devon` vs `/ecu-remapping`** | Stage-1 and performance pages are ~70% identical and both overlap the hub. | `/stage-1-remaps-devon` = "Stage 1 Devon"; `/performance-remapping-devon` = Stage 2 / hardware / dyno. | Differentiate performance → Stage 2. Keep Stage 1 as the primary Stage-1 page (it already receives 75 internal links from the vehicle pages). |
| **`/diesel-remapping-devon` vs `/petrol-remapping-devon`** | A near-mirror pair separated only by intro; bodies ~identical. | `/diesel-remapping-devon` (diesel is the higher-volume, core business). | Keep diesel; **merge petrol into it (or into `/ecu-remapping`) or reduce petrol to a distinct, genuinely petrol-specific page.** |
| **Vehicle remap pages vs `/ecu-remapping` / `/stage-1-remaps-devon`** | Generic remapping phrasing overlaps, but each vehicle page has unique data. | The vehicle page for its `{make} {model} remap` query; the hub for generic terms. | **Leave as-is structurally**; the unique engine data prevents true cannibalisation. Just add depth + better internal links. |
| **`/ecu-remapping-torbay` / `-south-hams` / `-east-devon` / `-north-devon` vs their constituent town pages** | Area pages overlap the towns they contain (e.g. Torbay vs Torquay/Paignton/Brixham). | Town pages for town queries; area pages for the region query. | Keep area pages as **hubs that link down to the town pages** and carry area-level (not town-level) copy. |

---

## Internal Linking Issues

Internal-link counts below are **contextual links inside page body only** (nav/footer excluded), so they reflect editorial link equity, not site chrome.

**Weakly-linked commercial pages (contextual inbound links):**
- DPF town pages are starved: `/dpf-cleaning-totnes` (1), `/dpf-cleaning-exeter` (1), `/dpf-cleaning-plymouth` (1), `/dpf-cleaning-torquay` (2), `/dpf-cleaning-paignton` (2), `/dpf-cleaning-newton-abbot` (3).
- The DPF hub `/dpf-cleaning` itself only has **3** contextual inbound links; `/mobile-ecu-remapping-devon` only **3**.
- Priority vehicle `/bmw-m140i-remap` has **2**.
- **0 contextual inbound links:** `/about`, `/book`, `/fuel-savings-calculator` (they rely on nav only).

**Structural gaps (verified across the cluster):**
- **0 / 69 vehicle pages link to `/mobile-ecu-remapping-devon`.** (They all link to `/ecu-remapping`, `/stage-1-remaps-devon` and `/ecu-remapping-locations` via the template — so the mobile page is invisible to the largest cluster on the site.)
- **0 / 29 ECU-location pages link to any vehicle remap page**, and **0 / 29 link to any Devon-service page.** Location pages only link to 3 sibling towns + the hub. No topical cross-linking between "ECU remapping Exeter" and "BMW 320d remap".
- **DPF town pages link to `/remapping`** — a **301 redirect** to `/ecu-remapping`. Also on `/`, `/services`, `/pricing`, `/remapping-booking`. Internal links should point at the final URL.
- DPF town pages under-link the rest of the DPF cluster: e.g. `/dpf-cleaning-totnes` links only to `/services`, `/why-clean`, `/postal-dpf` — not to `/dpf-cleaning`, `/dpf-diagnostics-devon`, `/blocked-dpf-cleaning-devon` or `/pricing`. `/dpf-cleaning-newton-abbot` is the exception (links to 9 relevant pages) and should be the model.

**Quick wins:**
1. Add a "Popular vehicles we remap" block (4–6 links) to every ECU-location page → feeds link equity to priority vehicle pages and creates topical relevance.
2. Add `/mobile-ecu-remapping-devon` to the vehicle template's "Mobile Remapping Available" card (currently links only to `/ecu-remapping-locations`).
3. Give every DPF town page a consistent "DPF services" link cluster: `/dpf-cleaning`, `/dpf-diagnostics-devon`, `/blocked-dpf-cleaning-devon`, `/pricing`, `/postal-dpf`, `/book`.
4. Have `/dpf-cleaning` (hub) link out to all 6 DPF town pages (strengthen the "DPF Cleaning by Location" section) and have each town link back — a clean hub-and-spoke.
5. Repoint all `/remapping` and `/vehicle-remapping` internal links to `/ecu-remapping` and `/vehicle-performance-lookup`.
6. Add contextual links to `/about`, `/fuel-savings-calculator` (from DPF pages) and `/pricing` from the vehicle template.

---

## Service Accuracy Issues

Overall the site is **honest and accurate** — this is a strength. Specific checks:

| Check | Result |
|---|---|
| Any page implying **mobile DPF cleaning**? | **No.** 0 pages. The "Mobile Remapping" strings on DPF pages are only the enquiry-form service dropdown. DPF pages consistently describe **workshop / off-vehicle** cleaning: "collect from {town}, deep clean at our Totnes workshop, and return". |
| "**Free diagnostics**" anywhere? | **No.** 0 pages. Consistent with diagnostics being paid. |
| **DPF cleaning vs replacement** confusion? | **Clear.** Multiple pages explicitly contrast "cleaning vs replacement" and position cleaning as the cheaper alternative. Good. |
| **DPF removal/delete** wording? | Appears on 13 pages but in the correct sense (postal "remove your DPF, send it to us" = physically removing the filter for off-vehicle cleaning; and "cleaning beats replacement"). No page promotes an **illegal DPF delete/removal for road use**. Low risk — but keep an eye that "removal" is always clearly "remove to clean & refit", not "delete". |
| **Same-day** claims | 18 pages, incl. all DPF town pages. **Body copy is properly hedged** ("same-day return **where possible**", "for filters received **before 10am**"). However **title tags are flat**: "DPF Cleaning Totnes \| Same-Day Drop-Off", "…Newton Abbot \| Same-Day Turnaround", "DPF Cleaning Devon \| Same-Day Return". ⚠️ *Verify these are reliably deliverable*; a title-tag promise is read as a guarantee. |
| **Mobile ECU remapping** honesty | Accurately presented as available across Devon, with distance notes and "subject to slot availability" caveats. Good. Workshop base (Totnes) is stated. |
| "Mechanics available full-time / same-day availability" over-promise | Not found. Pages consistently say "by appointment" and "subject to availability". |
| Distance / service-area honesty | Location pages state the distance from Totnes (e.g. "approximately 50 miles" for Barnstaple) and lean on mobile for far areas — honest. |

**Only action:** sanity-check that the flat "Same-Day" title-tag claims on the DPF pages are always achievable, or soften to match the hedged body copy ("Fast Turnaround" / "Often Same-Day").

---

## Recommended Improved Page Structures

### 1. DPF location page (e.g. `/dpf-cleaning-torquay`)
1. **H1:** `DPF Cleaning in {Town}` (or "Near {Town}" for satellite towns).
2. **Intro (unique):** local framing — collection route, drive time from Totnes, who we serve here (garages, fleets, drivers).
3. **How our workshop DPF clean works** (off-vehicle, METclean, before/after flow rates) — can be shared but should reference the town's collection logistics.
4. **DPF cleaning cost for {Town} drivers** — a real price line ("from £{X}") + "vs replacement" comparison.
5. **Local collection & turnaround** — cut-off time, same-day *where achievable*, drop-off option.
6. **Symptoms your DPF needs attention** (short, can be shared).
7. **2–3 {Town}-specific FAQs** (e.g. "Do you collect from {suburb}?", "I run a garage in {Town} — do you do trade DPF cleaning?").
8. **Trust:** a review, before/after photo, "hundreds of filters cleaned".
9. **Internal links:** `/dpf-cleaning` (hub), `/dpf-diagnostics-devon`, `/blocked-dpf-cleaning-devon`, `/pricing`, `/postal-dpf`, `/book`.
10. **CTA + enquiry form.**

### 2. ECU remapping location page (e.g. `/ecu-remapping-exeter`)
1. **H1:** `ECU Remapping in {Town}`.
2. **Intro (unique, local):** roads, terrain, typical local vehicles (keep the good ones you already have).
3. **≥250 words of genuinely local content** replacing the generic 6-card grid: what local drivers remap and why (commuters on the A38, tradespeople, farmers, etc.), a local job example/case study, mobile vs workshop for *this* town.
4. **Mobile remapping in {Town}** — link to `/mobile-ecu-remapping-devon`.
5. **Popular vehicles we remap in {Town}** — 4–6 links to relevant vehicle pages (new — fixes the 0/29 gap).
6. **Areas near {Town} we cover** (keep).
7. **3–5 {Town}-specific FAQs** — drop the generic "is remapping safe" duplicates in favour of local ones.
8. **Reviews** (ideally from that town for major towns).
9. **Internal links:** `/ecu-remapping`, `/mobile-ecu-remapping-devon`, `/stage-1-remaps-devon`, 3 sibling towns, 4+ vehicle pages.
10. **CTA + enquiry form.**

### 3. Devon service-type remap page (e.g. `/van-remapping-devon`)
1. **H1:** `{Service} Across Devon`.
2. **Intro (unique to the service).**
3. **Service-specific value section** — *tailored* cards, not the generic 6 (e.g. the van page: economy, payload pulling power, AdBlue/DPF considerations, popular vans).
4. **Who it's for / typical results for this service** (real numbers).
5. **Proof relevant to this service** — e.g. van page links to Transit/Sprinter/Transporter vehicle pages; 4x4 page links to Defender/Hilux/Ranger.
6. **Service-specific FAQs.**
7. **Internal links:** `/ecu-remapping`, `/mobile-ecu-remapping-devon`, relevant vehicle pages, relevant town pages.
8. **Tailored CTA** (e.g. "Book your van in" vs "Book a fleet assessment").

### 4. Vehicle remap page (e.g. `/bmw-320d-remap`)
1. **H1:** `{Vehicle} Remap`.
2. **Intro (unique).**
3. **Engine options table (keep — this is the unique asset).**
4. **NEW: "What to expect from a {Vehicle} remap"** — 150–250 words: real-world gains narrative, which engine variant benefits most, gearbox considerations (DSG/torque-converter limits), economy expectations, Stage 1 vs Stage 2 suitability.
5. **Our process + diagnostics-first note** (health check before flashing).
6. **Legal/insurance disclaimer** (declare to insurer; road-legal Stage 1; not for off-road-only deletes).
7. **Model-specific FAQs** (keep).
8. **Internal links:** `/ecu-remapping`, `/mobile-ecu-remapping-devon`, most relevant location page, related vehicles.
9. **CTA.**

---

## Priority Rewrite Plan

### Phase 1 — Top 10 (highest value × biggest gap; do first)
1. **`/dpf-cleaning` + `/dpf-cleaning-devon`** — resolve the "DPF Cleaning Devon" title clash; make `/dpf-cleaning` the single primary for "DPF cleaning Devon / near me". *(Fast, high value — counts as the top item.)*
2. `/ecu-remapping-torquay` — bespoke local rewrite.
3. `/ecu-remapping-exeter` — bespoke local rewrite.
4. `/ecu-remapping-newton-abbot` — bespoke local rewrite (closest town, highest priority score).
5. `/mobile-ecu-remapping-devon` — make it the genuinely-distinct canonical mobile page.
6. `/dpf-cleaning-torquay` — deepen + interlink + fix redirect link.
7. `/dpf-cleaning-totnes` — deepen (home town) + interlink.
8. `/dpf-cleaning-exeter` — deepen + interlink.
9. `/bmw-320d-remap` — flagship vehicle, expand to 800–1000 words.
10. `/vw-transporter-remap` — flagship van, expand.

### Phase 2 — Next 20
- ECU major/near towns: `/ecu-remapping-plymouth`, `/ecu-remapping-paignton`, `/ecu-remapping-totnes`, `/ecu-remapping-barnstaple` (N. Devon flagship).
- Devon-service differentiation: `/stage-1-remaps-devon`, `/diesel-remapping-devon`, `/van-remapping-devon` (already best), `/4x4-remapping-devon`, `/fleet-vehicle-remapping-devon`, `/performance-remapping-devon` (→ Stage 2).
- Priority vehicles: `/ford-transit-custom-remap`, `/ford-ranger-remap`, `/bmw-m140i-remap`, `/audi-s3-remap`, `/mercedes-sprinter-remap`, `/ford-transit-remap`, `/vw-golf-gtd-remap`, `/land-rover-defender-remap`, `/bmw-330d-remap`, `/audi-a3-remap`.

### Phase 3 — Lower priority (long tail)
- Remaining ~40 vehicle pages: batch-add the "what to expect" depth section + disclaimer + internal links via the template (a single template change lifts all 69 at once).
- Remaining small-town ECU pages not merged in Phase 4: rewrite bodies to match their (often good) intros.

### Phase 4 — Prune / merge / canonicalise / noindex candidates
- **Delete the stale orphan `dist/fuel-economy-remaps-devon/`** and add a `dist/` clean step to the prerender script so old routes don't linger.
- **Merge/canonicalise `/ecu-tuning-devon` → `/ecu-remapping`** (synonym page).
- **Merge/canonicalise `/petrol-remapping-devon` → `/diesel-remapping-devon`** (or into `/ecu-remapping`) unless genuinely petrol-specific content is added.
- **Consider `/dpf-cleaning-devon`** — differentiate or canonicalise to `/dpf-cleaning`.
- **Regionalise the small-town ECU long tail** (Dawlish, Teignmouth, Ashburton, Brixham, Buckfastleigh, Dartmouth, Salcombe, Ivybridge, Axminster, Cullompton, Honiton, Sidmouth, Bideford): either invest in genuinely unique local copy, or fold the weakest into the existing area hubs (`/ecu-remapping-torbay`, `-south-hams`, `-east-devon`, `-north-devon`) and 301 the thin ones. **Do not simply noindex** — they're in the sitemap and some carry local links; decide per-town by search demand.

---

## Example Improvements

### 1. `/dpf-cleaning-devon`
- **Better title:** `DPF Cleaning Collection Across Devon | Trade & Fleet | AutoCleanse` (stops clashing with `/dpf-cleaning`).
- **Better meta:** `Devon-wide DPF cleaning with free local collection & return from your garage or depot. Trade rates, fleet turnaround, detailed flow-rate reports. Based in Totnes.`
- **Better H1:** `Devon-Wide DPF Cleaning — Collection & Return`
- **Suggested H2s:** Our Devon collection routes & drive times · Trade & fleet DPF cleaning · What our workshop clean includes (flow-rate report) · DPF cleaning vs replacement — the cost case · Turnaround & same-day (where achievable) · Areas we collect from.
- **Unique content ideas:** a map/list of collection routes with typical days; a trade-account/volume pitch; a genuine flow-rate before/after example with numbers.
- **FAQ ideas:** "Do you offer trade rates for garages?" · "How do you collect and return the filter?" · "What's your turnaround for a fleet of vans?" · "Do I get a report?"
- **Internal links to add:** `/dpf-cleaning` (hub), `/dpf-diagnostics-devon`, `/postal-dpf`, `/pricing`, the 6 DPF town pages.
- **Proof/trust:** flow-rate before/after, fleet testimonial, count of filters cleaned. *(Or, if a distinct angle can't be sustained, canonicalise to `/dpf-cleaning`.)*

### 2. `/dpf-cleaning-torquay`
- **Better title:** `DPF Cleaning Torquay & Torbay | Collection & Return | AutoCleanse`
- **Better meta:** `Professional off-vehicle DPF cleaning for Torquay, Paignton & Brixham. We collect, deep-clean at our Totnes workshop and return — often same day. From £{X}.`
- **Better H1:** `DPF Cleaning in Torquay`
- **Suggested H2s:** Local DPF collection — Torquay & Torbay · How our off-vehicle clean works · DPF cleaning cost for Torquay drivers · Trade & fleet DPF cleaning in Torbay · Signs your DPF is blocking · Torquay DPF cleaning FAQs.
- **Unique content:** Torbay collection route + drive time; nod to local trade/garages; a local job example ("a Torquay taxi Insignia we recovered from limp mode").
- **FAQ ideas:** "Do you collect from Babbacombe/St Marychurch?" · "My garage is in Torquay — do you do trade DPF cleaning?" · "Torquay to Totnes — can I just drop it off?"
- **Internal links to add:** `/dpf-cleaning`, `/dpf-diagnostics-devon`, `/blocked-dpf-cleaning-devon`, `/pricing`, `/book`; **fix the `/remapping` link → `/ecu-remapping`**.
- **Proof/trust:** Torbay review, before/after flow numbers, price transparency.

### 3. `/mobile-ecu-remapping-devon`
- **Better title:** `Mobile ECU Remapping Devon | We Come to You | AutoCleanse`
- **Better meta:** `Mobile ECU remapping across Devon — we tune your car, van or 4x4 at your home or work. Same OBD/bench kit as our Totnes workshop. Pre & post diagnostics included.`
- **Better H1:** `Mobile ECU Remapping Across Devon`
- **Suggested H2s:** How mobile remapping works · What we need on-site (power, ~2 hours, off-road parking) · Where we cover (map + distance from Totnes) · Mobile vs workshop — which is right for you · What we can remap on-site (and what needs the workshop) · Mobile remapping FAQs.
- **Unique content ideas:** genuinely distinct "mobile" content — the on-site process, equipment carried, coverage map, honest limits (Stage 2 / bench-only jobs at the workshop). This is what separates it from the 29 town pages.
- **FAQ ideas:** "What do you need at my house?" · "How long does a mobile remap take?" · "Do you charge extra for mobile?" · "Can you do a Stage 2 remap mobile?" · "How far into Devon do you travel?"
- **Internal links to add:** `/ecu-remapping`, `/stage-1-remaps-devon`, `/ecu-remapping-locations`, the major town pages; **receive** links from the "Mobile Remapping Available" callouts on all 29 town pages and all 69 vehicle pages.
- **Proof/trust:** photos of the mobile setup on a driveway, a mobile-job review, coverage map.

### 4. `/ecu-remapping-exeter`
- **Better title:** `ECU Remapping Exeter | Stage 1 & Mobile Tuning | AutoCleanse` (fine as-is).
- **Better meta:** `ECU remapping in Exeter & East Devon — Stage 1 power/economy remaps for cars, vans & diesels. Mobile to your door or workshop in Totnes. Diagnostics included.`
- **Better H1:** `ECU Remapping in Exeter`
- **Suggested H2s:** Remapping for Exeter drivers (A38/A380 commuters, company vans) · What Exeter customers remap most · Mobile remapping in Exeter · Popular vehicles we remap in Exeter · Areas near Exeter we cover · Exeter remapping FAQs · Reviews.
- **Unique content ideas:** replace the generic 6-card grid with 250+ words on Exeter driving (M5/A30 corridor, high-mileage reps, city taxis), a real local before/after (dyno figure), and a short "why mobile suits Exeter commuters" note.
- **FAQ ideas:** "Do you come to me in Exeter or do I drive to Totnes?" · "Best route Exeter → Totnes workshop?" · "Can you remap my company van in Exeter?" · "Do you cover Exmouth/Topsham/Cranbrook?"
- **Internal links to add:** `/mobile-ecu-remapping-devon`, `/stage-1-remaps-devon`, 4–6 vehicle pages (BMW 320d, Audi A4, VW Transporter, Ford Transit Custom, Ford Ranger), sibling towns.
- **Proof/trust:** an Exeter-area review, dyno graph, "X remaps completed in the Exeter area".

### 5. `/bmw-320d-remap`
- **Better title:** `BMW 320d Remap | Stage 1 Tuning Gains & Prices | AutoCleanse Devon`
- **Better meta:** `BMW 320d Stage 1 remap in Devon — up to +45bhp/+70Nm and better MPG on the N47/B47. Real gains by engine, gearbox notes, diagnostics included. Workshop or mobile.`
- **Better H1:** `BMW 320d Remap`
- **Suggested H2s:** BMW 320d engine options & gains (keep table) · What to expect from a 320d remap (N47 vs B47, 184 vs 190) · Economy: real-world MPG after a 320d remap · Gearbox: ZF8 auto vs manual considerations · Stage 1 vs Stage 2 on the 320d · Our process & diagnostics-first check · Insurance & legal · BMW 320d remap FAQs.
- **Unique content ideas:** engine-code specifics (N47D20 vs B47D20), the ZF 8-speed's headroom, EGR/DPF/swirl-flap health notes for high-mileage 320ds, expected MPG on a motorway commute, why a health check matters on this engine.
- **FAQ ideas:** "How much power will my 320d gain?" · "Is a 320d remap safe on the N47/B47?" · "Will it improve MPG?" · "Can you remap the ZF8 auto too?" · "Do you check for swirl-flap/EGR issues first?" · "Can you remap my 320d at home in Devon?"
- **Internal links to add:** `/ecu-remapping`, `/mobile-ecu-remapping-devon`, `/stage-1-remaps-devon`, `/dpf-diagnostics-devon` (high-mileage diesel angle), nearest big-town page, related BMWs (330d, 520d, M140i).
- **Proof/trust:** a 320d before/after dyno or logged figures, a 320d owner review, "declare to your insurer" note.

---

## Cluster-Specific Audit (task sections A–D)

### A) ECU location pages (`/ecu-remapping-<town>`, 29)
- **Too similar? Yes — critically.** 67–75% body overlap after town-name stripping; every H2 identical. This is the site's biggest doorway risk.
- **Useful local content?** Only in the intro (~90 words), which is often genuinely good (Crediton/Tiverton/Okehampton/Sidmouth read as locally written). The other ~85% is shared.
- **Mobile explained honestly?** Yes — "mobile available, subject to slot availability", distance from Totnes stated.
- **Nearby areas mentioned naturally?** Yes (tag chips + FAQs).
- **Link to main ECU page + vehicle pages?** Links to `/ecu-remapping` (breadcrumb) and `/ecu-remapping-locations`: yes. **To vehicle pages: 0/29 (gap). To `/mobile-ecu-remapping-devon`: no (gap).**
- **Major towns deserve stronger unique content?** Yes — Torquay, Exeter, Newton Abbot, Plymouth, Paignton, Totnes should each become a bespoke, deeper page. They currently score only marginally better than the tiny villages.

### B) Devon service-type remap pages (9)
- **Distinct search intent?** The **intros** are distinct (diesel vs petrol vs van vs fleet vs 4x4 vs performance vs stage-1 vs mobile vs tuning). The **bodies are not** — same template, same untailored 6 service cards, ~70% overlap.
- **Differences clear enough?** No — a user landing on the petrol page sees diesel-economy cards; the 4x4 page shows van cards. The pages don't "feel" about their own topic below the fold.
- **Internal links sensible?** Partially. `/stage-1-remaps-devon` is well-linked (75 inbound from vehicle pages). Others are weakly linked and don't link to the relevant vehicle pages (e.g. van page should link to Transit/Sprinter/Transporter).
- **CTAs tailored?** No — identical CTA on all nine.
- **Verdict:** keep the distinct-intent ones (mobile, diesel, van, fleet, stage-1) and tailor their bodies; **merge/canonicalise `/ecu-tuning-devon`** and reconsider `/petrol-remapping-devon` and `/performance-remapping-devon` (→ Stage 2).

### C) DPF pages (12)
- **Competing for "dpf cleaning devon":** both `/dpf-cleaning` and `/dpf-cleaning-devon` (title clash). `/dpf-cleaning` should win.
- **Competing for "dpf cleaning near me":** `/dpf-cleaning` (it has "DPF Cleaning by Location" + collection framing) and the town pages for their own town.
- **Town pages unique enough?** Reasonably — this is the **best-localised location cluster** (town-specific H2s, collection-route framing, ~35% overlap). `/dpf-cleaning-newton-abbot` is the strongest (1082 words, FAQ + diagnostics). The other five are a bit thin (~630–660 words) and 4 share the flat title "DPF Cleaning {Town} | AutoCleanse Devon".
- **Devon/blocked/diagnostics cannibalising?** Mild and manageable — they're differentiated (85/86/75 uniqueness). Sharpen intents and interlink.
- **Workshop-based cleaning clear?** Yes — consistently explained (off-vehicle, collect/clean/return, postal). **No mobile-DPF confusion.**
- **Price/process/diagnostics/symptoms/outcomes explained?** Mostly — process and symptoms are strong; **pricing is inconsistent** (present on Torquay/Exeter/Plymouth/Paignton/Newton Abbot, absent on Totnes and the hubs). Standardise a price line.
- **Trust/proof?** Present (reviews, "cleaning vs replacement"), but the **same** review recurs everywhere — vary it.
- **FAQs unique or repeated?** Newton Abbot has a proper FAQ; most town pages rely on H2 sections rather than FAQs. Add 2–3 unique FAQs each.

### D) Vehicle remap pages (69)
- **Mostly duplicate with only names changed?** **No — this is the key nuance.** ~50% templated scaffolding, but each has a **genuinely unique data core** (per-engine stock-vs-remap BHP/Nm/MPG table) and mostly model-specific FAQs. They are **thin, not doorway.**
- **Vehicle-specific content?** Yes — the engine tables and most FAQs are specific and buyer-useful.
- **Targeting useful searches?** Yes — "{make}{model} remap" is high-intent. The priority set (320d, M140i, Transporter, Transit Custom, Ranger, S3, Golf GTD/R, Sprinter) is well chosen.
- **Enough on gains/variants/gearbox/economy/Stage-1 suitability/diagnostics?** **Partially** — gains and variants: yes (table + some FAQs). Gearbox limits, economy narrative, Stage-1-vs-2 guidance, diagnostics-first: **thin/inconsistent.** This is the depth to add.
- **Disclaimers/legal wording?** **Largely missing** — add an insurance-declaration + road-legal line (especially on performance models and any "delete" temptation).
- **Link to ECU remapping / mobile ECU remapping?** `/ecu-remapping`: yes (69/69). `/stage-1-remaps-devon`: yes (69/69). **`/mobile-ecu-remapping-devon`: 0/69 (gap to fix in the template).**
- **Groups to improve first:** the named priority set, then the diesel volume sellers (320d/330d, A4/A3, Transit/Transporter/Sprinter, Ranger/Hilux, Defender/Discovery).

---

## Appendix — Notes & caveats

- **Stale orphan:** `dist/fuel-economy-remaps-devon/index.html` is not a live route (not in `entry-server.tsx`/data). It's excluded from this audit. **Recommend deleting the folder and adding a `dist/` clean-and-rebuild step** so retired routes don't leave orphaned files that can still be served directly.
- **Robots/index status:** no page carries a `noindex` robots meta — all 137 are indexable (consistent with the prior sitemap audit). Canonicals are self-referential and correct on every page checked.
- **Schema:** location pages emit `AutomotiveService`/`LocalBusiness` + `City`/`AdministrativeArea`/`GeoCoordinates`; vehicle pages emit `Service` + `LocalBusiness` + `Offer`/`PriceSpecification` + `BreadcrumbList`; the homepage adds `FAQPage`. Schema is well-formed but, like the copy, **templated** — the location schema is identical bar the town name. Not a problem in itself, but it won't differentiate the pages.
- **Word counts** are rendered main-content words (nav/footer excluded); they under-count vs a naive "view source" count, which is intentional for a fair uniqueness comparison.
