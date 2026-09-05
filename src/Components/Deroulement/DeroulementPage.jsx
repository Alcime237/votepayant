import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './deroulementPage.scss';
import Aos from 'aos';
import 'aos/dist/aos.css';
import {
  LuMic, LuMusic4, LuSparkles, LuUsers, LuGavel, LuTrophy,
  LuMapPin, LuListChecks, LuAward, LuClock3, LuStar,
} from 'react-icons/lu';
import HeroSlider from '../HeroSlider/HeroSlider';
// Hero choisi avec le client (voir échange de validation) : plateau vide, projecteurs
// bleus — visuel neutre et premium, sans redite avec les autres images déjà utilisées
// ailleurs dans l'app (accueil, à propos).
import deroulementHeroImg from '../../Assets/deroulementHero.jpeg';

// Bandeau visuel en tête de page.
const HERO_SLIDES = [
  {
    image: deroulementHeroImg,
    eyebrow: 'Règlement de la compétition',
    title: 'Déroulement de la compétition',
    subtitle: 'Du casting à la Grande Finale Nationale : le format complet du Sénégal Talent Show, étape par étape.',
  },
];

// --- Contenu de la page --------------------------------------------------------------
// Tout le texte ci-dessous est extrait et reformulé à partir du document officiel
// "Déroulement_STS.pdf" fourni par le client (format général, casting, demi-finales
// à Thiès/Saly et Dakar, grande finale, règles de vote). Il est restructuré ici en
// données pures pour être affiché de façon claire et hiérarchisée, plutôt que collé
// tel quel — voir rendu plus bas dans le composant.

// Étape 1 — Casting : critères par discipline.
const CASTING_DISCIPLINES = [
  {
    name: 'Chant',
    icon: LuMic,
    rules: [
      'Interprétation ou composition personnelle',
      'Instrumental envoyé avant le casting',
      '1 min 30 maximum',
    ],
    notation: ['Justesse', 'Voix', 'Présence scénique', 'Interprétation'],
    qualifies: '16 qualifiés',
  },
  {
    name: 'Rap',
    icon: LuMusic4,
    rules: [
      'Beat envoyé avant le casting',
      '1 min 30 maximum',
    ],
    notation: ['Flow', 'Texte', 'Originalité', 'Présence scénique'],
    qualifies: '16 qualifiés',
  },
  {
    name: 'Danse',
    icon: LuSparkles,
    rules: [
      '2 à 10 danseurs par groupe',
      'Musique envoyée avant le casting',
      '2 min 30 maximum',
    ],
    notation: ['Synchronisation', 'Créativité', 'Technique', 'Présence scénique'],
    qualifies: '6 à 10 groupes qualifiés',
  },
];

// Étape 1 — ce qu'il se passe une fois le casting terminé (ordre chronologique réel).
const CASTING_STEPS = [
  'Délibération du jury',
  'Publication des qualifiés',
  'Tirage au sort des face-à-face en chant et en rap — (1 vs 8), (2 vs 9), (3 vs 10)…',
  'Attribution du thème imposé de la demi-finale danse',
  'Photo officielle des qualifiés',
];

// Étape 2 — Demi-finales : deux plateaux (Thiès & Saly, puis Dakar), chacun avec le
// même déroulé en 2 passages par discipline, mais des volumes de qualifiés différents.
const DEMI_FINALS = [
  {
    key: 'thies-saly',
    city: 'Thiès & Saly',
    disciplines: [
      {
        name: 'Rap',
        icon: LuMusic4,
        passage1: ['16 candidats', '8 battles', '8 gagnants'],
        passage2: 'Les 8 gagnants présentent un morceau personnel (2 min).',
        resultat: ['02 candidats qualifiés à Saly', '02 candidats qualifiés à Thiès'],
      },
      {
        name: 'Chant',
        icon: LuMic,
        passage1: ['16 candidats', '8 battles', '8 gagnants'],
        passage2: 'Les 8 gagnants chantent individuellement une chanson de leur choix (2 min).',
        resultat: ['02 candidats qualifiés à Saly', '02 candidats qualifiés à Thiès'],
      },
      {
        name: 'Danse',
        icon: LuSparkles,
        passage1: ['6 à 10 groupes', 'Chorégraphie sur le thème imposé', '4 gagnants'],
        passage2: 'Les 4 groupes présentent une création libre de 2 min 30.',
        resultat: ['02 groupes qualifiés à Saly', '02 groupes qualifiés à Thiès'],
      },
    ],
  },
  {
    key: 'dakar',
    city: 'Dakar',
    disciplines: [
      {
        name: 'Rap',
        icon: LuMusic4,
        passage1: ['16 candidats', '8 battles', '8 gagnants'],
        passage2: 'Les 8 gagnants présentent un morceau personnel (2 min).',
        resultat: ['04 candidats qualifiés pour Dakar'],
      },
      {
        name: 'Chant',
        icon: LuMic,
        passage1: ['16 candidats', '8 battles', '8 gagnants'],
        passage2: 'Les 8 gagnants chantent individuellement une chanson de leur choix (2 min).',
        resultat: ['04 candidats qualifiés pour Dakar'],
      },
      {
        name: 'Danse',
        icon: LuSparkles,
        passage1: ['8 à 10 groupes', 'Chorégraphie sur le thème imposé', '5 gagnants'],
        passage2: 'Les 5 groupes présentent une création libre de 2 min 30.',
        resultat: ['04 groupes de danse qualifiés pour Dakar'],
      },
    ],
  },
];

// Règle de vote commune aux deux demi-finales (Thiès/Saly et Dakar) : le nombre exact
// de qualifiés est fixé par le jury en amont, mais c'est le public qui choisit qui part
// en Grande Finale — affiché sous forme d'encart, pas noyé dans les tableaux ci-dessus.
const VOTE_DEMI_FINALE = "Après leur premier passage, les candidats et groupes retenus livrent une prestation libre. À l'issue de ces prestations, c'est le public présent sur place qui décide, par son appréciation, quels candidats ou groupes représenteront leur ville en Grande Finale Nationale. Le nombre de qualifiés pour la finale est fixé au préalable par le jury.";

// Étape 3 — Composition du plateau de la Grande Finale : chaque discipline additionne
// les qualifiés des 3 villes pour arriver à 8 finalistes.
const GRAND_FINALE_LINEUP = [
  { name: 'Chant', icon: LuMic, breakdown: ['2 — Thiès', '2 — Saly', '4 — Dakar'], total: '8 chanteurs' },
  { name: 'Rap', icon: LuMusic4, breakdown: ['2 — Thiès', '2 — Saly', '4 — Dakar'], total: '8 rappeurs' },
  { name: 'Danse', icon: LuSparkles, breakdown: ['2 — Thiès', '2 — Saly', '4 — Dakar'], total: '8 groupes' },
];

// Étape 3 — passage final : durée par discipline + liberté totale de mise en scène.
const FINALE_DURATIONS = [
  { name: 'Chant', icon: LuMic, duration: '5 min maximum' },
  { name: 'Rap', icon: LuMusic4, duration: '5 min maximum' },
  { name: 'Danse', icon: LuSparkles, duration: '5 min maximum' },
];

const FINALE_FREEDOMS = ['Décors', 'Costumes', 'Danseurs', 'Choristes', 'Instruments', 'Mise en scène', 'Effets spéciaux'];

// Étape 3 — récompenses du/de la champion·ne Sénégal Talent Show.
const CHAMPION_REWARDS = [
  'Trophée officiel',
  'Attestation',
  'Prix en espèces',
  'Une opportunité internationale avec la structure américaine AzyBanks',
  'Interview et mise en avant médias',
];

// Étape 3 — pondération du vote en Grande Finale : 50% jury, 50% public.
const VOTE_FINALE = "Lors de la Grande Finale Nationale, le vote du public compte pour 50% de la note globale de chaque finaliste. Les votes sont ouverts dès la fin des demi-finales, afin de laisser à chaque finaliste le temps de mobiliser son public sur la plateforme officielle du Sénégal Talent Show.";

// Les 3 grandes étapes affichées comme onglets — reflètent la structure réelle du
// document officiel (Casting → Demi-finales → Grande Finale), plutôt qu'un découpage
// approximatif : c'est aussi l'ordre chronologique de la compétition.
const PHASES = [
  { key: 'casting', label: 'Casting' },
  { key: 'demi-finales', label: 'Demi-finales' },
  { key: 'grande-finale', label: 'Grande finale' },
];

const DeroulementPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialPhase = PHASES.find((p) => location.hash === `#${p.key}`)?.key || 'casting';
  const [activePhase, setActivePhase] = useState(initialPhase);
  // Sous-onglet ville, utilisé uniquement par la phase "Demi-finales".
  const [activeCity, setActiveCity] = useState(DEMI_FINALS[0].key);

  useEffect(() => {
    Aos.init({ duration: 700 });
  }, []);

  const selectPhase = (key) => {
    setActivePhase(key);
    navigate(`#${key}`, { replace: true });
  };

  const demiFinale = DEMI_FINALS.find((d) => d.key === activeCity);

  return (
    <div className="deroulement-page">
      <HeroSlider slides={HERO_SLIDES} height="50vh" />

      <div className="container deroulement-body">
        {/* Vue d'ensemble ("Format général" du document source) : les 3 grandes étapes
            en un coup d'œil, avant le détail onglet par onglet plus bas. */}
        <div className="format-general" data-aos="fade-up">
          <span className="eyebrow">Format général</span>
          <h2>Trois étapes, un seul objectif</h2>
          <p>
            Chant, Rap et Danse suivent le même chemin : un casting national, deux demi-finales
            régionales (Thiès &amp; Saly, puis Dakar), puis une Grande Finale Nationale où le
            public a autant de poids que le jury dans le résultat final.
          </p>
          <div className="format-general__steps">
            {PHASES.map((p, i) => (
              <div className="format-general__step" key={p.key}>
                <span className="format-general__index">{String(i + 1).padStart(2, '0')}</span>
                <span>{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="phase-tabs" role="tablist">
          {PHASES.map((p, i) => (
            <button
              key={p.key}
              role="tab"
              aria-selected={activePhase === p.key}
              className={`pill phase-tab ${activePhase === p.key ? 'active' : ''}`}
              onClick={() => selectPhase(p.key)}
            >
              <span className="phase-tab__index">{String(i + 1).padStart(2, '0')}</span>
              {p.label}
            </button>
          ))}
        </div>

        {/* ------------------------------------------------------------------ Casting */}
        {activePhase === 'casting' && (
          <div className="phase-panel" key="casting">
            <p className="phase-intro">
              Première étape : les candidats et groupes se présentent devant le jury, un par
              discipline, pour décrocher leur place dans la compétition.
            </p>

            <div className="discipline-grid">
              {CASTING_DISCIPLINES.map(({ name, icon: Icon, rules, notation, qualifies }, i) => (
                <div className="discipline-card" data-aos="fade-up" data-aos-delay={i * 100} key={name}>
                  <div className="discipline-card__head">
                    <Icon className="discipline-card__icon" />
                    <h3>{name}</h3>
                  </div>
                  <ul className="discipline-card__rules">
                    {rules.map((r) => <li key={r}>{r}</li>)}
                  </ul>
                  <div className="discipline-card__notation">
                    <LuGavel className="notation-icon" />
                    <div>
                      <span className="notation-label">Notation sur :</span>
                      <span>{notation.join(' · ')}</span>
                    </div>
                  </div>
                  <div className="discipline-card__qualifies">
                    <LuAward /> {qualifies}
                  </div>
                </div>
              ))}
            </div>

            <div className="steps-block" data-aos="fade-up">
              <h3><LuListChecks className="steps-block__icon" /> Fin du casting</h3>
              <ol className="steps-list">
                {CASTING_STEPS.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------- Demi-finales */}
        {activePhase === 'demi-finales' && (
          <div className="phase-panel" key="demi-finales">
            <p className="phase-intro">
              Le vote du public entre en jeu : après un premier passage jugé par le jury, c'est
              le public présent sur place qui choisit qui accède à la Grande Finale Nationale.
            </p>

            <div className="city-tabs" role="tablist">
              {DEMI_FINALS.map((d) => (
                <button
                  key={d.key}
                  role="tab"
                  aria-selected={activeCity === d.key}
                  className={`pill city-tab ${activeCity === d.key ? 'active' : ''}`}
                  onClick={() => setActiveCity(d.key)}
                >
                  <LuMapPin /> {d.city}
                </button>
              ))}
            </div>

            <div className="table-scroll" data-aos="fade-up" key={activeCity}>
              <table className="phase-table">
                <thead>
                  <tr>
                    <th className="phase-table__row-label" />
                    {demiFinale.disciplines.map(({ name, icon: Icon }) => (
                      <th key={name}>
                        <Icon className="phase-table__head-icon" /> {name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="phase-table__row-label">1er passage</th>
                    {demiFinale.disciplines.map(({ name, passage1 }) => (
                      <td key={name}>
                        <ul>{passage1.map((it) => <li key={it}>{it}</li>)}</ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th className="phase-table__row-label">2ème passage</th>
                    {demiFinale.disciplines.map(({ name, passage2 }) => (
                      <td key={name}>{passage2}</td>
                    ))}
                  </tr>
                  <tr className="phase-table__result-row">
                    <th className="phase-table__row-label">Résultat</th>
                    {demiFinale.disciplines.map(({ name, resultat }) => (
                      <td key={name}>
                        <ul className="phase-table__result-list">
                          {resultat.map((it) => <li key={it}>{it}</li>)}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="vote-note" data-aos="fade-up">
              <LuUsers className="vote-note__icon" />
              <p>{VOTE_DEMI_FINALE}</p>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- Grande finale */}
        {activePhase === 'grande-finale' && (
          <div className="phase-panel" key="grande-finale">
            <p className="phase-intro">
              Les qualifiés des 3 villes (Thiès, Saly, Dakar) se retrouvent sur un même plateau
              pour la Grande Finale Nationale.
            </p>

            <div className="lineup-grid">
              {GRAND_FINALE_LINEUP.map(({ name, icon: Icon, breakdown, total }, i) => (
                <div className="lineup-card" data-aos="fade-up" data-aos-delay={i * 100} key={name}>
                  <div className="discipline-card__head">
                    <Icon className="discipline-card__icon" />
                    <h3>{name}</h3>
                  </div>
                  <ul className="lineup-card__breakdown">
                    {breakdown.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                  <div className="lineup-card__total"><LuTrophy /> {total}</div>
                </div>
              ))}
            </div>

            <div className="finale-details" data-aos="fade-up">
              <div className="finale-details__col">
                <h3><LuClock3 className="steps-block__icon" /> Passage en finale</h3>
                <p>Prestation individuelle libre, sans thème imposé.</p>
                <ul className="duration-list">
                  {FINALE_DURATIONS.map(({ name, icon: Icon, duration }) => (
                    <li key={name}><Icon /> <strong>{name}</strong> — {duration}</li>
                  ))}
                </ul>
              </div>

              <div className="finale-details__col">
                <h3><LuStar className="steps-block__icon" /> Liberté totale</h3>
                <div className="freedom-tags">
                  {FINALE_FREEDOMS.map((f) => <span key={f} className="freedom-tag">{f}</span>)}
                </div>
              </div>
            </div>

            <div className="rewards-block" data-aos="fade-up">
              <h3><LuAward className="steps-block__icon" /> Champion·ne Sénégal Talent Show</h3>
              <ul className="rewards-list">
                {CHAMPION_REWARDS.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </div>

            <div className="vote-split" data-aos="fade-up">
              <div className="vote-split__bar">
                <span className="vote-split__jury" style={{ width: '50%' }}>Jury 50%</span>
                <span className="vote-split__public" style={{ width: '50%' }}>Public 50%</span>
              </div>
              <p>{VOTE_FINALE}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeroulementPage;
