import React, { useEffect, useState } from 'react';
import './partnersSlider.scss';
import { getPartners } from '../../services/partnerService';

// Lettres utilisées pour varier l'initiale affichée sur chaque tuile de substitution,
// pour que les placeholders ne soient pas tous strictement identiques.
const PLACEHOLDER_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

// Partenaires de substitution : le cahier des charges demande d'utiliser des images
// "placeholder" en attendant les vrais logos. On les garde donc comme valeur par défaut
// tant que l'API ne renvoie rien d'exploitable, plutôt que de ne rien afficher du tout.
const PLACEHOLDER_PARTNERS = PLACEHOLDER_LETTERS.map((letter, i) => ({
  id: `placeholder-${i}`,
  name: `Partenaire ${letter}`,
  logoUrl: null,
  websiteUrl: null,
}));

// Construit l'initiale affichée dans la tuile ronde quand il n'y a pas encore de logo réel
const PLACEHOLDER_INITIAL = (name) => (name || '?').trim().charAt(0).toUpperCase();

const PartnersSlider = () => {
  // On démarre directement avec les placeholders (plutôt qu'un tableau vide) pour éviter
  // un "flash" de section invisible le temps que la requête réseau réponde.
  const [partners, setPartners] = useState(PLACEHOLDER_PARTNERS);

  useEffect(() => {
    getPartners()
      // Si l'API renvoie une vraie liste (non vide), elle remplace les placeholders ;
      // sinon on conserve les placeholders, pour que "Nos partenaires" reste visible
      // sur toutes les pages même avant que de vrais partenaires soient configurés.
      .then((data) => setPartners(Array.isArray(data) && data.length > 0 ? data : PLACEHOLDER_PARTNERS))
      .catch(() => setPartners(PLACEHOLDER_PARTNERS));
  }, []);

  // La liste est dupliquée pour permettre un défilement en boucle continue et fluide :
  // voir le commentaire sur @keyframes partnersMarquee dans le fichier .scss associé.
  const marqueeItems = [...partners, ...partners];

  return (
    <section className="partnersSlider" id="partenaires">
      <div className="secTitle sectionTitle">
        <span className="eyebrow" data-aos="fade-up">Ils nous soutiennent</span>
        <h3 data-aos="fade-up">Nos partenaires</h3>
        <p data-aos="fade-up">Les marques qui accompagnent les talents jusqu'à la grande finale.</p>
        <div className="titleUnderline" data-aos="fade-up"></div>
      </div>

      {/* Bandeau autoplay en boucle infinie (défilement CSS pur, mis en pause au survol) */}
      <div className="partnersSlider__viewport" data-aos="fade-up">
        <div className="partnersSlider__track">
          {marqueeItems.map((p, i) => (
            <a
              key={`${p.id}-${i}`}
              href={p.websiteUrl || undefined}
              target={p.websiteUrl ? '_blank' : undefined}
              rel={p.websiteUrl ? 'noopener noreferrer' : undefined}
              className="partnersSlider__tile"
              // Une tuile placeholder n'a pas de vraie destination : on neutralise le clic
              onClick={p.websiteUrl ? undefined : (e) => e.preventDefault()}
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
      </div>
    </section>
  );
};

export default PartnersSlider;
