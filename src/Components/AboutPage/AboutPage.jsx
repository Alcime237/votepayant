import React, { useEffect } from 'react';
import './aboutPage.scss';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';
import { LuMic, LuMusic4, LuSparkles, LuUsers, LuCalendarDays, LuTv } from 'react-icons/lu';
import HeroSlider from '../HeroSlider/HeroSlider';
import chantImg from '../../Assets/chant.jpg';
import danseImg from '../../Assets/danse.webp';
import rapImg from '../../Assets/rap.jpg';
import iameImg from '../../Assets/iame.jpeg';
// dts.jpg (ancien logo "Dakar Talent Show" imprimé dans l'image) retiré de ce slide —
// remplacé par une photo réelle de candidats au casting, cohérente avec le rebranding.
import auditionsImg from '../../Assets/auditionsCandidats.jpeg';

const HERO_SLIDES = [
  {
    image: iameImg,
    eyebrow: 'À propos',
    // Rebranding : "Dakar Talent Show" → "Sénégal Talent Show"
    title: 'Sénégal Talent Show',
    subtitle: 'Une émission de divertissement culturel qui célèbre la diversité artistique du continent.',
  },
  {
    image: auditionsImg,
    eyebrow: 'Notre mission',
    title: 'Révéler les talents de demain',
    // "dakarois" (adjectif dérivé de Dakar) remplacé par "sénégalais" pour rester cohérent
    // avec le repositionnement national de l'émission (plus une émission d'une seule ville)
    subtitle: "Une plateforme de découverte, portée par le public, pour le public sénégalais.",
  },
];

const DISCIPLINES = [
  // "Dakar Talent Show" → "Sénégal Talent Show" dans le texte descriptif de la discipline Chant
  { key: 'chant', name: 'Chant', img: chantImg, desc: "Des voix qui font vibrer la scène du Sénégal Talent Show." },
  { key: 'danse', name: 'Danse', img: danseImg, desc: "Chorégraphies et énergie pure, du Sabar au Hip-hop." },
  { key: 'rap', name: 'Rap', img: rapImg, desc: "Le flow et la plume des jeunes talents sénégalais." },
];

const HIGHLIGHTS = [
  { icon: LuCalendarDays, label: '1 mois', desc: 'de compétition' },
  { icon: LuTv, label: '4 semaines', desc: 'de diffusion' },
  { icon: LuUsers, label: 'Un jury', desc: 'compétent et exigeant' },
  { icon: LuSparkles, label: 'Qualité pro', desc: 'son, lumière, image' },
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
              {/* "DAKAR TALENT SHOW" → "SÉNÉGAL TALENT SHOW" (rebranding demandé) */}
              <strong>SÉNÉGAL TALENT SHOW</strong> est une émission de divertissement culturel mettant en
              compétition des jeunes talents de tout âge dans leurs disciplines respectives : la danse,
              le chant et le rap. La compétition s'étend sur une durée d'un mois, pour une diffusion sur
              quatre semaines.
            </p>
            <p className="justify">
              {/* Citation interne : même remplacement "dakarois" → "sénégalais" */}
              L'objectif majeur de ce programme est de <em>« célébrer la diversité culturelle du
              continent, de favoriser les échanges tout en offrant une plateforme de divertissement et
              de découverte pour le public sénégalais »</em>, avec une qualité de son et de lumière
              professionnelle, un jury compétent, et des images et vidéos de qualité.
            </p>
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
            <div className="aboutDisciplines__card" key={key} data-aos="fade-up" data-aos-delay={i * 120}>
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
