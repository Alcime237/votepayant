import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './chant.scss';
import { getCandidatesByCategory } from '../../services/candidateService';
import { getCampaignStatus } from '../../services/campaignService';
import { createVoteOrder, pollVoteOrderUntilSettled } from '../../services/voteOrderService';
import { openTouchPayWidget } from '../../services/touchpayWidget';
// "Verdict final" : diagramme en bâtons du classement, scopé à la discipline Chant (section 8.3)
import RankingChart from '../RankingChart/RankingChart';
// Distingue un serveur injoignable (mode démo) d'une vraie erreur de paiement, pour ne pas
// afficher un message technique de développeur aux visiteurs d'un aperçu sans backend relié.
import { isUnreachableError } from '../../services/demoMode';

const UNIT_PRICE_FCFA = 200;
// Nouvelle règle de vote unique (section 5) : 200 FCFA = 5 points, point. Plus aucun palier
// standard/soutien/premium ni multiplicateur — un seul taux fixe, affiché partout pareil.
const POINTS_PER_UNIT = 5;

const ChantDemiFinale = () => {
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

  // Fonction pour récupérer les candidats
  const fetchCandidates = async () => {
    try {
      const data = await getCandidatesByCategory('CHANT');
      setCandidates(data);
    } catch (err) {
      // friendlyMessage (posé par l'intercepteur axios, voir apiClient.js) explique la cause
      // réelle (serveur injoignable / CORS / erreur métier) au lieu du "Network Error" générique
      setError(err.friendlyMessage || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    const checkVoteStatus = async () => {
      try {
        const data = await getCampaignStatus();
        setVotingActive(data.active);

        if (data.endDate) {
          const endDate = new Date(data.endDate);
          const now = new Date(data.serverTime || new Date());
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
        console.error("Erreur lors de la vérification du statut du vote:", error);
        setVotingActive(false);
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

  const totalAmount = selectedCandidate ? UNIT_PRICE_FCFA * voteCount : 0;

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
      const order = await createVoteOrder({
        candidateId: selectedCandidate.id,
        phoneNumber,
        amountFcfa: totalAmount,
      });

      await openTouchPayWidget(order.paymentWidgetParams);

      const settled = await pollVoteOrderUntilSettled(order.id);

      if (settled.status === 'PAID') {
        alert(`Paiement confirmé pour ${voteCount} vote(s) sur ${selectedCandidate.fullName} !`);
        await fetchCandidates();
        setPaymentMethod('');
        setPhoneNumber('');
        setShowPaymentModal(false);
        setCurrentStep(1);
      } else if (settled.timedOut) {
        alert("Le paiement est toujours en attente de confirmation. Vérifiez votre téléphone puis réessayez si besoin.");
      } else {
        alert(`Le paiement n'a pas abouti (statut: ${settled.status}).`);
      }
    } catch (err) {
      if (isUnreachableError(err)) {
        // Serveur injoignable (ex. aperçu de démonstration sans backend relié) : message
        // honnête plutôt qu'une erreur technique — aucun paiement n'a été tenté ni facturé.
        alert("Mode démonstration : cette page n'est pas reliée à un serveur de paiement pour l'instant, aucun vote réel n'a été enregistré.");
      } else {
        // Même principe : friendlyMessage donne un message actionnable plutôt que l'erreur axios brute
        alert('Erreur de paiement: ' + (err.friendlyMessage || err.message));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="chant-loading-container">
      <div className="music-loader">
        <div className="note">♪</div>
        <div className="note">♫</div>
        <div className="note">♩</div>
      </div>
      <p className="loading-text">Chargement des talents vocaux...</p>
      <div className="equalizer">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bar" style={{ '--delay': `${i * 0.1}s` }} />
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <p>Erreur: {error}</p>
      <button onClick={() => window.location.reload()}>Réessayer</button>
    </div>
  );

  return (
     <section className="chant-container">
       <h1>Candidats - Catégorie Chant</h1>

       <button className="back-button" onClick={() => navigate(-1)}>
         &larr; Retour
       </button>

       <div className="candidates-list">
         {candidates.map((candidate) => (
           <div key={candidate.id} className="candidate-card">
             <div className="image-clickable" onClick={() => setSelectedImage({
               url: candidate.photoUrl,
               name: candidate.fullName
             })}>
               <img
                 src={candidate.photoUrl}
                 alt={candidate.fullName}
               />
             </div>
             <div className="candidate-info">
               <h3>{candidate.fullName}</h3>
               {/* Règle de vote unique affichée sur chaque carte (section 5) : plus de palier */}
               <p className="price">{UNIT_PRICE_FCFA} FCFA = {POINTS_PER_UNIT} points</p>
             </div>
             <button
               className={`vote-button ${!votingActive ? 'disabled' : ''}`}
               onClick={() => handleVoteClick(candidate)}
               disabled={!votingActive}
             >
               {votingActive ? 'Voter' : 'Terminé'}
             </button>
           </div>
         ))}
       </div>

       {/* "Verdict final" (section 8.3) : classement en direct, strictement scopé à Chant —
           category="CHANT" filtre la liste reçue et recalcule le pourcentage localement
           (voir le commentaire détaillé dans RankingChart.jsx). */}
       <RankingChart category="CHANT" title="Verdict final — Chant" showExplanation />

       {selectedImage && (
         <div className="image-popup-overlay" onClick={() => setSelectedImage(null)}>
           <div className="image-popup-content" onClick={e => e.stopPropagation()}>
             <button className="close-popup" onClick={() => setSelectedImage(null)}>
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
               <h3>Voter pour {selectedCandidate.fullName}</h3>
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
                   {/* Points affichés à côté du montant : cohérent avec la règle unique 200 FCFA = 5 points */}
                   <span className="amount">{totalAmount} FCFA · {voteCount * POINTS_PER_UNIT} points</span>
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

 export default ChantDemiFinale;