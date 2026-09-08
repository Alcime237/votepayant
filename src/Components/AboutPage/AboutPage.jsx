import React, { useEffect } from 'react';
import './aboutPage.scss';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';
import { LuMic, LuMusic4, LuSparkles, LuUsers, LuCalendarDays, LuTv } from 'react-icons/lu';
import HeroSlider from '../HeroSlider/HeroSlider';
import HighlightsGallery from '../HighlightsGallery/HighlightsGallery';
import chantImg from '../../Assets/chantLive.jpg';
import danseImg from '../../Assets/danseGroup.jpg';
import rapImg from '../../Assets/rap.jpg';
// Slide unique imposé pour la page À propos (image-1-30.JPG fournie par le client).
import aboutHeroImg from '../../Assets/aboutHero.jpg';

const HERO_SLIDES = [
  {
    image: aboutHeroImg,
    eyebrow: 'À propos',
    // Rebranding : "Dakar Talent Show" → "Sénégal Talent Show"
    title: 'Sénégal Talent Show',
    subtitle: 'Une émission de divertissement culturel qui célèbre la diversité artistique du continent.',
  },
];

const DISCIPLINES = [
  // "Dakar Talent Show" → "Sénégal Talent Show" dans le texte descriptif de la discipline Chant
  { key: 'chant', name: 'Chant', img: chantImg, desc: "Des voix qui font vibrer la scène du Sénégal Talent Show." },
  { key: 'danse', name: 'Danse', img: danseImg, desc: "Chorégraphies et énergie pure, du Sabar au Hip-hop." },
  { key: 'rap', name: 'Rap', img: rapImg, desc: "Le flow et la plume des jeunes talents sénégalais." },
];

const HIGHLIGHTS = [
  { icon: LuCalendarDays, label: '2 mois', desc: 'de compétition' },
  { icon: LuTv, label: 'Diffusion', desc: 'sur toutes les phases du programme' },
  { icon: LuUsers, label: 'Un jury', desc: 'compétent et exigeant' },
  { icon: LuSparkles, label: 'Qualité pro', desc: 'son, lumière, image, vidéo' },
];

const AboutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Aos.init({ duration: 900 });
  }, []);

  return (
    <div className="aboutPage">
      <HeroSlider slides={HERO_SLIDES} height="56vh" />

      <section className="section container">
        <div className="aboutConcept">
          <div data-aos="fade-right" className="aboutConcept__text">
            <span className="eyebrow">Le concept</span>
            {/* "dakarois" → "sénégalais" : émission repositionnée à l'échelle nationale */}
            <h2>Une plateforme de découverte pour le public sénégalais</h2>
            <p className="justify">
              <strong>SÉNÉGAL TALENT SHOW</strong>, une idée du promoteur Wafo Jeff Thibault, est une
              émission de divertissement culturel mettant en compétition des jeunes talents de tout âge
              dans leurs disciplines respectives : la danse, le chant, le rap et bien d'autres
              disciplines. La compétition s'étend sur une durée de deux mois, avec une diffusion
              couvrant les différentes phases du programme.
            </p>
            <p className="justify">
              L'objectif majeur de ce programme est de <em>« célébrer la diversité culturelle du
              continent, de favoriser les échanges tout en offrant une plateforme de divertissement et
              de découverte pour le public sénégalais »</em>.
            </p>
            <p className="justify">
              Pensé comme une véritable vitrine des talents, le <strong>SÉNÉGAL TALENT SHOW</strong> repose
              sur une production de qualité, avec un dispositif professionnel en matière de son, lumière,
              image et vidéo, ainsi qu'un jury compétent pour accompagner et évaluer les candidats tout au
              long de la compétition.
            </p>
            <p className="aboutConcept__credit">Concept imaginé et porté par Wafo Jeff Thibault.</p>
            <button className="btn" onClick={() => navigate('/vote')}>
              Découvrir les candidats
            </button>
          </div>

          <div data-aos="fade-left" className="aboutHighlights">
            {HIGHLIGHTS.map(({ icon: Icon, label, desc }) => (
              <div className="aboutHighlights__item" key={label}>
                <Icon className="aboutHighlights__icon" />
                <div>
                  <strong>{label}</strong>
                  <span>{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="secTitle sectionTitle">
          <span className="eyebrow" data-aos="fade-up">Les disciplines</span>
          <h3 data-aos="fade-up">Trois scènes, un seul grand show</h3>
          <div className="titleUnderline" data-aos="fade-up"></div>
        </div>

        <div className="aboutDisciplines">
          {DISCIPLINES.map(({ key, name, img, desc }, i) => (
            <div className="aboutDisciplines__card" key={key} data-discipline={key} data-aos="fade-up" data-aos-delay={i * 120}>
              <img src={img} alt={name} />
              <div className="aboutDisciplines__overlay">
                {key === 'chant' && <LuMic className="disciplineIcon" />}
                {key === 'danse' && <LuSparkles className="disciplineIcon" />}
                {key === 'rap' && <LuMusic4 className="disciplineIcon" />}
                <h4>{name}</h4>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <HighlightsGallery />

      <section className="aboutCta container">
        <div className="aboutCta__inner" data-aos="fade-up">
          <LuSparkles className="aboutCta__icon" />
          <h2>Envie de faire partie de l'aventure ?</h2>
          <p>Découvrez les candidats en lice et donnez votre voix à celui ou celle qui mérite la grande finale.</p>
          <div className="aboutCta__actions">
            <button className="btn" onClick={() => navigate('/vote')}>Découvrir les candidats</button>
            <button className="btnGhost" onClick={() => navigate('/#partenaires')}>Nos partenaires</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
