import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./JokerDanse.scss";

const JokerDanse = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [voteCount, setVoteCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  const [voteStatus, setVoteStatus] = useState({
    isActive: false,
    endDate: null
  });
  const [currentStep, setCurrentStep] = useState(1);

  const API_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    fetchCandidates();
    fetchVoteStatus();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/joker-danse`);
      setCandidates(response.data);
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des candidats");
      setLoading(false);
    }
  };

  const fetchVoteStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/joker/vote-config/status`);
      setVoteStatus({
        isActive: response.data.isActive,
        endDate: response.data.endDate
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du statut:", error);
    }
  };

  const handleVote = (candidate) => {
    if (!voteStatus.isActive) return;

    setSelectedCandidate(candidate);
    setShowPaymentModal(true);
    setCurrentStep(1);
    setVoteCount(1);
    setPaymentMethod("");
    setPhoneNumber("");
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

  const handlePayment = async () => {
    if (!paymentMethod || !phoneNumber) {
      alert("Veuillez sélectionner une méthode de paiement et entrer votre numéro");
      return;
    }

    setProcessing(true);
    try {
      const totalAmount = selectedCandidate.prixVote * voteCount;

      // Simuler un paiement (à remplacer par un vrai appel API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Enregistrer le vote
      await axios.post(`${API_BASE_URL}/joker-danse/vote`, {
        candidateId: selectedCandidate.id,
        votes: voteCount,
        amount: totalAmount,
        paymentMethod,
        phoneNumber
      });

      alert("Vote enregistré avec succès!");
      setShowPaymentModal(false);
      setCurrentStep(1);
      fetchCandidates(); // Recharger les données
    } catch (err) {
      alert("Erreur lors du traitement du vote");
    } finally {
      setProcessing(false);
    }
  };

  const openImagePopup = (candidate) => {
    setSelectedImage({
      url: `${API_BASE_URL}/joker-danse/photo/${candidate.id}`,
      name: candidate.nomJokerDanse
    });
    setShowImagePopup(true);
  };

  if (loading) {
    return (
      <div className="danse-container">
        <div className="dance-loading-container">
          <div className="dance-loading">
            <div className="dancer"></div>
            <div className="dancer"></div>
            <div className="dancer"></div>
          </div>
          <div className="loading-text">Chargement</div>
          <div className="loading-subtext">Préparez-vous à voter</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="danse-container">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchCandidates}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="danse-container">
      <button className="back-button" onClick={() => navigate("/joker-repechage")}>
        ← Retour
      </button>

      <h1>Joker Danse</h1>
      <p className="subtitle">Votez pour votre talent préféré</p>

      <div className="candidates-list">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="candidate-card">
            <div
              className="image-clickable"
              onClick={() => openImagePopup(candidate)}
            >
              <img
                src={`${API_BASE_URL}/joker-danse/photo/${candidate.id}`}
                alt={candidate.nomJokerDanse}
                className="dancer-image"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x300/1a1a1a/ffffff?text=Image+Non+Disponible";
                }}
              />
              <div className="dancer-overlay">Voir l'image</div>
            </div>

            <div className="candidate-info">
              <h3>{candidate.nomJokerDanse}</h3>
              <div className="details">
                <p className="price">Prix du vote: {candidate.prixVote?.toLocaleString()} FCFA</p>
                <p className="votes">Votes: {candidate.votes?.toLocaleString() || 0}</p>
              </div>
            </div>

            <button
              className="vote-button"
              onClick={() => handleVote(candidate)}
              disabled={!voteStatus.isActive}
            >
              {voteStatus.isActive ? `VOTER (${candidate.prixVote} FCFA)` : "TERMINÉ"}
            </button>
          </div>
        ))}
      </div>

      {/* Modal de paiement */}
      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal-content compact">
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
              <h3>Voter pour {selectedCandidate.nomJokerDanse}</h3>
              <button
                className="close-payment-modal"
                onClick={() => setShowPaymentModal(false)}
                disabled={processing}
              >
                ×
              </button>
            </div>

            {/* Étape 1: Sélection de la quantité */}
            {currentStep === 1 && (
              <div className="vote-selection">
                <div className="vote-counter">
                  <label>Nombre de votes:</label>
                  <div className="counter-controls">
                    <button
                      onClick={() => setVoteCount(Math.max(1, voteCount - 1))}
                      disabled={voteCount <= 1 || processing}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={voteCount}
                      onChange={(e) => setVoteCount(Math.max(1, parseInt(e.target.value) || 1))}
                      disabled={processing}
                    />
                    <button
                      onClick={() => setVoteCount(voteCount + 1)}
                      disabled={processing}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="total-amount">
                  <span>Total:</span>
                  <span className="amount">
                    {(selectedCandidate.prixVote * voteCount).toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            )}

            {/* Étape 2: Méthode de paiement */}
            {currentStep === 2 && (
              <div className="compact-form">
                <div className="payment-methods compact-methods">
                  <div className="method-title">Méthode de paiement:</div>
                  <div className="method-buttons">
                    <button
                      className={`method-btn ${paymentMethod === 'orange' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('orange')}
                      disabled={processing}
                    >
                      <div className="payment-icon orange-money-icon"></div>
                      Orange Money
                    </button>
                    <button
                      className={`method-btn ${paymentMethod === 'wave' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('wave')}
                      disabled={processing}
                    >
                      <div className="payment-icon wave-icon"></div>
                      Wave
                    </button>
                  </div>
                </div>

                <div className="form-group compact-input">
                  <label>Numéro de téléphone:</label>
                  <input
                    type="tel"
                    placeholder="77 123 45 67"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={processing}
                  />
                </div>
              </div>
            )}

            <div className="modal-actions">
              {currentStep === 2 && (
                <button
                  className="cancel-btn"
                  onClick={handlePrevStep}
                  disabled={processing}
                >
                  Retour
                </button>
              )}
              {currentStep === 1 ? (
                <button
                  className="submit-payment compact-submit"
                  onClick={handleNextStep}
                  disabled={voteCount < 1}
                >
                  Suivant
                </button>
              ) : (
                <button
                  className="submit-payment compact-submit"
                  onClick={handlePayment}
                  disabled={processing || !paymentMethod || !phoneNumber}
                >
                  {processing ? (
                    <>
                      <div className="processing-spinner"></div>
                      Traitement...
                    </>
                  ) : (
                    `Payer ${(selectedCandidate.prixVote * voteCount).toLocaleString()} FCFA`
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Popup d'image */}
      {showImagePopup && selectedImage && (
        <div className="image-popup-overlay" onClick={() => setShowImagePopup(false)}>
          <div className="image-popup-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-popup"
              onClick={() => setShowImagePopup(false)}
            >
              ×
            </button>
            <img src={selectedImage.url} alt={selectedImage.name} />
            <h3 className="popup-title">{selectedImage.name}</h3>
            <p className="popup-subtitle">Joker Danse</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JokerDanse;