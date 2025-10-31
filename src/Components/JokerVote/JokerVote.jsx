
import React from "react";
import { LuCrown, LuHeart, LuAward, LuStar } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom';
import './JokerVote.scss'

const JokerVote = () => {
    const navigate = useNavigate();

    return (
        <section className="joker-vote-section container section">
            <div data-aos="fade-up" className="joker-card-container">
                <div className="joker-card">
                    <div className="joker-card-header">
                        <div className="joker-badge">
                            <LuCrown className="crown-icon" />
                            <span>VOTE EXCLUSIF</span>
                        </div>
                        <h3>Votez pour le Joker</h3>
                        <p>Offrez une seconde chance à un talent méritant</p>
                    </div>

                    <div className="joker-card-content">
                        <div className="joker-feature">
                            <div className="feature-icon">
                                <LuHeart className="icon" />
                            </div>
                            <div className="feature-text">
                                <h4>Sauvez votre favori</h4>
                                <p>Un candidat éliminé par catégorie pourra être repêché</p>
                            </div>
                        </div>

                        <div className="joker-feature">
                            <div className="feature-icon">
                                <LuAward className="icon" />
                            </div>
                            <div className="feature-text">
                                <h4>Accès direct à la finale</h4>
                                <p>Le Joker gagne sa place pour le grand show final</p>
                            </div>
                        </div>

                        <div className="joker-feature">
                            <div className="feature-icon">
                                <LuStar className="icon" />
                            </div>
                            <div className="feature-text">
                                <h4>Votez dans chaque rubrique</h4>
                                <p>Chant, Rap et Danse - Un Joker par discipline</p>
                            </div>
                        </div>
                    </div>

                    <div className="joker-card-footer">
                        <button
                            className="joker-vote-btn"
                            onClick={() => navigate('/joker-repechage')}
                        >
                            <LuStar className="btn-icon" />
                            VOTER POUR LE JOKER
                        </button>
                        <p className="vote-info">Les votes seront ouverts 72h après la demi-finale</p>
                    </div>

                    <div className="joker-card-glow"></div>
                </div>
            </div>
        </section>
    )
}

export default JokerVote;
