---
# ── Required ─────────────────────────────────────────────────────────────────
title: "Your post title here"              # shown as the H1 and the SEO <title>
slug: "your-url-slug-here"                 # the /blog/<slug> URL. lowercase-hyphenated, no spaces
date: 2026-06-30                           # publish date (YYYY-MM-DD). Newest posts appear first
category: DPF                              # one of: DPF | ECU | AdBlue
excerpt: "One or two clear sentences."     # used on the card, the meta description and the OG share. ~150 chars
coverAlt: "Describe the cover image"       # ALWAYS required - describes the image for screen readers
author: "Auto-Cleanse"

# ── Optional ─────────────────────────────────────────────────────────────────
updated: 2026-06-30                        # last-updated date (sets dateModified). Remove if never updated
coverImage: "/blog/your-url-slug-here/cover.jpg"   # drop the image in /public/blog/<slug>/. Remove to use the branded fallback

# "The job" panel - fill these with the REAL job details. This is what makes a
# post genuinely original and is the strongest experience signal. Any field you
# leave out is simply hidden from the panel.
vehicle: "Make Model engine, e.g. Ford Transit Custom 2.0 EcoBlue"
mileage: "118,000"
faultCodes: [P2002, P244B]                 # YAML list. Remove the line or use [] if none
symptoms: "Limp mode, DPF light, poor MPG"
fix: "What you actually did to fix it"

# Internal linking - paths to the money pages this post should drive to.
# The FIRST one becomes the main call-to-action button on the post.
relatedServices: ["/blocked-dpf-cleaning-devon", "/dpf-cleaning-devon"]

# Keep true while drafting. It will NOT publish or appear in the sitemap until set to false.
draft: true
---

Write the post body in Markdown below the frontmatter.

## Use H2 and H3 headings for structure

Normal paragraphs with **bold**, _italics_ and [internal links](/dpf-cleaning-devon).
Lists work too:

- First point
- Second point

> Use a quote/callout for an important takeaway.

Keep it practical and specific. The vehicle, the fault codes and the actual fix
are what make each post original, so lean into the real detail of the job.
