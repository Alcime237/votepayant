import React from "react";
// LuArrowRight ajouté pour l'icône du CTA (flèche "vers l'action") du nouveau design spotlight
import { LuCrown, LuHeart, LuAward, LuStar, LuArrowRight } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom';
import './JokerVote.scss'

// Les 3 arguments de la rubrique, en donnée plutôt que répétés 3 fois en JSX : plus simple
// à relire et à faire évoluer (ajouter/retirer un argument = une ligne).
const FEATURES = [
    { icon: LuHeart, title: 'Sauvez votre favori', desc: "Un candidat éliminé par catégorie pourra être repêché" },
    { icon: LuAward, title: 'Accès direct à la finale', desc: 'Le Joker gagne sa place pour le grand show final' },
    { icon: LuStar, title: 'Votez dans chaque rubrique', desc: 'Chant, Rap et Danse — un Joker par discipline' },
];

// Redesign "VOTE EXCLUSIF" (section 1.2 du brief) : mise en page asymétrique — texte/CTA
// à gauche, visuel animé (couronne + halo) à droite — inspirée des bandeaux "moment fort"
// des talent-shows premium (ex. Golden Buzzer), plutôt que l'ancienne carte unique statique.
//
// NOTE IMPORTANTE : ce composant reste tel quel dans le code (contenu "Joker" inchangé) mais
// son rendu est désormais commenté partout où il était appelé (Home.jsx + routes /voter-joker*
// dans AppPublic.js), conformément à la consigne de désactiver la rubrique "Votez pour le
// Joker" sans supprimer le code. Le travail de redesign ci-dessous reste donc invisible tant
// que ces rendus ne sont pas réactivés.
const JokerVote = () => {
    const navigate = useNavigate();

    return (
        <section className="joker-vote-section container section">
            <div data-aos="fade-up" className="spotlight">
                {/* Colonne gauche : accroche, bénéfices, action */}
                <div className="spotlight__content">
                    <div className="spotlight__badge">
                        <LuCrown className="spotlight__badge-icon" />
                        <span>VOTE EXCLUSIF</span>
                    </div>

                    <h3 className="spotlight__title">Votez pour le Joker</h3>
                    <p className="spotlight__subtitle">Offrez une seconde chance à un talent méritant</p>

                    <ul className="spotlight__features">
                        {FEATURES.map(({ icon: Icon, title, desc }) => (
                            <li key={title} className="spotlight__feature">
                                <span className="spotlight__feature-icon"><Icon /></span>
                                <span className="spotlight__feature-text">
                                    <strong>{title}</strong>
                                    <span>{desc}</span>
                                </span>
                            </li>
                        ))}
                    </ul>

                    <button
                        className="spotlight__cta"
                        onClick={() => navigate('/joker-repechage')}
                    >
                        VOTER POUR LE JOKER
                        <LuArrowRight className="spotlight__cta-icon" />
                    </button>
                    <p className="spotlight__note">Les votes seront ouverts 72h après la demi-finale</p>
                </div>

                {/* Colonne droite : visuel décoratif animé (aria-hidden, n'apporte aucune info) */}
                <div className="spotlight__visual" aria-hidden="true">
                    <span className="spotlight__visual-ring" />
                    <span className="spotlight__visual-ring spotlight__visual-ring--2" />
                    <LuCrown className="spotlight__visual-icon" />
                </div>
            </div>
        </section>
    )
}

export default JokerVote;
