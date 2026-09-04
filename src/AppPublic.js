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
// PartnersSlider est monté une seule fois ici (layout global), juste avant le Footer,
// pour apparaître sur TOUTES les pages de l'app et pas seulement sur l'accueil.
import PartnersSlider from './Components/PartnersSlider/PartnersSlider';

// Rubrique "Votez pour le Joker" désactivée partout (consigne section 4) : les imports et
// les 5 routes qui suivent restent en place (rien n'est supprimé) mais sont commentés, donc
// injoignables par URL directe. Décommenter les 5 lignes ci-dessous + les 5 <Route> plus bas
// pour réactiver entièrement la rubrique.
// import JokerVote from './Components/JokerVote/JokerVote';
// import JokerRepêchage from './Components/JokerRepêchage/JokerRepêchage';
// import JokerDanse from './Components/JokerDanse/JokerDanse';
// import JokerChant from './Components/JokerChant/JokerChant';
// import JokerRap from './Components/JokerRap/JokerRap';

// Vrai logo de l'app (déjà utilisé dans la Navbar), réutilisé pour l'animer sur le splashscreen
import logoImg from './Assets/logo.png';

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
          {/* Halo + vrai logo animés (remplace l'ancien spinner générique + icône SVG en dur) */}
          <div className="loader-logo-wrap">
            <span className="loader-logo-ring" />
            <img src={logoImg} alt="Sénégal Talent Show" className="loader-logo-img" />
          </div>
          {/* Slogan officiel demandé, mis en avant comme accroche principale du splashscreen */}
          <p className="loader-slogan">Le plus grand rendez-vous des talents</p>
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
          {/* Routes Joker désactivées (voir imports commentés plus haut) : décommenter les
              5 lignes ci-dessous en même temps que les imports pour tout réactiver. */}
          {/* <Route path="/voter-joker" element={<JokerVote />} /> */}
          {/* <Route path="/joker-repechage" element={<JokerRepêchage />} /> */}
          {/* <Route path="/voter-joker/danse" element={<JokerDanse />} /> */}
          {/* <Route path="/voter-joker/chant" element={<JokerChant />} /> */}
          {/* <Route path="/voter-joker/rap" element={<JokerRap />} /> */}
        </Routes>
      </main>
      {/* Bandeau partenaires affiché sur toutes les pages, juste avant le pied de page */}
      <PartnersSlider />
      <Footer />
    </div>
  );
};

export default AppPublic;
