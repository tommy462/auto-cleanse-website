# Auto-Cleanse — Phase AI-1 Implementation Report

_Completed 2026-07-01. Source of truth: `seo-ai-visibility-audit.md` / `.json`. Scope: improve AI visibility / answer-engine readiness via clearer entity, consistent schema, and easier-to-quote key facts. No location-page content rewrites beyond template/schema changes; no new pages; no route/canonical/redirect/sitemap-logic changes. Build, prerender, sitemap and schema checks all pass._

## Build & verification status

| Check | Result |
|---|---|
| `npm run build` | ✅ **134 pages, 0 errors** |
| Page count / sitemap URLs | ✅ 134 / 134 |
| Orphans / all sitemap rendered | ✅ 0 / 0 |
| Self-referential canonicals | ✅ **134 / 134** |
| noindex leakage | ✅ 0 |
| **All JSON-LD parses** | ✅ every block, every page |
| **`hasOfferCatalog`** (was `hasOfferingCatalog`) | ✅ fixed; **0** `OfferingCatalog` anywhere |
| Internal links to retired URLs | ✅ 0 |
| "mobile DPF" wording | ✅ only the intended **negated** clarification (no positive/ambiguous use) |
| "free diagnostic" wording | ✅ 0 |
| Map-authoring overclaim | ✅ 0 (only negated "we don't write ECU files from scratch") |
| Schema business name = **Auto-Cleanse** everywhere | ✅ (no `"AutoCleanse"` as schema name) |
| Schema telephone **E.164** everywhere | ✅ `+441803269895` |
| Address string consistent | ✅ no more "Webbers Yard Estate" |
| **FAQPage schema matches visible text** | ✅ all 45 FAQPage pages |
| robots.txt: explicit crawlers + sitemap | ✅ |
| Placeholder `07700 900000` | ✅ removed |

Coverage after this phase: **business `@id` on 111 pages · logo referenced · FAQPage on 45 pages** (all matching visible content).

---

## 1. Files changed

**New:**
- `src/data/business.ts` — single source of truth for the business entity: canonical NAP, stable `@id` (`https://www.auto-cleanse.co.uk/#business`), `sameAs`, opening hours, and two helpers (`localBusinessNode()` for nesting, `localBusinessSchema()` for standalone blocks).

**Schema / entity (templates & hubs):**
- `src/pages/RemappingLocation.tsx` — now emits the shared LocalBusiness schema (all 36 location/service pages get `@id`, `alternateName`, E.164 phone, `logo`, opening hours, `sameAs`, consistent address).
- `src/pages/VehicleRemap.tsx` — `Service` schema now uses the shared business as `provider` + `areaServed: Devon` (all 69 vehicle pages).
- `src/pages/Home.tsx` — fixed `hasOfferingCatalog`→`hasOfferCatalog`; name→Auto-Cleanse; added `@id`, `logo`, hyphenated `alternateName`; E.164 phone; address fix; added a visible entity answer block.
- `src/pages/EcuRemappingHub.tsx` — shared LocalBusiness schema; added a visible answer block anchoring the Totnes base + workshop/mobile split.
- `src/pages/DPFCleaningHub.tsx` — shared LocalBusiness schema; added FAQPage schema + a visible answer block with the explicit mobile-DPF clarification.

**Content:**
- `src/pages/About.tsx` — full entity rewrite (see §4).
- `src/pages/Contact.tsx` — added a visible NAP + opening-hours block (see §7).
- `src/pages/PostalDPF.tsx` — rendered its existing FAQ **visibly** so its FAQPage schema now matches on-page content.

**NAP standardisation (schema name→Auto-Cleanse, telephone→E.164, address "Webbers Yard Estate"→"Webbers Yard"):**
- `src/components/Footer.tsx`, `src/components/VehicleSchema.tsx`, and the inline schemas in `AdBlueRepairDevon`, `BlockedDPFCleaningDevon`, `DPFCleaningDevon/Exeter/NewtonAbbot/Paignton/Plymouth/Torquay/Totnes`, `DPFDiagnosticsDevon`, `EcuCloning`, `Pricing`, `RemappingDevon`, `VehiclePerformanceLookup`.

**Crawler / forms:**
- `public/robots.txt` — explicit crawler policy (see §9).
- `src/components/QuickEnquiryForm.tsx` and `src/pages/RemappingBooking.tsx` — replaced the fictional `07700 900000`/`07700 000000` placeholders with "Your phone number".

_(Not changed: routes, canonicals, redirects, sitemap logic; the Phase 1/2 location copy, except where the shared template/schema reaches them.)_

---

## 2. Schema changes

- **Bug fixed:** homepage `hasOfferingCatalog` → **`hasOfferCatalog`** (the offer catalog is now valid and read by parsers).
- **Entity consolidation:** one canonical `LocalBusiness`/`AutomotiveService` node with a stable **`@id`** now appears on **111 pages** (home + 36 location/service + 69 vehicle + DPF hub + ECU hub…), so search/AI can merge every page onto one business entity.
- **Canonical NAP everywhere:** name **Auto-Cleanse** (+ `alternateName` ["AutoCleanse","Auto Cleanse", …]); telephone **`+441803269895`** (E.164); email; url; standardised address (**Webbers Yard**, no duplicate "Estate"); geo; **openingHoursSpecification** (Mon–Fri 08:00–17:00); **`logo`** (`autocleanse-text-logo.png`); `image`; `priceRange`; **`sameAs`** (Facebook, Instagram, YouTube, LinkedIn — existing official profiles).
- **Vehicle pages:** `Service` now references the business as **`provider`** (with `@id`) and adds `areaServed: Devon`.
- **FAQPage:** now on **45 pages**, and every FAQPage's Q&A is verified to appear verbatim in the visible HTML (schema never diverges from content). Added to the DPF hub (mobile-DPF/diagnostics/coverage) and made postal-dpf's schema match by rendering its FAQ visibly.
- **Not done (owner review):** `sameAs` left as the existing 4 profiles (LinkedIn is a personal profile — flagged). `AutoRepair` type not added (kept `AutomotiveService`+`LocalBusiness`); can be layered later if wanted.

---

## 3. NAP standardisation in visible content

- Brand: canonical **Auto-Cleanse** used in all new/edited copy and in schema; existing visible "AutoCleanse" instances were **not** mass-rewritten (kept as an accepted alternate). About page adds the note that the two spellings are the same business.
- Address string unified to "The Old Barn Industrial Estate, Webbers Yard, Totnes, Devon, TQ9 6JY" (visible Footer + Contact + schema).
- Visible phone display stays **01803 269895**; schema/`tel` intent standardised to E.164 in schema. (Converting every visible `tel:` href to `tel:+441803269895` is a minor optional follow-up — schema is the AI-critical part and is done.)

---

## 4. About page rewrite summary

`/about` now accurately describes the entity (previously trade-only DPF, no mention of remapping):
- **Auto-Cleanse is a Totnes-based DPF cleaning AND ECU remapping specialist**, serving **trade and private customers** across Devon (Plymouth, Exeter, Torbay, South Hams, North Devon).
- **DPF cleaning is off-vehicle** at the Totnes workshop, with local collection + UK-wide postal — **not** mobile/roadside.
- **ECU remapping is workshop or mobile** across Devon.
- **Diagnostics-first:** paid health check before and after; the remap is a **file matched to your exact vehicle**, applied carefully — **not written from scratch** or a generic flash-and-go.
- **Road-legal stance:** DPF/EGR/AdBlue kept intact on road cars.
- **Brand note:** "Auto-Cleanse is sometimes written as AutoCleanse online — it's the same Devon business."
- Values updated to "Service (trade & private)", "Diagnostics first", "Honest & local".
- **No invented owner names, years, job counts, awards or guarantees** (existing `foundingDate` in schema left as-is; owner/team name flagged for owner review).

---

## 5. DPF mobile clarification summary

Added a visible clarification + matching FAQPage schema so AI can answer the high-risk "does Auto-Cleanse offer mobile DPF cleaning?" correctly (**no**), framed positively as doing the job properly:

> **Do you offer mobile DPF cleaning?** No. Auto-Cleanse does not offer mobile DPF cleaning at the roadside. DPF cleaning is carried out off the vehicle using our workshop equipment in Totnes, or through postal and trade supply of the filter. Our mobile service applies to ECU remapping only.

Placed on the **DPF hub** (`/dpf-cleaning`) as a visible answer block + FAQ (+ FAQPage schema), and reinforced on **home** and **/about**. Diagnostics-are-paid is stated alongside. The ECU-location schema descriptions also now state DPF is off-vehicle at the workshop.

---

## 6. Answer blocks added

Concise, quotable TL;DR entity blocks near the top of:
- **`/`** — "Auto-Cleanse is a Totnes-based DPF cleaning and ECU remapping specialist serving trade and private customers across Devon. DPF cleaning is workshop/off-vehicle or postal (we do not offer mobile DPF cleaning), while ECU remapping is available at our Totnes workshop or mobile across Devon. Diagnostics are a paid check…"
- **`/ecu-remapping`** — anchors the Totnes base + workshop/mobile split + file-matched/diagnostics-first + emissions-intact.
- **`/dpf-cleaning`** — entity summary + the mobile-DPF clarification + diagnostics-paid.

---

## 7. Contact / NAP changes

`/contact` "Direct Access" now shows a full visible NAP + hours block: **Workshop** (Auto-Cleanse, full address), **Phone** (01803 269895 / `tel`), **Email**, and **Opening Hours** (Monday–Friday, 08:00–17:00) plus a one-line service summary (trade & private; DPF workshop/postal; ECU workshop/mobile). ContactPage schema NAP standardised to canonical.

---

## 8. Vehicle schema changes

All 69 vehicle `Service` schemas now reference the shared business as **`provider`** (via `@id`, with full canonical NAP) and declare **`areaServed: Devon`**. Vehicle-page bodies were not rewritten. Vehicle FAQ answers render via a separate component — **confirmed a future item**: unlike the location/DPF pages, vehicle FAQ answers are not yet all verified in prerendered HTML (vehicle pages are not in the 45 FAQPage set). Flagged for a small follow-up rather than changed here.

---

## 9. robots.txt changes

Explicit, intentional policy (all previously allowed via the wildcard — now named):
```
User-agent: Googlebot        Allow: /
User-agent: Bingbot          Allow: /
User-agent: OAI-SearchBot    Allow: /
User-agent: ChatGPT-User     Allow: /
User-agent: PerplexityBot    Allow: /
User-agent: GPTBot           Allow: /
User-agent: *                Allow: /
Sitemap: https://www.auto-cleanse.co.uk/sitemap.xml
```
CSS/JS/assets remain unblocked. GPTBot is **allowed** per the plan (maximum LLM presence); flip to `Disallow` if you prefer to withhold content from model training — it won't affect ChatGPT-search citations.

---

## 10. Schema validation notes

- Every JSON-LD block on all 134 pages parses as valid JSON.
- No invalid types/properties remain (the `hasOfferingCatalog`/`OfferingCatalog` typo is gone).
- All 45 FAQPage blocks' Q&A text is present verbatim in the visible page (verified with entity-decoding), so structured data matches content — safe for Google's structured-data guidelines.
- NAP is internally consistent (name, phone E.164, address, geo, hours) across all schema.

---

## 11. Owner review items

1. **Opening hours** — confirm Mon–Fri 08:00–17:00 (and any Saturday hours) before relying on the schema everywhere.
2. **Trade + private** — About/Contact/schema now say both; confirm this matches how you operate.
3. **Owner/team name** — not invented; add a real name/bio to `/about` if you'd like stronger E-E-A-T.
4. **`sameAs` / LinkedIn** — LinkedIn is a personal profile; swap for a company page if created. Confirm all profile URLs are current before relying on them.
5. **Off-site (next)** — claim/align **Google Business Profile, Bing Places, Apple Maps** with the exact canonical NAP; this is the biggest remaining lever and is outside code.
6. **Optional follow-ups** — convert visible `tel:` hrefs to E.164; verify/serve vehicle-page FAQ answers in HTML; consider layering the `AutoRepair` type.

---

## 12. AI visibility score estimate after changes

**~68 → ~82 / 100.**

| Dimension | Before | After (est.) |
|---|--:|--:|
| Crawlability / robots | 90 | 93 |
| Indexability / SSR | 90 | 92 |
| Entity clarity / NAP | 55 | 84 |
| Structured data (schema) | 62 | 86 |
| Answer readiness | 66 | 83 |
| Query coverage | 70 | 82 |
| Off-site consistency (unverified) | 45 | 48 |
| **Overall** | **68** | **~82** |

Biggest gains: entity consolidation (one `@id` + canonical NAP on 111 pages), the About fix, the mobile-DPF clarification (closes the top wrong-answer risk), and the homepage schema bug fix. Remaining ceiling is **off-site** (Google Business Profile etc.), which is owner action, not code.

---

**Phase AI-1 complete and the build is green (134 pages, 0 errors, 134/134 self-canonical, all JSON-LD valid, all FAQPage matching visible content). No routes, canonicals, redirects or sitemap logic were changed. Awaiting approval before any further phase.**
