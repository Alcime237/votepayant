import apiClient, { API_BASE_URL } from './apiClient';

export async function getRanking(campaignId) {
  const { data } = await apiClient.get(`/api/campaigns/${campaignId}/ranking`);
  return data;
}

/**
 * S'abonne au classement en direct (SSE). Renvoie une fonction de désabonnement.
 * Le serveur throttle lui-même les mises à jour (~1.5s) — pas de throttle à refaire ici.
 */
export function subscribeToRanking(campaignId, onUpdate, onError) {
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
