// robots.txt. Керується тим самим прапорцем, що й meta robots: site.noindex.
// Закритий режим — сайт повністю закрито від обходу, карта сайту не оголошується.
// Відкритий режим — обхід дозволено, додається посилання на sitemap.xml.
import type { APIRoute } from 'astro';
import { site } from '../data/site';

export const GET: APIRoute = () => {
  const body = site.noindex
    ? ['User-agent: *', 'Disallow: /', ''].join('\n')
    : ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('/sitemap.xml', site.url).href}`, ''].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
