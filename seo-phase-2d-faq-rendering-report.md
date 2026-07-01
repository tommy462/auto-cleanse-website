# Auto-Cleanse SEO — Phase 2D FAQ Rendering Report

_Completed 2026-07-01. Scope: fix the ECU location-page FAQ rendering issue found in Phase 2C, so the unique local FAQ answers written in Phases 1, 2B and 2C actually appear in the prerendered/static HTML. One shared component change plus FAQPage schema. **No location copy rewritten; no regionalise / 301 / canonical / noindex / removal; no DPF or vehicle page changes; no redirect changes.** Build, prerender, sitemap and accuracy checks all pass._

## Build & verification status

| Check | Result |
|---|---|
| `npm run build` (clean → client → SSR → prerender) | ✅ **134 pages, 0 errors** |
| Rendered `index.html` files | ✅ 134 (unchanged) |
| Sitemap URLs | ✅ 134 (unchanged) |
| Orphan pages (rendered ∉ sitemap / sitemap ∉ rendered) | ✅ 0 / 0 |
| Self-referential canonicals | ✅ **134 / 134** |
| Pages with `noindex` | ✅ 0 |
| Internal links to `/ecu-tuning-devon` or `/performance-remapping-devon` | ✅ 0 |
| Phase-2A removed URLs still gone (incl. `/fuel-savings-calculator`) | ✅ not in sitemap |
| "mobile DPF" wording | ✅ 0 pages |
| "free diagnostic" wording | ✅ 0 pages |
| Map-authoring overclaim wording | ✅ 0 pages |
| FAQ answers present in prerendered HTML (5 sample pages) | ✅ all 5 |

---

## 1. Files changed

| File | Change |
|---|---|
| `src/pages/RemappingLocation.tsx` | (a) `FaqItem` now **always renders the answer `<p>` in the DOM**, collapsed with the CSS `hidden` class when closed (was conditionally mounted, so absent from SSR). Added `aria-expanded` on the toggle button and `aria-hidden` on the answer. (b) Added a **`FAQPage` JSON-LD schema** built from the same `location.faqs` data that renders on the page. |

This single component powers **all** pages built on the shared template, so the fix reaches every one of them (see §3). No other files touched.

---

## 2. What was wrong, and how it was fixed

**What was wrong:** `FaqItem` rendered the answer with `{open && (<p>{a}</p>)}`. Because server-side rendering starts with `open = false`, the answer paragraph was **never emitted into the prerendered HTML** — only the question was. The FAQ answers (a large share of the unique local copy added in Phases 1/2B/2C) were therefore invisible to crawlers in the static output, and the pages carried no FAQPage schema either. That's why Phase 2C's rendered word-count gains (~+190) were smaller than the copy written.

**How it was fixed (preferred CSS-collapse approach, as requested):**
```jsx
// before
{open && (<p className="…">{a}</p>)}
// after
<p className={`…${open ? '' : ' hidden'}`} aria-hidden={!open}>{a}</p>
```
- The answer text is now **always in the DOM / prerendered HTML** (indexable), and only **visually collapsed** via Tailwind's `hidden` (`display:none`) when the accordion is closed.
- **User-facing behaviour is unchanged:** answers are collapsed by default (verified: every answer `<p>` carries the `hidden` class in the static output; **0** answers are open by default), and clicking the question toggles the class exactly as before. The chevron still rotates on open.
- **Clean hydration:** server and client both render `open = false` initially, so the markup matches — no hydration mismatch and no layout shift on load.
- **Accessibility improved:** `aria-expanded` on the button and `aria-hidden` on the collapsed answer.

---

## 3. Scope — which pages are fixed

The change is in the shared `RemappingLocation` template, so it applies to **all 36 pages that use it**:
- **29 ECU town/region pages** — major towns (Plymouth, Exeter, Torquay, Newton Abbot, Paignton, Totnes, Barnstaple), the 4 regional hubs (Torbay, South Hams, East Devon, North Devon), and all 18 small towns.
- **7 Devon service-type pages** — `/stage-1-remaps-devon`, `/mobile-ecu-remapping-devon`, `/van-remapping-devon`, `/diesel-remapping-devon`, `/4x4-remapping-devon`, `/fleet-vehicle-remapping-devon`, `/petrol-remapping-devon`.

**FAQPage schema now present on 44 pages total** — the 36 template pages above (newly added) plus the 8 pages that already had FAQPage schema (DPF pages etc., untouched). DPF and vehicle pages were not modified.

---

## 4. FAQPage schema — added (clean, matches visible content)

Added, because it is clean and risk-free here: the schema is generated from the **exact same `location.faqs` array** that renders the visible accordion, so the structured-data Q&A always matches the on-page Q&A verbatim (no divergence possible). It's emitted as a second `application/ld+json` block alongside the existing `AutomotiveService`/`LocalBusiness` schema.

Verified on all 5 sample pages: FAQPage schema present, and the first question **and** answer from the schema also appear in the visible `<main>` (scripts stripped) — i.e. schema and visible text agree.

> Note: Google now shows FAQ *rich results* only for authoritative gov/health sites, so this won't add rich snippets — but it's valid, matching structured data that helps machine understanding, and it carries no risk since it mirrors visible content.

---

## 5. FAQ answer rendering — verification (required sample pages)

For each, the FAQ **question and answer** are present in the prerendered `<main>` (with scripts stripped, so this is the visible DOM, not just schema), the page renders correctly, and the accordion still collapses/expands:

| Page | Q in HTML | A in HTML | FAQPage schema | Collapsed by default |
|---|:--:|:--:|:--:|:--:|
| `/ecu-remapping-dawlish` | ✅ | ✅ | ✅ | ✅ |
| `/ecu-remapping-plymouth` | ✅ | ✅ | ✅ | ✅ |
| `/ecu-remapping-torquay` | ✅ | ✅ | ✅ | ✅ |
| `/ecu-remapping-exeter` | ✅ | ✅ | ✅ | ✅ |
| `/stage-1-remaps-devon` | ✅ | ✅ | ✅ | ✅ |

---

## 6. Impact — sample before/after

"Before" = the page's word count/uniqueness after Phase 2A/2B/2C (i.e. immediately before this fix). "After" = with FAQ answers now in the static HTML.

### Rendered word count (indexable `<main>`)

| Page | Before | After | Δ |
|---|--:|--:|--:|
| `/ecu-remapping-dawlish` | 1060 | **1287** | +227 |
| `/ecu-remapping-teignmouth` | 1023 | **1239** | +216 |
| `/ecu-remapping-brixham` | 1038 | **1259** | +221 |
| `/ecu-remapping-plymouth` | 1410 | **1756** | +346 |
| `/ecu-remapping-torquay` | 1449 | **1685** | +236 |
| `/ecu-remapping-newton-abbot` | 1364 | **1617** | +253 |
| `/stage-1-remaps-devon` | 1650 | **2045** | +395 |

### Uniqueness (post-Phase-1 audit method: nearest-sibling shingle containment)

| Page | Before | After | Dup% now |
|---|--:|--:|--:|
| `/ecu-remapping-dawlish` | 35 | **47** | 60 |
| `/ecu-remapping-teignmouth` | 34 | **47** | 60 |
| `/ecu-remapping-brixham` | 35 | **49** | 58 |
| `/ecu-remapping-plymouth` | 49 | **63** | 46 |
| `/ecu-remapping-torquay` | 54 | **61** | 48 |
| `/ecu-remapping-newton-abbot` | 58 | **64** | 45 |
| `/stage-1-remaps-devon` | 68 | **75** | 32 |

This one template fix delivered a bigger uniqueness lift than the Phase-2C copy pass, because it surfaced **all** the FAQ answers written across every phase, on every location page at once. The three sample small towns jumped to ~47–49 (the level the priority towns reached in Phase 2B), and the priority towns/Stage-1 moved firmly into the 60s–70s. Every other location page benefits equally.

---

## 7. Visual / UX risks

- **Low risk.** The page looks identical on load — answers are `display:none` until clicked, exactly as before (they were previously not in the DOM at all; now they're in the DOM but hidden). No visible layout change, no extra whitespace, no answers shown open.
- **No hydration mismatch / layout shift** — server and client both start collapsed.
- **SEO note:** answers are indexed as `display:none` accordion content, which Google crawls and indexes normally for this standard UX pattern; the matching FAQPage schema reinforces it. This is the accepted best-practice approach.
- **Accessibility:** slightly improved (`aria-expanded`, `aria-hidden`). Not a full ARIA disclosure-widget implementation, but no regression.

---

## 8. Owner review items

1. **Quick visual spot-check** on a couple of location pages (e.g. Dawlish, Plymouth) to confirm the accordion opens/closes as expected in the browser — automated checks confirm the markup, but a human glance is worth it.
2. **FAQPage schema** is now on 36 location pages. If you'd prefer *not* to publish FAQ structured data (some owners keep schema minimal), it can be removed in one line — the rendered-HTML fix (the important part) stands on its own without it. Left in because it's clean and matches visible content.
3. Nothing else requires review — no copy, prices, claims, redirects or canonicals were changed.

---

## 9. Deliberately NOT done (as instructed)

- No location copy rewritten (only the render mechanism changed).
- No regionalise / 301 / canonicalise / noindex / removal.
- No DPF or vehicle page changes (their existing FAQ implementations were left alone).
- No redirect/canonical changes (no bug found; 0 links to the Phase-2A removed routes).
- No AI-visibility audit.

---

**Phase 2D complete and the build is green (134 pages, 0 errors, 134/134 self-canonical). FAQ answers now render in the prerendered HTML across all 36 shared-template pages, with matching FAQPage schema. Sample pages gained +216 to +395 indexable words and +6 to +14 uniqueness points; the biggest remaining content lever (a second local section on the thinnest small towns, or consolidation) remains available if wanted. Awaiting your decision.**
