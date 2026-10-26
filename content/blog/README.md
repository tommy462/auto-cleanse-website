# Auto-Cleanse Blog - How it works

The blog is fully static. Every post is a single Markdown file in this folder
(`content/blog/`). There is no CMS and no login - you write a file, push it, and
Vercel rebuilds the site with the new post live.

## Posts publish themselves every Monday

A post goes live when **both** of these are true:

- `draft: false`
- its `date` has arrived (UK time)

So posts can be written weeks ahead and committed with a future Monday as their
`date`. They sit in the repo, scheduled, and stay off the live site, the sitemap
and the RSS feed until their date.

Every Monday at about 7am the GitHub Action `.github/workflows/weekly-blog.yml`
checks the live site. If a post's date has arrived and it is not live yet, the
Action asks Vercel for a fresh build, waits until the post is live, and tells
IndexNow (Bing and others) about it. Google picks it up from the sitemap.

When only two or fewer posts are left in the queue, the Action opens a GitHub
issue called **"Blog queue running low"**, so you get an email in good time.

You can also run it by hand: GitHub, then the **Actions** tab, then
**Weekly blog publish**, then **Run workflow**.

The Action needs one secret, `VERCEL_DEPLOY_HOOK_URL`, holding a Vercel deploy
hook for the `main` branch (Vercel: Project, Settings, Git, Deploy Hooks).
Without it the Action fails and GitHub emails you to say so.

## Handy commands (run in this project folder)

```
npm run blog:status   # what is live, what is scheduled, which covers are still placeholders
npm run blog:covers   # install your enhanced cover art from the workspace root
npm run blog:ship     # install covers, commit content/blog + public/blog, push to main
```

`blog:ship` only ever commits the blog folders, refuses to run off `main`, and
pulls first if GitHub is ahead.

## Cover images

New posts get a generated placeholder cover in the house style. A 2x PNG of each
placeholder is saved in `blog-covers-to-enhance/` in the workspace root (the
folder above `autocleansewebsite/`). To use your own artwork:

1. Enhance the placeholder however you like.
2. Save the result in the **workspace root** with the **same filename** as the
   placeholder (the names are listed in `scripts/blog-cover-map.mjs`).
3. Run `npm run blog:ship`. It resizes to 1200x675, installs it and pushes.

`npm run blog:status` shows which posts still use a placeholder. A scheduled
post can have its cover swapped any time before its date.

## Adding a post by hand

1. **Copy the template.** Duplicate `_template.md` and rename it to your post's
   slug, e.g. `bmw-320d-stage-1-remap.md`. (Files starting with `_` and this
   `README.md` are ignored - they never become posts.)

2. **Fill in the frontmatter.** Every field is explained inline in
   `_template.md`. Set `date` to the next free Monday after the last scheduled
   post (`npm run blog:status` shows it).
   - The **"The job" fields** (`vehicle`, `mileage`, `faultCodes`, `symptoms`,
     `fix`) are for real job write-ups only. Leave them out of general
     explainers - never fill them with made-up details.
   - `relatedServices` - the money pages this post should link to. The first one
     becomes the main button on the post.

3. **Write the body** in Markdown below the frontmatter. Use `##` and `###`
   headings, paragraphs, lists and `[links](/dpf-cleaning)`.

4. **Cover image.** Put a 1200x675 image at `public/blog/<your-slug>/cover.jpg`
   and set `coverImage` to that path, or add the post to
   `scripts/blog-cover-map.mjs` and use the workflow above. **Always** fill in
   `coverAlt`.

5. **Publish.** Set `draft: false` and run `npm run blog:ship`. A post dated
   today or earlier goes live in about two minutes; a future-dated one goes live
   on its Monday.

## While you are still writing

Leave `draft: true`. Draft posts never appear on the live site, the sitemap or
the RSS feed, whatever their date.

## Previewing scheduled posts locally

In PowerShell:

```
$env:BLOG_SHOW_SCHEDULED=1; npm run dev
```

shows every scheduled post as if it were live (local only). Close the terminal
afterwards so the setting does not carry over into a build.

## What makes a good post

- One clear question answered in the first two sentences.
- Real detail: system names, what to check, what not to do. A real job with real
  fault codes beats any explainer - use the job fields for those.
- An honest excerpt (it becomes the Google description and the social card text).
- Links to the relevant service pages and to related posts.
- Never invented customers, vehicles, figures or prices.
