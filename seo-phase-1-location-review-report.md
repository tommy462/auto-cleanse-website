# Phase 1 — ECU Location Page Review (Exeter, Torquay, Newton Abbot)

_Completed 2026-07-01. Follow-up review of the three major-town ECU pages to strengthen their unique local footprint and de-risk them from feeling like location-swap pages. Scope was held to the three named pages plus the requested same-day / DPF-bundle wording review. No other location pages were rewritten; no layout changes._

## Build & verification

| Check | Result |
|---|---|
| `npm run build` | ✅ 137 pages, 0 errors |
| Routes | ✅ 137 (no orphan) |
| Each town has 3 bespoke local `<h2>` sections **before** "What we offer" | ✅ Torquay / Exeter / Newton Abbot |
| Localised "Popular Vehicles" intro (differs per town) | ✅ all 3 |
| ≥2 FAQ answers localised per page | ✅ 2 each |
| "DPF Clean + Remap Bundle" blanket "labour to remove and refit" promise | ✅ removed everywhere (0 in build) |
| Guaranteed-sounding same-day language ("guarantee"/"commitment to same-day") | ✅ 0 in build |
| Service accuracy (DPF workshop-only, mobile = ECU only, diagnostics paid) | ✅ preserved on all 3 |

---

## 1. Exact sections changed

### A. Template — `src/pages/RemappingLocation.tsx` (affects all 38 RemappingLocation pages)
1. **"DPF Clean + Remap Bundle" service card** reworded from _"Combined DPF clean and ECU remap - inc. labour to remove and refit. Best-value diesel health package."_ → **"Combine a professional DPF clean with an ECU remap where suitable. Removal and refit can be arranged subject to availability, or trade customers can supply the filter off the vehicle."** (The shared card was inaccurate on every page, so the fix is global — the cards themselves were kept, as requested.)
2. **"Popular Vehicles We Remap" intro paragraph** now renders a per-location `popularVehiclesIntro` when present, falling back to the previous generic sentence otherwise.

### B. Data interface — `src/data/remapping-locations.ts`
- Added optional `popularVehiclesIntro?: string`.

### C. Data — the three town entries only (`remapping-locations.ts`)
For each of **Exeter, Torquay, Newton Abbot**:
- **Kept the existing strong local intro copy** (the `intro` field is unchanged).
- **Replaced the two Phase‑1 `extraSections` with three distinct, deeper local sections** (net +1 bespoke local section), all rendered **before** the generic "What we offer" service cards. The three sections per town avoid repeating each other:

  | | Section 1 | Section 2 | Section 3 |
  |---|---|---|---|
  | **Exeter** | Remapping for Exeter's roads and commuters (M5/A30/A38, company cars, commuters, economy, torque & MPG) | Company cars, vans and East Devon trades (commercial diesel vans, fleets, loaded pulling power) | Mobile at your Exeter home or work, or a run to Totnes (logistics + honesty) |
  | **Torquay** | Torbay traffic and the hills around Torquay (stop-start seafront, hill climbs, low-down torque, economy) | Taxis, private hire, tradespeople and delivery vans (who we serve + economy) | Mobile in Torquay or our Totnes workshop (logistics + honesty) |
  | **Newton Abbot** | Just up the road from our workshop (8 miles, A380/A38 access, drop-off vs mobile) | Trades, vans, commuters and towing (diesel economy + towing torque) | How we work — and what we don't do at the roadside (paid diagnostics, mobile = ECU only, DPF workshop-only) |

- **Localised the "Popular Vehicles" intro** for each town (three different sentences, not one shared line).
- **Localised two FAQ answers** per town with real, factual local detail:
  - **Exeter:** "Can you remap petrol cars as well as diesels?" and "How long does a remap take?" (now reference the M5/A30/A38 diesel mix and the A38 run to Totnes).
  - **Torquay:** "Can you remap 4x4s and SUVs?" and "Will a Stage 1 remap improve my fuel economy?" (now reference the seafront climbs and local taxi/PH/van drivers).
  - **Newton Abbot:** "Can you remap a turbocharged petrol car?" and "What van brands do you remap?" (now reference commuting into Exeter/Torbay, towing, and the 8‑mile drop‑off).

### D. Same-day wording review — task 6 (wording-only, no layout/structure changes)
Guaranteed-sounding same-day promises were softened to "often", "usually", "where possible" or "fast turnaround". This required touching shared/other files (not the three location pages' own bodies, which had no same-day claims):

| File | Change |
|---|---|
| `src/components/Footer.tsx` | Site-wide tagline "Same-day return within 30 miles" → **"Fast turnaround, often same-day within 30 miles"** (renders on all three pages) |
| `src/config/booking.ts` | Booking option desc: removed blanket "inc. labour to remove and refit" → "removal and refit arranged subject to availability" |
| `src/pages/Pricing.tsx` | "Same-day return **guarantee** applies…" → "usually possible…"; FAQ "same-day return **guaranteed**…" → "often possible…" |
| `src/pages/HowItWorks.tsx` | Process step "Same-day return…" → "Fast turnaround — often same-day…" |
| `src/pages/Maintenance.tsx` | Feature bullet "Same-day return **guarantee**" → "Fast, often same-day return" |
| `src/pages/About.tsx` | Removed "our **commitment** to same-day… we **guarantee**…" → "often… where possible"; softened one description line |
| `src/pages/DPFCleaningTotnes.tsx` | "Our **commitment** to same-day service…" → "Fast turnaround — often same-day… before 10am" |

Instances already conditionally hedged ("when collected before 10am") in the Chatbot were left as-is.

---

## 2. Before / after word count (rendered `<main>`)

| Page | Before (Phase 1) | After | Δ |
|---|---:|---:|---:|
| `/ecu-remapping-exeter` | 1180 | **1386** | +206 |
| `/ecu-remapping-newton-abbot` | 1083 | **1236** | +153 |
| `/ecu-remapping-torquay` | 1222 | **1333** | +111 |

Each page now leads with ~380–430 words of genuinely town-specific prose (intro + 3 local sections) before any shared template content, plus a localised popular-vehicles intro and two localised FAQs — materially lifting the unique-to-shared ratio on the exact pages that were most at doorway risk.

---

## 3. Claims that need owner review

1. **Same-day expectations.** Wording is now hedged everywhere ("often same-day within 30 miles of Totnes when collected before 10am"). Please confirm this is realistically achievable so even the softened wording is safe.
2. **DPF Clean + Remap bundle.** New wording says removal/refit is "arranged subject to availability, or trade customers can supply the filter off the vehicle." Confirm this matches how you actually offer the bundle.
3. **Popular-vehicles list.** The six linked models (BMW 320d, VW Transporter, Ford Transit Custom, Ford Ranger, Audi A3, VW Golf GTD) are still the shared curated set — only the intro sentence is town-specific. If you'd like town-tailored lists, the new `popularVehicles` data field already supports a per-town override (e.g. more vans for Newton Abbot, more taxis/SUVs for Torquay).
4. **Local detail sanity check.** New copy references specific roads/areas (A30/A38/M5, A380/A381/A385, Wellswood/harbour climbs, Kingsteignton/Bovey Tracey/Abbotskerswell, Cullompton/Honiton). These are consistent with the existing `distanceNote`/`nearbyAreas` data and are geographic facts — but a quick owner read confirms nothing overstates where you genuinely operate. No performance figures were invented; all gains language is qualitative/hedged.
5. **Scope note (not a risk, for transparency).** The same-day review (task 6) and the bundle-card fix (task 5) are shared-component changes and therefore affect pages beyond the three towns (Footer is site-wide; the bundle card appears on all 38 RemappingLocation pages). These were wording-only accuracy fixes — no layout changes and no other location page had its body content rewritten.

---

**Ready for deployment review. Awaiting approval.**
