// sitemap.xml із реєстру сторінок (src/data/pages.ts).
// Поки site.noindex = true, карта порожня: закритим сторінкам у ній не місце.
// Щойно прапорець знято — у карті з’являються всі сторінки з датами оновлення.
import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { pages, sitemapPages } from '../data/pages';

export const GET: APIRoute = () => {
  const urls = site.noindex
    ? `  <!-- Сайт закрито від індексації (site.noindex). Готових адрес: ${sitemapPages.length}. -->`
    : sitemapPages
        .map((key) => {
          const page = pages[key];
          return [
            '  <url>',
            `    <loc>${new URL(page.path, site.url).href}</loc>`,
            `    <lastmod>${page.updated}</lastmod>`,
            '  </url>',
          ].join('\n');
        })
        .join('\n');

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
