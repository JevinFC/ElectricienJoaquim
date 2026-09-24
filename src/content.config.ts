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
      // Situation du client en une phrase courte : titre des cartes de l'accueil (« Vous rénovez une maison ancienne »).
      accroche: z.string().max(60),
      // Nom du service avec son article, en minuscules, pour les liens explicites : « Tout sur la rénovation électrique ».
      designation: z.string().max(60),
      // 3 ou 4 situations concrètes qui relèvent du service : liste « C'est pour vous si… » de la page Services.
      pourVousSi: z.array(z.string()).min(3).max(4),
      // 3 ou 4 prestations comprises : « Ce qui est compris » sur la page Services.
      inclus: z.array(z.string()).min(3).max(4),
      // Libellé court du service, affiché après un losange cuivre (« Rénovation »).
      etiquette: z.string().max(24),
      // Ordre d'affichage croissant.
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
