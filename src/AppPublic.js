import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';

import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Components/Home/Home";
import Main from "./Components/Main/Main";
import Price from './Components/Price/Price';
import DocumentPage from './Components/DocumentPage/DocumentPage';
import DemiFinale from './Components/DemiFinale/DemiFinale';
import ChantDemiFinale from './Components/ChantDemiFinale/ChantDemiFinale';
import RapDemiFinale from './Components/RapDemiFinale/RapDemiFinale';
import DanseDemiFinale from './Components/DanseDemiFinale/DanseDemiFinale';
import Voter from './Components/Voter/Voter';
import PartenairesPage from './Components/Partenaires/PartenairesPage';

import JokerVote from './Components/JokerVote/JokerVote';
import JokerRepêchage from './Components/JokerRepêchage/JokerRepêchage';
import JokerDanse from './Components/JokerDanse/JokerDanse';
import JokerChant from './Components/JokerChant/JokerChant';
import JokerRap from './Components/JokerRap/JokerRap';

import './App.css';

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
                    <stop stopColor="hsl(5, 85%, 40%)"/>
                    <stop offset="0.5" stopColor="hsl(35, 100%, 50%)"/>
                    <stop offset="1" stopColor="hsl(45, 100%, 50%)"/>
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
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<><Home /><Price /><Main /><Voter /><JokerVote /></>} />
          <Route path="/reglement" element={<DocumentPage />} />
          <Route path="/partenaires" element={<PartenairesPage />} />
          <Route path="/demi-finale" element={<DemiFinale />} />
          <Route path="/chant" element={<ChantDemiFinale />} />
          <Route path="/rap" element={<RapDemiFinale />} />
          <Route path="/danse" element={<DanseDemiFinale />} />
          <Route path="/voter-joker" element={<JokerVote />} />
          <Route path="/joker-repechage" element={<JokerRepêchage />} />

          // Ajoutez cette route avec les autres routes
          <Route path="/voter-joker/danse" element={<JokerDanse />} />
          <Route path="/voter-joker/chant" element={<JokerChant />} />
          <Route path="/voter-joker/rap" element={<JokerRap />} />
        </Routes>
      </main>
      <section id="inscription" className="inscription-section" data-aos="fade-up">
        <h2>Chaque vote compte!</h2>
        <p>Regarder en temps réel le classement des candidats votés par rubriques.</p>
      </section>
      <Footer />
    </div>
  );
};

export default AppPublic;