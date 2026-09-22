import { getCollection, type CollectionEntry } from 'astro:content';

/** Services triés selon leur champ `ordre`. */
export async function getServices(): Promise<CollectionEntry<'services'>[]> {
  const services = await getCollection('services');
  return services.sort((a, b) => a.data.ordre - b.data.ordre);
}

/**
 * Réalisations, de la plus récente à la plus ancienne. Le build s'arrête avec un
 * message clair si une réalisation pointe vers un service qui n'existe pas.
 */
export async function getRealisations(): Promise<CollectionEntry<'realisations'>[]> {
  const [realisations, services] = await Promise.all([getCollection('realisations'), getCollection('services')]);
  const identifiants = new Set(services.map((service) => service.id));

  for (const realisation of realisations) {
    if (!identifiants.has(realisation.data.service.id)) {
      throw new Error(
        `Réalisation « ${realisation.id} » : le service « ${realisation.data.service.id} » n'existe pas dans src/content/services/.`,
      );
    }
  }

  return realisations.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Titre d'un service à partir de son identifiant. */
export function titreService(services: CollectionEntry<'services'>[], id: string): string {
  return services.find((service) => service.id === id)?.data.titre ?? '';
}
