// Rubrique "Moments forts" de la page À propos : bandeau de photos de l'événement qui
// défile en continu (même mécanique que PartnersSlider — animation CSS pure, pause au
// survol) ; cliquer sur une photo l'ouvre en grand dans une visionneuse plein écran.
import React, { useCallback, useEffect, useState } from 'react';
import { LuChevronLeft, LuChevronRight, LuX } from 'react-icons/lu';
import './highlightsGallery.scss';

import auditionsImg from '../../Assets/auditionsCandidats.jpeg';
import sceneImg from '../../Assets/auditionsScene.jpg';
import juryImg from '../../Assets/jurySpotlight.jpg';
import rapCrewImg from '../../Assets/rapCrew.jpg';
import publicImg from '../../Assets/publicCheer.jpg';
import lineupImg from '../../Assets/deroulementLineup.jpg';

const PHOTOS = [
  { image: auditionsImg, caption: 'Auditions — les candidats se préparent' },
  { image: sceneImg, caption: 'Sur scène, devant le public' },
  { image: juryImg, caption: 'Le jury en pleine évaluation' },
  { image: rapCrewImg, caption: 'Les candidats Rap, entre deux passages' },
  { image: publicImg, caption: 'Le public, à fond derrière ses favoris' },
  { image: lineupImg, caption: "L'animateur face aux candidats Rap" },
];

const HighlightsGallery = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const isOpen = activeIndex !== null;

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback((e) => {
    e.stopPropagation();
    setActiveIndex((i) => (i - 1 + PHOTOS.length) % PHOTOS.length);
  }, []);
  const showNext = useCallback((e) => {
    e.stopPropagation();
    setActiveIndex((i) => (i + 1) % PHOTOS.length);
  }, []);

  // Navigation clavier (Échap pour fermer, flèches pour changer de photo) tant que la
  // visionneuse est ouverte.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + PHOTOS.length) % PHOTOS.length);
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % PHOTOS.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  // Liste dupliquée pour un défilement en boucle continue (voir @keyframes dans le .scss).
  const marqueeItems = [...PHOTOS, ...PHOTOS];

  return (
    <section className="highlightsGallery container">
      <div className="secTitle sectionTitle">
        <span className="eyebrow" data-aos="fade-up">Souvenirs</span>
        <h3 data-aos="fade-up">Moments forts</h3>
        <p data-aos="fade-up">
          Auditions, coulisses, jury, public en délire : un aperçu en images de l'énergie du
          Sénégal Talent Show. Cliquez sur une photo pour l'agrandir.
        </p>
        <div className="titleUnderline" data-aos="fade-up"></div>
      </div>

      <div className="highlightsGallery__viewport" data-aos="fade-up">
        <div className="highlightsGallery__track">
          {marqueeItems.map((photo, i) => (
            <button
              key={`${photo.caption}-${i}`}
              type="button"
              className="highlightsGallery__tile"
              onClick={() => setActiveIndex(i % PHOTOS.length)}
              aria-label={`Agrandir : ${photo.caption}`}
            >
              <img src={photo.image} alt={photo.caption} loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {isOpen && (
        <div className="highlightsLightbox" onClick={close}>
          <button type="button" className="highlightsLightbox__close" onClick={close} aria-label="Fermer">
            <LuX />
          </button>

          <button type="button" className="highlightsLightbox__arrow left" onClick={showPrev} aria-label="Photo précédente">
            <LuChevronLeft />
          </button>

          <figure className="highlightsLightbox__content" onClick={(e) => e.stopPropagation()}>
            <img src={PHOTOS[activeIndex].image} alt={PHOTOS[activeIndex].caption} />
            <figcaption>{PHOTOS[activeIndex].caption}</figcaption>
          </figure>

          <button type="button" className="highlightsLightbox__arrow right" onClick={showNext} aria-label="Photo suivante">
            <LuChevronRight />
          </button>
        </div>
      )}
    </section>
  );
};

export default HighlightsGallery;
