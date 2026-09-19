// Règle de vote unique et définitive (section 5) : 200 FCFA = 5 points, sans palier ni
// multiplicateur. Ces valeurs sont AFFICHÉES par le front uniquement : le montant débité et
// les points crédités sont toujours recalculés côté serveur (VotePricingService).
export const UNIT_PRICE_FCFA = 200;
export const POINTS_PER_UNIT = 5;

// Plafond de votes par paiement proposé dans le sélecteur de quantité (100 × 200 = 20 000 FCFA).
// Le serveur impose de son côté un plafond absolu par transaction (1 000 000 FCFA).
export const MAX_VOTES_PER_ORDER = 100;
