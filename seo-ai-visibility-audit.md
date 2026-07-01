# Auto-Cleanse — AI Visibility / Answer Engine Optimisation (AEO) Audit

_Generated 2026-07-01. **Audit and report only — no code, schema, robots, or content changes made; nothing deployed.** Based on the current build (134 pages) after Phases 1, 2A, 2B, 2C and 2D. Method: static analysis of prerendered `dist/` HTML + JSON-LD, `robots.txt`, `vercel.json` and source components. No external web browsing was performed, so off-site presence is provided as a checklist to confirm, not verified findings. Companion machine-readable file: `seo-ai-visibility-audit.json`._

## Executive summary

Auto-Cleanse is in good technical shape for AI answer engines — it is fully crawlable, server-rendered, self-canonical, snippet-friendly, and (after Phase 2D) its FAQ answers are in the static HTML with matching FAQPage schema. The content rewrites of Phases 1–2C mean most service and location pages can now be quoted cleanly by an AI for "who offers X in Y" queries.

Three things hold it back from AI systems confidently **citing and recommending** it:

1. **Entity ambiguity.** The brand is written two ways (**"AutoCleanse" 2,076× vs "Auto-Cleanse" 596×**, the latter being the domain/email), and the **About page mis-describes the business** as a trade-only DPF specialist that never mentions ECU remapping — contradicting the rest of the site. An AI reading `/about` (the canonical "who is this?" source) would conclude Auto-Cleanse is trade-only DPF and might not recommend it for remapping or to private customers.
2. **Schema inconsistency + one bug.** The homepage entity is rich, but a `hasOfferingCatalog` typo silently voids its offer catalog, telephone/address strings vary between templates, and location/vehicle pages omit `openingHours`, `sameAs`, `logo` and (for vehicles) `provider`.
3. **A high-risk missing negative fact.** The DPF hub never explicitly says **"we do not offer mobile DPF cleaning"** — it's only implied. Given how heavily *mobile ECU remapping* is promoted, an AI can easily give the wrong answer ("yes, mobile DPF") unless the negative is stated plainly.

None of these require large rewrites — they're mostly schema/entity fixes plus one About rewrite and a few short answer blocks.

## Current AI visibility score: **68 / 100**

| Dimension | Score |
|---|--:|
| Crawlability / robots | 90 |
| Indexability / SSR | 90 |
| Entity clarity / NAP | 55 |
| Structured data (schema) | 62 |
| Answer readiness | 66 |
| Query coverage | 70 |
| Off-site consistency (unverified) | 45 |
| **Overall** | **68** |

---

## Top 20 AI visibility improvements

1. **Fix the homepage schema typo** `hasOfferingCatalog` → `hasOfferCatalog` (offer catalog is currently ignored by parsers).
2. **Rewrite `/about`** to cover BOTH DPF cleaning AND ECU remapping, BOTH trade AND private customers, name the owner/team, and state Totnes base + Devon coverage + experience.
3. **Add an explicit "DPF cleaning is workshop/off-vehicle — we do not offer mobile DPF cleaning" statement + FAQ** on the DPF hub and DPF town pages.
4. **Standardise the brand:** pick "Auto-Cleanse" as canonical, add `alternateName` covering both spellings, and add a one-line note on `/about`.
5. **Standardise telephone to E.164** (`+441803269895`) everywhere; fix the `01803 269895` vs `01803269895` split.
6. **Roll `openingHoursSpecification` onto every LocalBusiness** (missing on ECU-location and vehicle pages).
7. **Roll `sameAs` (all confirmed profiles) onto every LocalBusiness** (currently home + 4 pages; DPF has Facebook only).
8. **Add a `logo`** property (`autocleanse-text-logo.png`) to the LocalBusiness/Organization entity.
9. **Anchor the Totnes/Devon base on `/ecu-remapping`** (the ECU hub currently doesn't mention Totnes or "based in").
10. **Add concise TL;DR entity/answer blocks** near the top of `/`, `/ecu-remapping`, `/dpf-cleaning` ("Auto-Cleanse is a Totnes-based DPF cleaning & ECU remapping specialist covering Devon…").
11. **State "diagnostics are paid"** explicitly on the DPF pages and hubs (already on Stage-1/location pages).
12. **Add `provider` (LocalBusiness) to vehicle `Service` schema** and verify vehicle FAQ answers are in the HTML (different component from the location FAQ).
13. **Standardise the address string** (`Webbers Yard` vs `Webbers Yard Estate`).
14. **Consolidate the entity with a stable schema `@id`** referenced across templates (reduces entity fragmentation).
15. **Strengthen `/contact`** with an explicit NAP + opening-hours block in HTML.
16. **robots.txt:** add explicit `Allow` blocks for Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot; make a conscious GPTBot decision.
17. **Confirm & claim Google Business Profile, Bing Places, Apple Maps**, align NAP, then add those URLs to `sameAs`.
18. **Consider adding the `AutoRepair` type** (specific AutomotiveBusiness subtype) alongside LocalBusiness to sharpen the category.
19. **Replace the fictional form placeholder** `07700 900000` with a non-numeric hint (avoids AI/user mis-reading it as a contact number).
20. **Grow the blog** with 2–3 AI-friendly explainers ("DPF cleaning vs ECU remapping", "DPF/EGR/AdBlue — what's legal on UK roads") and case-study proof; the RSS feed only has 2 posts.

---

## Crawler / robots recommendations

**Current state:** `robots.txt` is `User-agent: * / Allow: /` plus a `Sitemap:` line. This **already allows every crawler** — Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, CCBot. No page emits `noindex`; there are **no `nosnippet` / `max-snippet:0` restrictions** and no `X-Robots-Tag` headers in `vercel.json`; CSS/JS is not blocked; the sitemap is referenced. This is a good baseline — nothing is currently blocked.

**Recommended (make the policy explicit and intentional):**

| Bot | Recommendation |
|---|---|
| Googlebot | **Allow** (already) |
| Bingbot | **Allow** (already — also feeds Copilot) |
| OAI-SearchBot | **Allow** explicitly — ChatGPT search citations |
| ChatGPT-User | **Allow** explicitly — ChatGPT live user fetches |
| PerplexityBot | **Allow** — Perplexity citations |
| GPTBot | **Owner decision.** GPTBot is model-*training* crawl, not live search. **Allow** for maximum long-term LLM brand presence; **Disallow** only if you want to withhold content from training. Blocking GPTBot does **not** reduce ChatGPT-search citations (those use OAI-SearchBot/ChatGPT-User). |

Keep CSS/JS open, keep the sitemap referenced. The wildcard already covers these, but adding **explicit named `Allow` blocks** makes the policy auditable and future-proof (and signals intent to AI crawler operators).

---

## Schema recommendations (do not implement yet)

**What exists:** Homepage carries a strong `AutomotiveService`+`LocalBusiness` entity (name, alternateName, telephone, email, image, address, geo, areaServed, `openingHoursSpecification`, paymentAccepted, currenciesAccepted, priceRange, `sameAs`×4, `contactPoint`) plus `Service` nodes, `FAQPage`, and `BreadcrumbList`. DPF core pages have LocalBusiness + hours + (partial) sameAs + breadcrumb. ECU-location pages have LocalBusiness + geo + areaServed + FAQPage + breadcrumb. Vehicle pages have only `Service` + `BreadcrumbList`. FAQPage schema (Phase 2D) is on 44 pages and matches visible text.

**Bugs to fix:**
- **`hasOfferingCatalog` → `hasOfferCatalog`** on the homepage (invalid property → the whole offer catalog is ignored).
- **Telephone** not E.164 and inconsistent (`01803 269895` vs `01803269895`) → `+441803269895` everywhere.
- **Address string** differs (`Webbers Yard` vs `Webbers Yard Estate`) → pick one.

**Gaps to add:**
- **`logo`** (dedicated) — currently only `image` (og-image.jpg).
- **`openingHoursSpecification`** on ECU-location + vehicle pages.
- **`sameAs`** (all confirmed profiles) on all templates; DPF core has Facebook only.
- **`alternateName`** including the hyphenated **"Auto-Cleanse"** (homepage alternateName omits it).
- **`provider`** (the AutoCleanse LocalBusiness) on vehicle `Service` schema; add `areaServed`.
- **Single `@id`-referenced LocalBusiness entity** across pages (entity consolidation).
- Consider **`AutoRepair`** type to sharpen category.

**Conflicts / safety:** No schema currently contradicts visible content (FAQPage matches; NAP matches). The only conflict is a *content* one (the About page positioning). Schema is safe/valid apart from the typo. **Keep the Phase-2D discipline: never add schema that diverges from visible text.**

---

## Entity / NAP recommendations

| Field | Current | Recommended |
|---|---|---|
| Name | "AutoCleanse" (2076×) / "Auto-Cleanse" (596×, = domain/email) | Canonical **Auto-Cleanse**; `alternateName` ["AutoCleanse","Auto Cleanse"]; note on /about |
| Phone | `01803 269895` and `01803269895` (mixed) | Display `01803 269895`; `tel:+441803269895`; schema `+441803269895` |
| Email | info@auto-cleanse.co.uk | ✅ consistent — keep |
| Address | "…Webbers Yard" vs "…Webbers Yard Estate" | Pick one string, use everywhere |
| Opening hours | Mon–Fri 08:00–17:00 (home/DPF schema only) | Confirm (incl. Sat) + put on all templates |
| Base | Totnes, Devon (clear except `/ecu-remapping`) | Anchor Totnes on the ECU hub too |
| About | Trade-only DPF; omits ECU remapping | Rewrite: both services, trade + private, owner/experience |
| Placeholder phone | `07700 900000` (form placeholder, 48 pages) | Non-numeric hint (e.g. "Your mobile number") |

**Real-business credibility:** Good — consistent NAP, geo, hours, reviews, social links and an owner LinkedIn. The main risk is the About page under-selling the entity, not a lack of legitimacy.

---

## Page-level answer-readiness

Score = how confidently an AI could quote the page (0–100).

| URL | Answer block | States location/service/coverage | FAQs in HTML | AI-quotable | Key fix |
|---|---|---|---|--:|---|
| `/` | Partial | Yes (off-vehicle DPF, Stage 1/2, Devon, postal) | Yes | 70 | Add 1-line entity TL;DR |
| `/about` | Weak | Totnes but **trade-only DPF; no remapping** | No | 40 | **Rewrite — both services, trade+private, owner** |
| `/contact` | Weak | Phone only, thin | No | 45 | Add NAP + hours block |
| `/dpf-cleaning` | Partial | Workshop implied, **not-mobile not explicit** | Yes | 68 | Add explicit "no mobile DPF" + paid-diag |
| `/dpf-cleaning-devon` | Partial | Collection/trade Devon | Yes | 70 | Same not-mobile line |
| `/blocked-dpf-cleaning-devon` | Good | Symptoms + Devon | Yes | 74 | Not-mobile line for consistency |
| `/dpf-diagnostics-devon` | Good | Diagnostics + no illegal deletes | Yes | 78 | State diagnostics paid |
| `/postal-dpf` | Good | Off-vehicle postal | No | 72 | Add 2-line "how postal works" + £230 |
| `/ecu-remapping` | Partial | Services yes; **no Totnes base** | No | 65 | Anchor Totnes/Devon + short FAQ |
| `/mobile-ecu-remapping-devon` | Good | Mobile ECU only; DPF off-vehicle; Totnes | Yes | 82 | Keep |
| `/stage-1-remaps-devon` | **Excellent** | All facts present | Yes | 88 | Model page — no change |
| `/petrol-remapping-devon` | Partial | Generic petrol | Yes | 58 | Resolve rewrite-vs-301 (Phase 2B) |
| `/adblue-repair-devon` | Good | AdBlue + legality | Yes | 78 | "Repair, not delete on road cars" |
| `/ecu-remapping-exeter` | Good | Local + coverage + paid diag | Yes | 80 | Schema hours/sameAs |
| `/ecu-remapping-torquay` | Good | Local + DPF off-vehicle | Yes | 80 | Schema hours/sameAs |
| `/ecu-remapping-plymouth` | Good | Local + honest distance | Yes | 79 | Schema hours/sameAs |
| `/ecu-remapping-totnes` | Good | Home workshop + coverage | Yes | 80 | Schema hours/sameAs |
| `/ecu-remapping-north-devon` | Good | Regional hub + mobile-first | Yes | 77 | Schema hours/sameAs |
| `/bmw-320d-remap` | Good | Model + paid diag + no delete | Client comp. | 74 | Add `provider`; verify FAQ in HTML |
| `/vw-transporter-remap` | Good | Model + paid diag + no delete | Client comp. | 73 | Add `provider`; verify FAQ in HTML |

**The 11 factual AI questions** (who/where/what/mobile-remap/mobile-DPF/coverage/booking/vehicles/DPF-vs-remap/free-diagnostics/deletes) are all answerable from the site **except** two soft spots: **"Does Auto-Cleanse offer mobile DPF cleaning?"** (answer should be *no* — not stated explicitly on the DPF hub) and **"Who is Auto-Cleanse?"** (About page mis-frames it). "Are diagnostics free?" (no) and "Are deletes offered on road cars?" (no) are well covered on remapping/location pages but thin on the DPF/hub pages.

---

## Query simulation

| Query | Best target URL | Strength | Missing / improvement |
|---|---|--:|---|
| Who offers DPF cleaning in Devon? | `/dpf-cleaning` | 78 | Entity TL;DR + not-mobile clarity |
| Who offers DPF cleaning near Totnes? | `/dpf-cleaning-totnes` | 74 | NAP/hours in schema |
| Who offers DPF cleaning in Exeter? | `/dpf-cleaning-exeter` | 72 | Concise summary + off-vehicle line |
| Does Auto-Cleanse clean DPFs? | `/dpf-cleaning` | 80 | TL;DR summary |
| **Does Auto-Cleanse offer mobile DPF cleaning?** | `/dpf-cleaning` + `/mobile-ecu-remapping-devon` | **55** | **Explicit NO on the DPF hub — currently only implied; AI may wrongly infer yes** |
| Who offers mobile ECU remapping in Devon? | `/mobile-ecu-remapping-devon` | 85 | Strong — keep |
| Who offers ECU remapping in Exeter? | `/ecu-remapping-exeter` | 82 | Schema hours/sameAs |
| Who offers ECU remapping in Torquay? | `/ecu-remapping-torquay` | 82 | Schema hours/sameAs |
| Who offers ECU remapping in Plymouth? | `/ecu-remapping-plymouth` | 80 | Keep |
| Who offers Stage 1 remaps in Devon? | `/stage-1-remaps-devon` | 90 | Model page |
| Who offers petrol remapping in Devon? | `/petrol-remapping-devon` | 55 | Resolve rewrite-vs-301 |
| Who offers AdBlue diagnostics in Devon? | `/adblue-repair-devon` (+ `/dpf-diagnostics-devon`) | 74 | Add "AdBlue diagnostics" phrasing + paid-diag |
| Can Auto-Cleanse remap a BMW 320d? | `/bmw-320d-remap` | 80 | Add `provider` schema |
| Can Auto-Cleanse remap a VW Transporter? | `/vw-transporter-remap` | 79 | Add `provider` schema |

---

## Off-site AI visibility checklist (confirm, don't assume)

_No web browsing was done. Use the canonical NAP below on every profile; consistency across these sources is what lets AI local assistants trust and recommend the business._

**Canonical NAP**
- **Name:** Auto-Cleanse (alternate: AutoCleanse)
- **Address:** The Old Barn Industrial Estate, Webbers Yard, Totnes, Devon, TQ9 6JY
- **Phone:** +44 1803 269895
- **Email:** info@auto-cleanse.co.uk
- **Hours:** Mon–Fri 08:00–17:00 (confirm Saturday)
- **URL:** https://www.auto-cleanse.co.uk

**Preferred description:** "Auto-Cleanse is a Totnes-based DPF cleaning and ECU remapping specialist serving trade and private customers across Devon. DPF cleaning is carried out off the vehicle at the workshop (plus nationwide postal); ECU remapping is available at the workshop or mobile across Devon. Diagnostics before and after every remap."

**Services to list:** DPF cleaning (workshop/off-vehicle), postal DPF, DPF diagnostics, blocked-DPF, ECU remapping (Stage 1 & 2), mobile ECU remapping, economy/diesel/van/4x4/fleet remapping, AdBlue repair, ECU cloning.
**Service areas:** Totnes & South Hams · Torbay · Exeter & East Devon · Plymouth & SW Devon · Newton Abbot & Teignbridge · North Devon · Mid/West Devon · nationwide (postal DPF).

| Profile | Action | Priority |
|---|---|---|
| **Google Business Profile** | Claim/align NAP; category Auto repair shop; services, areas, photos/video, messaging | Highest |
| Bing Places | Claim/align (feeds Copilot/Bing) | High |
| Apple Maps (Business Connect) | Claim/align (feeds Siri/Apple) | High |
| Facebook | Confirm; prefer a vanity URL over `profile.php?id=` | Medium |
| Instagram (`auto_cleansedpf`) | Align bio NAP + link | Medium |
| YouTube (`@Auto-Cleanse`) | Align about/links (real footage = strong proof) | Medium |
| LinkedIn | Consider a **company** page (current `sameAs` is a personal profile) | Low |
| Directories (Yell, FreeIndex, Cylex, Scoot…) | Consistent NAP + category | Medium |
| Review platforms | Google reviews primary; keep responding | High |
| Trade/supplier partner pages | Any "find an installer" listings — align NAP | Low |

**`sameAs` to add to schema once confirmed:** Facebook, Instagram, YouTube, LinkedIn (company), Google Business Profile URL.

---

## Brand / entity consistency recommendation

Standardise on **"Auto-Cleanse"** (matches the domain and email) as the canonical brand, with **"AutoCleanse"** as an accepted alternate. **Do not** mass-rewrite the 2,000+ visible "AutoCleanse" instances now — instead:
1. Set schema `name` to the canonical and add `alternateName: ["Auto-Cleanse","AutoCleanse","Auto Cleanse"]`.
2. Add one line to `/about`: *"Auto-Cleanse (sometimes written AutoCleanse online) is…"*.
3. Use the canonical form in all NEW copy and every off-site profile.

---

## Content gaps worth filling (prioritised — not a long list)

1. **Explicit "Do you offer mobile DPF cleaning?" answer + DPF-process clarity** — High value, low effort. Section/FAQ on the DPF hub + town pages (not a new page). Fixes the biggest wrong-answer risk and states diagnostics are paid.
2. **About page rewrite** — High value. The primary entity source.
3. **"DPF cleaning vs ECU remapping — what's the difference"** — Medium. Section on `/services` or a short post; classic AI comparison query.
4. **"DPF, EGR & AdBlue — what's legal on UK roads"** — Medium. E-E-A-T + reinforces the no-delete stance.
5. **Case-study proof (real jobs, images/video)** — Medium. First-hand trust; leverages existing YouTube footage.

_(Deliberately not recommending large numbers of new pages — the site already has good coverage after Phases 1–2D.)_

---

## Technical AI-readability checks

| Check | Result |
|---|---|
| SSR / prerendered content | ✅ all content in static HTML |
| FAQ answers in HTML | ✅ location/service pages (Phase 2D) + FAQPage schema; ⚠️ verify vehicle-page FAQ component |
| Schema validity | ⚠️ valid except `hasOfferingCatalog` typo |
| Titles / meta clarity | ✅ clear, keyworded, self-canonical |
| Open Graph / Twitter cards | ✅ complete on every page |
| Image alt text | ✅ 100% on sampled pages |
| Logo | ⚠️ asset exists, not referenced as schema `logo` |
| Contact details in HTML | ✅ most pages; ⚠️ `/contact` thin |
| Client-only critical facts | ✅ none after Phase 2D |
| nosnippet / max-snippet:0 | ✅ none (AI snippets allowed) |
| Sitemap freshness | ✅ fresh |
| RSS feed | ⚠️ present but only 2 posts |

---

## Exact Phase AI-1 implementation plan (for approval — not yet done)

1. **Fix homepage schema bug** `hasOfferingCatalog` → `hasOfferCatalog`.
2. **Create one shared LocalBusiness schema constant** (name, `alternateName` [Auto-Cleanse, AutoCleanse], `telephone` `+441803269895`, email, url, `image` + `logo`, standardised `address`, `geo`, `openingHoursSpecification`, `sameAs` [confirmed], `priceRange`, stable `@id`) and emit it consistently on ALL templates (location, vehicle, DPF, core).
3. **Standardise telephone (E.164) and address string** site-wide.
4. **Rewrite `/about`** for entity clarity (both services, trade + private, Totnes base + Devon coverage, owner/team + experience, brand-name note).
5. **Add explicit "DPF cleaning is workshop/off-vehicle — no mobile DPF" statement + FAQ** on the DPF hub + town pages; state diagnostics are paid.
6. **Add TL;DR entity/answer blocks** to `/`, `/ecu-remapping` (anchor Totnes), `/dpf-cleaning`.
7. **Strengthen `/contact`** with a NAP + hours block.
8. **Add `provider` to vehicle `Service` schema**; verify vehicle FAQ answers render in HTML.
9. **robots.txt:** explicit `Allow` for Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot; conscious GPTBot decision; keep sitemap + CSS/JS open.
10. **Off-site:** confirm/claim GBP + Bing + Apple, align NAP, then add verified profile URLs to `sameAs`.

**Expected effect:** entity becomes unambiguous and machine-consolidated; the two wrong-answer risks (mobile DPF, "who is this") are closed; every template carries complete, consistent, valid LocalBusiness + FAQ schema — moving the AI visibility score from ~68 into the low-to-mid 80s.

---

## Risks / owner review items

1. **Confirm opening hours** (incl. Saturday) before hard-coding them everywhere.
2. **Confirm the business serves BOTH trade and private customers** — the About page says "exclusively trade"; this drives the About rewrite and off-site descriptions.
3. **Confirm owner/team name** for About (LinkedIn suggests Alex Rabone).
4. **Confirm canonical brand spelling** (recommended Auto-Cleanse).
5. **Confirm each social/GBP/Bing/Apple URL** before adding to `sameAs` (only add verified profiles).
6. **Decide GPTBot** allow vs disallow (visibility vs training-content control).
7. **Placeholder phone** `07700 900000` is only a form placeholder — consider a non-numeric hint.
8. **Keep Phase-2D discipline:** never add schema that diverges from visible text.

---

**AI visibility audit complete. Current score 68/100 — technically strong, content much improved, held back by entity/About misalignment, schema inconsistency + one typo, and unverified off-site presence. No code changes were made. Awaiting approval before any Phase AI-1 implementation.**
