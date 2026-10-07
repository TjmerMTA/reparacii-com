// Перевірка готової збірки (dist): внутрішні посилання та якорі, один H1,
// унікальні title/description, noindex, хлібні крихти, розмітка JSON-LD.
// Запуск: npm run build && npm run check   (з --external — ще й зовнішні посилання;
// можна передати іншу теку збірки першим аргументом)
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const dirArg = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
const dist = dirArg ?? fileURLToPath(new URL('../dist', import.meta.url));
const checkExternal = process.argv.includes('--external');

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const strip = (html) => html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/g, '');
const all = (html, re) => [...html.matchAll(re)].map((m) => m[1]);
const first = (html, re) => (html.match(re) ?? [])[1];

const files = await walk(dist);
const pages = new Map();
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const path = '/' + relative(dist, file).replace(/index\.html$/, '');
  pages.set(path, { html, body: strip(html) });
}

const errors = [];
const external = new Set();
const titles = new Map();
const descriptions = new Map();
let linkCount = 0;

for (const [path, { html, body }] of pages) {
  const fail = (text) => errors.push(`${path}: ${text}`);

  const h1 = all(body, /<h1\b[^>]*>([\s\S]*?)<\/h1>/g);
  if (h1.length !== 1) fail(`H1: ${h1.length}, має бути 1`);

  const title = first(html, /<title>([\s\S]*?)<\/title>/);
  const description = first(html, /<meta name="description" content="([^"]*)"/);
  if (!title) fail('немає title');
  if (!description) fail('немає description');
  if (titles.has(title)) fail(`title повторює ${titles.get(title)}`);
  if (descriptions.has(description)) fail(`description повторює ${descriptions.get(description)}`);
  titles.set(title, path);
  descriptions.set(description, path);
  if (title && title.length > 90) fail(`title задовгий: ${title.length}`);
  if (description && description.length > 200) fail(`description задовгий: ${description.length}`);

  if (!/<html lang="uk"/.test(html)) fail('немає lang="uk"');
  if (!/<link rel="canonical"/.test(html)) fail('немає canonical');

  const ids = new Set(all(body, /\sid="([^"]+)"/g));
  for (const href of all(body, /<a\b[^>]*\shref="([^"]*)"/g)) {
    linkCount += 1;
    if (/^(tel:|mailto:)/.test(href)) continue;
    if (/^https?:\/\//.test(href)) {
      external.add(href);
      continue;
    }
    const [target, hash] = href.split('#');
    const targetPath = target === '' ? path : target;
    const targetPage = pages.get(targetPath);
    if (!targetPage) {
      if (!existsSync(join(dist, targetPath))) fail(`бите посилання ${href}`);
      continue;
    }
    if (hash) {
      const targetIds = target === '' ? ids : new Set(all(targetPage.body, /\sid="([^"]+)"/g));
      if (!targetIds.has(hash)) fail(`немає якоря ${href}`);
    }
  }

  const blocks = all(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
  if (blocks.length !== 1) fail(`JSON-LD блоків: ${blocks.length}`);
  for (const block of blocks) {
    try {
      const data = JSON.parse(block);
      const types = data['@graph'].map((node) => node['@type']);
      const need = path === '/' ? ['WebSite'] : ['WebSite', 'BreadcrumbList'];
      for (const type of need) if (!types.includes(type)) fail(`у JSON-LD немає ${type}`);
      if (!types.some((type) => type === 'Organization' || type === 'LegalService')) {
        fail('у JSON-LD немає Organization/LegalService');
      }
      const crumbs = data['@graph'].find((node) => node['@type'] === 'BreadcrumbList');
      if (crumbs) {
        const visible = all(body, /<nav class="crumbs[\s\S]*?<\/nav>/g).length || /class="crumbs/.test(body);
        if (!visible) fail('BreadcrumbList є, а видимих крихт немає');
        const last = crumbs.itemListElement.at(-1).item;
        if (!last.endsWith(path)) fail(`остання крихта ${last} не збігається з адресою`);
      }
      const faq = data['@graph'].find((node) => node['@type'] === 'FAQPage');
      if (faq) {
        for (const item of faq.mainEntity) {
          if (!body.includes(item.name)) fail(`питання з FAQPage немає на сторінці: ${item.name}`);
        }
        console.log(`  FAQPage: ${faq.mainEntity.length} питань, усі є у видимому тексті`);
      }
    } catch (error) {
      fail(`JSON-LD не розбирається: ${error.message}`);
    }
  }
}

const robots = await readFile(join(dist, 'robots.txt'), 'utf8');
const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8');
const noindexPages = [...pages.values()].filter(({ html }) => /<meta name="robots" content="noindex, nofollow"/.test(html)).length;
const closed = /Disallow: \/\s/.test(robots + '\n');
const sitemapUrls = all(sitemap, /<loc>([^<]+)<\/loc>/g);

if (closed) {
  if (noindexPages !== pages.size) errors.push(`robots закрито, але noindex лише на ${noindexPages} з ${pages.size} сторінок`);
  if (sitemapUrls.length) errors.push('robots закрито, але sitemap не порожній');
} else {
  if (noindexPages) errors.push(`robots відкрито, але noindex стоїть на ${noindexPages} сторінках`);
  if (!/Sitemap: /.test(robots)) errors.push('robots відкрито, але немає рядка Sitemap');
  for (const url of sitemapUrls) {
    if (!pages.has(new URL(url).pathname)) errors.push(`у sitemap адреса без сторінки: ${url}`);
  }
  if (sitemapUrls.length !== pages.size) errors.push(`у sitemap ${sitemapUrls.length} адрес, сторінок ${pages.size}`);
}

if (checkExternal) {
  for (const url of external) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36' },
        signal: AbortSignal.timeout(30000),
      });
      if (response.status >= 400) errors.push(`зовнішнє посилання ${response.status}: ${url}`);
    } catch (error) {
      errors.push(`зовнішнє посилання недоступне: ${url} (${error.message})`);
    }
  }
}

console.log(`Сторінок: ${pages.size}; посилань: ${linkCount}; зовнішніх адрес: ${external.size}${checkExternal ? ' (перевірено)' : ''}`);
console.log(`Режим: ${closed ? 'ЗАКРИТО' : 'ВІДКРИТО'}; noindex на ${noindexPages} з ${pages.size}; адрес у sitemap: ${sitemapUrls.length}`);
if (errors.length) {
  console.log(`\nПомилок: ${errors.length}`);
  for (const error of errors) console.log('  ✗ ' + error);
  process.exit(1);
}
console.log('Помилок немає');
