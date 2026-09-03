import React, { useEffect, useState } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getCampaignStatus } from '../../services/campaignService';
import { getRanking, subscribeToRanking } from '../../services/rankingService';
import './rankingChart.scss';

const COLOR_BY_TIER = {
  VERT: '#22c55e',
  ORANGE: '#f97316',
  ROUGE: '#ef4444',
  GRIS: '#9ca3af',
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

  if (ranking.length === 0) {
    return (
      <div className="ranking-chart">
        <h3 className="ranking-chart-title">Classement en direct</h3>
        <p className="ranking-chart-empty">Aucun vote pour l'instant.</p>
      </div>
    );
  }

  const data = ranking.map((entry) => ({
    name: entry.fullName || 'Candidat',
    points: entry.points,
    colorTier: entry.colorTier,
  }));

  const podium = data.slice(0, 3);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="ranking-chart">
      <h3 className="ranking-chart-title">Classement en direct</h3>

      {podium.length > 0 && (
        <div className="ranking-podium">
          {podium.map((entry, i) => (
            <div key={entry.name} className={`ranking-podium__item rank-${i + 1}`}>
              <span className="ranking-podium__medal">{medals[i]}</span>
              <span className="ranking-podium__name">{entry.name}</span>
              <span className="ranking-podium__points">{entry.points} pts</span>
            </div>
          ))}
        </div>
      )}

      <ResponsiveContainer width="100%" height={Math.max(220, data.length * 48)}>
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 32, bottom: 8, left: 8 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 13 }} />
          <Tooltip formatter={(value) => [`${value} points`, 'Points']} />
          <Bar dataKey="points" radius={[0, 6, 6, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLOR_BY_TIER[entry.colorTier] || COLOR_BY_TIER.GRIS} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RankingChart;
