import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCampaignStatus } from '../../services/campaignService';
import { getRanking, subscribeToRanking } from '../../services/rankingService';
import './rankingChart.scss';

const CATEGORY_LABEL = {
  CHANT: 'Chant',
  DANSE: 'Danse',
  RAP: 'Rap',
  JOKER_CHANT: 'Joker · Chant',
  JOKER_DANSE: 'Joker · Danse',
  JOKER_RAP: 'Joker · Rap',
};

// Reproduit exactement le barème de couleur du backend (RankingEntryResponse.ColorTier) :
// nécessaire ici car quand on scope à une discipline, on recalcule le pourcentage localement
// (voir plus bas) et le colorTier du serveur — lui calculé sur le pourcentage GLOBAL toutes
// disciplines confondues — ne serait plus juste pour l'affichage scopé.
const colorTierForPercentage = (percentage) => {
  if (percentage >= 50) return 'VERT';
  if (percentage >= 10) return 'ORANGE';
  if (percentage >= 1) return 'ROUGE';
  return 'GRIS';
};

/**
 * Diagramme en bâtons du classement en direct (mis à jour via SSE, voir rankingService.js).
 *
 * - Sans prop `category` : classement global toutes disciplines confondues (page Vote/hub).
 * - Avec prop `category` (ex. "CHANT") : c'est le "Verdict final" d'une discipline précise
 *   (pages ChantDemiFinale/RapDemiFinale/DanseDemiFinale) — la liste reçue est filtrée à
 *   cette seule discipline, et le pourcentage de chaque candidat est RECALCULÉ localement par
 *   rapport au total de points de CETTE discipline uniquement (le champ `percentage` renvoyé
 *   par le backend est lui calculé sur le total de TOUTE la campagne, toutes disciplines
 *   confondues — l'utiliser tel quel afficherait un pourcentage faux ici). Voir section 8.3
 *   du cahier des charges : "en pourcentage du total de la discipline".
 */
const RankingChart = ({ category = null, title = 'Classement en direct', showExplanation = false }) => {
  // Id de la campagne de vote actuellement ouverte (nécessaire pour interroger/écouter le classement)
  const [campaignId, setCampaignId] = useState(null);
  // Classement brut tel que reçu du serveur (jamais filtré/modifié directement, voir displayedRanking)
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState(null);

  // Récupère la campagne active une seule fois au montage
  useEffect(() => {
    let cancelled = false;
    getCampaignStatus()
      .then((status) => {
        if (!cancelled) setCampaignId(status.campaignId);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de récupérer la campagne en cours.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Charge un premier instantané puis s'abonne au flux temps réel (SSE) dès que la campagne est connue
  useEffect(() => {
    if (!campaignId) return undefined;

    getRanking(campaignId)
      .then(setRanking)
      .catch(() => setError('Impossible de charger le classement.'));

    const unsubscribe = subscribeToRanking(
      campaignId,
      setRanking,
      () => setError('Connexion au classement en direct interrompue.')
    );

    return unsubscribe;
  }, [campaignId]);

  // Recalcule filtrage + pourcentages à chaque mise à jour du classement brut ou de la discipline
  // affichée — useMemo évite de refaire ce calcul à chaque rendu si rien n'a changé.
  const displayedRanking = useMemo(() => {
    const scoped = category ? ranking.filter((entry) => entry.category === category) : ranking;
    const totalPoints = scoped.reduce((sum, entry) => sum + entry.points, 0);

    return scoped
      .map((entry) => {
        const localPercentage = totalPoints === 0 ? 0 : (entry.points * 100) / totalPoints;
        return {
          ...entry,
          localPercentage,
          // Hors scope discipline (classement global), le colorTier du backend reste valide
          // puisqu'il est déjà calculé sur le même total global — pas besoin de le recalculer.
          localColorTier: category ? colorTierForPercentage(localPercentage) : entry.colorTier,
        };
      })
      // Toujours retrié localement : le classement global renvoyé par le serveur n'est plus
      // forcément dans l'ordre une fois qu'on l'a réduit à une seule discipline.
      .sort((a, b) => b.points - a.points);
  }, [ranking, category]);

  if (!campaignId && !error) {
    return null;
  }

  if (error) {
    return <div className="ranking-chart ranking-chart-error">{error}</div>;
  }

  return (
    <div className="ranking-chart">
      <h3 className="ranking-chart-title">
        <span className="live-dot" />
        {title}
      </h3>

      {showExplanation && (
        // Texte demandé en section 8.3 : explique ce que représente cette section
        <p className="ranking-chart-explanation">
          Ce classement montre, en temps réel, la répartition des votes reçus pour cette
          discipline. Chaque barre représente la part de points d'un candidat par rapport au
          total de la discipline — elle se met à jour automatiquement dès qu'un vote de 200
          FCFA (5 points) est confirmé.
        </p>
      )}

      {displayedRanking.length === 0 ? (
        <p className="ranking-chart-empty">Aucun vote pour l'instant.</p>
      ) : (
        <div className="board">
          {displayedRanking.map((entry, i) => {
            const rank = i + 1;
            return (
              <Link
                to={`/candidat/${entry.candidateId}`}
                key={entry.candidateId}
                className={`board-row rank-${Math.min(rank, 4)}`}
              >
                <span className="rank">{String(rank).padStart(2, '0')}</span>
                <span className="who">
                  {/* Photo affichée seulement si le candidat en a déjà une enregistrée */}
                  {entry.photoUrl && <img className="who-photo" src={entry.photoUrl} alt="" />}
                  <span className="who-text">
                    <b>{entry.fullName}</b>
                    {/* La discipline n'est affichée que sur le classement global : sur une
                        page déjà scopée à une discipline (category fourni), c'est redondant. */}
                    {!category && <span>{CATEGORY_LABEL[entry.category] || entry.category}</span>}
                  </span>
                </span>
                <span className="bar-wrap">
                  <span
                    className={`bar tier-${(entry.localColorTier || 'GRIS').toLowerCase()}`}
                    // Minimum 2% de largeur : une barre à 0px serait invisible/non cliquable visuellement
                    style={{ width: `${Math.max(entry.localPercentage, 2)}%` }}
                  />
                </span>
                <span className="pts">
                  {entry.points.toLocaleString('fr-FR')}
                  <span>{entry.localPercentage.toFixed(1)}%</span>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RankingChart;
