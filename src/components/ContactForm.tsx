import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, ReactNode, SubmitEvent } from 'react';

export interface OptionTravaux {
  value: string;
  label: string;
}

interface Props {
  /** Adresse de réception (Formspree ou Web3Forms), issue de PUBLIC_FORM_ENDPOINT. */
  endpoint?: string;
  /** Clé d'accès Web3Forms (PUBLIC_FORM_ACCESS_KEY) : sa présence active le format Web3Forms. */
  accessKey?: string;
  travaux: OptionTravaux[];
  communes: string[];
  telephone: { affichage: string; lien: string };
  email: string;
  /** Délai de rappel annoncé après l'envoi, par exemple « 24 h ». */
  delaiRappel: string;
  entreprise: string;
  /** URL de la politique de confidentialité. */
  confidentialite: string;
}

type Champ = 'nom' | 'telephone' | 'email' | 'commune' | 'travaux' | 'message' | 'consentement';

interface Valeurs {
  nom: string;
  telephone: string;
  email: string;
  commune: string;
  travaux: string;
  message: string;
  consentement: boolean;
}

type Erreurs = Partial<Record<Champ, string>>;
type Statut = 'saisie' | 'envoi' | 'succes' | 'erreur';

const ORDRE_CHAMPS: Champ[] = ['nom', 'telephone', 'email', 'commune', 'travaux', 'message', 'consentement'];
const AUTRE = 'autre';
const TELEPHONE_FR = /^(?:(?:\+|00)33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALEURS_INITIALES: Valeurs = {
  nom: '',
  telephone: '',
  email: '',
  commune: '',
  travaux: '',
  message: '',
  consentement: false,
};

function valider(valeurs: Valeurs): Erreurs {
  const erreurs: Erreurs = {};
  const telephone = valeurs.telephone.trim();
  const email = valeurs.email.trim();

  if (!valeurs.nom.trim()) erreurs.nom = 'Indiquez votre nom.';
  if (!telephone) erreurs.telephone = 'Indiquez votre numéro de téléphone.';
  else if (!TELEPHONE_FR.test(telephone)) erreurs.telephone = 'Ce numéro ne semble pas valide : 10 chiffres attendus.';
  if (email && !EMAIL.test(email)) erreurs.email = 'Cette adresse e-mail ne semble pas valide.';
  if (!valeurs.commune.trim()) erreurs.commune = 'Indiquez la commune des travaux.';
  if (!valeurs.travaux) erreurs.travaux = 'Choisissez le type de travaux.';
  if (!valeurs.message.trim()) erreurs.message = 'Décrivez votre projet en quelques mots.';
  if (!valeurs.consentement) erreurs.consentement = 'Cochez cette case pour que je puisse traiter votre demande.';

  return erreurs;
}

export default function ContactForm({
  endpoint,
  accessKey,
  travaux,
  communes,
  telephone,
  email,
  delaiRappel,
  entreprise,
  confidentialite,
}: Props) {
  const [valeurs, setValeurs] = useState<Valeurs>(VALEURS_INITIALES);
  const [erreurs, setErreurs] = useState<Erreurs>({});
  const [soumis, setSoumis] = useState(false);
  const [statut, setStatut] = useState<Statut>('saisie');
  const [hydrate, setHydrate] = useState(false);
  const formulaireRef = useRef<HTMLFormElement>(null);
  const succesRef = useRef<HTMLParagraphElement>(null);

  const configure = Boolean(endpoint);
  const web3forms = Boolean(accessKey);
  const champPiege = web3forms ? 'botcheck' : '_gotcha';
  const sujetParDefaut = `Demande de devis depuis le site ${entreprise}`;

  // Avant l'hydratation, la validation native du navigateur reste active (formulaire utilisable sans JS).
  useEffect(() => setHydrate(true), []);

  useEffect(() => {
    if (statut === 'succes') succesRef.current?.focus();
  }, [statut]);

  const modifier = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const cible = event.target;
    const valeur = cible instanceof HTMLInputElement && cible.type === 'checkbox' ? cible.checked : cible.value;
    const suivantes = { ...valeurs, [cible.name]: valeur };
    setValeurs(suivantes);
    if (soumis) setErreurs(valider(suivantes));
  };

  const envoyer = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSoumis(true);

    const nouvellesErreurs = valider(valeurs);
    setErreurs(nouvellesErreurs);
    const premierChamp = ORDRE_CHAMPS.find((champ) => nouvellesErreurs[champ]);
    if (premierChamp) {
      formulaireRef.current?.querySelector<HTMLElement>(`[name="${premierChamp}"]`)?.focus();
      return;
    }

    // Champ piège rempli : envoi automatisé. On affiche un succès sans rien transmettre.
    if (new FormData(event.currentTarget).get(champPiege)) {
      setStatut('succes');
      return;
    }

    if (!endpoint) {
      setStatut('erreur');
      return;
    }

    setStatut('envoi');
    const typeTravaux = travaux.find((option) => option.value === valeurs.travaux)?.label ?? 'Autre / je ne sais pas';
    const sujet = `Demande de devis : ${typeTravaux} (${valeurs.commune.trim()})`;
    const donnees = {
      nom: valeurs.nom.trim(),
      telephone: valeurs.telephone.trim(),
      ...(valeurs.email.trim() ? { email: valeurs.email.trim() } : {}),
      commune: valeurs.commune.trim(),
      travaux: typeTravaux,
      message: valeurs.message.trim(),
      consentement: 'Oui',
      ...(web3forms ? { access_key: accessKey, subject: sujet, from_name: `Site ${entreprise}` } : { _subject: sujet }),
    };

    try {
      const reponse = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(donnees),
      });
      const resultat: unknown = await reponse.json().catch(() => null);
      const refuse =
        typeof resultat === 'object' && resultat !== null && 'success' in resultat && resultat.success === false;
      if (!reponse.ok || refuse) throw new Error(`Envoi refusé (${reponse.status})`);
      setStatut('succes');
    } catch {
      setStatut('erreur');
    }
  };

  /** Attributs d'accessibilité communs : identifiant, nom, état invalide et descriptions liées. */
  const attributs = (champ: Champ, aide?: string) => {
    const decrits = [aide, erreurs[champ] ? `cf-${champ}-erreur` : undefined].filter(Boolean).join(' ');
    return {
      id: `cf-${champ}`,
      name: champ,
      'aria-invalid': erreurs[champ] ? true : undefined,
      'aria-describedby': decrits || undefined,
    };
  };

  const messageErreur = (champ: Champ): ReactNode =>
    erreurs[champ] ? (
      <p id={`cf-${champ}-erreur`} className="mt-2 text-sm font-semibold text-cuivre">
        {erreurs[champ]}
      </p>
    ) : null;

  const lienTelephone = (
    <a href={`tel:${telephone.lien}`} className="font-semibold whitespace-nowrap text-cuivre underline">
      {telephone.affichage}
    </a>
  );

  if (statut === 'succes') {
    return (
      <div role="status" className="rounded-conteneur border border-bordure bg-tuffeau-clair p-6 sm:p-8">
        <p ref={succesRef} tabIndex={-1} className="font-titre text-2xl font-bold">
          Merci, votre demande a bien été envoyée.
        </p>
        <p className="mt-3 text-gris-ardoise">
          Je vous rappelle sous {delaiRappel}. Pour une question urgente, appelez le {lienTelephone}.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formulaireRef}
      action={endpoint}
      method="POST"
      noValidate={hydrate}
      onSubmit={envoyer}
      aria-busy={statut === 'envoi'}
      className="relative space-y-6"
    >
      {!configure && (
        <p className="rounded-conteneur border border-bordure bg-tuffeau p-4 text-sm">
          L'envoi en ligne n'est pas encore activé. En attendant, appelez le {lienTelephone} ou écrivez à{' '}
          <a href={`mailto:${email}`} className="font-semibold break-all text-cuivre underline">
            {email}
          </a>
          .
        </p>
      )}

      <p className="text-sm text-gris-ardoise">Les champs marqués d'un astérisque (*) sont obligatoires.</p>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-nom" className="block font-semibold">
            Nom <span aria-hidden="true">*</span>
          </label>
          <input
            {...attributs('nom')}
            type="text"
            autoComplete="name"
            required
            value={valeurs.nom}
            onChange={modifier}
            className="field mt-2"
          />
          {messageErreur('nom')}
        </div>

        <div>
          <label htmlFor="cf-telephone" className="block font-semibold">
            Téléphone <span aria-hidden="true">*</span>
          </label>
          <input
            {...attributs('telephone')}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            value={valeurs.telephone}
            onChange={modifier}
            className="field mt-2"
          />
          {messageErreur('telephone')}
        </div>

        <div>
          <label htmlFor="cf-email" className="block font-semibold">
            E-mail <span className="font-normal text-gris-ardoise">(facultatif)</span>
          </label>
          <input
            {...attributs('email')}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={valeurs.email}
            onChange={modifier}
            className="field mt-2"
          />
          {messageErreur('email')}
        </div>

        <div>
          <label htmlFor="cf-commune" className="block font-semibold">
            Commune des travaux <span aria-hidden="true">*</span>
          </label>
          <input
            {...attributs('commune')}
            type="text"
            autoComplete="address-level2"
            list="cf-communes"
            required
            value={valeurs.commune}
            onChange={modifier}
            className="field mt-2"
          />
          <datalist id="cf-communes">
            {communes.map((commune) => (
              <option key={commune} value={commune} />
            ))}
          </datalist>
          {messageErreur('commune')}
        </div>
      </div>

      <div>
        <label htmlFor="cf-travaux" className="block font-semibold">
          Type de travaux <span aria-hidden="true">*</span>
        </label>
        <select {...attributs('travaux')} required value={valeurs.travaux} onChange={modifier} className="field mt-2">
          <option value="">Choisissez un type de travaux</option>
          {travaux.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          <option value={AUTRE}>Autre / je ne sais pas</option>
        </select>
        {messageErreur('travaux')}
      </div>

      <div>
        <label htmlFor="cf-message" className="block font-semibold">
          Votre projet <span aria-hidden="true">*</span>
        </label>
        <p id="cf-message-aide" className="mt-1 text-sm text-gris-ardoise">
          Type de logement, travaux envisagés, délai souhaité&nbsp;: quelques mots suffisent.
        </p>
        <textarea
          {...attributs('message', 'cf-message-aide')}
          rows={5}
          required
          value={valeurs.message}
          onChange={modifier}
          className="field mt-2"
        />
        {messageErreur('message')}
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            {...attributs('consentement', 'cf-consentement-aide')}
            type="checkbox"
            required
            checked={valeurs.consentement}
            onChange={modifier}
            className="mt-1 size-5 shrink-0 accent-cuivre"
          />
          <label htmlFor="cf-consentement">
            J'accepte que les informations saisies soient utilisées pour me recontacter au sujet de ma demande.{' '}
            <span aria-hidden="true">*</span>
          </label>
        </div>
        <p id="cf-consentement-aide" className="mt-2 pl-8 text-sm text-gris-ardoise">
          Vos données servent uniquement à traiter votre demande. Pour en savoir plus, consultez la{' '}
          <a href={confidentialite} className="font-semibold text-cuivre underline">
            politique de confidentialité
          </a>
          .
        </p>
        {messageErreur('consentement')}
      </div>

      {/* Champ piège invisible pour limiter le spam : les robots le remplissent, pas les humains. */}
      <div aria-hidden="true" className="absolute left-[-10000px] size-px overflow-hidden">
        <label htmlFor="cf-piege">Ne pas remplir ce champ</label>
        <input id="cf-piege" type="text" name={champPiege} tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {/* Champs techniques utilisés uniquement si le formulaire est envoyé sans JavaScript. */}
      {web3forms ? (
        <>
          <input type="hidden" name="access_key" value={accessKey} />
          <input type="hidden" name="subject" value={sujetParDefaut} />
        </>
      ) : (
        <input type="hidden" name="_subject" value={sujetParDefaut} />
      )}

      {statut === 'erreur' && (
        <div role="alert" className="rounded-conteneur border-2 border-cuivre bg-tuffeau p-4">
          <p className="font-semibold text-cuivre">
            {configure ? "L'envoi a échoué." : "L'envoi en ligne n'est pas encore activé."}
          </p>
          <p className="mt-1">
            {configure ? 'Réessayez dans un instant, ou appelez-moi directement au ' : 'Appelez-moi directement au '}
            {lienTelephone}.
          </p>
        </div>
      )}

      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={statut === 'envoi'}>
        {statut === 'envoi' ? 'Envoi en cours…' : 'Envoyer ma demande'}
      </button>
    </form>
  );
}
