import React, { useEffect, useState } from 'react';
import './partnersSlider.scss';
import { getPartners } from '../../services/partnerService';

// Silhouettes utilisées tant que le logo réel d'un partenaire n'est pas
// encore fourni — garde la section crédible en attendant les vraies images.
const PLACEHOLDER_INITIAL = (name) => (name || '?').trim().charAt(0).toUpperCase();

const PartnersSlider = () => {
  const [partners, setPartners] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    getPartners().then(setPartners).catch(() => setPartners([]));
  }, []);

  useEffect(() => {
    if (partners.length <= 1) return undefined;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % partners.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [partners.length]);

  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="partnersSlider" id="partenaires">
      <div className="secTitle sectionTitle">
        <span className="eyebrow" data-aos="fade-up">Ils nous soutiennent</span>
        <h3 data-aos="fade-up">Nos partenaires</h3>
        <p data-aos="fade-up">Les marques qui accompagnent les talents jusqu'à la grande finale.</p>
        <div className="titleUnderline" data-aos="fade-up"></div>
      </div>

      <div className="partnersSlider__stage" data-aos="fade-up">
        {partners.map((p, i) => (
          <a
            key={p.id}
            href={p.websiteUrl || undefined}
            target={p.websiteUrl ? '_blank' : undefined}
            rel={p.websiteUrl ? 'noopener noreferrer' : undefined}
            className={`partnersSlider__slide ${i === active ? 'is-active' : ''}`}
          >
            {p.logoUrl ? (
              <img src={p.logoUrl} alt={p.name} />
            ) : (
              <div className="partnersSlider__placeholder">{PLACEHOLDER_INITIAL(p.name)}</div>
            )}
            <span className="partnersSlider__name">{p.name}</span>
          </a>
        ))}
      </div>

      {partners.length > 1 && (
        <div className="partnersSlider__dots">
          {partners.map((p, i) => (
            <button
              key={p.id}
              className={`partnersSlider__dot ${i === active ? 'is-active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Voir ${p.name}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default PartnersSlider;
