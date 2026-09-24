# Site vitrine : électricien à Tours et en Indre-et-Loire

Site vitrine statique d'un artisan électricien : installation électrique neuve, rénovation électrique, tableaux électriques et mise aux normes NF C 15-100. Il vise à inspirer confiance et à générer des appels et des demandes de devis, surtout sur mobile.

- **Astro 7** en sortie 100 % statique, **TypeScript strict**.
- **Tailwind CSS 4**.
- **React 19** uniquement pour deux îles : la galerie des réalisations et le formulaire de contact.
- Polices **Bitter** (titres et logotype), **Public Sans** (textes et libellés), auto-hébergées via Fontsource : aucune requête vers Google Fonts.
- Palette « Tuffeau & Cuivre » : ardoise, tuffeau et cuivre (détail dans `src/styles/global.css`).
- Déploiement prévu sur **Vercel**.

Toutes les informations sur l'entreprise sont centralisées dans [`src/config/site.ts`](src/config/site.ts), et les photos du site dans [`src/config/photos.ts`](src/config/photos.ts). Les informations encore inconnues sont écrites **entre crochets** (`[N]`, `[adresse e-mail]`…) et affichées telles quelles comme emplacements réservés ; chacune est signalée par un commentaire **TODO**.

## Sommaire

1. [Lancer le projet](#1-lancer-le-projet)
2. [Structure du projet](#2-structure-du-projet)
3. [Remplir la configuration](#3-remplir-la-configuration-srcconfigsitets)
4. [Ajouter une réalisation](#4-ajouter-une-réalisation)
5. [Ajouter un service](#5-ajouter-un-service)
6. [Ajouter les photos](#6-ajouter-les-photos)
7. [Configurer le formulaire de contact](#7-configurer-le-formulaire-de-contact)
8. [Déployer sur Vercel](#8-déployer-sur-vercel)
9. [Qualité, performance et accessibilité](#9-qualité-performance-et-accessibilité)
10. [Notes techniques (Astro 7)](#10-notes-techniques-astro-7)
11. [TODO à compléter avec le client](#11-todo-à-compléter-avec-le-client)

---

## 1. Lancer le projet

Prérequis : **Node.js 22.12 ou plus récent**, et npm.

```bash
npm install        # installe les dépendances
npm run dev        # serveur de développement sur http://localhost:4321
npm run build      # vérification TypeScript (astro check), puis build statique dans dist/
npm run preview    # sert le contenu de dist/ en local, pour vérifier le build
npm run check      # vérification TypeScript seule
```

Les serveurs `dev` et `preview` s'arrêtent avec `Ctrl+C`.

Astro 7 permet aussi de les lancer en arrière-plan, avec `npm run dev -- --background` (même option pour `preview`). Il le fait parfois automatiquement quand le terminal n'est pas interactif. Dans ce cas :

- pour arrêter le serveur : `npx astro dev stop` (ou `npx astro preview stop`) ;
- pour connaître son état : `npx astro dev status`.

Le build échoue à la moindre erreur TypeScript ou si un contenu ne respecte pas son schéma : image introuvable, service inexistant, description trop longue…

## 2. Structure du projet

```text
src/
├── config/site.ts           ← toutes les infos de l'entreprise ([…] et TODO à remplir)
├── config/photos.ts         ← photos du site (hero, portrait, avant/après) = liste des prises de vue
├── content.config.ts        ← schémas des collections (services, réalisations)
├── content/
│   ├── services/            ← 1 fichier Markdown par service
│   └── realisations/        ← 1 fichier Markdown par chantier (+ _modele.md)
├── assets/                  ← images optimisées par Astro (og-default.png, puis les vraies photos)
├── layouts/BaseLayout.astro ← <head> (SEO, Open Graph, JSON-LD), en-tête, pied de page
├── components/              ← composants Astro (Photo, Etiquette…), icônes, îles React (.tsx)
├── lib/                     ← utilitaires (formatage des dates et horaires, requêtes)
├── styles/global.css        ← Tailwind 4 : jetons de couleurs, police, styles communs
└── pages/                   ← une page = une URL (+ robots.txt généré)
public/favicon.svg
vercel.json                  ← redirection du slash final, cache, en-têtes de sécurité
.env.example                 ← variables du formulaire de contact
```

Les pages générées :

| URL | Contenu |
|---|---|
| `/` | Accueil : hero, services, bandeau « Qui suis-je », avant/après et derniers chantiers, avis, zone |
| `/services/` et `/services/<service>/` | Liste des services et une page par service |
| `/realisations/` | Avant/après, puis galerie filtrable avec visionneuse de photos |
| `/a-propos/` | Présentation du gérant, méthode, garanties |
| `/contact/` | Coordonnées et formulaire de demande de devis |
| `/mentions-legales/`, `/confidentialite/` | Pages légales générées depuis la config |
| `/404` | Page d'erreur (non indexée) |
| `/robots.txt`, `/sitemap-index.xml` | Générés au build depuis `site.url` |

## 3. Remplir la configuration (`src/config/site.ts`)

Aucune information sur l'entreprise n'est écrite ailleurs : en-tête, pied de page, bouton d'appel, pages légales, données structurées et formulaire lisent tous ce fichier.

Une information encore inconnue s'écrit entre crochets, par exemple `anneesMetier: '[N]'` : le site affiche « [N] ans de métier » tel quel, comme un emplacement réservé, et la ligne porte un commentaire `TODO`. Il suffit de remplacer la valeur (`'30'`) pour que le texte définitif apparaisse partout.

Pour retrouver tout ce qui reste à compléter :

```bash
grep -rn "TODO" src
```

Dans VS Code, une recherche de « TODO » dans `src/` donne le même résultat.

| Bloc | À renseigner |
|---|---|
| `url` | Nom de domaine définitif, sans slash final (`https://www.exemple.fr`). Sert au sitemap, aux URL canoniques et au robots.txt. |
| `entreprise` | Nom commercial, nom légal complet du gérant (`gerant`, pour les pages légales), nom d'usage (`gerantNomUsuel`, pour les textes de présentation), forme juridique, capital social (société uniquement, sinon `''`), SIRET, immatriculation, TVA ou mention d'exonération. |
| `parcours` | Années de métier (`anneesMetier`, affiché « N ans de métier » dans le hero et sur `/a-propos/`), année d'installation à son compte (`anneeInstallation`) et une phrase du gérant sur son métier (`citation`, bandeau « Qui suis-je » de l'accueil). |
| `delaiRappel` | Délai de rappel des demandes (`'24 h'`, avec une espace insécable) : hero, bandeau d'appel, pages service, contact, formulaire. |
| `contact.telephone` | `affichage` (ex. `02 47 00 00 00`) et `lien` au format international sans espaces (ex. `+33247000000`), utilisé pour les liens `tel:`. |
| `contact.email`, `contact.adresse` | Adresse e-mail et adresse postale. `region` vaut déjà `Centre-Val de Loire`. |
| `horaires` | `plages` (voir l'exemple ci-dessous) et une `note` facultative. Laisser `note: ''` si inutile. |
| `zone` | `libelle` (repris dans le H1 et les titres), département, liste des communes mises en avant. |
| `assuranceDecennale` | Assureur, coordonnées, n° de contrat, zone couverte : informations affichées sur le site et dans les mentions légales. |
| `certifications` | Qualifications **réellement détenues**. Le bloc « Qualifications » ne s'affiche que si le tableau n'est pas vide. |
| `avis` | Avis **authentiques** uniquement. Le premier est mis en avant en grande citation, les suivants en liste. Tant que le tableau est vide, la section est masquée en production ; en développement (`npm run dev`), un emplacement réservé montre sa place. |
| `mediateur` | Médiateur de la consommation auquel l'entreprise adhère (obligatoire pour travailler avec des particuliers). |
| `hebergeur` | Déjà rempli pour Vercel, sauf le téléphone : à vérifier. |
| `donneesPersonnelles` | Prestataire du formulaire, durée de conservation, date de mise à jour de la politique de confidentialité. |
| `reseaux` | Liens vers les profils officiels (fiche Google Business Profile…), repris dans les données structurées. |

Exemples de format :

```ts
horaires: {
  plages: [
    { jours: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'], ouverture: '08:00', fermeture: '18:00' },
    { jours: ['samedi'], ouverture: '09:00', fermeture: '12:00' },
  ],
  note: 'Interventions sur rendez-vous',
},

certifications: [{ nom: 'Nom exact de la qualification', organisme: 'Organisme', url: 'https://…' }],

avis: [{ auteur: 'Prénom N.', commune: 'Tours', texte: "Texte de l'avis, recopié sans modification.", note: 5, date: '2026-01-15', source: 'Google' }],
```

> **Règle absolue** : ne jamais inventer de certification, d'avis client, de chiffre ou d'années d'expérience. Une information non confirmée reste entre crochets, avec son commentaire TODO.

## 4. Ajouter une réalisation

Chaque chantier est un fichier Markdown dans `src/content/realisations/`, qui ne contient qu'un en-tête (frontmatter). Un modèle commenté est fourni : [`src/content/realisations/_modele.md`](src/content/realisations/_modele.md). Les fichiers dont le nom commence par `_` sont ignorés par le site.

1. **Photos** : les placer dans `src/assets/realisations/` (dossier à créer au premier ajout). Privilégier le JPG, au format paysage 4:3, d'au moins 1600 px de large. Astro les convertit en WebP et génère automatiquement les différentes tailles. Il n'agrandit jamais une image, d'où l'intérêt de fournir des photos assez grandes.
2. **Fiche** : copier `_modele.md` dans le même dossier, sous un nom sans `_` initial, par exemple `2026-10-tableau-amboise.md`. Le nom du fichier sert d'identifiant.
3. **Champs** :

| Champ | Description |
|---|---|
| `titre` | Titre du chantier, par exemple « Remplacement d'un tableau électrique ». |
| `ville` | Commune du chantier. |
| `date` | Date au format `AAAA-MM-JJ`. Les réalisations sont triées de la plus récente à la plus ancienne. |
| `service` | Identifiant du service lié : le nom d'un fichier de `src/content/services/`, sans `.md` (par exemple `tableau-electrique`). |
| `couverture` | Photo principale : `src` (chemin **relatif au fichier**, par exemple `../../assets/realisations/amboise-tableau.jpg`) et `alt` (description de la photo). |
| `photos` | Facultatif : photos supplémentaires, même format que `couverture`, dans l'ordre d'affichage. |

```yaml
---
titre: Remplacement d'un tableau électrique
ville: Amboise
date: 2026-10-01
service: tableau-electrique
couverture:
  src: ../../assets/realisations/amboise-tableau-apres.jpg
  alt: Nouveau tableau électrique avec ses circuits repérés
photos:
  - src: ../../assets/realisations/amboise-tableau-avant.jpg
    alt: Ancien tableau à fusibles avant les travaux
---
```

4. **Vérification** : lancer `npm run dev` pour contrôler l'affichage, puis `npm run build`.

La réalisation apparaît automatiquement :

- sur l'accueil (les 2 plus récentes, sous l'avant/après) ;
- dans la galerie `/realisations/`, avec un filtre par service ;
- sur la page du service lié.

Chaque carte porte le libellé de son service (« ◆ Rénovation »). Tant qu'aucun chantier n'est publié, l'accueil n'affiche que l'avant/après, et la galerie un court message. Le build affiche alors l'avertissement « The collection "realisations" does not exist or is empty » : il disparaît au premier chantier ajouté.

## 5. Ajouter un service

1. Créer un fichier Markdown dans `src/content/services/`. Son nom devient l'URL : `borne-de-recharge.md` donne `/services/borne-de-recharge/`.
2. Renseigner l'en-tête :

| Champ | Description |
|---|---|
| `titre` | Nom du service, par exemple « Borne de recharge ». |
| `description` | Meta description pour les moteurs de recherche, **160 caractères maximum**. Elle n'est plus affichée sur les cartes. |
| `resume` | Phrase courte, **140 caractères maximum** et **sans nom de ville**, dans les mots du client : affichée sur les cartes et en introduction de la page du service. |
| `etiquette` | Libellé court du service (24 caractères maximum), affiché après un petit losange cuivre, par exemple « Borne ». |
| `accroche` | Situation du client en une phrase courte (60 caractères maximum) : titre de la carte sur l'accueil, par exemple « Vous rénovez une maison ancienne ». |
| `designation` | Nom du service avec son article, en minuscules, pour les liens explicites : « la rénovation électrique » donne « Tout sur la rénovation électrique ». |
| `pourVousSi` | 3 ou 4 situations concrètes : liste « C'est pour vous si… » de la page Services. |
| `inclus` | 3 ou 4 prestations comprises : liste « Ce qui est compris » de la page Services. À valider avec le client. |
| `ordre` | Position dans les listes (ordre croissant). |
| `image` | Facultatif : photo illustrant le service, chemin relatif au fichier (par exemple `../../assets/services/borne.jpg`). Sans photo, un emplacement réservé affiche `imageAlt`. |
| `imageAlt` | Description de la photo (ou de la photo attendue, tant qu'elle manque). |

3. Rédiger le corps du texte en Markdown :
   - commencer les intertitres à `##`, car le titre principal (H1) est généré automatiquement ;
   - viser 200 à 300 mots, à la première personne, en partant des problèmes du client ;
   - mentionner « Tours » et « Indre-et-Loire » une ou deux fois, pas à chaque paragraphe ;
   - sans promesse chiffrée ni formule toute faite (« en toute transparence », « de A à Z »…).

La page du service, les cartes, la liste du formulaire de contact et les filtres de la galerie se mettent à jour automatiquement.

Les services n'ont pas d'icône : leurs cartes portent un libellé précédé d'un losange cuivre. Pour une nouvelle icône d'interface, ajouter une entrée dans `src/components/icons.ts` : un tracé SVG sur une grille de 24 × 24, au trait. Pas d'éclair ni d'ampoule : c'est un parti pris de la direction artistique.

Typographie : en français, une espace insécable précède `: ; ? !`. Dans les fichiers Markdown, utiliser le caractère U+00A0 ou `&nbsp;`. Dans les fichiers `.astro`, utiliser `&nbsp;`.

## 6. Ajouter les photos

Tant qu'une photo manque, le composant `Photo` (`src/components/Photo.astro`) affiche à sa place un **emplacement réservé** : cadre en pointillés, mention « Photo à venir » et description de la photo attendue (son texte alternatif). La page garde ainsi sa mise en page définitive, et chaque emplacement indique quelle photo prendre.

| Photo | Où la déclarer |
|---|---|
| Hero de l'accueil, portrait (bandeau « Qui suis-je » et `/a-propos/`), avant/après d'un tableau | [`src/config/photos.ts`](src/config/photos.ts) : placer le JPG dans `src/assets/photos/`, l'importer en haut du fichier et le passer à `src` (marche à suivre en tête du fichier). |
| Photo d'un service | Champ `image` du fichier du service (voir la section 5). Sur la page Services, elle occupe toute une moitié d'écran, à bord perdu : prévoir au moins 1920 px de large et garder le sujet au centre, car le cadrage s'adapte à la hauteur du texte. |
| Photos des chantiers | Fichiers de `src/content/realisations/` (voir la section 4). |
| Image de partage (réseaux sociaux) | `src/assets/og-default.png`, à remplacer par une image de 1200 × 630 px. Pour un autre nom de fichier, modifier l'import dans `src/layouts/BaseLayout.astro`. |
| Favicon | `public/favicon.svg`. |

Conseils de prise de vue : lumière naturelle, sans flash ; le gérant au travail plutôt que posé ; pour l'avant/après, le même cadrage pris du même endroit ; rien qui identifie un client (visage, adresse, plaque). Toujours décrire la photo réelle dans le texte alternatif (`alt`, `imageAlt`).

## 7. Configurer le formulaire de contact

Le formulaire (`src/components/ContactForm.tsx`) envoie les demandes en `POST` vers l'adresse définie dans la variable `PUBLIC_FORM_ENDPOINT`. Il est compatible avec **Formspree** et **Web3Forms**, qui proposent tous deux une offre gratuite.

**Avec Formspree**

1. Créer un formulaire sur formspree.io et récupérer son adresse, de la forme `https://formspree.io/f/xxxxxxx`.
2. Renseigner `PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxx` et laisser `PUBLIC_FORM_ACCESS_KEY` vide.

**Avec Web3Forms**

1. Obtenir une clé d'accès sur web3forms.com.
2. Renseigner `PUBLIC_FORM_ENDPOINT=https://api.web3forms.com/submit` et `PUBLIC_FORM_ACCESS_KEY=<la clé>`. La présence de la clé active automatiquement le format attendu par Web3Forms.

**Où déclarer ces variables**

- En local : copier `.env.example` en `.env`, puis le remplir.
- Sur Vercel : Project, puis Settings, puis Environment Variables, puis **redéployer**. Les variables sont intégrées au moment du build.

**Fonctionnement**

- Validation côté client, avec des messages d'erreur accessibles et le focus placé sur le premier champ en erreur.
- États d'envoi, de succès et d'erreur annoncés aux lecteurs d'écran.
- Champ piège anti-spam.
- Envoi natif du formulaire si JavaScript ne s'exécute pas.
- Tant qu'aucune adresse n'est configurée, le formulaire affiche un message invitant à appeler.

Après configuration :

- indiquer le prestataire choisi dans `donneesPersonnelles.prestataireFormulaire` (`src/config/site.ts`) ;
- compléter la section « Transferts hors de l'Union européenne » de `src/pages/confidentialite.astro` ;
- envoyer une demande de test depuis le site en ligne.

## 8. Déployer sur Vercel

1. Pousser le dépôt sur GitHub, GitLab ou Bitbucket.
2. Sur vercel.com, choisir **Add New… → Project** puis importer le dépôt. Le preset **Astro** est détecté automatiquement :
   - commande de build : `npm run build` ;
   - dossier de sortie : `dist` ;
   - version de Node : celle du champ `engines` de `package.json`, soit 22.12 ou plus.
3. Déclarer les variables du formulaire (voir la section 7).
4. Ajouter le nom de domaine dans **Settings → Domains**.
5. Reporter ce domaine dans `site.url` (`src/config/site.ts`), committer : Vercel redéploie automatiquement.
6. Après la mise en ligne :
   - déclarer le site dans Google Search Console et soumettre `https://<domaine>/sitemap-index.xml` ;
   - relier la fiche Google Business Profile (champ `reseaux`).

`vercel.json` :

- redirige les URL sans slash final vers la version avec slash (`/contact` vers `/contact/`), pour éviter les doublons ;
- met en cache longue durée les fichiers de `/_astro/`, dont les noms sont versionnés ;
- ajoute des en-têtes de sécurité de base.

Aucun adaptateur n'est nécessaire : le site est entièrement statique.

## 9. Qualité, performance et accessibilité

**Mesures Lighthouse** (mobile, version 13, build de production servi en local) : **100 / 100 / 100 / 100** en performance, accessibilité, bonnes pratiques et SEO, sur les 8 pages principales. Métriques relevées : LCP de 1,1 à 1,8 s, CLS 0, TBT 0 ms. Ces mesures datent d'avant la refonte de l'accueil (photos, étiquettes) : à refaire une fois les vraies photos en place. Pendant la mesure, `site.url` pointait vers le serveur local ; avec le domaine provisoire, l'audit « canonical » échoue forcément.

**Performance**

- Aucun JavaScript en dehors de deux scripts en ligne (menu mobile, environ 1 ko ; barre d'appel mobile, quelques lignes) et des deux îles React : galerie (`client:visible`) et formulaire (`client:visible`).
- CSS intégré à chaque page (environ 6 ko compressé).
- Polices préchargées : sous-ensemble latin, Bitter 700, Public Sans 400 et 600.
- Images optimisées par Astro, avec `srcset` et `sizes`.

**Accessibilité (WCAG AA)**

- Lien « Aller au contenu ».
- Focus visible : contour cuivre sur fond clair, cuivre-clair sur fond ardoise.
- Hiérarchie de titres respectée.
- Menu burger avec `aria-expanded`, fermeture par Échap et retour du focus au bouton.
- Barre d'appel mobile masquée (et retirée de la navigation clavier) tant que le bouton d'appel du hero est visible ; sans JavaScript, elle reste affichée.
- Visionneuse en `<dialog>` natif.
- `prefers-reduced-motion` respecté.
- Contrastes vérifiés :
  - ardoise sur tuffeau 9,8:1 ;
  - cuivre sur tuffeau 4,8:1, et tuffeau sur cuivre (boutons) 4,8:1, puis 6,5:1 sur cuivre-fonce au survol ;
  - gris-ardoise sur tuffeau 4,8:1 ;
  - sur fond ardoise : sable 6,7:1 et cuivre-clair 4,7:1 ; sable sur ardoise-clair 5,4:1 (emplacements photo).
- Règles de couleur du texte :
  - le cuivre n'est jamais utilisé pour du texte sur fond ardoise ;
  - le cuivre-clair n'est jamais utilisé pour du texte sur ardoise-clair (3,8:1).

**SEO local**

- Titres et meta descriptions par page.
- URL canoniques et balises Open Graph.
- Données structurées `Electrician` générées depuis la config, avec les communes dans `areaServed`.
- `sitemap-index.xml` et `robots.txt`.

## 10. Notes techniques (Astro 7)

- **TypeScript 6** : `@astrojs/check` n'accepte que TypeScript 5 ou 6. Ne pas passer à TypeScript 7 tant que ce n'est pas le cas.
- **Collections** : configuration dans `src/content.config.ts`, loader `glob`. `z` s'importe depuis `astro/zod` (Zod 4).
- **Cache Vite séparé** : `astro check` et `astro build` utilisent `node_modules/.vite-build/`, le serveur de développement `node_modules/.vite/` (intégration `cacheViteSepare` dans `astro.config.mjs`). Sans cette séparation, un build lancé pendant `npm run dev` remplaçait React par sa version de production dans le cache du serveur, et les îles React (formulaire de contact, galerie) disparaissaient aussitôt affichées (« _jsxDEV is not a function » dans la console). Si cela se reproduit : `npx astro dev --force`, ou supprimer `node_modules/.vite/` puis relancer `npm run dev`.
- **`compressHTML: true`** : la valeur par défaut d'Astro 7 (`'jsx'`) supprime les espaces entre un texte et un lien écrits sur deux lignes. Le comportement HTML classique est plus sûr pour les pages de texte.
- **Images** :
  - ne jamais imposer `format` à `<Image />` ou `getImage()` sur une image de contenu : un SVG ferait échouer le build, alors que le format par défaut convient (SVG conservé, JPG et PNG convertis en WebP) ;
  - `image.layout: 'constrained'` génère `srcset` et `sizes` ;
  - `responsiveStyles` reste désactivé, car sa couche CSS passerait devant les classes Tailwind.
- **Tailwind 4** : jetons définis dans `@theme` (`src/styles/global.css`).
  - La palette par défaut est désactivée : seules les couleurs du site existent (`ardoise`, `ardoise-clair`, `tuffeau`, `tuffeau-clair`, `cuivre`, `cuivre-fonce`, `cuivre-clair`, `gris-ardoise`, `sable`, `bordure`).
  - Deux arrondis seulement : `rounded-conteneur` (cartes, photos, encarts) et `rounded-controle` (boutons, champs, filtres, étiquettes). Les autres (`rounded-lg`…) n'existent plus.
  - Signature graphique : le **libellé à losange** (`src/components/Etiquette.astro`, classes `etiquette`, `etiquette-photo` et `losange`), en Public Sans et en casse normale.
  - Le filet cuivre (`filet`) est réservé au H1 ; le losange ne sert plus qu'aux puces des listes de texte (`prose-content`).
  - Mise en page de l'accueil : une seule grille de trois éléments (les services), une rupture pleine largeur au milieu (bande ardoise portée par la photo), pas d'alternance de fonds tuffeau / tuffeau-clair.
  - Photo à bord perdu et texte (`src/components/SplitMedia.astro`) : bandeau « Qui suis-je » de l'accueil et blocs de la page Services. À partir de `lg`, la photo occupe une moitié de l'écran sur toute la hauteur du bloc, et le texte reste aligné sur le conteneur.
- **Compilateur Rust** : le HTML doit être valide (balises fermées, pas de bloc dans un `<p>`).

## 11. TODO à compléter avec le client

Déjà renseignés : nom commercial, dirigeant, forme juridique, SIRET, mention de TVA, téléphone, adresse et délai de rappel (24 h).

**Parcours** (`src/config/site.ts`, bloc `parcours`)

- Nombre d'années de métier (électricien depuis très jeune).
- Année d'installation à son compte (« bientôt 2 ans » en septembre 2026).
- Une phrase du gérant sur son métier, recopiée telle quelle.

**Identité et mentions légales** (`src/config/site.ts`)

- Immatriculation (registre indiqué sur l'extrait RNE ou l'avis de situation Sirene).
- Médiateur de la consommation : nom, adresse, site.
- Téléphone de l'hébergeur Vercel (à vérifier).

**Contact et zone** (`src/config/site.ts`)

- Adresse e-mail.
- Horaires.
- Confirmation de la liste des communes mises en avant.
- Liens vers les profils officiels (`reseaux`).

**Assurance et qualifications** (`src/config/site.ts`)

- Assurance décennale : assureur, coordonnées, n° de contrat, zone couverte.
- Qualifications réellement détenues, s'il y en a.
- Avis clients authentiques, s'il y en a.

**Contenus**

- Section « Mon parcours » de `/a-propos/` : formation et motivation, entre crochets dans `src/pages/a-propos.astro`.
- Étapes « Comment se déroule un chantier » à valider (`src/pages/a-propos.astro`).
- Photos : hero, portrait, avant/après et commune du chantier (`src/config/photos.ts`), photos des 3 services.
- Premiers vrais chantiers, au moins deux (voir la section 4).
- Relecture des textes des services.
- Crédits photos (`src/pages/mentions-legales.astro`).

**Mise en ligne**

- Nom de domaine (`site.url`).
- Image de partage 1200 × 630 définitive.
- Configuration du formulaire : prestataire, variables d'environnement, test d'envoi.

**RGPD** (`src/config/site.ts` et `src/pages/confidentialite.astro`)

- Prestataire du formulaire.
- Durée de conservation des demandes.
- Date de mise à jour de la politique.
- Garanties des transferts hors UE.
- Relecture de la politique de confidentialité.
