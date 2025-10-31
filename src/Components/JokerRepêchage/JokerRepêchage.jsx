import React, { useState, useEffect } from "react";
import { LuClock, LuMusic, LuMic, LuZap } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import "./JokerRepêchage.scss";

const JokerRepêchage = () => {
  const navigate = useNavigate();
  const [voteStatus, setVoteStatus] = useState({
    isActive: false,
    endDate: null,
    timeLeft: null
  });

  const categories = [
    { id: "chant", title: "Chant", icon: LuMusic, description: "Talents vocaux en lice", path: "/voter-joker/chant" },
    { id: "rap", title: "Rap", icon: LuMic, description: "Les rappeurs à repêcher", path: "/voter-joker/rap" },
    { id: "danse", title: "Danse", icon: LuZap, description: "Danseurs prêts pour la revanche", path: "/voter-joker/danse" },
  ];

  // Fonction pour récupérer le statut du vote joker
  const fetchVoteStatus = async () => {
    try {
      const response = await fetch("http://localhost:8080/joker/vote-config/status");
      const data = await response.json();

      setVoteStatus({
        isActive: data.isActive,
        endDate: data.endDate ? new Date(data.endDate) : null,
        timeLeft: data.endDate ? calculateTimeLeft(new Date(data.endDate)) : null
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du statut:", error);
    }
  };

  // Calcul du temps restant
  const calculateTimeLeft = (endDate) => {
    const now = new Date();
    const difference = endDate - now;

    if (difference <= 0) return null;

    return Math.floor(difference / 1000);
  };

  // Mise à jour du compte à rebours
  useEffect(() => {
    fetchVoteStatus();

    const interval = setInterval(() => {
      if (voteStatus.isActive && voteStatus.timeLeft > 0) {
        setVoteStatus(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      } else if (voteStatus.isActive && voteStatus.timeLeft <= 0) {
        fetchVoteStatus();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [voteStatus.isActive, voteStatus.timeLeft, fetchVoteStatus]);

  // Formatage du temps
  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "00jr 00hr 00min 00s";

    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${days.toString().padStart(2, '0')}jr ${hours.toString().padStart(2, '0')}hr ${minutes.toString().padStart(2, '0')}min ${secs.toString().padStart(2, '0')}s`;
  };

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  return (
    <div className="joker-repechage-page">
      {/* Header avec timer dynamique */}
      <header className="joker-repechage-header">
        <LuClock className="timer-icon" />
        <h2>Repêchage en direct</h2>
        <p className="timer">
          {voteStatus.isActive && voteStatus.timeLeft
            ? formatTime(voteStatus.timeLeft)
            : "Vote non actif"}
        </p>
      </header>

      {/* Grille des catégories */}
      <main className="joker-repechage-main">
        <div className="categories-grid">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="category-card repechage-card"
                onClick={() => handleCategoryClick(cat.path)}
              >
                <Icon className="category-icon" />
                <h3>{cat.title}</h3>
                <p>{cat.description}</p>
                <button className="vote-now-btn">
                  {voteStatus.isActive ? "VOTER" : "VOIR LES CANDIDATS"}
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="joker-repechage-footer">
        <button onClick={() => navigate("/")}>← Retour à l'accueil</button>
        <p>⚡ Qui sera repêché pour la grande finale ?</p>
      </footer>
    </div>
  );
};

export default JokerRepêchage;