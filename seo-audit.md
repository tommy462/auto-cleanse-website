# SEO Audit — AutoCleanse (auto-cleanse.co.uk)

**Date:** 2026-05-03  
**Stack:** React 18 + TypeScript + Vite SPA, deployed on Vercel  
**Total indexable URLs:** ~130 (16 hardcoded + 41 location data pages + 71 vehicle data pages + 2 hub/redirect pages)

---

## Severity Key

| Symbol | Meaning |
|--------|---------|
| 🔴 | Critical — directly harms ranking/indexing |
| 🟠 | High — significant missed opportunity or risk |
| 🟡 | Medium — should fix before next content push |
| 🔵 | Low — minor, fix opportunistically |

---

## 1. Domain Canonicalisation

### What's configured

- **Sitemap hostname:** `https://www.auto-cleanse.co.uk` (www) ✓  
- **SEO component canonical:** Uses `https://www.auto-cleanse.co.uk` (www) ✓  
- **vercel.json redirects:** `/remapping` → www, `/remapping-devon` → www ✓

### Issues

**🔴 No www ↔ non-www redirect in vercel.json.**  
If `auto-cleanse.co.uk` (no www) resolves to the same Vercel deployment, Google sees two separate origins serving identical content. Vercel does not add a canonical redirect automatically for the naked domain — you must configure it.

```json
// Missing from vercel.json:
{ "source": "https://auto-cleanse.co.uk/(.*)", "destination": "https://www.auto-cleanse.co.uk/$1", "permanent": true }
```

**🟡 Email inconsistency across schema.**  
- `DPFCleaningDevon.tsx` JSON-LD: `"info@autocleanse.co.uk"` (no hyphen)  
- `RemappingLocation` template JSON-LD: `"info@auto-cleanse.co.uk"` (with hyphen)  

These are different addresses. Confirm which is live and make consistent.

**🔵 vercel.json redirects use hardcoded www.**  
The redirect destinations (`https://www.auto-cleanse.co.uk/ecu-remapping`) hard-code www, which is correct given the canonical choice — no action needed unless the canonical domain changes.

---

## 2. Title & Meta Description Audit

### How titles are constructed — **critical architectural flaw**

The `SEO` component (`src/components/SEO.tsx`) does:

```tsx
const siteName = 'AutoCleanse | DPF Cleaning & Remapping';   // 37 chars
const fullTitle = `${title} | ${siteName}`;                   // adds " | " + 37 chars
```

This appends `| AutoCleanse | DPF Cleaning & Remapping` to the `title` prop on **every page**.

**Hardcoded pages** pass a short title without "AutoCleanse":
- `title="DPF Cleaning Totnes | Same-Day Drop-Off"` → rendered as `"DPF Cleaning Totnes | Same-Day Drop-Off | AutoCleanse | DPF Cleaning & Remapping"` (80 chars — still too long)

**Data-driven pages** pass `metaTitle` from the data file, which already ends in `| AutoCleanse`:
- `metaTitle="ECU Remapping Plymouth | Stage 1 & Mobile Remapping | AutoCleanse"` (65 chars)  
- Rendered as `"ECU Remapping Plymouth | Stage 1 & Mobile Remapping | AutoCleanse | AutoCleanse | DPF Cleaning & Remapping"` (**105 chars — "AutoCleanse" appears twice**)

**🔴 Every location page and every vehicle page (112 pages total) has a bloated, duplicate-branded `<title>` tag of ~90–110 characters.**  
Google truncates at ~60 chars in SERPs and may ignore or rewrite titles it considers stuffed. This is the single most urgent technical SEO fix.

**Root cause options (pick one):**
1. Strip `| AutoCleanse` from all 112 data file `metaTitle` values and let SEO component provide the brand suffix.
2. Or remove the siteName append from the SEO component and include "| AutoCleanse" explicitly only where wanted.

---

### 2a. Hardcoded Pages

The "Prop title" is what's passed to `<SEO title="..."/>`. The "Full `<title>` in browser" is what Google reads.

| Page | Route | Prop title (chars) | Full `<title>` in browser (chars) | Desc (chars) | Issues |
|------|-------|-------------------|-----------------------------------|--------------|--------|
| Home | `/` | DPF Cleaning & ECU Remapping \| Devon & Nationwide (50) | ...`\| AutoCleanse \| DPF Cleaning & Remapping` **(91)** | 139 | Title too long |
| Services | `/services` | Our Services \| DPF Cleaning & ECU Remapping (45) | **(86)** | 99 | Title too long; **desc too short** (<120) |
| Pricing | `/pricing` | DPF Cleaning & Remap Prices \| Devon (36) | **(77)** | 132 | Title too long |
| How It Works | `/how-it-works` | How DPF Cleaning Works \| AutoCleanse Process (46) | **(87)** | 149 | Title too long |
| Why Clean | `/why-clean` | DPF Cleaning vs Replacement \| Save £1000s (43) | **(84)** | 150 | Title too long |
| Maintenance | `/maintenance` | DPF Maintenance Guide \| Keep Your Filter Healthy (50) | **(91)** | 155 | Title too long |
| About | `/about` | About AutoCleanse \| DPF & Remapping Devon (43) | **(84)** | 150 | Title too long |
| Contact | `/contact` | Contact AutoCleanse \| DPF Cleaning & Remapping (48) | **(89)** | 126 | Title too long |
| Postal DPF | `/postal-dpf` | Postal DPF Cleaning UK \| Next-Day Return (42) | **(83)** | 148 | Title too long |
| DPF Cleaning Totnes | `/dpf-cleaning-totnes` | DPF Cleaning Totnes \| Same-Day Drop-Off (40) | **(81)** | 146 | Title too long |
| DPF Cleaning Devon | `/dpf-cleaning-devon` | DPF Cleaning Devon \| Same-Day Collection (42) | **(83)** | 144 | Title too long |
| DPF Cleaning Exeter | `/dpf-cleaning-exeter` | DPF Cleaning Exeter \| AutoCleanse Devon (41) | **(82)** | 143 | Title too long |
| DPF Cleaning Plymouth | `/dpf-cleaning-plymouth` | DPF Cleaning Plymouth \| AutoCleanse Devon (43) | **(84)** | 152 | Title too long |
| DPF Cleaning Torquay | `/dpf-cleaning-torquay` | DPF Cleaning Torquay \| AutoCleanse Devon (42) | **(83)** | 143 | Title too long |
| DPF Cleaning Paignton | `/dpf-cleaning-paignton` | DPF Cleaning Paignton \| AutoCleanse Devon (43) | **(84)** | 142 | Title too long |
| ECU Remapping Hub | `/ecu-remapping` | ECU Remapping Services \| Stage 1, Stage 2 & Economy Tuning (59) | **(100)** | 150 | Title too long |
| Remapping Locations Hub | `/ecu-remapping-locations` | Mobile ECU Remapping Locations in Devon \| AutoCleanse (55) | **(96)** | 148 | Title too long; "AutoCleanse" doubled |

> **Note:** Ideal rendered `<title>` length is 50–60 characters. Every single hardcoded page exceeds this due to the SEO component suffix.

---

### 2b. Location Pages (41 entries via RemappingLocation template)

Title formula: `{metaTitle} | AutoCleanse | DPF Cleaning & Remapping`  
Desc target: 140–160 chars.

| Slug | metaTitle (chars) | **Rendered title (chars)** | Desc (chars) | Title flags | Desc flags |
|------|-------------------|---------------------------|--------------|-------------|------------|
| ecu-remapping-plymouth | 65 | **106** | 151 | 🔴 Too long + duplicate brand | ✓ |
| ecu-remapping-exeter | 70 | **111** | 146 | 🔴 Too long + duplicate brand | ✓ |
| ecu-remapping-torquay | 61 | **102** | 130 | 🔴 Too long + duplicate brand | 🟡 Short |
| ecu-remapping-paignton | 68 | **109** | 147 | 🔴 Too long + duplicate brand | ✓ |
| ecu-remapping-newton-abbot | 67 | **108** | 142 | 🔴 Too long + duplicate brand | ✓ |
| ecu-remapping-torbay | 64 | **105** | 143 | 🔴 Too long + duplicate brand | ✓ |
| ecu-remapping-totnes | 51 | **92** | 142 | 🔴 Too long + duplicate brand | ✓ |
| ecu-remapping-ivybridge | 62 | **103** | 158 | 🔴 Too long + duplicate brand | ✓ |
| ecu-remapping-tavistock | 62 | **103** | 149 | 🔴 Too long + duplicate brand | ✓ |
| ecu-remapping-kingsbridge | 65 | **106** | 149 | 🔴 Too long + duplicate brand | ✓ |
| ecu-remapping-brixham | 61 | **102** | 126 | 🔴 Too long + duplicate brand | 🟡 Short |
| ecu-remapping-teignmouth | 63 | **104** | 149 | 🔴 Too long + duplicate brand | ✓ |
| ecu-remapping-dawlish | 61 | **102** | 120 | 🔴 Too long + duplicate brand | 🟠 Too short |
| ecu-remapping-ashburton | 66 | **107** | 152 | 🔴 Too long + duplicate brand | ✓ |
| ecu-remapping-buckfastleigh | 66 | **107** | 140 | 🔴 Too long + duplicate brand | ✓ |
| ecu-remapping-dartmouth | 63 | **104** | 132 | 🔴 Too long + duplicate brand | 🟡 Short |
| ecu-remapping-salcombe | 62 | **103** | 155 | 🔴 Too long + duplicate brand | ✓ |
| ecu-remapping-okehampton | 63 | **104** | 126 | 🔴 Too long + duplicate brand | 🟡 Short |
| ecu-remapping-sidmouth | 62 | **103** | 156 | 🔴 Too long + duplicate brand | ✓ |
| ecu-remapping-barnstaple | 65 | **106** | 127 | 🔴 Too long + duplicate brand | 🟡 Short |
| ecu-remapping-bideford | 73 | **114** | 128 | 🔴 Too long + duplicate brand | 🟡 Short |
| ecu-remapping-tiverton | 71 | **112** | 126 | 🔴 Too long + duplicate brand | 🟡 Short |
| ecu-remapping-honiton | 61 | **102** | 117 | 🔴 Too long + duplicate brand | 🟠 Too short |
| ecu-remapping-axminster | 63 | **104** | 119 | 🔴 Too long + duplicate brand | 🟠 Too short |
| ecu-remapping-crediton | 61 | **102** | 123 | 🔴 Too long + duplicate brand | 🟡 Short |
| ecu-remapping-cullompton | 65 | **106** | 129 | 🔴 Too long + duplicate brand | 🟡 Short |
| ecu-remapping-south-hams | 72 | **113** | 155 | 🔴 Too long + duplicate brand | ✓ |
| ecu-remapping-east-devon | 66 | **107** | 158 | 🔴 Too long + duplicate brand | ✓ |
| ecu-remapping-north-devon | 71 | **112** | 146 | 🔴 Too long + duplicate brand | ✓ |
| mobile-ecu-remapping-devon | 57 | **98** | 154 | 🔴 Too long + duplicate brand | ✓ |
| stage-1-remaps-devon | 47 | **88** | 150 | 🔴 Too long + duplicate brand | ✓ |
| van-remapping-devon | 69 | **110** | 152 | 🔴 Too long + duplicate brand | ✓ |
| performance-remapping-devon | 68 | **109** | 148 | 🔴 Too long + duplicate brand | ✓ |
| fuel-economy-remaps-devon | 54 | **95** | 146 | 🔴 Too long + duplicate brand | ✓ |
| diesel-remapping-devon | 56 | **97** | 141 | 🔴 Too long + duplicate brand | ✓ |
| petrol-remapping-devon | 69 | **110** | 151 | 🔴 Too long + duplicate brand | ✓ |
| 4x4-remapping-devon | 70 | **111** | 153 | 🔴 Too long + duplicate brand | ✓ |
| fleet-vehicle-remapping-devon | 69 | **110** | 159 | 🔴 Too long + duplicate brand | ✓ |
| ecu-tuning-devon | 59 | **100** | 148 | 🔴 Too long + duplicate brand | ✓ |

All 39 location pages (+ 2 service-type pages above = **41 total**): rendered title range **88–114 chars**. Every one has "AutoCleanse" duplicated.

---

### 2c. Vehicle Pages (71 entries via VehicleRemap template)

Same title formula produces rendered titles of **89–108 chars** for entries with `| AutoCleanse` in metaTitle, and **85–100 chars** for the 4 without it (those at least don't duplicate brand).

| Slug | metaTitle (chars) | **Rendered title (chars)** | Desc (chars) | Title flags | Desc flags |
|------|-------------------|---------------------------|--------------|-------------|------------|
| audi-a3-remap | 54 | **95** | 132 | 🔴 Too long + dup brand | 🟡 Short |
| audi-a4-remap | 54 | **95** | 139 | 🔴 Too long + dup brand | ✓ |
| audi-a5-remap | 54 | **95** | 140 | 🔴 Too long + dup brand | ✓ |
| audi-a6-remap | 54 | **95** | 131 | 🔴 Too long + dup brand | 🟡 Short |
| audi-q5-remap | 54 | **95** | ⚠️ ~76 (truncated) | 🔴 Too long + dup brand | 🔴 **Desc truncated by escaped apostrophe** |
| audi-s3-remap | 62 | **103** | 134 | 🔴 Too long + dup brand | ✓ |
| audi-s4-remap | 62 | **103** | 139 | 🔴 Too long + dup brand | ✓ |
| audi-rs3-remap | 63 | **104** | 133 | 🔴 Too long + dup brand | ✓ |
| bmw-320d-remap | 55 | **96** | 125 | 🔴 Too long + dup brand | 🟡 Short |
| bmw-330d-remap | 55 | **96** | 121 | 🔴 Too long + dup brand | 🟡 Short |
| bmw-118d-remap | 55 | **96** | 136 | 🔴 Too long + dup brand | ✓ |
| bmw-120d-remap | 55 | **96** | 126 | 🔴 Too long + dup brand | 🟡 Short |
| bmw-m140i-remap | 64 | **105** | 127 | 🔴 Too long + dup brand | 🟡 Short |
| bmw-m340i-remap | 64 | **105** | 108 | 🔴 Too long + dup brand | 🟠 **Too short** |
| bmw-x5-remap | 53 | **94** | 138 | 🔴 Too long + dup brand | ✓ |
| bmw-520d-remap | 55 | **96** | 119 | 🔴 Too long + dup brand | 🟠 Too short |
| vw-golf-gti-remap | 54 | **95** | 134 | 🔴 Too long + dup brand | ✓ |
| vw-golf-r-remap | 64 | **105** | 115 | 🔴 Too long + dup brand | 🟠 Too short |
| vw-golf-gtd-remap | 58 | **99** | 127 | 🔴 Too long + dup brand | 🟡 Short |
| vw-transporter-remap | 53 | **94** | 119 | 🔴 Too long + dup brand | 🟠 Too short |
| vw-amarok-remap | 59 | **100** | 127 | 🔴 Too long + dup brand | 🟡 Short |
| vw-passat-remap | 56 | **97** | 128 | 🔴 Too long + dup brand | 🟡 Short |
| vw-tiguan-remap | 56 | **97** | 128 | 🔴 Too long + dup brand | 🟡 Short |
| mercedes-a35-remap | 59 | **100** | 138 | 🔴 Too long + dup brand | ✓ |
| mercedes-a45-remap | 59 | **100** | 128 | 🔴 Too long + dup brand | 🟡 Short |
| mercedes-c220-remap | 61 | **102** | 125 | 🔴 Too long + dup brand | 🟡 Short |
| mercedes-c63-remap | 59 | **100** | 127 | 🔴 Too long + dup brand | 🟡 Short |
| mercedes-glc63-remap | 61 | **102** | 122 | 🔴 Too long + dup brand | 🟡 Short |
| mercedes-sprinter-remap | 67 | **108** | 132 | 🔴 Too long + dup brand | ✓ |
| mercedes-e220-remap | 61 | **102** | 125 | 🔴 Too long + dup brand | 🟡 Short |
| ford-transit-remap | 62 | **103** | 126 | 🔴 Too long + dup brand | 🟡 Short |
| ford-transit-custom-remap | 58 | **99** | 107 | 🔴 Too long + dup brand | 🟠 **Too short** |
| ford-ranger-remap | 54 | **95** | 133 | 🔴 Too long + dup brand | ✓ |
| ford-fiesta-st-remap | 55 | **96** | 131 | 🟠 Title missing brand | ✓ |
| ford-focus-st-remap | 54 | **95** | 122 | 🟠 Title missing brand | 🟡 Short |
| ford-kuga-remap | 56 | **97** | 127 | 🔴 Too long + dup brand | 🟡 Short |
| ford-mondeo-remap | 58 | **99** | 122 | 🔴 Too long + dup brand | 🟡 Short |
| range-rover-sport-remap | 60 | **101** | 118 | 🔴 Too long + dup brand | 🟠 Too short |
| range-rover-evoque-remap | 61 | **102** | 134 | 🔴 Too long + dup brand | ✓ |
| range-rover-velar-remap | 60 | **101** | 132 | 🔴 Too long + dup brand | ✓ |
| land-rover-discovery-remap | 59 | **100** | 123 | 🔴 Too long + dup brand | 🟡 Short |
| land-rover-defender-remap | 62 | **103** | 137 | 🔴 Too long + dup brand | ✓ |
| range-rover-vogue-remap | 60 | **101** | 118 | 🔴 Too long + dup brand | 🟠 Too short |
| vauxhall-vivaro-remap | 54 | **95** | 108 | 🔴 Too long + dup brand | 🟠 **Too short** |
| vauxhall-astra-remap | 57 | **98** | 123 | 🔴 Too long + dup brand | 🟡 Short |
| vauxhall-corsa-remap | 57 | **98** | 110 | 🔴 Too long + dup brand | 🟠 Too short |
| nissan-navara-remap | 52 | **93** | 106 | 🔴 Too long + dup brand | 🟠 **Too short** |
| toyota-hilux-remap | 55 | **96** | 119 | 🔴 Too long + dup brand | 🟠 Too short |
| peugeot-boxer-remap | 50 | **91** | 122 | 🟠 Title missing brand | 🟡 Short |
| renault-trafic-remap | 53 | **94** | 107 | 🔴 Too long + dup brand | 🟠 **Too short** |
| seat-leon-remap | 52 | **93** | 125 | 🔴 Too long + dup brand | 🟡 Short |
| seat-ibiza-remap | 53 | **94** | 114 | 🔴 Too long + dup brand | 🟠 Too short |
| skoda-octavia-remap | 56 | **97** | 121 | 🔴 Too long + dup brand | 🟡 Short |
| skoda-superb-remap | 55 | **96** | 112 | 🔴 Too long + dup brand | 🟠 Too short |
| porsche-macan-remap | 56 | **97** | 115 | 🔴 Too long + dup brand | 🟠 Too short |
| volvo-xc60-remap | 53 | **94** | 131 | 🔴 Too long + dup brand | 🟡 Short |
| volvo-xc90-remap | 53 | **94** | 113 | 🔴 Too long + dup brand | 🟠 Too short |
| peugeot-208-remap | 54 | **95** | 106 | 🔴 Too long + dup brand | 🟠 **Too short** |
| peugeot-3008-remap | 55 | **96** | 113 | 🔴 Too long + dup brand | 🟠 Too short |
| renault-clio-remap | 55 | **96** | 112 | 🔴 Too long + dup brand | 🟠 Too short |
| renault-megane-remap | 57 | **98** | 124 | 🔴 Too long + dup brand | 🟡 Short |
| citroen-berlingo-remap | 55 | **96** | 100 | 🔴 Too long + dup brand | 🟠 **Too short** |
| dacia-duster-remap | 55 | **96** | 117 | 🔴 Too long + dup brand | 🟠 Too short |
| fiat-500-remap | 60 | **101** | 120 | 🔴 Too long + dup brand | 🟡 Short |
| fiat-ducato-remap | 48 | **89** | 120 | 🟠 Title missing brand | 🟡 Short |
| mazda-cx-5-remap | 53 | **94** | 113 | 🔴 Too long + dup brand | 🟠 Too short |
| nissan-qashqai-remap | 57 | **98** | 118 | 🔴 Too long + dup brand | 🟠 Too short |
| nissan-juke-remap | 54 | **95** | 128 | 🔴 Too long + dup brand | 🟡 Short |
| toyota-land-cruiser-remap | 58 | **99** | 133 | 🔴 Too long + dup brand | ✓ |

**Summary of description flags:**
- 🔴 Truncated/broken: 1 (`audi-q5-remap` — apostrophe escape issue in source file)
- 🟠 Too short (<120 chars): ~24 vehicle pages
- 🟡 Short but acceptable (120–130): ~18 vehicle pages
- ✓ In range (130–160): ~28 vehicle pages

**4 vehicle pages missing `| AutoCleanse` in metaTitle:** `ford-fiesta-st-remap`, `ford-focus-st-remap`, `peugeot-boxer-remap`, `fiat-ducato-remap` — these are the only 4 that don't duplicate the brand, but they still produce long titles (~89–96 chars) due to the SEO component suffix.

---

## 3. Content Uniqueness on Programmatic Pages

### RemappingLocation template

| Content block | Source | Status |
|---------------|--------|--------|
| `<title>`, `<meta description>` | `location.metaTitle`, `location.metaDescription` | ✅ Unique per page |
| Canonical URL | `location.slug` | ✅ Unique per page |
| H1 | `location.h1` | ✅ Unique per page |
| Intro paragraph | `location.intro` | ✅ Unique per page (~80–120 words) |
| "Mobile Remapping Available" callout body | `location.distanceNote` (1–2 phrases) | ⚠️ Mostly templated, small unique fragment |
| Nearby areas list | `location.nearbyAreas` (6–8 items) | ✅ Unique per page |
| FAQ section (5 Q&As) | `location.faqs` | ✅ Unique per page (~250–300 words) |
| Towing section | `location.towingContent` (optional) | ✅ Unique where present |
| Related locations links | `location.relatedSlugs` | ✅ Unique per page |
| SERVICES grid (6 cards) | Hardcoded constant `SERVICES` | ❌ Identical across all 41 pages |
| TRUST checklist (6 items) | Hardcoded constant `TRUST` | ❌ Identical across all 41 pages |
| "Why AutoCleanse" copy | Hardcoded in JSX | ❌ Identical across all 41 pages |
| CTA copy | Hardcoded (uses `location.name`) | ⚠️ Mostly identical |

**Estimated unique-content ratio:** ~55–60% of rendered text is unique per location.  
This is borderline acceptable for programmatic SEO. The main duplication risk is the `SERVICES` descriptions and "Why AutoCleanse" copy — Google can identify these boilerplate blocks. Stronger differentiation (e.g., location-specific intro for the "Serving X" paragraph, or location-specific service notes) would improve signals.

---

### VehicleRemap template

| Content block | Source | Status |
|---------------|--------|--------|
| `<title>`, `<meta description>` | `vehicle.metaTitle`, `vehicle.metaDescription` | ✅ Unique per page |
| Canonical URL | `vehicle.slug` | ✅ Unique per page |
| H1 | `vehicle.h1` | ✅ Unique per page |
| Intro paragraph | `vehicle.intro` | ✅ Unique per page (~80–120 words) |
| Engine options table | `vehicle.engineOptions` (1–5 engines, specs) | ✅ Unique per page (data-rich) |
| FAQ section (5 Q&As) | `vehicle.faqs` | ✅ Unique per page (~300–400 words) |
| Related vehicles links | `vehicle.relatedSlugs` | ✅ Unique per page |
| "Our Process" list (5 items) | Hardcoded in JSX | ❌ Identical across all 71 pages |
| "Mobile Remapping Available" callout | Templated (uses `vehicle.make`, `vehicle.fullName`) | ⚠️ Semi-unique |
| CTA section | Templated (uses `vehicle.make`, `vehicle.model`) | ⚠️ Semi-unique |
| Breadcrumb vehicle category label | Hardcoded as `vehicle.make` path `/vehicle-remapping` | ⚠️ Same path for all |

**Estimated unique-content ratio:** ~60–65% of rendered text is unique per vehicle.  
Engine specs and FAQs provide strong unique content signals. The "Our Process" block is the main shared boilerplate concern.

---

## 4. Data File Structure

### `RemapLocation` interface (`src/data/remapping-locations.ts`)

```typescript
interface RemapFaq {
  q: string;
  a: string;
}

interface RemapLocation {
  slug: string;           // URL path (required)
  name: string;           // Display name (required)
  region: string;         // Sub-region label (required)
  metaTitle: string;      // Title prop for SEO component (required)
  metaDescription: string; // Meta description (required)
  h1: string;             // Page heading (required)
  intro: string;          // Hero body paragraph (required)
  distanceNote: string;   // Distance from workshop (required)
  mobileAvailable: boolean; // Controls mobile callout section (required)
  nearbyAreas: string[];  // List of surrounding towns (required)
  faqs: RemapFaq[];       // FAQ accordion content (required, typically 5)
  relatedSlugs: string[]; // Cross-links to 2–3 nearby locations (required)
  towingContent?: string[]; // Optional towing-specific paragraphs
}
```

**Field population across all 41 entries:**

| Field | Populated | Empty/Missing | Notes |
|-------|-----------|---------------|-------|
| slug | 41/41 | 0 | ✅ |
| name | 41/41 | 0 | ✅ |
| region | 41/41 | 0 | ✅ |
| metaTitle | 41/41 | 0 | ✅ |
| metaDescription | 41/41 | 0 | ✅ |
| h1 | 41/41 | 0 | ✅ |
| intro | 41/41 | 0 | ✅ |
| distanceNote | 41/41 | 0 | ✅ |
| mobileAvailable | 41/41 | 0 | ✅ |
| nearbyAreas | 41/41 | 0 | ✅ |
| faqs | 41/41 | 0 | ✅ (5 per entry) |
| relatedSlugs | 41/41 | 0 | ✅ (typically 3) |
| towingContent | ~5–8/41 | ~33–36 | Optional field; check which locations have it |

---

### `VehicleRemapData` interface (`src/data/vehicle-remapping.ts`)

```typescript
interface EngineOption {
  name: string;
  stockPower: string;
  remapPower: string;
  stockTorque: string;
  remapTorque: string;
  mpgGain?: string;       // Optional — only present on diesel economy entries
}

interface VehicleRemapData {
  slug: string;
  make: string;
  model: string;
  fullName: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  engineOptions: EngineOption[];
  faqs: { q: string; a: string }[];
  relatedSlugs: string[];
  category: 'performance' | 'economy' | 'commercial' | 'mixed';
  fuelType: 'diesel' | 'petrol' | 'both';
}
```

**Field population across all 71 entries:**

| Field | Populated | Concern |
|-------|-----------|---------|
| slug | 71/71 | ✅ |
| make / model / fullName | 71/71 | ✅ |
| metaTitle | 71/71 (4 missing brand suffix) | ✅ / 🟡 4 inconsistent |
| metaDescription | 70/71 | 🔴 `audi-q5-remap` appears truncated due to unescaped apostrophe in source string |
| h1 | 71/71 | ✅ |
| intro | 71/71 | ✅ |
| engineOptions | 71/71 | ✅ (1–5 per vehicle) |
| engineOptions.mpgGain | ~30/71 | ✅ Optional, appropriately populated |
| faqs | 71/71 | ✅ (5 per entry) |
| relatedSlugs | 71/71 | ✅ |
| category | 71/71 | ✅ |
| fuelType | 71/71 | ✅ |

---

## 5. Internal Linking

### Location → Location

| Mechanism | Coverage | Status |
|-----------|----------|--------|
| RemappingLocation `relatedSlugs` section | 41 location pages, each with 2–3 links to nearby locations | ✅ Good |
| RemappingLocationsHub (`/ecu-remapping-locations`) | All 41 locations grouped by region | ✅ Good |
| Footer "Locations" column | 5 specific locations + "View All" | ✅ Present |
| Header nav | `/ecu-remapping` only (no direct location links) | ⚠️ No direct links |

### Vehicle → Vehicle

| Mechanism | Coverage | Status |
|-----------|----------|--------|
| VehicleRemap `relatedSlugs` section | 71 vehicle pages, each with 2–3 related vehicles | ✅ Good |
| VehiclePerformanceLookup hub (`/vehicle-performance-lookup`) | Likely links to all vehicle pages | ✅ (assumed) |
| Footer "Vehicles" column | 5 vehicles + "View All" | ✅ Present but: |

**🟠 Footer links to `/bmw-3-series-remap`** — this slug does NOT exist in `vehicle-remapping.ts`. The data has `bmw-320d-remap`, `bmw-330d-remap` etc. The `/bmw-3-series-remap` route returns a 404 (DynamicPage falls back to redirect on no match). **Fix:** change footer entry to `/bmw-320d-remap` or a valid slug.

### Cross-linking (Vehicle ↔ Location)

| Direction | Mechanism | Status |
|-----------|-----------|--------|
| Vehicle → Location | VehicleRemap links to `/ecu-remapping-locations` hub (generic) | ⚠️ No specific location pages |
| Location → Vehicle | RemappingLocation has no vehicle links | ❌ Missing |
| Location → Vehicle | No template section linking "popular vehicles in X" | ❌ Missing |

**🟡 Neither template cross-links to the other's programmatic pages.** A vehicle page for "Audi A3 Remap" has no link to "ECU Remapping Exeter" (or nearby location). A location page for Plymouth has no link to popular vehicles in that area. This is a PageRank distribution gap and a relevance signal missed by both templates.

### Homepage → Programmatic Pages

| Link | Destination | Status |
|------|-------------|--------|
| "Remap Tool" CTA | `/vehicle-performance-lookup` | ✅ |
| "Book Remap" CTA | `/remapping-booking` | ✅ |
| "Postal DPF" CTA | `/postal-dpf` | ✅ |
| ECU section links | `/remapping` (old redirect) | 🟡 Goes via 301, loses small amount of link equity — update to `/ecu-remapping` |
| Direct location links | None | ❌ Home page has no links to any specific location pages |
| Direct vehicle links | None | ❌ Home page has no links to any vehicle pages |

**🟡 Home page JSON-LD also contains `"url": "https://www.auto-cleanse.co.uk/remapping"`** (old path) in two places — should be updated to `/ecu-remapping`.

### Service Pages → Programmatic Pages

- `EcuRemappingHub` links to `/stage-1-remaps-devon`, `/fuel-economy-remaps-devon`, `/van-remapping-devon`, `/vehicle-performance-lookup`, `/ecu-remapping-locations` ✓
- `EcuRemappingHub` does NOT link to any individual location pages directly
- `Services` page — not audited in detail, likely has similar gap

---

## 6. Schema Markup (JSON-LD)

### Current schema coverage

| Page / Template | Schema type(s) present | Notes |
|----------------|------------------------|-------|
| Home | `AutomotiveService` + `LocalBusiness` | ✓ Rich, includes `areaServed`, `priceRange`, `openingHours`, `sameAs` |
| DPFCleaningDevon | `AutomotiveService` + `LocalBusiness` (hardcoded inline) | ✓ Has `areaServed` cities, `openingHoursSpecification` |
| DPFCleaningTotnes | Likely same pattern | ✅ (assumed) |
| DPFCleaningExeter/Plymouth/Torquay/Paignton | Likely same pattern | ✅ (assumed) |
| RemappingLocation template | `AutomotiveService` + `LocalBusiness` + **`BreadcrumbList`** (via Breadcrumbs component) | ✓ Has `areaServed`, `serviceType`; missing FAQPage, openingHours |
| VehicleRemap template | `Service` + `LocalBusiness` (nested) + **`BreadcrumbList`** | ✓ Has `offers` block; missing FAQPage, price value |
| About | LocalBusiness / Organization | ✅ (6 matches) |
| Contact | LocalBusiness | ✅ (7 matches) |
| PostalDPF | Service / LocalBusiness | ✅ (11 matches) |
| Pricing | Service / Offer | ✅ (9 matches) |
| Services | **None** | 🟠 Only page with no schema |
| HowItWorks | Not checked — likely none | 🟡 |
| WhyClean | Not checked — likely none | 🔵 |
| Maintenance | Not checked — likely none | 🔵 |
| EcuRemappingHub | Has `AutomotiveService` inline | ✅ (confirmed ~8 matches) |

### Missing schema flags

**🟠 No `FAQPage` schema on location or vehicle pages.**  
Both templates have 5 FAQs per page (5 × 41 location = 205 FAQ pairs; 5 × 71 vehicle = 355 FAQ pairs — 560 total). Without `FAQPage` JSON-LD, these FAQs cannot surface as rich results in SERPs. This is a high-leverage gap for programmatic pages.

Example structure to add alongside existing schema on both templates:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{faq.q}",
      "acceptedAnswer": { "@type": "Answer", "text": "{faq.a}" }
    }
  ]
}
```

**🟡 VehicleRemap `Service` schema has no `price` in `Offer`.**  
The `offers.priceSpecification` only contains `priceCurrency: "GBP"` — no `price` value. Without a price, Google cannot show price rich snippets. Since pricing varies by vehicle and service type, either add a `"price": "from 299"` string or remove the offers block to avoid an incomplete schema warning.

**🟡 RemappingLocation schema missing `openingHoursSpecification`.**  
The hardcoded DPF pages include opening hours; the RemappingLocation template does not. Inconsistency across LocalBusiness schema.

**🟡 Services page has zero JSON-LD.**  
This is likely the second most important service page after the homepage. At minimum it should have a `Service` schema with the service list.

**🔵 VehicleRemap breadcrumb incorrectly paths through `/vehicle-remapping`** (a redirect to `/vehicle-performance-lookup`). The breadcrumb schema item `path: '/vehicle-remapping'` generates a JSON-LD `BreadcrumbList` with the redirect URL — should point to `/vehicle-performance-lookup`.

---

## 7. Sitemap

### Generation mechanism

Generated **at build time** by `vite-plugin-sitemap` with a manually maintained `dynamicRoutes` array in `vite.config.ts`. Output is `dist/sitemap.xml`, served as a static file.

**🟡 Sitemap is static/manual.** If new vehicles or locations are added to the data files, the sitemap does NOT update automatically — `vite.config.ts` must be manually edited and the project rebuilt. This is a maintenance risk as the data files scale.

### Sitemap coverage gaps

| URL | In sitemap | In router | Issue |
|-----|-----------|-----------|-------|
| `/how-it-works` | ❌ | ✅ (linked in header nav as "Our Process") | 🟠 Missing — major nav link not indexed via sitemap |
| `/vehicle-performance-lookup` | ❌ | ✅ (linked from Home + EcuRemappingHub) | 🟡 Missing |
| `/ecu-remapping-locations` | ✅ | ✅ | ✓ |
| `/fuel-savings-calculator` | ✅ | ❌ **Not routed in PageTransition.tsx** | 🔴 **404 — page in sitemap but no route exists** |
| `/vehicle-remapping` | ✅ | Routes as redirect → `/vehicle-performance-lookup` | 🟡 Sitemap should point to canonical destination, not the redirect |
| `/remapping-booking` | ✅ | ✅ | ✓ |
| `/booking-success` | ❌ | ✅ | ✓ (correct — transactional pages should be excluded) |
| `/booking-cancel` | ❌ | ✅ | ✓ |
| `/debug/dvla` | ❌ | ✅ | ✓ (correct — debug pages should stay off sitemap) |

### Priority and changefreq

**🟡 Every single URL — all 130+ — has `priority="1.0"` and `changefreq="daily"`.**

Setting everything to maximum priority gives Google no differentiation signal. Setting `changefreq=daily` on product/service pages that update rarely is misleading and may erode trust in the sitemap.

Recommended tiering:

| Page type | priority | changefreq |
|-----------|----------|------------|
| Homepage | 1.0 | weekly |
| Core service pages (Services, Pricing, PostalDPF, ECU hub) | 0.9 | monthly |
| Location pages (41) | 0.8 | monthly |
| Vehicle pages (71) | 0.7 | monthly |
| Info/editorial (HowItWorks, WhyClean, Maintenance, About) | 0.6 | monthly |
| Booking/transactional | excluded | — |

---

## 8. SPA-Specific SEO Concerns

### Rendering model

**🔴 Purely client-side rendered (CSR) SPA — no prerendering.**

`vercel.json` rewrites all non-API paths to `index.html`:
```json
{ "source": "/((?!api/).*)", "destination": "/" }
```

Every URL serves an **identical blank HTML shell**. All page-specific content — including `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph tags, and all body copy — is injected by React after JavaScript executes.

**Consequences:**

1. **Googlebot rendering lag.** Google crawls and indexes in two passes: first the raw HTML (gets the same generic shell for every URL), then a separate JavaScript rendering queue (may take days to weeks for new pages). During that window, pages may appear in index with no title, no description, and no content.

2. **120+ programmatic pages at higher discovery risk.** Freshly added vehicle or location pages depend entirely on JS rendering being processed. Lower-authority new pages may rank slowly or not at all until Google renders them.

3. **Social scrapers (WhatsApp, LinkedIn, Slack, Discord) do not execute JavaScript.** OG tags (og:title, og:description, og:image) are injected by react-helmet-async — these scrapers will see the generic unfilled template. Every shared link preview will show a blank or generic preview rather than the page's content.

4. **The `<title>` in the initial HTML** (if present in `index.html`) is the same for all 130+ pages. If a user shares a link before Google has rendered the page, or if a social bot scrapes it, they'll see the fallback title.

### No prerender / SSG configured

- `vite-plugin-prerender`: ❌ not installed
- `vite-ssg`: ❌ not installed  
- `vite-plugin-ssr` / `react-router` SSR: ❌ not configured  
- Vercel Edge Middleware prerender: ❌ not in `vercel.json`

### Recommended path forward

The most impactful fix without a full framework migration is to add **`vite-plugin-prerender`** (or migrate to Vite + React Router with SSR on Vercel). This would:
- Pre-render all 130 URLs to static HTML at build time
- Inject correct `<title>`, `<meta description>`, `<link rel="canonical">`, and OG tags into each page's static HTML
- Serve full text content to crawlers without requiring JS execution
- Fix all social sharing previews instantly

Alternative: **migrate to Next.js** with `generateStaticParams` for the vehicle and location data — this is the standard approach for exactly this kind of programmatic SEO at scale. Given you already have structured data files, the migration path is well-defined.

---

## Summary of Findings

### 🔴 Critical (fix immediately)

| # | Issue | Affected pages |
|---|-------|----------------|
| C1 | SEO component doubles "AutoCleanse" brand — all data-driven `<title>` tags are 90–114 chars with duplicate brand suffix | 112 pages |
| C2 | Pure CSR SPA — no static HTML, all meta tags JS-injected, social previews broken | All 130+ pages |
| C3 | `/fuel-savings-calculator` in sitemap but no router route — returns 404 | 1 page |

### 🟠 High (fix before next content push)

| # | Issue | Affected pages |
|---|-------|----------------|
| H1 | No www→non-www redirect in `vercel.json` — duplicate content risk at naked domain | All pages |
| H2 | `/how-it-works` linked in header nav but absent from sitemap | 1 page |
| H3 | No FAQPage JSON-LD despite 560 FAQ pairs across programmatic pages | 112 pages |
| H4 | Footer links to `/bmw-3-series-remap` which doesn't exist (broken internal link) | Footer sitewide |
| H5 | `audi-q5-remap` metaDescription appears truncated (apostrophe escape issue) | 1 page |

### 🟡 Medium

| # | Issue | Affected pages |
|---|-------|----------------|
| M1 | All titles still 75–91 chars even after fixing C1 — SEO component suffix itself is too long | All pages |
| M2 | ~24 vehicle pages have descriptions under 120 chars | 24 vehicle pages |
| M3 | Services page has no JSON-LD schema | 1 page |
| M4 | `/vehicle-remapping` in sitemap is a redirect URL — should point to `/vehicle-performance-lookup` | Sitemap |
| M5 | All sitemap URLs at `priority=1.0` / `changefreq=daily` — no tiering | All 130+ |
| M6 | No cross-links between vehicle pages and location pages | 112 pages |
| M7 | Sitemap is manually maintained — new data entries require manual `vite.config.ts` edits | Build process |
| M8 | Home page JSON-LD and internal links reference `/remapping` (redirect) not `/ecu-remapping` | Home |
| M9 | VehicleRemap Service schema has incomplete `Offer` (currency only, no price) | 71 pages |
| M10 | RemappingLocation schema missing `openingHoursSpecification` vs hardcoded DPF pages which have it | 41 pages |

### 🔵 Low

| # | Issue | Affected pages |
|---|-------|----------------|
| L1 | VehicleRemap breadcrumb item path is `/vehicle-remapping` (redirect) | BreadcrumbList schema, 71 pages |
| L2 | Email inconsistency: `autocleanse.co.uk` vs `auto-cleanse.co.uk` in JSON-LD | DPFCleaningDevon vs templates |
| L3 | 4 vehicle metaTitles missing `| AutoCleanse` suffix — inconsistent with the other 67 | 4 vehicle pages |
| L4 | `HowItWorks`, `WhyClean`, `Maintenance` pages likely have no JSON-LD — worth adding `HowTo` or `Article` schema | 3 pages |
