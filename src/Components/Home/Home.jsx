import React, { useEffect } from "react";
import './home.scss'
import backgroundImage from '../../Assets/iame.jpeg';
import { LuChevronDown } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

import Aos from 'aos'
import 'aos/dist/aos.css'

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        Aos.init({ duration: 2000 })
    }, [])

    return (
        <section className="home">
            <div className="overlay"></div>
            <img
                src={backgroundImage}
                alt="Background"
                className="background-image"
            />

            <div className="homeContent container">
                <div className="textDiv">

                    <span data-aos="fade-up" className="smallText">
                        1ère édition
                    </span>

                    <h1 data-aos="fade-up" className="homeTitle">
                        Dakar Talent Show
                    </h1>

                    <p data-aos="fade-up" data-aos-delay="150" className="homeSubtitle">
                        Chant · Danse · Rap — votez pour le talent qui mérite la grande finale.
                    </p>

                    <div data-aos="fade-up" data-aos-delay="300" className="homeActions">
                        <button className="btn" onClick={() => navigate('/demi-finale')}>
                            Voter maintenant
                        </button>
                        <button className="btnGhost" onClick={() => navigate('/a-propos')}>
                            Découvrir le concept
                        </button>
                    </div>
                </div>

            </div>

            <div className="scrollCue" data-aos="fade-in" data-aos-delay="900">
                <LuChevronDown />
            </div>

        </section>
    )
}

export default Home