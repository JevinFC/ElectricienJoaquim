import { promesse } from '../config/site.ts';

export interface Etape {
  titre: string;
  texte: string;
}

/**
 * Étapes d'une intervention, reprises sur la page Services et la page À propos.
 * Délai de rappel et gratuité du devis viennent des promesses de la config.
 */
// TODO : étapes à valider avec le client (elles décrivent sa façon de travailler).
export const etapesIntervention: Etape[] = [
  {
    titre: 'Vous appelez ou écrivez',
    texte: `Par téléphone ou via le formulaire de contact, vous me décrivez votre projet. ${promesse('rappel').phrase}`,
  },
  {
    titre: 'Visite et devis',
    texte: `Je viens voir le chantier ou l’installation existante, puis je vous remets un devis. ${promesse('devis').phrase}`,
  },
  {
    titre: 'Travaux',
    texte: 'Les travaux sont réalisés selon la norme NF C 15-100, aux dates convenues ensemble.',
  },
  {
    titre: 'Mise en service',
    texte:
      'Je vous présente votre installation et votre tableau électrique. Pour une installation neuve, je prépare l’attestation de conformité à faire viser par le Consuel, indispensable à la mise en service.',
  },
];
