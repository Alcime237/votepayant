import { useEffect, useState } from 'react';
import { getCampaignStatus } from '../services/campaignService';

const REFRESH_MS = 60000;

/**
 * Statut de la campagne de vote, rafraîchi périodiquement, avec un compte à rebours calé sur
 * l'horloge du SERVEUR (champ serverTime) et non sur celle de l'appareil du visiteur — une
 * horloge de téléphone en avance ou en retard décalait sinon le compte à rebours et l'instant
 * où le bouton "Voter" se désactive.
 *
 * @param {{ tick?: boolean }} options `tick: true` re-rend le composant chaque seconde (compte à
 *   rebours affiché) ; sinon il ne se re-rend qu'au rafraîchissement et à l'échéance du vote.
 * @returns {{ loaded: boolean, votingActive: boolean, campaignId: string|null, phase: string|null,
 *   remainingMs: number }}
 */
export default function useCampaignStatus({ tick = false } = {}) {
  const [snapshot, setSnapshot] = useState(null);
  const [, forceRender] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const status = await getCampaignStatus();
        if (cancelled) return;
        const serverNow = status.serverTime ? new Date(status.serverTime).getTime() : Date.now();
        setSnapshot({
          active: Boolean(status.active),
          campaignId: status.campaignId || null,
          phase: status.phase || null,
          endAt: status.endDate ? new Date(status.endDate).getTime() : null,
          clockOffsetMs: serverNow - Date.now(),
        });
      } catch (error) {
        // Échec de rafraîchissement : on garde le dernier statut connu. Sans statut du tout, le
        // vote est considéré fermé (mieux vaut refuser un vote que d'en accepter un dans le vide).
        if (!cancelled) {
          setSnapshot((previous) => previous ?? {
            active: false, campaignId: null, phase: null, endAt: null, clockOffsetMs: 0,
          });
        }
      }
    };

    load();
    const interval = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!tick) return undefined;
    const interval = setInterval(() => forceRender((n) => n + 1), 1000);
    return () => clearInterval(interval);
  }, [tick]);

  // Re-rendu à l'échéance du vote, pour désactiver les boutons même sans compte à rebours affiché
  const endAt = snapshot?.endAt ?? null;
  const clockOffsetMs = snapshot?.clockOffsetMs ?? 0;
  useEffect(() => {
    if (endAt === null || tick) return undefined;
    const msLeft = endAt - (Date.now() + clockOffsetMs);
    // setTimeout plafonne à ~24,8 jours : au-delà, le rafraîchissement périodique prendra le relais
    if (msLeft <= 0 || msLeft > 2 ** 31 - 1) return undefined;
    const timeout = setTimeout(() => forceRender((n) => n + 1), msLeft + 100);
    return () => clearTimeout(timeout);
  }, [endAt, clockOffsetMs, tick]);

  const remainingMs = endAt === null ? null : endAt - (Date.now() + clockOffsetMs);
  const votingActive = Boolean(snapshot?.active) && (remainingMs === null || remainingMs > 0);

  return {
    loaded: snapshot !== null,
    votingActive,
    campaignId: snapshot?.campaignId ?? null,
    phase: snapshot?.phase ?? null,
    remainingMs: votingActive && remainingMs !== null ? remainingMs : 0,
  };
}
