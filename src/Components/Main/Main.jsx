import React, { useEffect } from "react";
import './main.scss'
import img1 from '../../Assets/dts.jpg'
import img2 from '../../Assets/dts.jpg'
import img3 from '../../Assets/dts.jpg'
import { LuClipboardCheck } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom';
import Aos from 'aos'
import 'aos/dist/aos.css'

const Main = () => {
    const navigate = useNavigate();

    useEffect(() => {
        Aos.init({ duration: 2000 })
    }, [])

    const handleButtonClick = (link) => {
        let pdfUrl;

        // Détermine le PDF à ouvrir en fonction du lien
        switch(link) {
            case '/document':
                pdfUrl = process.env.PUBLIC_URL + '/documents/Auditions.pdf';
                break;
            case '/demifinale':
                pdfUrl = process.env.PUBLIC_URL + '/documents/Demi-finale.pdf';
                break;
            case '/finale':
                pdfUrl = process.env.PUBLIC_URL + '/documents/Finale.pdf';
                break;
            default:
                // Si ce n'est pas un lien PDF, naviguer normalement
                if (link) navigate(link);
                return;
        }

        // Solution robuste pour ouvrir le PDF
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return (
        <section className="main container section">
            <div data-aos="fade-up" className="secTitle">
                <h3 data-aos="fade-right" className="title">
                    Déroulement de la compétition
                </h3>
            </div>

            <div data-aos="fade-up" className="secContent grid">
                <div className="singleDestination">
                    <div className="imageDiv">
                        <img src={img1} alt="A propos" />
                    </div>
                    <div className="cardInfo">
                        <h4 className="destTitle">Auditions</h4>
                        <div className="desc">
                            <p>
                                Tout ce qu'il faut savoir sur le déroulement des auditions.
                            </p>
                        </div>
                        <button className="btn flex" onClick={() => handleButtonClick('/document')}>
                            DETAILS <LuClipboardCheck className='icon' />
                        </button>
                    </div>
                </div>

                <div className="singleDestination">
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
                        <button className="btn flex" onClick={() => handleButtonClick('/demifinale')}>
                            DETAILS <LuClipboardCheck className='icon' />
                        </button>
                    </div>
                </div>

                <div className="singleDestination">
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
                        <button className="btn flex" onClick={() => handleButtonClick('/finale')}>
                            DETAILS <LuClipboardCheck className='icon' />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Main