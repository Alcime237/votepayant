/**
 * Normalise un numéro de téléphone saisi par l'utilisateur en 9 chiffres nus (format attendu
 * par le backend : ^\d{9}$), ou renvoie null s'il est invalide.
 *
 * Accepte ce que les gens tapent réellement — "77 123 45 67", "77-123-45-67", "+221 77 123 45 67",
 * "00221771234567" — au lieu d'imposer 9 chiffres collés, ce que le placeholder du champ
 * ("77 123 45 67") contredisait auparavant.
 */
export function normalizePhoneNumber(raw) {
  if (typeof raw !== 'string') return null;

  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('00221')) digits = digits.slice(5);
  else if (digits.startsWith('221') && digits.length === 12) digits = digits.slice(3);

  return /^\d{9}$/.test(digits) ? digits : null;
}
