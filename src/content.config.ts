import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { iconNames } from './components/icons.ts';

/**
 * Services : un fichier Markdown par service dans src/content/services/.
 * Le nom du fichier donne l'identifiant, donc l'URL /services/<identifiant>/.
 * Le corps du fichier est le texte détaillé de la page du service.
 */
const services = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/services' }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      // Texte court affiché sur les cartes et utilisé comme meta description.
      description: z.string().max(160),
      icone: z.enum(iconNames),
      // Ordre d'affichage croissant.
      ordre: z.number().int(),
      image: image(),
      imageAlt: z.string(),
    }),
});

/**
 * Réalisations : un fichier Markdown (en-tête uniquement) par chantier dans
 * src/content/realisations/. Les chemins d'images sont relatifs au fichier.
 * Les fichiers commençant par « _ » (comme _modele.md) sont ignorés.
 */
const realisations = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/realisations' }),
  schema: ({ image }) => {
    const photo = z.object({ src: image(), alt: z.string() });

    return z.object({
      titre: z.string(),
      ville: z.string(),
      date: z.coerce.date(),
      service: reference('services'),
      couverture: photo,
      photos: z.array(photo).default([]),
      // true pour un chantier fictif de démonstration, signalé par un badge « Exemple ».
      exemple: z.boolean().default(false),
    });
  },
});

export const collections = { services, realisations };
