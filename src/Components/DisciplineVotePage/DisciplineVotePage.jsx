import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './disciplineVotePage.scss';
import { getCandidatesByCategory } from '../../services/candidateService';
import useCampaignStatus from '../../hooks/useCampaignStatus';
import { POINTS_PER_UNIT, UNIT_PRICE_FCFA } from '../../constants/voteRules';
// "Verdict final" : diagramme en bâtons du classement, scopé à la discipline (section 8.3)
import RankingChart from '../RankingChart/RankingChart';
import VoteModal from '../VoteModal/VoteModal';

const initialOf = (name) => (name || '?').trim().charAt(0).toUpperCase();

/**
 * Page de vote d'UNE discipline (Chant, Rap ou Danse) : liste des candidats, fenêtre de vote et
 * "Verdict final". Remplace trois pages de ~400 lignes quasi identiques — ChantDemiFinale,
 * RapDemiFinale et DanseDemiFinale ne sont plus que de fines configurations de ce composant
 * (titre, écran de chargement propre à la discipline, variante d'affichage des cartes).
 *
 * @param {'CHANT'|'RAP'|'DANSE'} category Discipline affichée (valeur de l'enum backend)
 * @param {string} containerClass Classe racine propre à la discipline (voir _votingPage.scss)
 * @param {'default'|'dance'} variant "dance" : photo avec calque "Voir le groupe" et style de danse
 */
const DisciplineVotePage = ({ category, containerClass, heading, subtitle, loader, rankingTitle, variant = 'default' }) => {
  const navigate = useNavigate();
  const { loaded: campaignLoaded, votingActive } = useCampaignStatus();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [voteTarget, setVoteTarget] = useState(null);

  const isDance = variant === 'dance';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getCandidatesByCategory(category)
      .then((data) => { if (!cancelled) setCandidates(data); })
      // friendlyMessage (posé par l'intercepteur axios, voir apiClient.js) explique la cause
      // réelle (serveur injoignable / CORS / erreur métier) au lieu du "Network Error" générique
      .catch((err) => { if (!cancelled) setError(err.friendlyMessage || err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [category, reloadKey]);

  const closeVoteModal = useCallback(() => setVoteTarget(null), []);

  // Échap ferme la visionneuse de photo
  useEffect(() => {
    if (!selectedImage) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedImage(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selectedImage]);

  if (loading) return loader;

  if (error) {
    return (
      <div className="error-container" role="alert">
        <p>Erreur : {error}</p>
        <button type="button" onClick={() => setReloadKey((key) => key + 1)}>Réessayer</button>
      </div>
    );
  }

  const openImage = (candidate) => setSelectedImage({ url: candidate.photoUrl, name: candidate.fullName });

  return (
    <section className={containerClass}>
      <h1>{heading}</h1>
      {subtitle && <div className="subtitle">{subtitle}</div>}

      <button type="button" className="back-button" onClick={() => navigate(-1)}>
        &larr; Retour
      </button>

      {campaignLoaded && !votingActive && (
        <p className="vote-closed-notice" role="status">
          Les votes sont clos pour le moment. Vous pouvez consulter le classement ci-dessous.
        </p>
      )}

      {candidates.length === 0 ? (
        <p className="candidates-empty">Aucun candidat n'est encore inscrit dans cette discipline.</p>
      ) : (
        <div className="candidates-list">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="candidate-card">
              <div
                className="image-clickable"
                role="button"
                tabIndex={0}
                aria-label={`Voir la photo de ${candidate.fullName}`}
                onClick={() => candidate.photoUrl && openImage(candidate)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && candidate.photoUrl) {
                    e.preventDefault();
                    openImage(candidate);
                  }
                }}
              >
                {candidate.photoUrl ? (
                  <img
                    src={candidate.photoUrl}
                    alt={candidate.fullName}
                    className={isDance ? 'dancer-image' : undefined}
                    loading="lazy"
                  />
                ) : (
                  // Candidat sans photo (ex. inscrit avant l'ajout des 3 photos) : initiale plutôt qu'une image cassée
                  <div className="candidate-photo-placeholder" aria-hidden="true">{initialOf(candidate.fullName)}</div>
                )}
                {isDance && candidate.photoUrl && (
                  <div className="dancer-overlay"><span>Voir le groupe</span></div>
                )}
              </div>

              <div className="candidate-info">
                <h3>{candidate.fullName}</h3>
                {isDance ? (
                  <div className="details">
                    {candidate.style && <p className="style">Style : {candidate.style}</p>}
                    <p className="price">{UNIT_PRICE_FCFA} FCFA = {POINTS_PER_UNIT} points</p>
                  </div>
                ) : (
                  // Règle de vote unique affichée sur chaque carte (section 5) : plus de palier
                  <p className="price">{UNIT_PRICE_FCFA} FCFA = {POINTS_PER_UNIT} points</p>
                )}
              </div>

              <button
                type="button"
                className={`vote-button ${!votingActive ? 'disabled' : ''}`}
                onClick={() => setVoteTarget(candidate)}
                disabled={!votingActive}
              >
                {isDance
                  ? <span className="vote-text">{votingActive ? 'Voter' : 'Terminé'}</span>
                  : (votingActive ? 'Voter' : 'Terminé')}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* "Verdict final" (section 8.3) : classement en direct, strictement scopé à la discipline —
          category filtre la liste reçue et recalcule le pourcentage localement (voir le
          commentaire détaillé dans RankingChart.jsx). */}
      <RankingChart category={category} title={rankingTitle} showExplanation />

      {selectedImage && (
        <div className="image-popup-overlay" onClick={() => setSelectedImage(null)}>
          <div
            className="image-popup-content"
            role="dialog"
            aria-modal="true"
            aria-label={selectedImage.name}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="close-popup" onClick={() => setSelectedImage(null)} aria-label="Fermer">
              &times;
            </button>
            <img src={selectedImage.url} alt={selectedImage.name} />
            <p>{selectedImage.name}</p>
          </div>
        </div>
      )}

      {voteTarget && (
        <VoteModal candidate={voteTarget} votingActive={votingActive} onClose={closeVoteModal} />
      )}
    </section>
  );
};

export default DisciplineVotePage;
