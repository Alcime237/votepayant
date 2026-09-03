import React, { useEffect } from "react";
import './home.scss'
import { useNavigate } from 'react-router-dom';
import { LuMic, LuSmartphone, LuRadio, LuTrophy } from 'react-icons/lu';

import Aos from 'aos'
import 'aos/dist/aos.css'

import HeroSlider from '../HeroSlider/HeroSlider';
import Main from '../Main/Main';
import PartnersSlider from '../PartnersSlider/PartnersSlider';
import Voter from '../Voter/Voter';
import JokerVote from '../JokerVote/JokerVote';

import iameImg from '../../Assets/iame.jpeg';
import danseImg from '../../Assets/danse.webp';
import rapImg from '../../Assets/rap.jpg';
import chantImg from '../../Assets/chant.jpg';

const SLIDES = [
    {
        image: iameImg,
        eyebrow: '1ère édition',
        title: 'Dakar Talent Show',
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

            <PartnersSlider />

            <Voter />

            <JokerVote />
        </div>
    )
}

export default Home
