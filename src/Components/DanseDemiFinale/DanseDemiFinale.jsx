import React from 'react';
import DisciplineVotePage from '../DisciplineVotePage/DisciplineVotePage';

// Écran de chargement propre à la discipline (styles dans styles/_votingPage.scss)
const loader = (
  <div className="dance-loading-container">
    <div className="dance-loading">
      <div className="dancer"></div>
      <div className="dancer"></div>
      <div className="dancer"></div>
    </div>
    <p className="loading-text">Chargement des performances</p>
    <p className="loading-subtext">Préparez-vous à voter pour vos danseurs préférés</p>
  </div>
);

const DanseDemiFinale = () => (
  <DisciplineVotePage
    category="DANSE"
    containerClass="danse-container"
    heading="Performances de Danse"
    subtitle="Votez pour votre chorégraphie préférée"
    loader={loader}
    rankingTitle="Verdict final — Danse"
    variant="dance"
  />
);

export default DanseDemiFinale;
