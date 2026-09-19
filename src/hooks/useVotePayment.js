import { useCallback, useEffect, useRef, useState } from 'react';
import { createVoteOrder, pollVoteOrderUntilSettled } from '../services/voteOrderService';
import { openTouchPayWidget } from '../services/touchpayWidget';
import { isDemoMode, isUnreachableError } from '../services/demoMode';

/**
 * Parcours de paiement d'un vote — remplace le code copié-collé dans les 3 pages de vote, où
 * chaque issue du paiement (succès, attente, échec, erreur) n'était signalée que par un alert().
 *
 * États : idle → creating (commande en cours de création) → awaiting (widget ouvert, on attend
 * la confirmation serveur) → success | pending (délai dépassé, paiement peut-être en cours) |
 * failed (refusé/expiré) | error (commande ou widget impossible).
 *
 * Seul le webhook serveur-à-serveur fait foi : le front ne fait qu'interroger le statut de la
 * commande, il ne décide jamais lui-même qu'un vote est payé.
 */
export default function useVotePayment() {
  const [state, setState] = useState({ status: 'idle', message: null });
  // Commande créée dont l'issue est encore incertaine (statut "pending") : la re-vérifier plutôt
  // que d'en recréer une, sinon un second clic sur "Payer" ouvrirait un deuxième paiement.
  const pendingOrderRef = useRef(null);
  const activeRef = useRef(true);

  useEffect(() => {
    activeRef.current = true;
    return () => {
      // Fenêtre fermée : on arrête le suivi. Un paiement déjà validé sur le téléphone sera
      // quand même compté par le webhook, indépendamment de cette fenêtre.
      activeRef.current = false;
    };
  }, []);

  const update = useCallback((next) => {
    if (activeRef.current) setState(next);
  }, []);

  const settle = useCallback(async (order) => {
    update({ status: 'awaiting', message: null });

    let result;
    try {
      result = await pollVoteOrderUntilSettled(order.id, { shouldStop: () => !activeRef.current });
    } catch (error) {
      pendingOrderRef.current = order;
      update({
        status: 'pending',
        message: "Impossible de vérifier l'état du paiement pour le moment. Si vous avez validé sur "
          + 'votre téléphone, votre vote sera pris en compte automatiquement.',
      });
      return;
    }

    if (result.cancelled) return;

    if (result.status === 'PAID') {
      pendingOrderRef.current = null;
      update({ status: 'success', message: null, points: result.totalPoints ?? order.totalPoints });
    } else if (result.timedOut) {
      pendingOrderRef.current = order;
      update({
        status: 'pending',
        message: 'Paiement en attente de confirmation. Si vous avez validé sur votre téléphone, '
          + 'votre vote sera compté dans un instant.',
      });
    } else {
      pendingOrderRef.current = null;
      update({
        status: 'failed',
        message: result.status === 'EXPIRED'
          ? 'La demande de paiement a expiré. Vous pouvez recommencer.'
          : "Le paiement n'a pas abouti. Vous pouvez réessayer.",
      });
    }
  }, [update]);

  /** Crée la commande, ouvre le widget de paiement puis attend la confirmation. */
  const submit = useCallback(async ({ candidateId, phoneNumber, amountFcfa }) => {
    if (isDemoMode()) {
      update({
        status: 'error',
        message: "Mode démonstration : le serveur de paiement n'est pas joignable, aucun vote n'a été enregistré.",
      });
      return;
    }

    update({ status: 'creating', message: null });

    let order;
    try {
      order = await createVoteOrder({ candidateId, phoneNumber, amountFcfa });
    } catch (error) {
      update({
        status: 'error',
        message: isUnreachableError(error)
          ? "Impossible de joindre le serveur de paiement : aucun vote n'a été enregistré et vous n'avez pas été débité."
          : error.friendlyMessage || error.message,
      });
      return;
    }

    try {
      await openTouchPayWidget(order.paymentWidgetParams);
    } catch (error) {
      update({
        status: 'error',
        message: "Le module de paiement n'a pas pu s'ouvrir (connexion, bloqueur de publicités ?). "
          + "Vous n'avez pas été débité — réessayez.",
      });
      return;
    }

    await settle(order);
  }, [settle, update]);

  /** Re-vérifie la commande restée en attente (statut "pending"), sans en créer de nouvelle. */
  const recheck = useCallback(async () => {
    if (pendingOrderRef.current) {
      await settle(pendingOrderRef.current);
    }
  }, [settle]);

  return { state, submit, recheck };
}
