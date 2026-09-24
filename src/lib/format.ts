import type { Jour, PlageHoraire } from '../config/site.ts';

const ORDRE_JOURS: Jour[] = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

const JOURS_SCHEMA: Record<Jour, string> = {
  lundi: 'Monday',
  mardi: 'Tuesday',
  mercredi: 'Wednesday',
  jeudi: 'Thursday',
  vendredi: 'Friday',
  samedi: 'Saturday',
  dimanche: 'Sunday',
};

const moisAnnee = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' });

/** Date d'un chantier : « juin 2026 ». */
export function formatMoisAnnee(date: Date): string {
  return moisAnnee.format(date);
}

/** Date au format AAAA-MM-JJ, pour l'attribut datetime de <time>. */
export function formatDateIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** « 08:00 » → « 8 h », « 08:30 » → « 8 h 30 ». */
function formatHeure(hhmm: string): string {
  const [heures = '', minutes = '00'] = hhmm.split(':');
  const h = String(Number(heures));
  return minutes === '00' ? `${h} h` : `${h} h ${minutes}`;
}

function majuscule(texte: string): string {
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

/** « Du lundi au vendredi », « Samedi et dimanche » ou « Lundi, mercredi et vendredi ». */
function formatJours(jours: Jour[]): string {
  const tries = [...jours].sort((a, b) => ORDRE_JOURS.indexOf(a) - ORDRE_JOURS.indexOf(b));
  const premier = tries[0];
  const dernier = tries[tries.length - 1];
  if (!premier || !dernier) return '';
  if (tries.length === 1) return majuscule(premier);

  const indices = tries.map((jour) => ORDRE_JOURS.indexOf(jour));
  const consecutifs = indices.every((valeur, i) => i === 0 || valeur === (indices[i - 1] ?? -2) + 1);
  if (consecutifs && tries.length > 2) return `Du ${premier} au ${dernier}`;

  return majuscule(`${tries.slice(0, -1).join(', ')} et ${dernier}`);
}

/** « Du lundi au vendredi : 8 h – 18 h ». */
export function formatPlage(plage: PlageHoraire): string {
  return `${formatJours(plage.jours)} : ${formatHeure(plage.ouverture)} – ${formatHeure(plage.fermeture)}`;
}

/** Jours au format attendu par schema.org (dayOfWeek). */
export function joursSchema(jours: Jour[]): string[] {
  return jours.map((jour) => JOURS_SCHEMA[jour]);
}

/** Vrai si le texte contient encore un emplacement réservé entre crochets (« [à compléter] »). */
export function contientEmplacement(texte: string): boolean {
  return /\[[^\]]+\]/.test(texte);
}
