// Intégration du widget MyTouchPoint (TouchPay / GuTouch).
//
// Reproduit la structure de l'exemple fonctionnel fourni (SATURN FITNESS AND PERSONAL
// TRAINING-1.htm) :
//   sendPaymentInfos(timestamp, agencyCode, apiKey, website, '', '', amount, city, '', '', '', '')
// 6 des 12 paramètres positionnels restent non documentés (laissés vides dans l'exemple) —
// voir DEMANDE-MYTOUCHPOINT.md à la racine du projet. Ne pas leur inventer de valeur.
//
// Le SDK ne s'ouvre pas en fenêtre : appelé avec des identifiants valides, il redirige la page
// entière vers le checkout hébergé MyTouchPoint.

const TOUCHPAY_SDK_URL =
  'https://touchpay.gutouch.net/touchpayv2/script/touchpaynr/prod_touchpay-0.0.1.js';

// Le SDK charge lui-même CryptoJS de façon asynchrone APRÈS son propre événement "load" :
// appeler sendPaymentInfos() juste après le chargement du script lève
// "ReferenceError: CryptoJS is not defined" (l'exemple fourni ne l'appelle que sur un clic,
// bien plus tard). On attend donc explicitement que CryptoJS soit disponible.
const CRYPTOJS_POLL_MS = 50;
const CRYPTOJS_TIMEOUT_MS = 10000;

let sdkLoadPromise = null;

function waitForCryptoJs() {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const check = () => {
      if (typeof window.CryptoJS !== 'undefined') {
        resolve();
      } else if (Date.now() - startedAt > CRYPTOJS_TIMEOUT_MS) {
        reject(new Error("Le SDK MyTouchPoint n'a pas fini de s'initialiser (CryptoJS indisponible)."));
      } else {
        setTimeout(check, CRYPTOJS_POLL_MS);
      }
    };
    check();
  });
}

function injectSdkScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = TOUCHPAY_SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      // Le script en échec est retiré : un nouvel essai en injectera un neuf
      script.remove();
      reject(new Error('Impossible de charger le SDK de paiement MyTouchPoint.'));
    };
    document.head.appendChild(script);
  });
}

/**
 * Charge le SDK et attend qu'il soit réellement utilisable. Idempotent, et réessayable après un
 * échec : la promesse en échec n'est pas conservée (sinon un simple "Réessayer" rejouait
 * indéfiniment la même erreur jusqu'au rechargement de la page).
 */
export function loadTouchPaySdk() {
  if (!sdkLoadPromise) {
    const promise = (typeof window.sendPaymentInfos === 'function' ? Promise.resolve() : injectSdkScript())
      .then(waitForCryptoJs);
    sdkLoadPromise = promise;
    promise.catch(() => {
      if (sdkLoadPromise === promise) sdkLoadPromise = null;
    });
  }
  return sdkLoadPromise;
}

/**
 * Ouvre le widget de paiement MyTouchPoint avec les paramètres renvoyés par
 * POST /api/vote-orders (champ paymentWidgetParams).
 */
export async function openTouchPayWidget(widgetParams) {
  await loadTouchPaySdk();

  if (typeof window.sendPaymentInfos !== 'function') {
    throw new Error("Le SDK MyTouchPoint n'a pas exposé sendPaymentInfos().");
  }

  const { agencyCode, apiKey, website, city, amount } = widgetParams;

  window.sendPaymentInfos(
    new Date().getTime(),
    agencyCode,
    apiKey,
    website,
    '', '',
    Number(amount),
    city,
    '', '', '', ''
  );
}
