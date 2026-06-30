# Auto-Cleanse Blog - How to add a post

The blog is fully static. Every post is a single Markdown file in this folder
(`content/blog/`). There is no CMS and no login - you write a file, push it, and
Vercel rebuilds the site with the new post live.

## The weekly flow

1. **Copy the template.** Duplicate `_template.md` and rename it to your post's
   slug, e.g. `bmw-320d-stage-1-remap.md`. (Files starting with `_` and this
   `README.md` are ignored - they never become posts.)

2. **Fill in the frontmatter** (the block between the two `---` lines). Every
   field is explained inline in `_template.md`. The important ones:
   - `title`, `slug`, `date`, `category` (`DPF`, `ECU` or `AdBlue`), `excerpt`, `coverAlt`.
   - The **"The job" fields** (`vehicle`, `mileage`, `faultCodes`, `symptoms`,
     `fix`). Filling these in with the **real** job details is what makes each
     post genuinely original and is the strongest signal that the work is real.
   - `relatedServices` - the money pages this post should link to. The first one
     becomes the main button on the post.

3. **Write the body** in Markdown below the frontmatter. Use `##` and `###`
   headings, paragraphs, lists and `[links](/dpf-cleaning-devon)`.

4. **Add an image (optional).** Drop a cover image in
   `public/blog/<your-slug>/cover.jpg` and set `coverImage` to that path. If you
   skip it, a branded fallback cover is used automatically. **Always** fill in
   `coverAlt` either way. Keep covers roughly 1200x675 (16:9) so there is no
   layout shift.

5. **Publish.** Set `draft: false`, then commit and push:
   ```
   git add content/blog public/blog
   git commit -m "Blog: <post title>"
   git push
   ```
   Vercel rebuilds automatically. The post appears at `/blog/<slug>`, is added to
   the sitemap and RSS feed, and shows in the matching category filter and the
   "Latest from the workshop" block on the related service page.

## While you are still writing

Leave `draft: true`. Draft posts do **not** appear on the live site, the sitemap
or the RSS feed, so you can commit work-in-progress safely.

## What makes a good post

- A real vehicle, real fault codes, and the real fix. Generic posts rank poorly;
  specific job write-ups are what set this apart.
- A clear, honest excerpt (it becomes the Google description and the social card text).
- One or two internal links to the relevant service page.

## Examples to learn from

- `blocked-dpf-ford-transit-custom.md` (DPF)
- `adblue-no-start-countdown-sprinter.md` (AdBlue)

These are worked examples. Replace them with your own real jobs over time, or
keep them as evergreen explainers.
