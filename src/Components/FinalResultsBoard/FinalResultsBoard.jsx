// Tableau des résultats finaux, par catégorie (Rap, Chant, Danse) — remplace le classement
// en direct global (RankingChart sans prop `category`) sur la page Vote. Contrairement à ce
// dernier (alimenté en temps réel via SSE), ce tableau lit les totaux définitifs de chaque
// candidat (voir ResultsQueryService côté backend) : il reste juste même une fois le vote
// terminé, quand plus rien n'incrémente le classement en direct.
//
// Le nombre de "qualifié·e·s" mis en avant par catégorie n'est jamais décidé ici : il vient
// du serveur (Campaign.qualifiersPerCategory), fixé selon les règles réelles du déroulement
// de l'étape en cours (ex. 2 par catégorie en demi-finale Thiès & Saly, 4 à Dakar...). Ce
// composant se contente d'afficher ce qu'on lui donne — jamais de nombre codé en dur ici.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuMic, LuMusic4, LuSparkles, LuTrophy } from 'react-icons/lu';
import { getCampaignStatus } from '../../services/campaignService';
import { getFinalResults } from '../../services/resultsService';
import './finalResultsBoard.scss';

const CATEGORY_META = {
  RAP: { label: 'Rap', icon: LuMusic4 },
  CHANT: { label: 'Chant', icon: LuMic },
  DANSE: { label: 'Danse', icon: LuSparkles },
};

const PHASE_LABEL = {
  AUDITION: 'Casting',
  DEMI_FINALE: 'Demi-finale',
  FINALE: 'Grande finale',
};

// Reproduit le barème de couleur du backend (RankingEntryResponse.ColorTier) : les résultats
// ici sont recalculés en pourcentage de la CATÉGORIE (jamais du total toutes disciplines
// confondues), donc le colorTier doit lui aussi être recalculé localement.
function colorTierForPercentage(percentage) {
  if (percentage >= 50) return 'vert';
  if (percentage >= 10) return 'orange';
  if (percentage >= 1) return 'rouge';
  return 'gris';
}

const CategoryBoard = ({ category, meta, qualifiersPerCategory, results }) => {
  const Icon = meta.icon;
  const hasResults = results.length > 0;

  return (
    <div className="finalResultsBoard__category" data-aos="fade-up">
      <div className="finalResultsBoard__categoryHead">
        <span className="finalResultsBoard__categoryIcon"><Icon /></span>
        <div>
          <h4>{meta.label}</h4>
          {qualifiersPerCategory != null && (
            <span className="finalResultsBoard__qualifierNote">
              {qualifiersPerCategory} qualifié{qualifiersPerCategory > 1 ? 's' : ''} sur {results.length}
            </span>
          )}
        </div>
      </div>

      {!hasResults ? (
        <p className="finalResultsBoard__empty">Aucun candidat pour l'instant dans cette catégorie.</p>
      ) : (
        <ol className="finalResultsBoard__rows">
          {results.map((entry) => (
            <li key={entry.candidateId}>
              <Link
                to={`/candidat/${entry.candidateId}`}
                className={`finalResultsBoard__row ${entry.qualified ? 'is-qualified' : ''}`}
              >
                <span className="finalResultsBoard__rank">{String(entry.rank).padStart(2, '0')}</span>

                <span className="finalResultsBoard__who">
                  {entry.photoUrl && <img src={entry.photoUrl} alt="" />}
                  <span className="finalResultsBoard__name">{entry.fullName}</span>
                  {entry.qualified && (
                    <span className="finalResultsBoard__badge">
                      <LuTrophy /> Qualifié·e
                    </span>
                  )}
                </span>

                <span className="finalResultsBoard__barWrap">
                  <span
                    className={`finalResultsBoard__bar tier-${colorTierForPercentage(entry.percentage)}`}
                    style={{ width: `${Math.max(entry.percentage, 1.5)}%` }}
                  />
                </span>

                <span className="finalResultsBoard__stats">
                  <b>{entry.percentage.toFixed(1)}%</b>
                  <span>{entry.points.toLocaleString('fr-FR')} pts</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

const FinalResultsBoard = () => {
  const [campaignId, setCampaignId] = useState(null);
  const [phase, setPhase] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getCampaignStatus()
      .then((status) => {
        if (cancelled) return;
        setCampaignId(status.campaignId);
        setPhase(status.phase);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de récupérer la campagne en cours.");
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!campaignId) return undefined;
    let cancelled = false;

    getFinalResults(campaignId)
      .then((data) => { if (!cancelled) setCategories(data); })
      .catch(() => { if (!cancelled) setError('Impossible de charger les résultats.'); });

    return () => { cancelled = true; };
  }, [campaignId]);

  if (!campaignId && !error) {
    return null;
  }

  return (
    <section className="finalResultsBoard">
      <div className="secTitle sectionTitle finalResultsBoard__intro">
        <span className="eyebrow" data-aos="fade-up">Résultats</span>
        <h3 data-aos="fade-up">Résultats par catégorie</h3>
        <p data-aos="fade-up">
          La répartition des votes reçus dans chaque discipline, en pourcentage du total de sa
          catégorie{phase && <>  étape actuelle : <strong>{PHASE_LABEL[phase] || phase}</strong></>}.
          Les places qualificatives affichées suivent les règles officielles du déroulement de
          cette étape.
        </p>
        <div className="titleUnderline" data-aos="fade-up"></div>
      </div>

      {error ? (
        <p className="finalResultsBoard__empty">{error}</p>
      ) : (
        <div className="finalResultsBoard__grid">
          {categories.map((cat) => (
            <CategoryBoard
              key={cat.category}
              category={cat.category}
              meta={CATEGORY_META[cat.category] || { label: cat.category, icon: LuTrophy }}
              qualifiersPerCategory={cat.qualifiersPerCategory}
              results={cat.results}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FinalResultsBoard;
