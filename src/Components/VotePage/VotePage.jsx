import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Mêmes visuels que la rubrique "Les disciplines" de la page À propos, pour la cohérence.
import chantImg from '../../Assets/chantLive.jpg';
import rapImg from '../../Assets/rap.jpg';
import danseImg from '../../Assets/danseGroup.jpg';
// dts.jpg (ancien logo "Dakar Talent Show" imprimé dans l'image) retiré de ce hero —
// remplacé par une photo live de la scène (candidats + public).
import heroImg from '../../Assets/auditionsScene.jpg';
import { LuClipboardCheck, LuListChecks, LuUserCheck, LuSmartphone } from 'react-icons/lu';
import './votePage.scss';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { getCampaignStatus } from '../../services/campaignService';
import RankingChart from '../RankingChart/RankingChart';
import PricingTiers from '../PricingTiers/PricingTiers';
import HeroSlider from '../HeroSlider/HeroSlider';

const HERO_SLIDES = [
  {
    image: heroImg,
    eyebrow: 'Votez',
    title: 'Choisissez le futur finaliste',
    subtitle: '3 étapes, 2 minutes : votre voix compte autant que celle du jury.',
  },
];

const STEPS = [
  { icon: LuListChecks, title: '1. Choisissez la rubrique', text: 'Chant, Rap ou Danse — sélectionnez la catégorie que vous suivez.' },
  { icon: LuUserCheck, title: '2. Sélectionnez le candidat', text: "Parcourez les talents en lice et choisissez celui que vous voulez soutenir." },
  // "Choisissez votre palier" retiré : il n'existe plus de palier, la règle est unique
  // (200 FCFA = 5 points, section 5). Le texte décrit maintenant simplement le geste de paiement.
  { icon: LuSmartphone, title: '3. Payez en Mobile Money', text: 'Chaque tranche de 200 FCFA rapporte 5 points. Payez via Orange Money ou Wave, et c\'est voté.' },
];

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [votingActive, setVotingActive] = useState(false);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    const fetchVoteConfig = async () => {
      try {
        const status = await getCampaignStatus();
        setVotingActive(status.active);
        if (status.endDate) {
          setEndTime(new Date(status.endDate).getTime());
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    fetchVoteConfig();
  }, []);

  useEffect(() => {
    if (!endTime || !votingActive) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        setVotingActive(false);
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, votingActive]);

  if (!votingActive) {
    return (
      <div className="countdown-section inactive">
        <h3>Les votes sont actuellement fermés</h3>
      </div>
    );
  }

  return (
    <div className="countdown-section active">
      <h3>Temps restant pour voter :</h3>
      <div className="countdown-timer">
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.days}</span>
          <span className="countdown-label">Jours</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.hours}</span>
          <span className="countdown-label">Heures</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.minutes}</span>
          <span className="countdown-label">Minutes</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.seconds}</span>
          <span className="countdown-label">Secondes</span>
        </div>
      </div>
    </div>
  );
};

const VotePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Aos.init({ duration: 1200 });
  }, []);

  return (
    <div className="vote-page">
      <HeroSlider slides={HERO_SLIDES} height="46vh" />

      <section className="demi-finale container section">
        <div className="secTitle sectionTitle">
          <span className="eyebrow" data-aos="fade-up">Comment voter</span>
          <h3 data-aos="fade-up">Simple, rapide, en 3 étapes</h3>
          <div className="titleUnderline" data-aos="fade-up"></div>
        </div>

        <div className="howToVote">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <div className="howToVote__step" data-aos="fade-up" data-aos-delay={i * 120} key={title}>
              <div className="howToVote__icon"><Icon /></div>
              <h4>{title}</h4>
              <p>{text}</p>
            </div>
          ))}
        </div>

        <CountdownTimer />

        <div className="secTitle sectionTitle">
          <span className="eyebrow" data-aos="fade-up">Rubriques</span>
          <h3 data-aos="fade-up">Sélectionnez une catégorie</h3>
          <p data-aos="fade-up">Trois disciplines, un seul vainqueur par catégorie. Choisissez où voter.</p>
          <div className="titleUnderline" data-aos="fade-up"></div>
        </div>

        <div className="secContent grid">
          <div className="singleDestination" data-aos="fade-up" data-aos-delay="0">
            <div className="imageDiv">
              <img src={chantImg} alt="Chant" />
            </div>
            <div className="cardInfo">
              <h4 className="destTitle">Chant</h4>
              <div className="desc">
                <p>Découvrez les talents en chant et votez pour votre favori.</p>
              </div>
              <button className="btn flex" onClick={() => navigate('/chant')}>
                VOTER <LuClipboardCheck className="icon" />
              </button>
            </div>
          </div>

          <div className="singleDestination" data-aos="fade-up" data-aos-delay="150">
            <div className="imageDiv">
              <img src={rapImg} alt="Rap" />
            </div>
            <div className="cardInfo">
              <h4 className="destTitle">Rap</h4>
              <div className="desc">
                <p>Écoutez les performances de rap et choisissez le meilleur.</p>
              </div>
              <button className="btn flex" onClick={() => navigate('/rap')}>
                VOTER <LuClipboardCheck className="icon" />
              </button>
            </div>
          </div>

          <div className="singleDestination" data-aos="fade-up" data-aos-delay="300">
            <div className="imageDiv">
              <img src={danseImg} alt="Danse" />
            </div>
            <div className="cardInfo">
              <h4 className="destTitle">Danse</h4>
              <div className="desc">
                <p>Admirez les chorégraphies et votez pour votre groupe.</p>
              </div>
              <button className="btn flex" onClick={() => navigate('/danse')}>
                VOTER <LuClipboardCheck className="icon" />
              </button>
            </div>
          </div>
        </div>

        <PricingTiers />

        <RankingChart />
      </section>
    </div>
  );
};

export default VotePage;
