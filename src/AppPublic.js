import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';

import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Components/Home/Home";
import AboutPage from './Components/AboutPage/AboutPage';
import DeroulementPage from './Components/Deroulement/DeroulementPage';
import CandidatePage from './Components/CandidatePage/CandidatePage';
import VotePage from './Components/VotePage/VotePage';
import ChantDemiFinale from './Components/ChantDemiFinale/ChantDemiFinale';
import RapDemiFinale from './Components/RapDemiFinale/RapDemiFinale';
import DanseDemiFinale from './Components/DanseDemiFinale/DanseDemiFinale';
import ContactPage from './Components/ContactPage/ContactPage';

import JokerVote from './Components/JokerVote/JokerVote';
import JokerRepêchage from './Components/JokerRepêchage/JokerRepêchage';
import JokerDanse from './Components/JokerDanse/JokerDanse';
import JokerChant from './Components/JokerChant/JokerChant';
import JokerRap from './Components/JokerRap/JokerRap';

import './App.css';

/** Remonte en haut de page à chaque navigation, ou fait défiler jusqu'à
 * l'ancre demandée (ex. /#partenaires, /deroulement#finale). */
const ScrollManager = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [location.pathname, location.hash]);

  return null;
};

const AppPublic = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="luxury-loader">
        <div className="particles">
          {[...Array(20)].map((_, i) => {
            const size = Math.random() * 5 + 3;
            return (
              <div
                key={i}
                className="particle"
                style={{
                  '--size': `${size}px`,
                  '--x': `${Math.random() * 100}%`,
                  '--y': `${Math.random() * 100}%`,
                  '--duration': `${Math.random() * 5 + 5}s`,
                  '--delay': `${Math.random() * 5}s`
                }}
              />
            );
          })}
        </div>
        <div className="loader-content">
          <div className="luxury-spinner">
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-logo">

              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#gradient)"/>
                <defs>
                  <linearGradient id="gradient" x1="12" y1="2" x2="12" y2="21.02" gradientUnits="userSpaceOnUse">
                    <stop stopColor="hsl(32, 92%, 58%)"/>
                    <stop offset="1" stopColor="hsl(18, 85%, 46%)"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <h1 className="loader-title">Dakar Talent Show</h1>
          <p className="loader-subtitle">Vivez une expérience unique</p>
          <p className="loader-wait-text">Chargement de l'application en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <ScrollManager />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/deroulement" element={<DeroulementPage />} />
          <Route path="/candidat/:id" element={<CandidatePage />} />
          <Route path="/vote" element={<VotePage />} />
          <Route path="/demi-finale" element={<Navigate to="/vote" replace />} />
          <Route path="/partenaires" element={<Navigate to="/#partenaires" replace />} />
          <Route path="/chant" element={<ChantDemiFinale />} />
          <Route path="/rap" element={<RapDemiFinale />} />
          <Route path="/danse" element={<DanseDemiFinale />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/voter-joker" element={<JokerVote />} />
          <Route path="/joker-repechage" element={<JokerRepêchage />} />
          <Route path="/voter-joker/danse" element={<JokerDanse />} />
          <Route path="/voter-joker/chant" element={<JokerChant />} />
          <Route path="/voter-joker/rap" element={<JokerRap />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppPublic;
