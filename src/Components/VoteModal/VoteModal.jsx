import React, { useEffect, useRef, useState } from 'react';
import { LuCheck } from 'react-icons/lu';
import useVotePayment from '../../hooks/useVotePayment';
import { MAX_VOTES_PER_ORDER, POINTS_PER_UNIT, UNIT_PRICE_FCFA } from '../../constants/voteRules';
import { normalizePhoneNumber } from '../../utils/phone';

const PAYMENT_METHODS = [
  { key: 'orange', label: 'Orange Money', iconClass: 'orange-money-icon' },
  { key: 'wave', label: 'Wave', iconClass: 'wave-icon' },
];

/**
 * Fenêtre de vote en 2 étapes (quantité → paiement), partagée par les pages Chant, Rap et Danse
 * (les styles viennent de styles/_paymentModal.scss).
 *
 * Tout est dans UN <form> : le bouton "Payer" se trouvait auparavant hors du formulaire, si bien
 * qu'un clic dessus ne déclenchait jamais l'envoi et qu'aucun paiement ne pouvait démarrer.
 * Les issues du paiement s'affichent dans la fenêtre (plus d'alert() bloquants).
 */
const VoteModal = ({ candidate, votingActive, onClose }) => {
  const [step, setStep] = useState(1);
  const [voteCount, setVoteCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const { state, submit, recheck } = useVotePayment();
  const dialogRef = useRef(null);

  const totalAmount = UNIT_PRICE_FCFA * voteCount;
  const totalPoints = voteCount * POINTS_PER_UNIT;
  const phoneNumber = normalizePhoneNumber(phoneInput);
  const phoneInvalid = phoneInput.trim() !== '' && phoneNumber === null;
  const isCreating = state.status === 'creating';
  const isBusy = isCreating || state.status === 'awaiting';
  const isPending = state.status === 'pending';
  const isSuccess = state.status === 'success';
  // Fermer pendant la création de la commande laisserait un paiement lancé sans aucun retour à l'écran
  const canClose = !isCreating;

  // Échap ferme la fenêtre, le fond de page ne défile plus, le focus entre dans la fenêtre
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && canClose) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [canClose, onClose]);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  const changeVoteCount = (next) => {
    setVoteCount(Math.max(1, Math.min(MAX_VOTES_PER_ORDER, next)));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isBusy || isSuccess) return;

    if (step === 1) {
      setStep(2);
      return;
    }
    if (isPending) {
      recheck();
      return;
    }
    if (!votingActive || !paymentMethod || phoneNumber === null) return;

    submit({ candidateId: candidate.id, phoneNumber, amountFcfa: totalAmount });
  };

  const feedback = (() => {
    switch (state.status) {
      case 'awaiting':
        return { tone: 'info', text: 'Validez le paiement sur votre téléphone. Cette fenêtre se met à jour automatiquement.' };
      case 'pending':
        return { tone: 'warn', text: state.message };
      case 'failed':
      case 'error':
        return { tone: 'error', text: state.message };
      default:
        return null;
    }
  })();

  const submitLabel = () => {
    if (isCreating) return 'Traitement...';
    if (state.status === 'awaiting') return 'En attente de confirmation...';
    if (isPending) return 'Vérifier le paiement';
    if (!votingActive) return 'Votes terminés';
    return `Payer ${totalAmount} FCFA`;
  };

  return (
    <div className="payment-modal-overlay" onClick={() => canClose && onClose()}>
      <div
        ref={dialogRef}
        className="payment-modal-content compact"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vote-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {isSuccess ? (
          <div className="payment-success" role="status">
            <span className="payment-success__icon"><LuCheck aria-hidden="true" /></span>
            <h3 id="vote-modal-title">Vote confirmé !</h3>
            <p>
              <strong>{state.points ?? totalPoints} points</strong> viennent d'être ajoutés à{' '}
              <strong>{candidate.fullName}</strong>. Merci pour votre soutien !
            </p>
            <div className="modal-actions">
              <button type="button" className="submit-payment compact-submit" onClick={onClose}>
                Fermer
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="payment-nav">
              <div className={`nav-step ${step === 1 ? 'active' : ''}`}>
                <span className="step-number">1</span>
                <span className="step-label">Quantité</span>
              </div>
              <div className="nav-connector"></div>
              <div className={`nav-step ${step === 2 ? 'active' : ''}`}>
                <span className="step-number">2</span>
                <span className="step-label">Paiement</span>
              </div>
            </div>

            <div className="modal-header">
              <h3 id="vote-modal-title">Voter pour {candidate.fullName}</h3>
              <button
                type="button"
                className="close-payment-modal"
                onClick={onClose}
                disabled={!canClose}
                aria-label="Fermer"
              >
                &times;
              </button>
            </div>

            {step === 1 && (
              <div className="vote-selection">
                <div className="vote-counter">
                  <label htmlFor="vote-count">Nombre de votes :</label>
                  <div className="counter-controls">
                    <button
                      type="button"
                      onClick={() => changeVoteCount(voteCount - 1)}
                      disabled={voteCount <= 1}
                      aria-label="Un vote de moins"
                    >
                      −
                    </button>
                    <input
                      id="vote-count"
                      type="number"
                      min="1"
                      max={MAX_VOTES_PER_ORDER}
                      value={voteCount}
                      onChange={(e) => changeVoteCount(parseInt(e.target.value, 10) || 1)}
                    />
                    <button
                      type="button"
                      onClick={() => changeVoteCount(voteCount + 1)}
                      disabled={voteCount >= MAX_VOTES_PER_ORDER}
                      aria-label="Un vote de plus"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="total-amount">
                  <span>Total :</span>
                  {/* Points affichés à côté du montant : cohérent avec la règle unique 200 FCFA = 5 points */}
                  <span className="amount">{totalAmount} FCFA · {totalPoints} points</span>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="compact-form">
                <div className="payment-methods compact-methods">
                  <div className="method-title">Méthode de paiement :</div>
                  <div className="method-buttons">
                    {PAYMENT_METHODS.map(({ key, label, iconClass }) => (
                      <button
                        key={key}
                        type="button"
                        className={`method-btn ${paymentMethod === key ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod(key)}
                        disabled={isBusy}
                        aria-pressed={paymentMethod === key}
                      >
                        <div className={`payment-icon ${iconClass}`} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {paymentMethod && (
                  <div className="form-group compact-input">
                    <label htmlFor="vote-phone">
                      Numéro {PAYMENT_METHODS.find((m) => m.key === paymentMethod).label}
                    </label>
                    <input
                      id="vote-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="77 123 45 67"
                      maxLength={20}
                      disabled={isBusy}
                      aria-invalid={phoneInvalid}
                      aria-describedby={phoneInvalid ? 'vote-phone-error' : undefined}
                    />
                    {phoneInvalid && (
                      <p id="vote-phone-error" className="payment-field-error">
                        Saisissez un numéro à 9 chiffres (ex. 77 123 45 67).
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {feedback && (
              <p
                className={`payment-feedback payment-feedback--${feedback.tone}`}
                role={feedback.tone === 'error' ? 'alert' : 'status'}
              >
                {feedback.text}
              </p>
            )}

            <div className="modal-actions">
              {step === 2 && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setStep(1)}
                  disabled={isBusy}
                >
                  Retour
                </button>
              )}
              {step === 1 ? (
                <button type="submit" className="submit-payment compact-submit">
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  className="submit-payment compact-submit"
                  disabled={isBusy || !votingActive || (!isPending && (!paymentMethod || phoneNumber === null))}
                >
                  {isBusy && <span className="processing-spinner"></span>}
                  {submitLabel()}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default VoteModal;
