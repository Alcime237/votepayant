import apiClient from './apiClient';

// Après ce nombre d'échecs de lecture CONSÉCUTIFS, on abandonne le suivi (le réseau est
// vraiment tombé) ; un échec isolé ne doit pas interrompre l'attente d'un paiement en cours.
const MAX_CONSECUTIVE_POLL_FAILURES = 5;

/**
 * Crée une commande de vote (statut PENDING) et renvoie les paramètres du widget de
 * paiement à transmettre à MyTouchPoint (voir touchpayWidget.js).
 */
export async function createVoteOrder({ candidateId, phoneNumber, amountFcfa }) {
  const { data } = await apiClient.post('/api/vote-orders', { candidateId, phoneNumber, amountFcfa });
  return data;
}

export async function getVoteOrderStatus(orderId) {
  const { data } = await apiClient.get(`/api/vote-orders/${orderId}`);
  return data;
}

/**
 * Interroge périodiquement le statut de la commande jusqu'à confirmation ou timeout.
 * Le statut passe à PAID/FAILED dès que le webhook serveur-à-serveur confirme le paiement.
 *
 * - Tolère les coupures réseau passagères (voir MAX_CONSECUTIVE_POLL_FAILURES).
 * - `shouldStop()` permet à l'appelant d'interrompre le suivi (fenêtre fermée) sans erreur ;
 *   le résultat est alors `{ id, status: 'PENDING', cancelled: true }`.
 */
export async function pollVoteOrderUntilSettled(
  orderId,
  { intervalMs = 3000, timeoutMs = 90000, shouldStop = () => false } = {}
) {
  const startedAt = Date.now();
  let consecutiveFailures = 0;

  while (Date.now() - startedAt < timeoutMs) {
    if (shouldStop()) {
      return { id: orderId, status: 'PENDING', cancelled: true };
    }

    try {
      const status = await getVoteOrderStatus(orderId);
      consecutiveFailures = 0;
      if (status.status !== 'PENDING') {
        return status;
      }
    } catch (error) {
      consecutiveFailures += 1;
      // Une erreur 4xx (commande introuvable...) ne se résoudra pas en réessayant
      const definitive = error.response && error.response.status < 500;
      if (definitive || consecutiveFailures >= MAX_CONSECUTIVE_POLL_FAILURES) {
        throw error;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return { id: orderId, status: 'PENDING', timedOut: true };
}
