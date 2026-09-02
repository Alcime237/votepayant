// Intégration du widget MyTouchPoint (TouchPay / GuTouch).
//
// Reproduit EXACTEMENT la structure observée dans l'exemple fonctionnel fourni
// (SATURN FITNESS AND PERSONAL TRAINING-1.htm) :
//   sendPaymentInfos(timestamp, agencyCode, apiKey, website, '', '', amount, city, '', '', '')
// 5 des 11 paramètres positionnels restent non documentés (laissés vides dans l'exemple) —
// voir DEMANDE-MYTOUCHPOINT.md à la racine du projet. Ne pas leur inventer de valeur.

const TOUCHPAY_SDK_URL =
  'https://touchpay.gutouch.net/touchpayv2/script/touchpaynr/prod_touchpay-0.0.1.js';

let sdkLoadPromise = null;

function loadTouchPaySdk() {
  if (typeof window.sendPaymentInfos === 'function') {
    return Promise.resolve();
  }
  if (!sdkLoadPromise) {
    sdkLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = TOUCHPAY_SDK_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Impossible de charger le SDK de paiement MyTouchPoint."));
      document.head.appendChild(script);
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
    '', '', ''
  );
}
