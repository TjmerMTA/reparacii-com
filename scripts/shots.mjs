// Знімає повні скриншоти головної і типових сторінок із готової збірки (dist)
// на 1440 і 390 px.
// Запуск: npm run build && npm run shots
// Нічого не публікує: піднімає локальний сервер на 127.0.0.1 і гасить його.
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const out = join(root, 'shots');
const chrome =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
};

if (!existsSync(join(dist, 'index.html'))) {
  console.error('Немає dist/index.html — спершу npm run build');
  process.exit(1);
}

const server = createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (path.endsWith('/')) path += 'index.html';
  try {
    const body = await readFile(join(dist, path));
    res.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('404');
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
await mkdir(out, { recursive: true });

const shotPages = [
  { name: 'home', path: '/' },
  { name: 'yak-podaty', path: '/yak-podaty-zaiavu-do-reiestru-zbytkiv/' },
  { name: 'a3-3', path: '/a3-3-vtrata-zhytla/' },
  { name: 'pytannia', path: '/pytannia/' },
];

const targets = shotPages.flatMap((item) => [
  { name: `${item.name}-1440`, path: item.path, width: 1440, height: 900, scale: 1 },
  { name: `${item.name}-390`, path: item.path, width: 390, height: 844, scale: 2, mobile: true },
]);

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
try {
  for (const target of targets) {
    const page = await browser.newPage();
    await page.setViewport({
      width: target.width,
      height: target.height,
      deviceScaleFactor: target.scale,
      isMobile: Boolean(target.mobile),
      hasTouch: Boolean(target.mobile),
    });
    await page.goto(base + target.path, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);

    // Прокручуємо сторінку, щоб спрацювала поява блоків, і повертаємося нагору.
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.6);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 900));
    });

    // Chrome не знімає полотно вище ~16 000 px: довгу мобільну сторінку
    // знімаємо з меншою щільністю, інакше низ кадру повторює верх.
    const fullHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const scale = Math.min(target.scale, Math.floor((15000 / fullHeight) * 100) / 100);
    if (scale < target.scale) {
      await page.setViewport({ ...page.viewport(), deviceScaleFactor: scale });
      await new Promise((r) => setTimeout(r, 300));
    }

    const file = join(out, `${target.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const size = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      viewport: window.innerWidth,
      pending: document.querySelectorAll('.reveal-pending').length,
    }));
    console.log(
      `${file}  ${size.width}×${size.height} @${scale}x` +
        (size.width > size.viewport ? '  ⚠ горизонтальна прокрутка' : '') +
        (size.pending ? `  ⚠ прихованих блоків: ${size.pending}` : ''),
    );
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
