import apiClient, { API_BASE_URL } from './apiClient';
import { isDemoMode, isUnreachableError, markDemoMode } from './demoMode';
import { MOCK_RANKING } from './mockData';

export async function getRanking(campaignId) {
  if (isDemoMode() || campaignId === 'demo-campaign') {
    return MOCK_RANKING;
  }

  try {
    const { data } = await apiClient.get(`/api/campaigns/${campaignId}/ranking`);
    return data;
  } catch (error) {
    if (isUnreachableError(error)) {
      markDemoMode();
      return MOCK_RANKING;
    }
    throw error;
  }
}

/**
 * S'abonne au classement en direct (SSE). Renvoie une fonction de désabonnement.
 * Le serveur throttle lui-même les mises à jour (~1.5s) — pas de throttle à refaire ici.
 */
export function subscribeToRanking(campaignId, onUpdate, onError) {
  // Mode démo : pas de vrai serveur SSE à écouter. On ne tente même pas la connexion (elle
  // échouerait de toute façon après un délai, et appellerait onError inutilement) — le
  // classement reste simplement figé sur l'instantané déjà renvoyé par getRanking ci-dessus.
  if (isDemoMode() || campaignId === 'demo-campaign') {
    return () => {};
  }

  const source = new EventSource(`${API_BASE_URL}/api/campaigns/${campaignId}/ranking/stream`);

  source.addEventListener('ranking', (event) => {
    try {
      onUpdate(JSON.parse(event.data));
    } catch (err) {
      console.error('Classement: payload SSE invalide', err);
    }
  });

  if (onError) {
    source.onerror = onError;
  }

  return () => source.close();
}
