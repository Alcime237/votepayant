import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import chantImg from '../../Assets/chant.jpg';
import rapImg from '../../Assets/rap.jpg';
import danseImg from '../../Assets/danse.webp';
import { LuClipboardCheck } from 'react-icons/lu';
import './demiFinale.scss';
import Aos from 'aos';
import 'aos/dist/aos.css';

const API_BASE_URL = "http://localhost:8080";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [votingActive, setVotingActive] = useState(false);
  const [endTime, setEndTime] = useState(null);

  // Récupération initiale de la config
  useEffect(() => {
    const fetchVoteConfig = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/vote-config/status`);
        setVotingActive(response.data.isActive);
        if (response.data.endDate) {
          setEndTime(new Date(response.data.endDate).getTime());
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    fetchVoteConfig();
  }, []);

  // Timer qui se met à jour en temps réel
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

const DemiFinale = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <section className="demi-finale container section">
      {/* Section du compte à rebours */}
      <CountdownTimer />

      <div data-aos="fade-up" className="secTitle">
        <h3 data-aos="fade-right" className="title">
          Demi-finale - Sélectionnez une rubrique
        </h3>
      </div>

      <div data-aos="fade-up" className="secContent grid">
        {/* Carte Chant */}
        <div className="singleDestination">
          <div className="imageDiv">
            <img src={chantImg} alt="Chant" />
          </div>
          <div className="cardInfo">
            <h4 className="destTitle">Chant</h4>
            <div className="desc">
              <p>Découvrez les talents en chant et votez pour votre favori.</p>
            </div>
            <button
              className="btn flex"
              onClick={() => navigate('/chant')}>
              VOIR <LuClipboardCheck className="icon" />
            </button>
          </div>
        </div>

        {/* Carte Rap */}
        <div className="singleDestination">
          <div className="imageDiv">
            <img src={rapImg} alt="Rap" />
          </div>
          <div className="cardInfo">
            <h4 className="destTitle">Rap</h4>
            <div className="desc">
              <p>Écoutez les performances de rap et choisissez le meilleur.</p>
            </div>
            <button
              className="btn flex"
              onClick={() => navigate('/rap')}>
              VOIR <LuClipboardCheck className="icon" />
            </button>
          </div>
        </div>

        {/* Carte Danse */}
        <div className="singleDestination">
          <div className="imageDiv">
            <img src={danseImg} alt="Danse" />
          </div>
          <div className="cardInfo">
            <h4 className="destTitle">Danse</h4>
            <div className="desc">
              <p>Admirez les chorégraphies et votez pour votre groupe.</p>
            </div>
            <button
              className="btn flex"
              onClick={() => navigate('/danse')}>
              VOIR <LuClipboardCheck className="icon" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemiFinale;