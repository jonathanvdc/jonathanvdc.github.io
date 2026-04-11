import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jonathanvdc.github.io',
  integrations: [sitemap()],
  output: 'static'
});
