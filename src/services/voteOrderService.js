import apiClient from './apiClient';

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
 */
export async function pollVoteOrderUntilSettled(orderId, { intervalMs = 3000, timeoutMs = 90000 } = {}) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const status = await getVoteOrderStatus(orderId);
    if (status.status !== 'PENDING') {
      return status;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return { id: orderId, status: 'PENDING', timedOut: true };
}
