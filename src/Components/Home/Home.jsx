import React, { useEffect } from "react";
import './home.scss'
import { useNavigate } from 'react-router-dom';
import { LuMic, LuSmartphone, LuRadio, LuTrophy } from 'react-icons/lu';

import Aos from 'aos'
import 'aos/dist/aos.css'

import HeroSlider from '../HeroSlider/HeroSlider';
import Main from '../Main/Main';
// PartnersSlider n'est plus importé ici : il est désormais monté une seule fois dans
// AppPublic.js (layout global, entre les Routes et le Footer) pour apparaître sur TOUTES
// les pages de l'app, comme demandé, plutôt que seulement sur la page d'accueil.
import Voter from '../Voter/Voter';
// JokerVote reste importé (le code n'est pas supprimé, juste désactivé à l'usage plus bas)
// afin de pouvoir réactiver la rubrique "Votez pour le Joker" facilement si besoin.
// eslint-disable-next-line no-unused-vars -- import volontairement inutilisé tant que la rubrique est désactivée
import JokerVote from '../JokerVote/JokerVote';

import iameImg from '../../Assets/iame.jpeg';
import danseImg from '../../Assets/danse.webp';
import rapImg from '../../Assets/rap.jpg';
import chantImg from '../../Assets/chant.jpg';

const SLIDES = [
    {
        image: iameImg,
        eyebrow: '1ère édition',
        // "Dakar Talent Show" → "Sénégal Talent Show" (rebranding demandé, section 3)
        title: 'Sénégal Talent Show',
        subtitle: "Chant, Danse, Rap : le Sénégal a un incroyable talent. Découvrez-le, votez pour lui.",
    },
    {
        image: danseImg,
        eyebrow: 'Danse',
        title: 'Des chorégraphies qui embrasent la scène',
        subtitle: "Vivez l'énergie des meilleurs groupes de danse du pays et faites basculer le classement.",
    },
    {
        image: rapImg,
        eyebrow: 'Rap',
        title: 'Le flow qui va marquer l\'année',
        subtitle: 'Suivez les battles en direct et votez pour le futur champion.',
    },
    {
        image: chantImg,
        eyebrow: 'Chant',
        title: 'Des voix prêtes pour la grande scène',
        subtitle: 'Un jury de professionnels, un public conquis — à vous de décider qui ira en finale.',
    },
];

const HIGHLIGHTS = [
    { icon: LuMic, label: 'Chant · Rap · Danse', desc: '3 disciplines, un seul grand show' },
    { icon: LuSmartphone, label: 'Vote 100% mobile', desc: 'Orange Money & Wave, dès 200 FCFA' },
    { icon: LuRadio, label: 'Classement en direct', desc: 'Les points s\'actualisent en temps réel' },
    { icon: LuTrophy, label: 'Une grande finale', desc: 'Le public décide qui monte sur scène' },
];

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, [])

    return (
        <div className="home-page">
            <HeroSlider slides={SLIDES} height="82vh">
                <button className="btn" onClick={() => navigate('/vote')}>
                    Voter maintenant
                </button>
                <button className="btnGhost" onClick={() => navigate('/a-propos')}>
                    Découvrir le concept
                </button>
            </HeroSlider>

            <section className="highlights container">
                {HIGHLIGHTS.map(({ icon: Icon, label, desc }, i) => (
                    <div className="highlights__item" data-aos="fade-up" data-aos-delay={i * 100} key={label}>
                        <Icon className="highlights__icon" />
                        <div>
                            <strong>{label}</strong>
                            <span>{desc}</span>
                        </div>
                    </div>
                ))}
            </section>

            <Main />

            {/* PartnersSlider retiré d'ici : rendu globalement dans AppPublic.js pour
                apparaître sur toutes les pages, pas seulement l'accueil. */}

            <Voter />

            {/* Rubrique "Votez pour le Joker" désactivée (consigne section 4) : le composant
                JokerVote a été redesigné en spotlight premium (section 1.2 "VOTE EXCLUSIF")
                mais son rendu reste commenté ici pour qu'il n'apparaisse plus dans l'app —
                décommenter la ligne ci-dessous pour le réactiver. */}
            {/* <JokerVote /> */}
        </div>
    )
}

export default Home
