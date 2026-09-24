import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';

/** Image déjà optimisée côté Astro (getImage) avant d'être transmise à l'île. */
export interface GalleryImage {
  src: string;
  srcset: string;
  width: number;
  height: number;
  alt: string;
}

export interface GalleryItem {
  id: string;
  titre: string;
  ville: string;
  /** Date au format AAAA-MM-JJ. */
  date: string;
  /** Date lisible, par exemple « juin 2026 ». */
  dateLabel: string;
  serviceId: string;
  /** Repère et libellé de l'étiquette du service, par exemple « C2 » et « Rénovation ». */
  serviceEtiquette: string;
  couverture: GalleryImage;
  /** Photos affichées dans la visionneuse, couverture comprise. */
  photos: GalleryImage[];
}

export interface GalleryService {
  id: string;
  titre: string;
}

interface Props {
  items: GalleryItem[];
  services: GalleryService[];
}

const TOUTES = 'toutes';

function accorder(nombre: number, singulier: string, pluriel: string): string {
  return `${nombre} ${nombre > 1 ? pluriel : singulier}`;
}

function IconeFermer() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function IconeChevron({ sens }: { sens: 'precedent' | 'suivant' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={sens === 'suivant' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
    </svg>
  );
}

export default function Gallery({ items, services }: Props) {
  const [filtre, setFiltre] = useState(TOUTES);
  const [selection, setSelection] = useState<{ id: string; index: number } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Seuls les services ayant au moins une réalisation apparaissent dans les filtres.
  const filtres = useMemo(
    () =>
      services
        .map((service) => ({ ...service, total: items.filter((item) => item.serviceId === service.id).length }))
        .filter((service) => service.total > 0),
    [items, services],
  );

  const visibles = filtre === TOUTES ? items : items.filter((item) => item.serviceId === filtre);

  // Présélection du filtre depuis l'URL (?service=identifiant), par exemple depuis une page service.
  useEffect(() => {
    const demande = new URLSearchParams(window.location.search).get('service');
    if (demande && filtres.some((service) => service.id === demande)) setFiltre(demande);
  }, [filtres]);

  const courant = selection ? items.find((item) => item.id === selection.id) : undefined;
  const photo = courant && selection ? courant.photos[selection.index] : undefined;

  // Boîte de dialogue native : focus piégé, fermeture par Échap et retour du focus au déclencheur.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (courant && !dialog.open) dialog.showModal();
    if (!courant && dialog.open) dialog.close();
  }, [courant]);

  const fermer = () => setSelection(null);

  const naviguer = (pas: number) => {
    setSelection((actuelle) => {
      if (!actuelle) return actuelle;
      const total = items.find((item) => item.id === actuelle.id)?.photos.length ?? 1;
      return { id: actuelle.id, index: (actuelle.index + pas + total) % total };
    });
  };

  const surTouche = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      naviguer(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      naviguer(-1);
    }
  };

  // Un clic sur le fond (en dehors de la photo et des boutons) ferme la visionneuse.
  const surClic = (event: MouseEvent<HTMLDialogElement>) => {
    const cible = event.target;
    if (cible === event.currentTarget || (cible instanceof HTMLElement && 'fond' in cible.dataset)) fermer();
  };

  return (
    <div>
      {filtres.length > 1 && (
        <div role="group" aria-label="Filtrer les réalisations par service" className="flex flex-wrap gap-2">
          {[{ id: TOUTES, titre: 'Toutes', total: items.length }, ...filtres].map(({ id, titre, total }) => (
            <button
              key={id}
              type="button"
              aria-pressed={filtre === id}
              onClick={() => setFiltre(id)}
              className="min-h-11 rounded-controle border-2 border-cuivre px-4 py-2 text-sm font-semibold text-cuivre transition-colors hover:bg-tuffeau-clair aria-pressed:bg-cuivre aria-pressed:text-tuffeau"
            >
              {titre} <span className="font-normal">({total})</span>
            </button>
          ))}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {accorder(visibles.length, 'réalisation affichée', 'réalisations affichées')}
      </p>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((item, position) => (
          <li key={item.id} id={`realisation-${item.id}`}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-conteneur border border-bordure bg-tuffeau-clair transition-colors hover:border-cuivre has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-4 has-[button:focus-visible]:outline-cuivre">
              <div className="relative">
                <img
                  src={item.couverture.src}
                  srcSet={item.couverture.srcset}
                  sizes="(min-width: 1024px) 368px, (min-width: 640px) 50vw, 100vw"
                  width={item.couverture.width}
                  height={item.couverture.height}
                  alt={item.couverture.alt}
                  loading={position < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="aspect-4/3 w-full object-cover"
                />
                {/* Étiquette de repérage du service, comme sur les cartes Astro (styles dans global.css). */}
                <span className="etiquette etiquette-photo absolute top-3 left-3">
                  <span className="losange" aria-hidden="true" />
                  <span>{item.serviceEtiquette}</span>
                </span>
                <span className="absolute right-3 bottom-3 rounded-controle bg-ardoise px-2 py-1 text-xs font-semibold text-tuffeau">
                  {accorder(item.photos.length, 'photo', 'photos')}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg leading-snug font-bold">
                  <button
                    type="button"
                    onClick={() => setSelection({ id: item.id, index: 0 })}
                    aria-haspopup="dialog"
                    className="text-left after:absolute after:inset-0 focus-visible:outline-none"
                  >
                    {item.titre}
                    <span className="sr-only"> : voir les photos</span>
                  </button>
                </h3>
                <p className="mt-auto pt-3 text-sm text-gris-ardoise">
                  {item.ville} · <time dateTime={item.date}>{item.dateLabel}</time>
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-labelledby="visionneuse-titre"
        onClose={fermer}
        onKeyDown={surTouche}
        onClick={surClic}
        className="surface-dark fixed inset-0 m-0 size-full max-h-none max-w-none border-0 bg-transparent p-0 text-tuffeau backdrop:bg-ardoise"
      >
        {courant && photo && selection && (
          <div data-fond className="mx-auto flex h-full max-w-6xl flex-col px-4 py-4 sm:px-8 sm:py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="visionneuse-titre" className="text-lg leading-snug font-bold sm:text-xl">
                  {courant.titre}
                </h2>
                <p className="mt-1 text-sm text-sable">
                  {courant.ville} · {courant.dateLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={fermer}
                aria-label="Fermer la visionneuse"
                className="inline-flex size-12 shrink-0 items-center justify-center rounded-controle border-2 border-sable transition-colors hover:border-tuffeau"
              >
                <IconeFermer />
              </button>
            </div>

            <figure data-fond className="flex min-h-0 flex-1 flex-col items-center justify-center py-4">
              <img
                key={photo.src}
                src={photo.src}
                srcSet={photo.srcset}
                sizes="(min-width: 1200px) 1152px, 100vw"
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
                className="min-h-0 w-auto max-w-full flex-1 object-contain"
              />
              <figcaption className="mt-3 text-center text-sm text-sable">
                Photo {selection.index + 1} sur {courant.photos.length}
              </figcaption>
            </figure>

            {courant.photos.length > 1 && (
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => naviguer(-1)}
                  aria-label="Photo précédente"
                  className="inline-flex size-12 items-center justify-center rounded-controle border-2 border-sable transition-colors hover:border-tuffeau"
                >
                  <IconeChevron sens="precedent" />
                </button>
                <button
                  type="button"
                  onClick={() => naviguer(1)}
                  aria-label="Photo suivante"
                  className="inline-flex size-12 items-center justify-center rounded-controle border-2 border-sable transition-colors hover:border-tuffeau"
                >
                  <IconeChevron sens="suivant" />
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}
