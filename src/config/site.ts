/**
 * Configuration centralisée du site.
 *
 * Toutes les informations sur l'entreprise sont lues depuis ce fichier : aucun
 * composant ni aucune page ne doit les écrire en dur.
 *
 * Une information encore inconnue s'écrit entre crochets, par exemple
 * '[nom de l’assureur]' : le site l'affiche telle quelle, comme un emplacement
 * réservé. Chacune est signalée par un commentaire TODO ; pour toutes les
 * retrouver avant la mise en ligne : `grep -rn "TODO" src`.
 *
 * Règle absolue : ne jamais inventer de certification, d'avis client, de
 * chiffre ou d'années d'expérience. Une information non confirmée reste entre crochets.
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
    /** Nom légal complet du dirigeant : mentions légales, confidentialité, données structurées. */
    gerant: string;
    /** Nom d'usage du dirigeant, affiché dans les textes de présentation (« Je suis … »). */
    gerantNomUsuel: string;
    formeJuridique: string;
    /** Uniquement pour une société (EURL, SARL, SASU…). Laisser '' pour une entreprise individuelle. */
    capitalSocial: string;
    siret: string;
    immatriculation: string;
    tva: string;
  };
  /** Parcours du gérant, repris dans le hero, le bandeau « Qui suis-je » et la page À propos. */
  parcours: {
    /** Années de métier d'électricien, salarié puis à son compte, par exemple '25'. */
    anneesMetier: string;
    /** Année d'installation à son compte, par exemple '2024'. */
    anneeInstallation: string;
    /** Une phrase du gérant sur son métier, recopiée telle quelle, sans guillemets. */
    citation: string;
  };
  /** Délai dans lequel les demandes sont rappelées, avec une espace insécable (« 24 h »). */
  delaiRappel: string;
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
    nom: 'Joaquim Machado',
    gerant: 'Joaquim Ferreira Martins Machado',
    gerantNomUsuel: 'Joaquim Machado',
    formeJuridique: 'Entrepreneur individuel',
    capitalSocial: '',
    siret: '394 712 699 00021',
    // TODO : registre indiqué sur l'extrait RNE ou l'avis de situation Sirene.
    immatriculation: '[immatriculation, ex. Registre national des entreprises]',
    tva: 'TVA non applicable, art. 293 B du CGI',
  },

  parcours: {
    // TODO : nombre d'années de métier. Électricien depuis très jeune, il n'a jamais fait d'autre métier.
    anneesMetier: '[N]',
    // TODO : année d'installation à son compte (« bientôt 2 ans » en septembre 2026).
    anneeInstallation: '[année]',
    // TODO : une phrase de Joaquim sur son métier, recopiée telle quelle.
    citation: '[Une phrase de Joaquim sur son métier, recopiée telle quelle]',
  },

  // Confirmé : les demandes sont toujours rappelées sous 24 h.
  delaiRappel: '24 h',

  contact: {
    telephone: {
      affichage: '06 60 69 36 85',
      lien: '+33660693685',
    },
    // TODO : adresse e-mail de contact.
    email: '[adresse e-mail]',
    adresse: {
      rue: '69 avenue de l’Europe',
      codePostal: '37100',
      ville: 'Tours',
      region: 'Centre-Val de Loire',
    },
  },

  horaires: {
    // TODO : renseigner les horaires réels, puis vider la note si elle devient inutile. Exemple de format :
    // plages: [{ jours: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'], ouverture: '08:00', fermeture: '18:00' }],
    plages: [],
    note: '[horaires à renseigner]',
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
    // TODO : informations figurant sur l'attestation d'assurance décennale.
    assureur: '[nom de l’assureur]',
    coordonnees: '[adresse de l’assureur]',
    numeroContrat: '[n° de contrat]',
    zoneCouverte: '[zone géographique couverte, ex. France métropolitaine]',
  },

  // Qualifications réellement détenues, avec justificatif. Exemple de format :
  // certifications: [{ nom: 'Nom de la qualification', organisme: 'Organisme', url: 'https://…' }],
  certifications: [],

  // Avis authentiques uniquement, recopiés tels quels avec l'accord de leurs auteurs. Exemple de format :
  // avis: [{ auteur: 'Prénom N.', commune: 'Tours', texte: '…', note: 5, date: '2026-01-15', source: 'Google' }],
  avis: [],

  // Médiateur de la consommation auquel l'entreprise adhère (obligatoire pour travailler avec des particuliers).
  mediateur: {
    // TODO : nom, adresse et site du médiateur.
    nom: '[nom du médiateur de la consommation]',
    adresse: '[adresse postale du médiateur]',
    site: '[site internet du médiateur]',
  },

  // Coordonnées issues de la politique de confidentialité de Vercel (vercel.com/legal, juin 2026).
  hebergeur: {
    nom: 'Vercel Inc.',
    adresse: '440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis',
    // TODO : téléphone à vérifier sur vercel.com.
    telephone: '[téléphone de l’hébergeur]',
    site: 'https://vercel.com',
  },

  donneesPersonnelles: {
    // TODO : prestataire choisi pour le formulaire (Formspree ou Web3Forms).
    prestataireFormulaire: '[prestataire du formulaire]',
    // TODO : durée à valider. Référence CNIL pour une demande restée sans suite : 3 ans à compter du dernier contact.
    dureeConservation: '[durée de conservation, ex. 3 ans à compter du dernier contact]',
    // TODO : date de mise à jour de la politique de confidentialité.
    miseAJour: '[date de mise à jour]',
  },

  // Exemple : ['https://g.page/…', 'https://www.facebook.com/…']
  reseaux: [],
};
