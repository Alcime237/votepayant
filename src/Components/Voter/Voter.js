import React, { useEffect } from 'react';
import './voter.scss';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';

const Voter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const handleVote = () => {
    navigate('/demi-finale'); // Redirection directe vers la page des demi-finales
  };

  return (
    <div className="voter-container" data-aos="fade-up">
      <h3>Votez pour vos talents préférés</h3>
      <p className="vote-message">
        Chaque vote compte ! Offrez à votre candidat la chance d’accéder à la grande finale du Dakar Talent Show.
      </p>
      <button className="vote-btn" onClick={handleVote}>
        Voter maintenant
      </button>
    </div>
  );
};

export default Voter;