// Mode démonstration : s'active tout seul dès qu'un premier appel API échoue parce que le
// serveur est injoignable (ex. ce frontend déployé sur Vercel sans backend public relié pour
// l'instant). Tant qu'il est actif, les autres services évitent de retenter des appels voués à
// l'échec (ex. SSE du classement) et affichent des données de démonstration — voir mockData.js
// et les services candidateService/campaignService/rankingService.
//
// Variable de module (pas de contexte React) : c'est un simple drapeau partagé entre
// plusieurs services indépendants. Les composants qui doivent l'AFFICHER (bandeau "Mode
// démonstration") s'y abonnent via subscribeDemoMode / le hook useDemoMode.
//
// Le mode n'est jamais définitif : au bout de RETRY_DELAY_MS les services retentent le vrai
// serveur, et le premier appel réussi le désactive (clearDemoMode, appelé par apiClient). Sans
// cela, une simple coupure passagère laissait toute la session sur de fausses données.
const RETRY_DELAY_MS = 30000;

let demoModeActive = false;
let demoModeSince = 0;
const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener());
}

/** true si les services doivent répondre avec les données de démonstration (sans appeler l'API). */
export function isDemoMode() {
  return demoModeActive && Date.now() - demoModeSince < RETRY_DELAY_MS;
}

/** true tant que le dernier état connu du serveur est "injoignable" (pilote le bandeau d'avertissement). */
export function isDemoBannerVisible() {
  return demoModeActive;
}

export function markDemoMode() {
  const wasActive = demoModeActive;
  demoModeActive = true;
  demoModeSince = Date.now();
  if (!wasActive) notify();
}

/** Appelé à chaque réponse réussie du serveur : le backend est de nouveau joignable. */
export function clearDemoMode() {
  if (!demoModeActive) return;
  demoModeActive = false;
  notify();
}

export function subscribeDemoMode(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Distingue une vraie panne réseau (serveur injoignable / CORS, error.response absent) d'une
 * erreur métier renvoyée PAR le serveur (ex. 400/404/409 — celle-ci prouve au contraire que le
 * serveur est bien joignable, donc ne doit jamais déclencher le mode démo).
 */
export function isUnreachableError(error) {
  // Un délai dépassé (ECONNABORTED) n'est pas une panne : le serveur est peut-être juste lent,
  // ce n'est pas une raison de basculer sur de fausses données.
  return !error?.response && error?.code !== 'ECONNABORTED';
}
