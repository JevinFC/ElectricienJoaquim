import type { APIRoute } from 'astro';
import { site } from '../config/site.ts';

// robots.txt généré au build depuis la config : l'adresse du sitemap suit toujours site.url.
export const GET: APIRoute = () => {
  const sitemap = new URL('/sitemap-index.xml', site.url).href;

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
