import React from 'react';
import './chant.scss';
import DisciplineVotePage from '../DisciplineVotePage/DisciplineVotePage';

// Écran de chargement propre à la discipline (styles dans chant.scss)
const loader = (
  <div className="chant-loading-container">
    <div className="music-loader">
      <div className="note">♪</div>
      <div className="note">♫</div>
      <div className="note">♩</div>
    </div>
    <p className="loading-text">Chargement des talents vocaux...</p>
    <div className="equalizer">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bar" style={{ '--delay': `${i * 0.1}s` }} />
      ))}
    </div>
  </div>
);

const ChantDemiFinale = () => (
  <DisciplineVotePage
    category="CHANT"
    containerClass="chant-container"
    heading="Candidats - Catégorie Chant"
    loader={loader}
    rankingTitle="Verdict final — Chant"
  />
);

export default ChantDemiFinale;
