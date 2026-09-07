import apiClient from './apiClient';
import { isDemoMode, isUnreachableError, markDemoMode } from './demoMode';
import { MOCK_RESULTS } from './mockData';

/**
 * Résultats finaux par catégorie (Rap, Chant, Danse) d'une campagne — voir ResultsQueryService
 * côté backend. Contrairement au classement en direct (rankingService, SSE), ceci lit
 * directement la base : ça reste juste une fois le vote terminé, quand plus rien
 * n'incrémente le classement en direct.
 *
 * Chaque catégorie renvoie TOUS ses candidats actifs, classés, avec un champ `qualified`
 * qui reflète les règles du déroulement de l'étape en cours (le nombre de qualifiés par
 * catégorie est fixé par campagne côté serveur, jamais en dur ici).
 */
export async function getFinalResults(campaignId) {
  if (isDemoMode() || campaignId === 'demo-campaign') {
    return MOCK_RESULTS;
  }

  try {
    const { data } = await apiClient.get(`/api/campaigns/${campaignId}/results`);
    return data;
  } catch (error) {
    if (isUnreachableError(error)) {
      markDemoMode();
      return MOCK_RESULTS;
    }
    throw error;
  }
}
