import React from 'react';
import './rap.scss';
import DisciplineVotePage from '../DisciplineVotePage/DisciplineVotePage';

// Écran de chargement propre à la discipline (styles dans rap.scss)
const loader = (
  <div className="rap-loading-container">
    <div className="beat-loader">
      <div className="vinyl">
        <div className="groove"></div>
        <div className="label">RAP</div>
      </div>
      <div className="needle"></div>
    </div>
    <p className="loading-text">Mixage des beats...</p>
    <div className="lyric-bubble">
      <div className="word">Yo</div>
      <div className="word">Check</div>
      <div className="word">It</div>
      <div className="word">Out</div>
    </div>
  </div>
);

const RapDemiFinale = () => (
  <DisciplineVotePage
    category="RAP"
    containerClass="rap-container"
    heading="Candidats - Catégorie Rap"
    loader={loader}
    rankingTitle="Verdict final — Rap"
  />
);

export default RapDemiFinale;
