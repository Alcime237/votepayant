import React from 'react';
import { LuTriangleAlert } from 'react-icons/lu';
import useDemoMode from '../../hooks/useDemoMode';
import './demoBanner.scss';

/**
 * Avertit le visiteur quand le serveur est injoignable : les candidats, points et résultats
 * affichés sont alors FICTIFS (voir services/demoMode.js). Sans ce bandeau, ces données
 * passaient pour de vraies alors qu'aucun vote ne peut être enregistré.
 */
const DemoBanner = () => {
  const isDemo = useDemoMode();
  if (!isDemo) return null;

  return (
    <div className="demoBanner" role="status">
      <LuTriangleAlert aria-hidden="true" />
      <span>
        <strong>Mode démonstration</strong> — le serveur est injoignable : les données affichées sont
        fictives et aucun vote ne peut être enregistré.
      </span>
    </div>
  );
};

export default DemoBanner;
