import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './deroulementPage.scss';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { LuMic, LuMusic4, LuSparkles, LuUsers, LuGavel, LuTrophy } from 'react-icons/lu';

const PHASES = [
  {
    key: 'auditions',
    label: 'Auditions',
    intro: "Première étape : les candidats se présentent devant le jury pour décrocher leur place dans la compétition.",
    disciplines: [
      {
        name: 'Chant',
        icon: LuMic,
        rules: [
          "Une chanson au choix, maîtrisée par le candidat, interprétée en 1min30.",
          'Prestation devant un jury de trois professionnels.',
          "Le jury émet un avis facultatif ; les candidats retenus sont annoncés sur les pages sociales de l'événement.",
        ],
      },
      {
        name: 'Rap',
        icon: LuMusic4,
        rules: [
          'Un freestyle maîtrisé de 1min30, sur un instrumental proposé par le DJ.',
          'Prestation devant un jury de trois professionnels.',
          "Résultats des candidats retenus publiés sur les pages sociales de l'événement.",
        ],
      },
      {
        name: 'Groupe de danse',
        icon: LuSparkles,
        rules: [
          'Une chorégraphie de 2 minutes représentant le style du groupe.',
          'Prestation devant un jury de trois professionnels.',
          "Résultats des groupes retenus publiés sur les pages sociales de l'événement.",
        ],
      },
    ],
  },
  {
    key: 'demi-finale',
    label: 'Demi-finale',
    intro: 'Le vote du public entre en jeu : il compte pour 50% de la note générale, aux côtés du jury.',
    vote: "Tous les candidats retenus en chant, rap et danse mobilisent leur fan club pour le vote payant en ligne, ouvert du lendemain des auditions jusqu'au jour de la demi-finale.",
    disciplines: [
      {
        name: 'Chant',
        icon: LuMic,
        rules: [
          'Un titre choisi sur une liste proposée par le comité, interprété en 2min30.',
          '4 candidats retenus pour la grande finale.',
        ],
        notation: ['Jury — note sur 50', 'Public (vote en ligne, une semaine avant) — note sur 50'],
      },
      {
        name: 'Rap',
        icon: LuMusic4,
        rules: [
          'Battles tirées au sort — un "clash rap" sur des instrumentaux proposés par le DJ.',
          'Le jury commente chaque candidat et rend son verdict en fin de journée.',
          '4 candidats retenus pour la grande finale.',
        ],
        notation: ['Jury — note sur 50', 'Public (vote en ligne, une semaine avant) — note sur 50'],
      },
      {
        name: 'Groupe de danse',
        icon: LuSparkles,
        rules: [
          'Un défi ou thème est attribué à chaque groupe, à présenter en 3 minutes.',
          '4 groupes retenus pour la grande finale.',
          'Musiques/mixtapes à fournir sur clé USB.',
        ],
        notation: ['Jury — note sur 50', 'Public (vote en ligne, une semaine avant) — note sur 50'],
      },
    ],
  },
  {
    key: 'finale',
    label: 'Finale',
    intro: 'Chant, Rap et Danse réunis pour la dernière prestation, sans thème imposé.',
    vote: 'Les finalistes présentent un spectacle libre de 3 à 5 minutes, laissant place à leur imagination. Le jury désigne les vainqueurs de chaque rubrique.',
    disciplines: [],
    criteria: [
      {
        name: 'Chant',
        icon: LuMic,
        items: ['Interprétation /20', 'Prestation vocale /20', 'Potentiel artistique /20', 'Présence scénique /20', 'Originalité /20'],
      },
      {
        name: 'Rap',
        icon: LuMusic4,
        items: ['Le flow (adaptation au beat) /20', 'La diction / le texte /20', "L'occupation scénique /20", 'Performance /20', 'Originalité /20'],
      },
      {
        name: 'Danse',
        icon: LuSparkles,
        items: [
          'Performance (effort, personnalité) — 20 pts',
          'Technique (transitions, propreté, exécution) — 20 pts',
          'Chorégraphie (difficulté, musicalité, astuces) — 20 pts',
          'Créativité (originalité, choix artistiques, dynamique) — 20 pts',
          'Présentation (attrait du public, impact) — 20 pts',
        ],
      },
    ],
  },
];

const DeroulementPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initial = PHASES.find((p) => location.hash === `#${p.key}`)?.key || 'auditions';
  const [active, setActive] = useState(initial);

  useEffect(() => {
    Aos.init({ duration: 700 });
  }, []);

  const phase = PHASES.find((p) => p.key === active);

  const selectPhase = (key) => {
    setActive(key);
    navigate(`#${key}`, { replace: true });
  };

  return (
    <div className="deroulement-page">
      <section className="deroulement-hero">
        <div className="container">
          <span className="eyebrow" data-aos="fade-up">Règlement de la compétition</span>
          <h1 data-aos="fade-up" data-aos-delay="100">Déroulement de la compétition</h1>
          <p data-aos="fade-up" data-aos-delay="200">
            Trois étapes, un même objectif : révéler le meilleur talent du Sénégal en chant, rap et danse.
          </p>
        </div>
      </section>

      <div className="container deroulement-body">
        <div className="phase-tabs" role="tablist">
          {PHASES.map((p, i) => (
            <button
              key={p.key}
              role="tab"
              aria-selected={active === p.key}
              className={`pill phase-tab ${active === p.key ? 'active' : ''}`}
              onClick={() => selectPhase(p.key)}
            >
              <span className="phase-tab__index">{String(i + 1).padStart(2, '0')}</span>
              {p.label}
            </button>
          ))}
        </div>

        <div className="phase-panel" key={phase.key}>
          <p className="phase-intro">{phase.intro}</p>

          {phase.vote && (
            <div className="vote-note" data-aos="fade-up">
              <LuUsers className="vote-note__icon" />
              <p>{phase.vote}</p>
            </div>
          )}

          {phase.disciplines.length > 0 && (
            <div className="discipline-grid">
              {phase.disciplines.map(({ name, icon: Icon, rules, notation }, i) => (
                <div className="discipline-card" data-aos="fade-up" data-aos-delay={i * 100} key={name}>
                  <div className="discipline-card__head">
                    <Icon className="discipline-card__icon" />
                    <h3>{name}</h3>
                  </div>
                  <ul className="discipline-card__rules">
                    {rules.map((r) => <li key={r}>{r}</li>)}
                  </ul>
                  {notation && (
                    <div className="discipline-card__notation">
                      <LuGavel className="notation-icon" />
                      <div>
                        {notation.map((n) => <span key={n}>{n}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {phase.criteria && (
            <div className="criteria-grid">
              {phase.criteria.map(({ name, icon: Icon, items }, i) => (
                <div className="criteria-card" data-aos="fade-up" data-aos-delay={i * 100} key={name}>
                  <div className="criteria-card__head">
                    <Icon className="discipline-card__icon" />
                    <h3>{name}</h3>
                    <LuTrophy className="trophy-icon" />
                  </div>
                  <ul>
                    {items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeroulementPage;
