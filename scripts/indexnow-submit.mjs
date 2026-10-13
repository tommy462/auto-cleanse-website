// Tells IndexNow search engines (Bing, Yandex, Seznam, Naver and others) about
// pages on the live site, so they are crawled straight away instead of waiting.
// Run after a deploy that adds or changes pages:
//   node scripts/indexnow-submit.mjs              (every URL in the live sitemap)
//   node scripts/indexnow-submit.mjs /some/path   (only the paths given)
// The key file public/<KEY>.txt must already be live for the engines to accept it.

const HOST = 'www.auto-cleanse.co.uk';
const KEY = 'c59d2935e658e8c12121b0689d186eca';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

async function sitemapUrls() {
  const res = await fetch(`https://${HOST}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

const keyCheck = await fetch(`https://${HOST}/${KEY}.txt`);
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  console.error(`Key file https://${HOST}/${KEY}.txt is not live yet; deploy first.`);
  process.exit(1);
}

const args = process.argv.slice(2);
const urls = args.length ? args.map((p) => `https://${HOST}${p.startsWith('/') ? p : `/${p}`}`) : await sitemapUrls();

// IndexNow accepts up to 10,000 URLs per request.
for (let i = 0; i < urls.length; i += 10000) {
  const urlList = urls.slice(i, i + 10000);
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
  });
  console.log(`Submitted ${urlList.length} URLs: HTTP ${res.status} ${res.statusText}`);
  if (res.status >= 400) console.log(await res.text());
}
