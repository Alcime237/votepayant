import React, { useState } from "react";
import './navbar.scss';
import { IoIosCloseCircle } from 'react-icons/io';
import { TbGridDots } from 'react-icons/tb';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../../Assets/logo.png';
// Remplace l'ancien bouton "Ticket" (section 6) : ouvre le parcours d'inscription candidat
import CandidateRegistrationModal from '../CandidateRegistration/CandidateRegistrationModal';

const Navbar = () => {
    const [active, setActive] = useState('navBar');
    // Remplace showTicketModal/formData (ancien flux Ticket, entièrement supprimé comme demandé)
    const [showCandidateModal, setShowCandidateModal] = useState(false);
    const location = useLocation();

    const showNav = () => {
        setActive('navBar activeNavbar');
    };

    const removeNavbar = () => {
        setActive('navBar');
    };

    const handleCandidateClick = (e) => {
        e.preventDefault();
        setShowCandidateModal(true);
        removeNavbar();
    };

    return (
        <section className="navBarSection">
            <header className="header flex">
                <div className="logoDiv">
                    <Link to="/" className="logo flex">
                        <img
                            src={logoImg}
                            /* "Dakar Talent Show" → "Sénégal Talent Show" dans le texte alternatif du logo (accessibilité + SEO) */
                            alt="Sénégal Talent Show Logo"
                            className="logo-img"
                        />
                    </Link>
                </div>

                {!showCandidateModal ? (
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
                                {/* "Ticket" supprimé, remplacé par "Candidat" (section 6) : ouvre
                                    le parcours d'inscription en 3 étapes au lieu de l'ancienne
                                    modale d'achat de billet (qui ne faisait qu'un alert() simulé). */}
                                <button className="btn" onClick={handleCandidateClick}>
                                    Candidat
                                </button>
                            </li>
                        </ul>

                        <div onClick={removeNavbar} className="closeNavbar">
                            <IoIosCloseCircle className="icon" />
                        </div>
                    </div>
                ) : null}

                {!showCandidateModal && (
                    <div onClick={showNav} className="toggleNavbar">
                        <TbGridDots className="icon" />
                    </div>
                )}
            </header>

            {/* Parcours d'inscription candidat en 3 étapes (voir CandidateRegistrationModal) */}
            {showCandidateModal && (
                <CandidateRegistrationModal onClose={() => setShowCandidateModal(false)} />
            )}
        </section>
    );
};

export default Navbar;
