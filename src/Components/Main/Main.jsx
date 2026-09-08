import React, { useEffect } from "react";
import './main.scss'
// Les 3 cartes (Casting / Demi-finales / Grande finale) partagent le même visuel imposé
// par le client (Castingfinaledemifinale.jpg) plutôt que 3 photos distinctes.
import parcoursImg from '../../Assets/parcoursStage.jpg'
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
                {/* Les 3 clés de hash ci-dessous (casting / demi-finales / grande-finale) doivent
                    rester synchronisées avec les clés PHASES de DeroulementPage.jsx : ce sont
                    elles qui sélectionnent l'onglet ouvert à l'arrivée sur /deroulement#... */}
                <div className="singleDestination" data-aos="fade-up" data-aos-delay="0">
                    <span className="stepNumber">01</span>
                    <div className="imageDiv">
                        <img src={parcoursImg} alt="Casting" />
                    </div>
                    <div className="cardInfo">
                        <h4 className="destTitle">Casting</h4>
                        <div className="desc">
                            <p>
                                Tout ce qu'il faut savoir sur le déroulement du casting.
                            </p>
                        </div>
                        <button className="btn flex" onClick={() => handleButtonClick('casting')}>
                            DÉTAIL <LuClipboardCheck className='icon' />
                        </button>
                    </div>
                </div>

                <div className="singleDestination" data-aos="fade-up" data-aos-delay="150">
                    <span className="stepNumber">02</span>
                    <div className="imageDiv">
                        <img src={parcoursImg} alt="Demi-finales" />
                    </div>
                    <div className="cardInfo">
                        <h4 className="destTitle">Demi-finales</h4>
                        <div className="desc">
                            <p>
                                Découvrez les modalités de sélection à Thiès, Saly et Dakar.
                            </p>
                        </div>
                        <button className="btn flex" onClick={() => handleButtonClick('demi-finales')}>
                            DÉTAIL <LuClipboardCheck className='icon' />
                        </button>
                    </div>
                </div>

                <div className="singleDestination" data-aos="fade-up" data-aos-delay="300">
                    <span className="stepNumber">03</span>
                    <div className="imageDiv">
                        <img src={parcoursImg} alt="Grande finale" />
                    </div>
                    <div className="cardInfo">
                        <h4 className="destTitle">Grande finale</h4>
                        <div className="desc">
                            <p>
                                Toutes les informations sur le grand show final et le système de notation.
                            </p>
                        </div>
                        <button className="btn flex" onClick={() => handleButtonClick('grande-finale')}>
                            DÉTAIL <LuClipboardCheck className='icon' />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Main