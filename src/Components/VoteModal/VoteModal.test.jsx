import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import VoteModal from './VoteModal';
import { createVoteOrder, pollVoteOrderUntilSettled } from '../../services/voteOrderService';
import { openTouchPayWidget } from '../../services/touchpayWidget';

// Mocks à fabrique : le mock automatique chargerait le vrai module, donc axios (ESM, non transformé par Jest)
jest.mock('../../services/voteOrderService', () => ({ createVoteOrder: jest.fn(), pollVoteOrderUntilSettled: jest.fn() }));
jest.mock('../../services/touchpayWidget', () => ({ openTouchPayWidget: jest.fn() }));

const candidate = { id: 'cand-1', fullName: 'Awa Ndiaye' };
const order = { id: 'order-1', totalPoints: 25, paymentWidgetParams: { amount: '1000' } };

const renderModal = (props = {}) =>
  render(<VoteModal candidate={candidate} votingActive onClose={jest.fn()} {...props} />);

// Passe à l'étape paiement, choisit Orange Money et saisit le numéro
async function fillPaymentStep(phone = '77 123 45 67') {
  await userEvent.click(screen.getByRole('button', { name: 'Suivant' }));
  await userEvent.click(screen.getByRole('button', { name: /Orange Money/ }));
  await userEvent.type(screen.getByLabelText(/Numéro Orange Money/), phone);
}

describe('VoteModal', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    createVoteOrder.mockResolvedValue(order);
    openTouchPayWidget.mockResolvedValue(undefined);
  });

  it('calcule le total et les points selon la règle 200 FCFA = 5 points', async () => {
    renderModal();
    expect(screen.getByText('200 FCFA · 5 points')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Un vote de plus' }));
    await userEvent.click(screen.getByRole('button', { name: 'Un vote de plus' }));

    expect(screen.getByText('600 FCFA · 15 points')).toBeInTheDocument();
  });

  it('le bouton "Payer" déclenche bien la création de la commande, puis la confirmation', async () => {
    pollVoteOrderUntilSettled.mockResolvedValue({ id: 'order-1', status: 'PAID', totalPoints: 25 });
    renderModal();
    await userEvent.click(screen.getByRole('button', { name: 'Un vote de plus' }));
    await fillPaymentStep();

    await userEvent.click(screen.getByRole('button', { name: 'Payer 400 FCFA' }));

    // Numéro normalisé en 9 chiffres nus, montant calculé côté modal
    expect(createVoteOrder).toHaveBeenCalledWith({ candidateId: 'cand-1', phoneNumber: '771234567', amountFcfa: 400 });
    await waitFor(() => expect(openTouchPayWidget).toHaveBeenCalledWith(order.paymentWidgetParams));
    expect(await screen.findByText('Vote confirmé !')).toBeInTheDocument();
    expect(screen.getByText('25 points')).toBeInTheDocument();
  });

  it('refuse un numéro invalide et garde le bouton désactivé', async () => {
    renderModal();
    await fillPaymentStep('12345');

    expect(screen.getByText(/numéro à 9 chiffres/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Payer 200 FCFA' })).toBeDisabled();
    expect(createVoteOrder).not.toHaveBeenCalled();
  });

  it("affiche l'erreur du serveur dans la fenêtre (sans alert) et permet de réessayer", async () => {
    createVoteOrder.mockRejectedValueOnce(Object.assign(new Error('x'), {
      response: { status: 409 }, friendlyMessage: "Aucune campagne de vote n'est ouverte actuellement.",
    }));
    renderModal();
    await fillPaymentStep();

    await userEvent.click(screen.getByRole('button', { name: 'Payer 200 FCFA' }));

    expect(await screen.findByRole('alert')).toHaveTextContent("Aucune campagne de vote n'est ouverte");
    expect(screen.getByRole('button', { name: 'Payer 200 FCFA' })).toBeEnabled();
  });

  it("après un délai dépassé, re-vérifie la MÊME commande au lieu d'en créer une seconde", async () => {
    pollVoteOrderUntilSettled
      .mockResolvedValueOnce({ id: 'order-1', status: 'PENDING', timedOut: true })
      .mockResolvedValueOnce({ id: 'order-1', status: 'PAID', totalPoints: 25 });
    renderModal();
    await fillPaymentStep();

    await userEvent.click(screen.getByRole('button', { name: 'Payer 200 FCFA' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Vérifier le paiement' }));

    expect(await screen.findByText('Vote confirmé !')).toBeInTheDocument();
    expect(createVoteOrder).toHaveBeenCalledTimes(1);
    expect(openTouchPayWidget).toHaveBeenCalledTimes(1);
  });

  it('signale un paiement refusé', async () => {
    pollVoteOrderUntilSettled.mockResolvedValue({ id: 'order-1', status: 'FAILED' });
    renderModal();
    await fillPaymentStep();

    await userEvent.click(screen.getByRole('button', { name: 'Payer 200 FCFA' }));

    expect(await screen.findByRole('alert')).toHaveTextContent("Le paiement n'a pas abouti");
  });

  it('empêche de payer quand les votes sont clos', async () => {
    renderModal({ votingActive: false });
    await fillPaymentStep();

    expect(screen.getByRole('button', { name: 'Votes terminés' })).toBeDisabled();
  });

  it('se ferme avec la touche Échap', async () => {
    const onClose = jest.fn();
    renderModal({ onClose });

    await userEvent.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
  });
});
