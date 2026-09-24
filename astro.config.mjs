// @ts-check
import { defineConfig, envField } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import { site } from './src/config/site.ts';

// `astro check` et `astro build` pré-bundlent React en mode production dans le cache de Vite.
// Un cache séparé évite qu'ils écrasent celui d'un serveur de développement lancé en parallèle
// (les îles React disparaissaient alors : « _jsxDEV is not a function »).
/** @type {import('astro').AstroIntegration} */
const cacheViteSepare = {
  name: 'cache-vite-separe',
  hooks: {
    'astro:config:setup': ({ command, updateConfig }) => {
      if (command !== 'dev') updateConfig({ vite: { cacheDir: 'node_modules/.vite-build' } });
    },
  },
};

// https://astro.build/config
export default defineConfig({
  // URL publique, lue depuis la configuration centralisée (sitemap, URL canoniques, robots.txt).
  site: site.url,

  // Astro 7 compresse par défaut le HTML avec les règles d'espacement de JSX ('jsx') :
  // l'espace entre un texte et un lien écrits sur deux lignes disparaît. `true` garde
  // le comportement HTML classique, plus sûr pour les pages de texte (mentions légales…).
  compressHTML: true,

  build: {
    // CSS (≈ 6 ko compressé) intégré à chaque page : aucune requête bloquante avant le premier affichage.
    inlineStylesheets: 'always',
  },

  integrations: [react(), sitemap(), cacheViteSepare],

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
