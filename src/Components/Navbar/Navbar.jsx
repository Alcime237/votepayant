import React, { useState } from "react";
import './navbar.scss';
import { IoIosCloseCircle } from 'react-icons/io';
import { TbGridDots } from 'react-icons/tb';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../../Assets/logo.png';

const Navbar = () => {
    const [active, setActive] = useState('navBar');
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

                {!showTicketModal ? (
                    <div className={active}>
                        <ul className="navLists flex">
                            <li className="navItem">
                                <Link
                                    to="/"
                                    className={`navLink ${location.pathname === '/' ? 'active' : ''}`}
                                    onClick={removeNavbar}
                                >
                                    Accueil
                                </Link>
                            </li>

                            <li className="navItem">
                                <Link
                                    to="/a-propos"
                                    className={`navLink ${location.pathname === '/a-propos' ? 'active' : ''}`}
                                    onClick={removeNavbar}
                                >
                                    A propos
                                </Link>
                            </li>

                            <li className="navItem">
                                <Link
                                    to="/deroulement"
                                    className={`navLink ${location.pathname === '/deroulement' ? 'active' : ''}`}
                                    onClick={removeNavbar}
                                >
                                    Déroulement
                                </Link>
                            </li>

                            <li className="navItem">
                              <Link
                                to="/vote"
                                className={`navLink ${location.pathname === '/vote' ? 'active' : ''}`}
                                onClick={removeNavbar}
                              >
                                Voter
                              </Link>
                            </li>

                            <li className="navItem">
                                <Link
                                    to="/contact"
                                    className={`navLink ${location.pathname === '/contact' ? 'active' : ''}`}
                                    onClick={removeNavbar}
                                >
                                    Contact
                                </Link>
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

                {!showTicketModal && (
                    <div onClick={showNav} className="toggleNavbar">
                        <TbGridDots className="icon" />
                    </div>
                )}
            </header>

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
