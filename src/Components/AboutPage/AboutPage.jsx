import React, { useEffect } from 'react';
import './aboutPage.scss';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';
import { LuMic, LuMusic4, LuSparkles, LuUsers, LuCalendarDays, LuTv } from 'react-icons/lu';
import chantImg from '../../Assets/chant.jpg';
import danseImg from '../../Assets/danse.webp';
import rapImg from '../../Assets/rap.jpg';

const DISCIPLINES = [
  { key: 'chant', name: 'Chant', img: chantImg, desc: "Des voix qui font vibrer la scène du Dakar Talent Show." },
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
      <section className="aboutHero">
        <div className="aboutHero__overlay"></div>
        <div className="container aboutHero__content">
          <span className="eyebrow" data-aos="fade-up">À propos</span>
          <h1 data-aos="fade-up" data-aos-delay="100">Dakar Talent Show</h1>
          <p data-aos="fade-up" data-aos-delay="200">
            Une émission de divertissement culturel qui célèbre la diversité artistique du continent.
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="aboutConcept">
          <div data-aos="fade-right" className="aboutConcept__text">
            <span className="eyebrow">Le concept</span>
            <h2>Une plateforme de découverte pour le public dakarois</h2>
            <p>
              <strong>DAKAR TALENT SHOW</strong> est une émission de divertissement culturel mettant en
              compétition des jeunes talents de tout âge dans leurs disciplines respectives : la danse,
              le chant et le rap. La compétition s'étend sur une durée d'un mois, pour une diffusion sur
              quatre semaines.
            </p>
            <p>
              L'objectif majeur de ce programme est de <em>« célébrer la diversité culturelle du
              continent, de favoriser les échanges tout en offrant une plateforme de divertissement et
              de découverte pour le public dakarois »</em>, avec une qualité de son et de lumière
              professionnelle, un jury compétent, et des images et vidéos de qualité.
            </p>
            <button className="btn" onClick={() => navigate('/demi-finale')}>
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

      <section className="aboutCta">
        <div className="container aboutCta__inner" data-aos="fade-up">
          <h2>Chaque vote rapproche votre talent préféré de la grande finale</h2>
          <div className="aboutCta__actions">
            <button className="btn" onClick={() => navigate('/demi-finale')}>Voter maintenant</button>
            <button className="btnGhost" onClick={() => navigate('/partenaires')}>Nos partenaires</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
