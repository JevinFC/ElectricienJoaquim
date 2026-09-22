/**
 * Icônes du site : tracés SVG au trait sur une grille de 24 × 24, dessinés pour
 * ce projet (volontairement sans éclair ni ampoule). Chaque entrée contient le
 * contenu interne d'un <svg viewBox="0 0 24 24">, rendu par <Icon name="…" />.
 *
 * Pour ajouter une icône : ajouter une entrée ci-dessous. Son nom devient
 * utilisable dans <Icon /> et dans le champ `icone` des services.
 */
export const icons = {
  // Maison et prise : installation électrique neuve.
  'maison-neuve':
    '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9v11h14V9"/><circle cx="12" cy="14.5" r="3"/><circle cx="10.9" cy="14.5" r=".55" fill="currentColor" stroke="none"/><circle cx="13.1" cy="14.5" r=".55" fill="currentColor" stroke="none"/>',
  // Maison et flèche circulaire : rénovation.
  renovation:
    '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9v11h14V9"/><path d="M15 15a3 3 0 1 1-1.5-2.6"/><path d="m13.3 11.2.5 1.4-1.5.3"/>',
  // Coffret, rangée de disjoncteurs et bornier : tableau électrique.
  tableau:
    '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 7.5h16"/><rect x="6.5" y="10" width="2.2" height="5" rx=".5"/><rect x="10.9" y="10" width="2.2" height="5" rx=".5"/><rect x="15.3" y="10" width="2.2" height="5" rx=".5"/><path d="M7 18h10"/>',
  telephone: '<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M11 18.5h2"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  localisation:
    '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  horaires: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  devis:
    '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
  assurance: '<path d="M12 3 19 6v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><path d="m9 12 2 2 4-4"/>',
  norme: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/>',
  certification: '<circle cx="12" cy="9" r="5.5"/><path d="M8.6 13.4 7 21l5-2.5 5 2.5-1.6-7.6"/>',
  coche: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  fleche: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  etoile: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  fermer: '<path d="M6 6l12 12M18 6 6 18"/>',
} as const;

export type IconName = keyof typeof icons;

export const iconNames = Object.keys(icons) as [IconName, ...IconName[]];
