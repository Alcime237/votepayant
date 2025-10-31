import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './rap.scss';

const Rap = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [votingActive, setVotingActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [voteCount, setVoteCount] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const totalAmount = selectedCandidate ? selectedCandidate.prixVote * voteCount : 0;

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch('http://localhost:8080/vote-rap');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des candidats');
        }
        const data = await response.json();
        setCandidates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  useEffect(() => {
    const checkVoteStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/admin/vote-config/status');
        const data = await response.json();
        setVotingActive(data.isActive);

        if (data.endDate) {
          const endDate = new Date(data.endDate);
          const now = new Date(data.currentTime || new Date());
          const diff = endDate - now;

          if (diff > 0) {
            setTimeLeft(Math.floor(diff / 1000));
          } else {
            setVotingActive(false);
            if (data.isActive) {
              alert("Le temps de vote est écoulé !");
              navigate('/');
            }
          }
        }
      } catch (error) {
        console.error('Error checking vote status:', error);
      }
    };

    checkVoteStatus();
    const interval = setInterval(checkVoteStatus, 60000);
    return () => clearInterval(interval);
  }, [navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleVoteClick = (candidate) => {
    if (!votingActive) {
      alert("Les votes sont terminés !");
      return;
    }
    setSelectedCandidate(candidate);
    setVoteCount(1);
    setCurrentStep(1);
    setPaymentMethod('');
    setPhoneNumber('');
    setShowPaymentModal(true);
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Paiement de ${totalAmount} FCFA effectué avec succès pour ${voteCount} vote(s) pour ${selectedCandidate.nomRap} via ${paymentMethod === 'orange' ? 'Orange Money' : 'Wave'}`);
      setPaymentMethod('');
      setPhoneNumber('');
      setShowPaymentModal(false);
      setCurrentStep(1);
    } catch (error) {
      alert('Erreur lors du paiement: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const openImagePopup = (imageUrl, candidateName) => {
    setSelectedImage({ url: imageUrl, name: candidateName });
  };

  const closeImagePopup = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="rap-loading-container">
        <div className="beat-loader">
          <div className="vinyl">
            <div className="groove"></div>
            <div className="label">RAP</div>
          </div>
          <div className="needle"></div>
        </div>
        <p className="loading-text">Mixage des beats...</p>
        <div className="lyric-bubble">
          <div className="word">Yo</div>
          <div className="word">Check</div>
          <div className="word">It</div>
          <div className="word">Out</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Erreur: {error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  return (
    <section className="rap-container">
      <h1>Candidats - Catégorie Rap</h1>

      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Retour
      </button>

      <div className="candidates-list">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="candidate-card">
            <div
              className="image-clickable"
              onClick={() => openImagePopup(
                `http://localhost:8080/vote-rap/photo/${candidate.id}`,
                candidate.nomRap
              )}
            >
              <img
                src={`http://localhost:8080/vote-rap/photo/${candidate.id}`}
                alt={candidate.nomRap}
              />
            </div>
            <div className="candidate-info">
              <h3>{candidate.nomRap}</h3>
              <p className="price">Prix: {candidate.prixVote} FCFA/vote</p>
              <p className="votes">Votes: {candidate.votes}</p>
            </div>
            <button
              className="vote-button"
              onClick={() => handleVoteClick(candidate)}
              disabled={!votingActive}
            >
              {votingActive ? 'Voter' : 'Terminé'}
            </button>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="image-popup-overlay" onClick={closeImagePopup}>
          <div className="image-popup-content" onClick={e => e.stopPropagation()}>
            <button className="close-popup" onClick={closeImagePopup}>
              &times;
            </button>
            <img src={selectedImage.url} alt={selectedImage.name} />
            <p>{selectedImage.name}</p>
          </div>
        </div>
      )}

      {showPaymentModal && selectedCandidate && (
        <div className="payment-modal-overlay" onClick={() => !isProcessing && setShowPaymentModal(false)}>
          <div className="payment-modal-content compact" onClick={e => e.stopPropagation()}>
            {/* Barre de navigation */}
            <div className="payment-nav">
              <div className={`nav-step ${currentStep === 1 ? 'active' : ''}`}>
                <span className="step-number">1</span>
                <span className="step-label">Quantité</span>
              </div>
              <div className="nav-connector"></div>
              <div className={`nav-step ${currentStep === 2 ? 'active' : ''}`}>
                <span className="step-number">2</span>
                <span className="step-label">Paiement</span>
              </div>
            </div>

            <div className="modal-header">
              <h3>Voter pour {selectedCandidate.nomRap}</h3>
              <button
                className="close-payment-modal"
                onClick={() => setShowPaymentModal(false)}
                disabled={isProcessing}
              >
                &times;
              </button>
            </div>

            {/* Étape 1: Sélection de la quantité */}
            {currentStep === 1 && (
              <div className="vote-selection">
                <div className="vote-counter">
                  <label>Nombre de votes:</label>
                  <div className="counter-controls">
                    <button
                      onClick={() => setVoteCount(prev => Math.max(1, prev - 1))}
                      disabled={voteCount <= 1 || isProcessing}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={voteCount}
                      onChange={(e) => {
                        const value = Math.max(1, Math.min(100, parseInt(e.target.value) || 1));
                        setVoteCount(value);
                      }}
                      disabled={isProcessing}
                    />
                    <button
                      onClick={() => setVoteCount(prev => Math.min(100, prev + 1))}
                      disabled={voteCount >= 100 || isProcessing}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="total-amount">
                  <span>Total:</span>
                  <span className="amount">{totalAmount} FCFA</span>
                </div>
              </div>
            )}

            {/* Étape 2: Méthode de paiement */}
            {currentStep === 2 && (
              <form onSubmit={handlePaymentSubmit} className="compact-form">
                <div className="payment-methods compact-methods">
                  <div className="method-title">Méthode de paiement:</div>
                  <div className="method-buttons">
                    <button
                      type="button"
                      className={`method-btn ${paymentMethod === 'orange' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('orange')}
                      disabled={isProcessing}
                    >
                      <div className="payment-icon orange-money-icon" />
                      Orange Money
                    </button>
                    <button
                      type="button"
                      className={`method-btn ${paymentMethod === 'wave' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('wave')}
                      disabled={isProcessing}
                    >
                      <div className="payment-icon wave-icon" />
                      Wave
                    </button>
                  </div>
                </div>

                {paymentMethod && (
                  <div className="form-group compact-input">
                    <label>Numéro {paymentMethod === 'orange' ? 'Orange Money' : 'Wave'}</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="77 123 45 67"
                      required
                      disabled={isProcessing}
                      pattern="[0-9]{9}"
                    />
                  </div>
                )}
              </form>
            )}

            <div className="modal-actions">
              {currentStep === 2 && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handlePrevStep}
                  disabled={isProcessing}
                >
                  Retour
                </button>
              )}
              {currentStep === 1 ? (
                <button
                  type="button"
                  className="submit-payment compact-submit"
                  onClick={handleNextStep}
                  disabled={voteCount < 1}
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  className="submit-payment compact-submit"
                  disabled={isProcessing || !votingActive || !paymentMethod || !phoneNumber}
                >
                  {isProcessing ? (
                    <>
                      <span className="processing-spinner"></span>
                      Traitement...
                    </>
                  ) : votingActive ? (
                    `Payer ${totalAmount} FCFA`
                  ) : (
                    'Votes terminés'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Rap;