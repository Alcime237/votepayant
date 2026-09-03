import React, { useEffect, useState } from 'react';
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

const RankingChart = () => {
  const [campaignId, setCampaignId] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState(null);

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
        Classement en direct
      </h3>

      {ranking.length === 0 ? (
        <p className="ranking-chart-empty">Aucun vote pour l'instant.</p>
      ) : (
        <div className="board">
          {ranking.map((entry, i) => {
            const rank = i + 1;
            return (
              <Link
                to={`/candidat/${entry.candidateId}`}
                key={entry.candidateId}
                className={`board-row rank-${Math.min(rank, 4)}`}
              >
                <span className="rank">{String(rank).padStart(2, '0')}</span>
                <span className="who">
                  <b>{entry.fullName}</b>
                  <span>{CATEGORY_LABEL[entry.category] || entry.category}</span>
                </span>
                <span className="bar-wrap">
                  <span
                    className={`bar tier-${(entry.colorTier || 'GRIS').toLowerCase()}`}
                    style={{ width: `${Math.max(entry.percentage, 2)}%` }}
                  />
                </span>
                <span className="pts">
                  {entry.points.toLocaleString('fr-FR')}
                  <span>points</span>
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
