import { defineConfig } from 'astro/config';

// Статичний сайт під GitHub Pages з власним доменом (корінь домену, без base).
export default defineConfig({
  site: 'https://reparatsii.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
