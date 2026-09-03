import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './candidatePage.scss';
import { getCandidateById } from '../../services/candidateService';
import { getCampaignStatus } from '../../services/campaignService';
import { getRanking } from '../../services/rankingService';
import { LuArrowLeft, LuTrophy } from 'react-icons/lu';

const CATEGORY_LABEL = {
  CHANT: 'Chant',
  DANSE: 'Danse',
  RAP: 'Rap',
  JOKER_CHANT: 'Joker · Chant',
  JOKER_DANSE: 'Joker · Danse',
  JOKER_RAP: 'Joker · Rap',
};

const VOTE_ROUTE = {
  CHANT: '/chant',
  DANSE: '/danse',
  RAP: '/rap',
  JOKER_CHANT: '/voter-joker/chant',
  JOKER_DANSE: '/voter-joker/danse',
  JOKER_RAP: '/voter-joker/rap',
};

const CandidatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [standing, setStanding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await getCandidateById(id);
        if (cancelled) return;
        setCandidate(data);

        const status = await getCampaignStatus();
        if (cancelled || !status.campaignId) return;

        const ranking = await getRanking(status.campaignId);
        if (cancelled) return;
        const index = ranking.findIndex((r) => r.candidateId === id);
        if (index >= 0) {
          setStanding({ rank: index + 1, ...ranking[index] });
        }
      } catch (err) {
        if (!cancelled) setError("Ce candidat est introuvable ou n'est plus actif.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return <div className="candidate-page-loading">Chargement du profil...</div>;
  }

  if (error || !candidate) {
    return (
      <div className="candidate-page-error">
        <p>{error}</p>
        <button className="btn" onClick={() => navigate('/demi-finale')}>Retour aux catégories</button>
      </div>
    );
  }

  const voteRoute = VOTE_ROUTE[candidate.category] || '/demi-finale';

  return (
    <div className="candidate-page">
      <div className="candidate-hero" style={{ backgroundImage: `url(${candidate.photoUrl})` }}>
        <div className="candidate-hero__scrim" />
        <div className="container candidate-hero__content">
          <button className="back-link" onClick={() => navigate(-1)}>
            <LuArrowLeft /> Retour
          </button>

          <div className="candidate-hero__badges">
            <span className="badge">{CATEGORY_LABEL[candidate.category] || candidate.category}</span>
            {candidate.style && <span className="badge badge-signal">{candidate.style}</span>}
          </div>

          <h1>{candidate.fullName}</h1>

          {standing && (
            <div className="standing-strip">
              <div className="standing-item">
                <LuTrophy className="standing-icon" />
                <span className="standing-value">#{standing.rank}</span>
                <span className="standing-label">classement</span>
              </div>
              <div className="standing-item">
                <span className="standing-value mono">{standing.points.toLocaleString('fr-FR')}</span>
                <span className="standing-label">points</span>
              </div>
              <div className="standing-item">
                <span className="standing-value mono">{standing.percentage.toFixed(1)}%</span>
                <span className="standing-label">des voix</span>
              </div>
            </div>
          )}

          <div className="candidate-hero__actions">
            <button className="btn" onClick={() => navigate(voteRoute)}>Voter pour {candidate.fullName.split(' ')[0]}</button>
            <Link className="btnGhost" to={voteRoute}>Voir la catégorie</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatePage;
