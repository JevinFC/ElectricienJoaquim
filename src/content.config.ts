import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

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
      // Meta description de la page du service, pour les moteurs de recherche.
      description: z.string().max(160),
      // Phrase courte, sans nom de ville, affichée sur les cartes et en introduction de la page.
      resume: z.string().max(140),
      // Libellé court de l'étiquette de repérage (« Rénovation »), après le repère C1, C2…
      etiquette: z.string().max(24),
      // Ordre d'affichage croissant ; donne aussi le repère de l'étiquette (1 → C1).
      ordre: z.number().int().positive(),
      // Photo facultative : sans elle, un emplacement réservé affiche `imageAlt`.
      image: image().optional(),
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
    });
  },
});

export const collections = { services, realisations };
