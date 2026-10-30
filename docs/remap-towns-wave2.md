# National Stage 1 remap towns: wave 2

Completed locally on 30 October 2026. This work has not been pushed or deployed.

## Result

- 343 additional town pages, bringing the remap total to 447 (104 in wave 1).
- URLs remain `/ecu-remapping/<town>`, listed at `/ecu-remapping/areas` and in
  `sitemap-remap-towns.xml`. Devon keeps its existing URLs.
- No published national price. Coverage is confirmed by phone; the work is done
  by an independent mobile technician from our national network.
- Local copy uses the saved town fact sheets, with council vehicle figures
  distinguished from town Census data and postcode-area MOT figures.
- All 343 new towns have Census data: 290 England, 15 Wales, 27 Scotland and
  11 Northern Ireland. Scottish comparisons use Scotland's 2022 figures.
- Northern Ireland pages have no DVSA model list. Approximated NISRA settlement
  figures carry their source limitations. The original four Scottish wave-1
  cities still have no Census data; this work does not invent it.

## Validation

- `npm run build`: passed, 1,672 pages, 1,658 public sitemap URLs.
- Both source copy checkers: passed, 447 towns, none missing, no flagged wording
  or numbers. An additional percentage-only check matched all 2,053 percentage
  mentions in wave 2 to percentage fields in the appropriate town's fact sheet
  (including absolute values when describing a fall).
- Repeated data generation is byte-for-byte stable. Rebuilding preserves the
  source date of an unchanged town. All sitemap lastmod changes relative to the
  wave-1 commit are confined to `/ecu-remapping/` pages and their areas index.
- `node scripts/verify-remap-towns.mjs`: passed for all 447 pages. Checks built
  HTML for canonicals, sitemap presence, rendered copy, FAQ schema, hydration
  records, local links, country labels and the areas index. Checks all 10
  trade-invite pages return HTTP 200, remain noindex and stay out of the sitemap.
- The AdBlue sitemap still contains all 1,009 URLs. Town copy is absent from the
  client JavaScript bundles.
- Browser review at a 375px viewport: Bath, Falkirk, Derry, New Haw/West Byfleet/
  Sheerwater, and the areas index. No page-level horizontal overflow or browser
  warnings/errors on these samples. No forms were submitted or call links used.
- TypeScript remains blocked by 19 existing diagnostics in unrelated components,
  including the EcuCloning breadcrumb `href` mismatch and unused declarations.
  None point to the remap changes. Focused ESLint reports the six pre-existing
  unused `_lat`, `_lng`, `_wave` destructurings in `src/entry-server.tsx`; the
  other changed files have no reported lint errors.

## Similarity

Five-word shingle Jaccard scores from the built main content. Remap pairwise
figures cover all 447 pages. The AdBlue pairwise baseline samples 149 matching
towns; its unique-share figure covers all 447 matching towns.

| Measure | Remap | AdBlue comparison |
| --- | ---: | ---: |
| Average pairwise overlap | 22.2% | 29.7% |
| Worst pairwise overlap | 32.1% | 38.8% |
| Median text unique within its set | 39.7% | 42.1% |
| Mean overlap with the same town's AdBlue page | 8.0% | n/a |

The worst remap pair remains Barnet/Camden. These are text checks, not a guarantee
of Google indexing or ranking.

## Sources and repeatable commands

Source sheets, written copy and check logs remain outside the Git repository at
`../../national-expansion/remap-towns/`, with wave 2 under `wave2/`.
The final production dataset is committed at `src/data/remap-towns/towns.json`.

Run from the project directory:

```text
node ../../national-expansion/remap-towns/wave2/check-copy.mjs
node scripts/build-remap-towns.mjs ../../national-expansion/remap-towns ../../national-expansion/remap-towns/wave2
npm run build
```

Start `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort` in a second
terminal, then run:

```text
node scripts/verify-remap-towns.mjs
node scripts/town-similarity.mjs
```

After Tom authorises deployment, push main. The push will also include the
previously unpushed header and 104-town wave-1 commits. After the deployment is
confirmed, run IndexNow and submit the remap sitemap to Google Search Console
and Bing. Those external publishing/indexing steps have not been performed.
