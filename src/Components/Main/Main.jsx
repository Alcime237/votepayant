import React, { useEffect } from "react";
import './main.scss'
import img1 from '../../Assets/iame.jpeg'
import img2 from '../../Assets/dts.jpg'
import img3 from '../../Assets/recompense.jpg'
import { LuClipboardCheck } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom';
import Aos from 'aos'
import 'aos/dist/aos.css'

const Main = () => {
    const navigate = useNavigate();

    useEffect(() => {
        Aos.init({ duration: 2000 })
    }, [])

    const handleButtonClick = (phaseKey) => {
        navigate(`/deroulement#${phaseKey}`);
    }

    return (
        <section className="main container section">
            <div className="secTitle sectionTitle">
                <span className="eyebrow" data-aos="fade-up">Le parcours</span>
                <h3 data-aos="fade-up">Déroulement de la compétition</h3>
                <p data-aos="fade-up">Trois étapes, un seul objectif : révéler le meilleur talent du Sénégal.</p>
                <div className="titleUnderline" data-aos="fade-up"></div>
            </div>

            <div className="secContent grid">
                <div className="singleDestination" data-aos="fade-up" data-aos-delay="0">
                    <span className="stepNumber">01</span>
                    <div className="imageDiv">
                        <img src={img1} alt="Auditions" />
                    </div>
                    <div className="cardInfo">
                        <h4 className="destTitle">Auditions</h4>
                        <div className="desc">
                            <p>
                                Tout ce qu'il faut savoir sur le déroulement des auditions.
                            </p>
                        </div>
                        <button className="btn flex" onClick={() => handleButtonClick('auditions')}>
                            DÉTAIL <LuClipboardCheck className='icon' />
                        </button>
                    </div>
                </div>

                <div className="singleDestination" data-aos="fade-up" data-aos-delay="150">
                    <span className="stepNumber">02</span>
                    <div className="imageDiv">
                        <img src={img2} alt="1/2 finale" />
                    </div>
                    <div className="cardInfo">
                        <h4 className="destTitle">1/2 finale</h4>
                        <div className="desc">
                            <p>
                                Découvrez les modalités de sélection pour cette phase cruciale.
                            </p>
                        </div>
                        <button className="btn flex" onClick={() => handleButtonClick('demi-finale')}>
                            DÉTAIL <LuClipboardCheck className='icon' />
                        </button>
                    </div>
                </div>

                <div className="singleDestination" data-aos="fade-up" data-aos-delay="300">
                    <span className="stepNumber">03</span>
                    <div className="imageDiv">
                        <img src={img3} alt="Finale" />
                    </div>
                    <div className="cardInfo">
                        <h4 className="destTitle">Finale</h4>
                        <div className="desc">
                            <p>
                                Toutes les informations sur le grand show final et le système de notation.
                            </p>
                        </div>
                        <button className="btn flex" onClick={() => handleButtonClick('finale')}>
                            DÉTAIL <LuClipboardCheck className='icon' />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Main