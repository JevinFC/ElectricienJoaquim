import type { ImageMetadata } from 'astro';
import { site } from './site.ts';

/**
 * Photos du site qui ne dépendent pas d'un contenu : hero, portrait, avant/après.
 * Les photos des services et des chantiers se déclarent dans leurs fichiers Markdown.
 *
 * Tant qu'une photo n'a pas de `src`, le site affiche à sa place un emplacement
 * réservé qui reprend sa description (`alt`) : cette liste sert aussi de liste de
 * prises de vue. Pour ajouter une photo :
 *   1. placer le fichier JPG dans src/assets/photos/ ;
 *   2. l'importer en haut de ce fichier : import hero from '../assets/photos/hero.jpg';
 *   3. le passer à `src` : hero: { src: hero, alt: '…' } ;
 *   4. relire `alt`, qui doit décrire la photo réelle.
 */
export interface PhotoSite {
  src?: ImageMetadata;
  alt: string;
}

export interface PhotosSite {
  /** Accueil, à droite du titre : cadrage vertical (4:5), recadré en 4:3 sur mobile. */
  hero: PhotoSite;
  /** Bandeau « Qui suis-je » de l'accueil et page À propos : cadrage horizontal ou carré. */
  portrait: PhotoSite;
  /** Un même tableau avant et après les travaux, pris du même endroit avec le même cadrage (4:3). */
  avantApres: { avant: PhotoSite; apres: PhotoSite; legende: string };
}

const nom = site.entreprise.gerantNomUsuel;

// TODO : photos à prendre, puis à déclarer ici (voir la marche à suivre ci-dessus).
export const photos: PhotosSite = {
  hero: { alt: `${nom} sur un chantier, devant un tableau électrique ouvert` },
  portrait: { alt: `${nom} devant son camion` },
  avantApres: {
    avant: { alt: 'Ancien tableau électrique à fusibles, avant les travaux' },
    apres: { alt: 'Le même emplacement après les travaux : tableau neuf, câbles peignés et circuits repérés' },
    // TODO : commune du chantier photographié.
    legende: '[Commune] : remplacement d’un tableau à fusibles par un tableau neuf, aux circuits repérés.',
  },
};
