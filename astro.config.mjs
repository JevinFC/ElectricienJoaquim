// @ts-check
import { defineConfig, envField } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import { site } from './src/config/site.ts';

// https://astro.build/config
export default defineConfig({
  // URL publique, lue depuis la configuration centralisée (sitemap, URL canoniques, robots.txt).
  site: site.url,

  // Astro 7 compresse par défaut le HTML avec les règles d'espacement de JSX ('jsx') :
  // l'espace entre un texte et un lien écrits sur deux lignes disparaît. `true` garde
  // le comportement HTML classique, plus sûr pour les pages de texte (mentions légales…).
  compressHTML: true,

  integrations: [react(), sitemap()],

  image: {
    // Génère automatiquement srcset et sizes pour chaque <Image />. Les styles responsives
    // d'Astro (responsiveStyles) restent désactivés : le preflight de Tailwind applique déjà
    // max-width: 100% et height: auto aux images, et leur couche CSS passerait devant les
    // classes utilitaires.
    layout: 'constrained',
  },

  env: {
    schema: {
      // Formulaire de contact (Formspree ou Web3Forms) : voir .env.example et le README.
      PUBLIC_FORM_ENDPOINT: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_FORM_ACCESS_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
