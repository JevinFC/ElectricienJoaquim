/**
 * Configuration centralisée du site.
 *
 * Toutes les informations sur l'entreprise sont lues depuis ce fichier : aucun
 * composant ni aucune page ne doit les écrire en dur. Chaque valeur contenant
 * « TODO » est à compléter avec le client avant la mise en ligne. Pour toutes
 * les retrouver : `grep -rn "TODO" src`.
 *
 * Règle absolue : ne jamais inventer de certification, d'avis client, de
 * chiffre ou d'années d'expérience. Une information non confirmée reste en TODO.
 */

export type Jour = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche';

export interface PlageHoraire {
  /** Jours concernés, dans l'ordre de la semaine. */
  jours: Jour[];
  /** Heure d'ouverture au format HH:MM, par exemple '08:00'. */
  ouverture: string;
  /** Heure de fermeture au format HH:MM, par exemple '18:00'. */
  fermeture: string;
}

export interface Certification {
  /** Nom exact de la qualification ou du label, tel qu'il figure sur le certificat. */
  nom: string;
  /** Organisme qui délivre la qualification. */
  organisme?: string;
  /** Page officielle permettant de vérifier la qualification. */
  url?: string;
}

export interface Avis {
  /** Nom affiché, avec l'accord de l'auteur, par exemple 'Marie D.'. */
  auteur: string;
  /** Texte de l'avis, recopié sans modification. */
  texte: string;
  /** Commune du chantier. */
  commune?: string;
  /** Note sur 5, si l'avis en comporte une. */
  note?: 1 | 2 | 3 | 4 | 5;
  /** Date de l'avis au format AAAA-MM-JJ. */
  date?: string;
  /** Provenance de l'avis, par exemple 'Google'. */
  source?: string;
}

export interface SiteConfig {
  /** URL publique du site, sans slash final. Utilisée pour le sitemap, les URL canoniques et le robots.txt. */
  url: string;
  entreprise: {
    nom: string;
    gerant: string;
    formeJuridique: string;
    /** Uniquement pour une société (EURL, SARL, SASU…). Laisser '' pour une entreprise individuelle. */
    capitalSocial: string;
    siret: string;
    immatriculation: string;
    tva: string;
  };
  contact: {
    telephone: {
      /** Format affiché sur le site, par exemple '02 47 00 00 00'. */
      affichage: string;
      /** Format international sans espaces, utilisé dans les liens tel: et le Schema.org, par exemple '+33247000000'. */
      lien: string;
    };
    email: string;
    adresse: {
      rue: string;
      codePostal: string;
      ville: string;
      region: string;
    };
  };
  horaires: {
    plages: PlageHoraire[];
    /** Précision affichée sous les horaires (rendez-vous, urgences…). Laisser '' si inutile. */
    note: string;
  };
  zone: {
    /** Complément de lieu repris dans le H1, les titres et les textes : « Électricien à Tours et en Indre-et-Loire ». */
    libelle: string;
    departement: string;
    numeroDepartement: string;
    /** Communes mises en avant sur le site et dans les données structurées (Schema.org). */
    communes: string[];
  };
  assuranceDecennale: {
    assureur: string;
    coordonnees: string;
    numeroContrat: string;
    zoneCouverte: string;
  };
  /** Laisser vide tant qu'aucune qualification n'est confirmée : le bloc ne s'affiche pas. */
  certifications: Certification[];
  /** Laisser vide tant qu'aucun avis authentique n'est disponible : la section ne s'affiche pas. */
  avis: Avis[];
  mediateur: {
    nom: string;
    adresse: string;
    site: string;
  };
  hebergeur: {
    nom: string;
    adresse: string;
    telephone: string;
    site: string;
  };
  donneesPersonnelles: {
    prestataireFormulaire: string;
    dureeConservation: string;
    miseAJour: string;
  };
  /** Profils officiels (fiche Google Business Profile, Facebook…), repris dans le Schema.org (sameAs). */
  reseaux: string[];
}

export const site: SiteConfig = {
  // TODO : remplacer par le nom de domaine définitif (le TLD .example est réservé et ne pointe nulle part).
  url: 'https://todo-nom-de-domaine.example',

  entreprise: {
    nom: 'TODO Nom',
    gerant: 'TODO Prénom Nom',
    formeJuridique: 'TODO forme juridique (ex. entrepreneur individuel, EURL, SASU)',
    capitalSocial: 'TODO capital social (société uniquement, sinon laisser vide)',
    siret: 'TODO SIRET (14 chiffres)',
    immatriculation: 'TODO immatriculation (ex. Registre national des entreprises)',
    tva: 'TODO n° de TVA intracommunautaire ou mention « TVA non applicable, art. 293 B du CGI »',
  },

  contact: {
    telephone: {
      affichage: 'TODO téléphone',
      lien: 'TODO',
    },
    email: 'TODO@example.com',
    adresse: {
      rue: 'TODO adresse',
      codePostal: 'TODO code postal',
      ville: 'TODO commune',
      region: 'Centre-Val de Loire',
    },
  },

  horaires: {
    // TODO : renseigner les horaires réels. Exemple de format :
    // plages: [{ jours: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'], ouverture: '08:00', fermeture: '18:00' }],
    plages: [],
    note: 'TODO horaires à renseigner',
  },

  zone: {
    libelle: 'à Tours et en Indre-et-Loire',
    departement: 'Indre-et-Loire',
    numeroDepartement: '37',
    // TODO : confirmer la liste des communes mises en avant avec le client.
    communes: [
      'Tours',
      'Joué-lès-Tours',
      'Saint-Cyr-sur-Loire',
      'Saint-Pierre-des-Corps',
      'Saint-Avertin',
      'Chambray-lès-Tours',
      'La Riche',
      'Fondettes',
      'Ballan-Miré',
      'Montlouis-sur-Loire',
      'Amboise',
      'Chinon',
      'Loches',
      'Bléré',
      'Château-Renault',
      'Langeais',
    ],
  },

  assuranceDecennale: {
    assureur: 'TODO nom de l’assureur',
    coordonnees: 'TODO adresse de l’assureur',
    numeroContrat: 'TODO n° de contrat',
    zoneCouverte: 'TODO zone géographique couverte (ex. France métropolitaine)',
  },

  // Qualifications réellement détenues, avec justificatif. Exemple de format :
  // certifications: [{ nom: 'Nom de la qualification', organisme: 'Organisme', url: 'https://…' }],
  certifications: [],

  // Avis authentiques uniquement, recopiés tels quels avec l'accord de leurs auteurs. Exemple de format :
  // avis: [{ auteur: 'Prénom N.', commune: 'Tours', texte: '…', note: 5, date: '2026-01-15', source: 'Google' }],
  avis: [],

  // Médiateur de la consommation auquel l'entreprise adhère (obligatoire pour travailler avec des particuliers).
  mediateur: {
    nom: 'TODO nom du médiateur de la consommation',
    adresse: 'TODO adresse postale du médiateur',
    site: 'TODO site internet du médiateur',
  },

  // Coordonnées issues de la politique de confidentialité de Vercel (vercel.com/legal, juin 2026).
  hebergeur: {
    nom: 'Vercel Inc.',
    adresse: '440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis',
    telephone: 'TODO téléphone de l’hébergeur (à vérifier sur vercel.com)',
    site: 'https://vercel.com',
  },

  donneesPersonnelles: {
    prestataireFormulaire: 'TODO prestataire du formulaire (Formspree ou Web3Forms)',
    // Référence CNIL pour une demande restée sans suite : 3 ans à compter du dernier contact.
    dureeConservation: 'TODO durée de conservation à valider (ex. 3 ans à compter du dernier contact)',
    miseAJour: 'TODO date de mise à jour',
  },

  // Exemple : ['https://g.page/…', 'https://www.facebook.com/…']
  reseaux: [],
};
