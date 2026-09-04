import React, { useEffect } from 'react';
import './pricingTiers.scss';
import { LuZap, LuShieldCheck, LuSmartphone } from 'react-icons/lu';
import Aos from 'aos';
import 'aos/dist/aos.css';

// Nouvelle règle de vote (section 5 du brief) : ancien barème à paliers (standard/soutien/
// premium, avec un nombre de points différent selon le montant) entièrement abandonné.
// Règle unique et définitive, sans exception : 200 FCFA = 5 points.
const UNIT_PRICE_FCFA = 200;
const POINTS_PER_UNIT = 5;

// 3 garanties courtes affichées sous la règle, pour rassurer sans réintroduire de complexité
// (aucun "palier" ni condition — juste des informations pratiques sur le vote lui-même).
const GUARANTEES = [
  { icon: LuZap, text: 'Points crédités quasi instantanément après confirmation du paiement' },
  { icon: LuShieldCheck, text: 'Chaque vote compte dans le classement en direct de sa discipline' },
  { icon: LuSmartphone, text: 'Paiement mobile money sécurisé (Orange Money, Wave)' },
];

const PricingTiers = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <section className="pricingTiers">
      <div className="secTitle sectionTitle">
        <span className="eyebrow" data-aos="fade-up">Règle de vote</span>
        <h3 data-aos="fade-up">Une seule règle, simple et juste</h3>
        <p data-aos="fade-up">
          Pas de palier, pas de multiplicateur : chaque vote rapporte exactement le même nombre
          de points, quel que soit le nombre de votes effectués en une fois.
        </p>
        <div className="titleUnderline" data-aos="fade-up"></div>
      </div>

      {/* Carte unique mettant en avant la règle — remplace l'ancienne grille à 3 paliers */}
      <div className="ruleCard" data-aos="fade-up">
        <div className="ruleCard__equation">
          <span className="ruleCard__amount">{UNIT_PRICE_FCFA} FCFA</span>
          <span className="ruleCard__equals">=</span>
          <span className="ruleCard__points">{POINTS_PER_UNIT} points</span>
        </div>

        <ul className="ruleCard__guarantees">
          {GUARANTEES.map(({ icon: Icon, text }) => (
            <li key={text}>
              <Icon className="ruleCard__guaranteeIcon" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PricingTiers;
