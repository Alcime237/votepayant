import React, { useCallback, useEffect, useRef, useState } from 'react';
import './heroSlider.scss';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

/**
 * Slider héro réutilisable : image plein cadre en fondu + effet Ken Burns,
 * eyebrow/titre/sous-titre par diapositive, navigation par points + flèches,
 * défilement automatique (pause au survol). `children` s'affiche par-dessus
 * toutes les diapositives (ex. boutons d'action persistants).
 */
const HeroSlider = ({ slides, height = '78vh', interval = 6000, children }) => {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);
  const pausedRef = useRef(false);

  const goTo = useCallback((index) => {
    setActive(((index % slides.length) + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    timerRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setActive((prev) => (prev + 1) % slides.length);
      }
    }, interval);

    return () => clearInterval(timerRef.current);
  }, [slides.length, interval]);

  return (
    <section
      className="heroSlider"
      style={{ '--hero-height': height }}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.title || i}
          className={`heroSlider__slide ${i === active ? 'is-active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
          aria-hidden={i !== active}
        >
          <div className="heroSlider__scrim" />
        </div>
      ))}

      <div className="container heroSlider__content">
        {slides.map((slide, i) => (
          <div key={slide.title || i} className={`heroSlider__text ${i === active ? 'is-active' : ''}`}>
            {slide.eyebrow && <span className="eyebrow">{slide.eyebrow}</span>}
            {slide.title && <h1>{slide.title}</h1>}
            {slide.subtitle && <p>{slide.subtitle}</p>}
          </div>
        ))}

        {children && <div className="heroSlider__actions">{children}</div>}
      </div>

      {slides.length > 1 && (
        <>
          <button className="heroSlider__arrow left" onClick={() => goTo(active - 1)} aria-label="Diapositive précédente">
            <LuChevronLeft />
          </button>
          <button className="heroSlider__arrow right" onClick={() => goTo(active + 1)} aria-label="Diapositive suivante">
            <LuChevronRight />
          </button>

          <div className="heroSlider__dots">
            {slides.map((slide, i) => (
              <button
                key={slide.title || i}
                className={`heroSlider__dot ${i === active ? 'is-active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Aller à la diapositive ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSlider;
