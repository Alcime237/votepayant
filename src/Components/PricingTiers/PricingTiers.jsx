import React, { useEffect } from 'react';
import './pricingTiers.scss';
import { LuStar, LuHeart, LuCrown, LuCheck } from 'react-icons/lu';
import Aos from 'aos';
import 'aos/dist/aos.css';

const TIERS = [
  {
    key: 'standard',
    icon: LuStar,
    name: 'Standard',
    range: '200 - 800 FCFA',
    points: '3 points',
    perUnit: 'par tranche de 200 FCFA',
    highlight: false,
  },
  {
    key: 'soutien',
    icon: LuHeart,
    name: 'Soutien',
    range: '1 000 - 4 800 FCFA',
    points: '6 points',
    perUnit: 'par tranche de 200 FCFA',
    highlight: true,
  },
  {
    key: 'premium',
    icon: LuCrown,
    name: 'Premium',
    range: '5 000 FCFA et plus',
    points: '10 points',
    perUnit: 'par tranche de 200 FCFA',
    highlight: false,
  },
];

const PricingTiers = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <section className="pricingTiers">
      <div className="secTitle sectionTitle">
        <span className="eyebrow" data-aos="fade-up">Grille de vote</span>
        <h3 data-aos="fade-up">Le vote est à 200 FCFA</h3>
        <p data-aos="fade-up">
          Plus vous votez en une seule fois pour un candidat, plus chaque tranche de 200 FCFA rapporte de points.
        </p>
        <div className="titleUnderline" data-aos="fade-up"></div>
      </div>

      <div className="tiersGrid">
        {TIERS.map(({ key, icon: Icon, name, range, points, perUnit, highlight }, index) => (
          <div
            key={key}
            className={`tierCard ${highlight ? 'tierCard--highlight' : ''}`}
            data-aos="fade-up"
            data-aos-delay={index * 120}
          >
            {highlight && <span className="tierBadge">Le plus soutenu</span>}
            <div className="tierIcon">
              <Icon />
            </div>
            <h4 className="tierName">{name}</h4>
            <p className="tierRange">{range}</p>
            <div className="tierPoints">
              <span className="tierPointsValue">{points}</span>
              <span className="tierPointsUnit">{perUnit}</span>
            </div>
            <ul className="tierFeatures">
              <li><LuCheck className="checkIcon" /> Compte dans le classement en direct</li>
              <li><LuCheck className="checkIcon" /> Paiement mobile money sécurisé</li>
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingTiers;
