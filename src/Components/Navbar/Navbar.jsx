import React, { useState } from "react";
import './navbar.scss';
import { IoIosCloseCircle } from 'react-icons/io';
import { TbGridDots } from 'react-icons/tb';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../../Assets/logo.png';

const Navbar = () => {
    const [active, setActive] = useState('navBar');
    const [showContact, setShowContact] = useState(false);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        paymentMethod: 'wave'
    });
    const location = useLocation();

    const showNav = () => {
        setActive('navBar activeNavbar');
    };

    const removeNavbar = () => {
        setActive('navBar');
    };

    const handleAboutClick = (e) => {
        e.preventDefault();
        const pdfUrl = process.env.PUBLIC_URL + '/documents/Apropos.pdf';

        const a = document.createElement('a');
        a.href = pdfUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleContactClick = (e) => {
        e.preventDefault();
        setShowContact(true);
        removeNavbar();
    };

    const handleBackToHome = () => {
        setShowContact(false);
    };

    const handleTicketClick = (e) => {
        e.preventDefault();
        setShowTicketModal(true);
        removeNavbar();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitTicket = (e) => {
        e.preventDefault();
        // Ici vous pouvez ajouter la logique de traitement du paiement
        alert(`Ticket pour la grande finale acheté par ${formData.name} (${formData.email}) via ${formData.paymentMethod}`);
        setShowTicketModal(false);
        setFormData({
            name: '',
            email: '',
            paymentMethod: 'wave'
        });
    };

    return (
        <section className="navBarSection">
            <header className="header flex">
                <div className="logoDiv">
                    <Link to="/" className="logo flex">
                        <img
                            src={logoImg}
                            alt="Dakar Talent Show Logo"
                            className="logo-img"
                        />
                    </Link>
                </div>

                {!showContact && !showTicketModal ? (
                    <div className={active}>
                        <ul className="navLists flex">
                            <li className="navItem">
                                <Link
                                    to="/"
                                    className={`navLink ${location.pathname === '/' ? 'active' : ''}`}
                                >
                                    Accueil
                                </Link>
                            </li>

                            <li className="navItem">
                                <a
                                    href="/documents/Apropos.pdf"
                                    className="navLink"
                                    onClick={handleAboutClick}
                                >
                                    A propos
                                </a>
                            </li>

                            <li className="navItem">
                              <Link
                                to="/partenaires"
                                className={`navLink ${location.pathname === '/partenaires' ? 'active' : ''}`}
                              >
                                Partenaires
                              </Link>
                            </li>

                            <li className="navItem">
                                <a
                                    href="#"
                                    className="navLink"
                                    onClick={handleContactClick}
                                >
                                    Contact
                                </a>
                            </li>

                            <li className="navItem">
                                <button className="btn" onClick={handleTicketClick}>
                                    Ticket
                                </button>
                            </li>
                        </ul>

                        <div onClick={removeNavbar} className="closeNavbar">
                            <IoIosCloseCircle className="icon" />
                        </div>
                    </div>
                ) : null}

                {!showContact && !showTicketModal && (
                    <div onClick={showNav} className="toggleNavbar">
                        <TbGridDots className="icon" />
                    </div>
                )}
            </header>

            {showContact && (
                <div className="contactOverlay" onClick={handleBackToHome}>
                    <div className="contactContent" onClick={(e) => e.stopPropagation()}>
                        <IoIosCloseCircle className="closeModalIcon" onClick={handleBackToHome} />

                        <h2>Contactez-nous</h2>
                        <div className="contactInfo">
                            <p><strong>Téléphone:</strong> +221 78 538 62 25</p>
                            <p><strong>Email:</strong> dakartalentshow@gmail.com</p>
                            <div className="socialLinks">
                                <a href="https://www.facebook.com/share/16d5VhcsCg/" target="_blank" rel="noopener noreferrer">Facebook</a>
                                <a href="https://www.tiktok.com/@dakar_talent_show221?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer">TikTok</a>
                                <a href="https://www.instagram.com/dakar_talent_show/" target="_blank" rel="noopener noreferrer">Instagram</a>
                                <a href="https://wa.me/221785386225" target="_blank" rel="noopener noreferrer">Whatsapp</a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showTicketModal && (
                <div className="contactOverlay" onClick={() => setShowTicketModal(false)}>
                    <div className="ticketContent" onClick={(e) => e.stopPropagation()}>
                        <IoIosCloseCircle className="closeModalIcon" onClick={() => setShowTicketModal(false)} />

                        <h2>Billet pour la Grande Finale</h2>
                        <p className="ticketInfo">Achetez votre billet pour assister à la grande finale du Dakar Talent Show</p>

                        <form onSubmit={handleSubmitTicket} className="ticketForm">
                            <div className="formGroup">
                                <label htmlFor="name">Nom complet</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="formGroup">
                                <label htmlFor="email">Adresse email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="formGroup">
                                <label>Méthode de paiement</label>
                                <div className="paymentMethods">
                                    <label>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="wave"
                                            checked={formData.paymentMethod === 'wave'}
                                            onChange={handleInputChange}
                                        />
                                        Wave
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="orange"
                                            checked={formData.paymentMethod === 'orange'}
                                            onChange={handleInputChange}
                                        />
                                        Orange Money
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="submitBtn">
                                Payer maintenant
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Navbar;