// Mode démonstration : s'active tout seul dès qu'un premier appel API échoue parce que le
// serveur est injoignable (ex. ce frontend déployé sur Vercel sans backend public relié pour
// l'instant). Une fois détecté, les autres services évitent de retenter des appels voués à
// l'échec (ex. SSE du classement) et affichent directement des données de démonstration —
// voir mockData.js et les services candidateService/campaignService/rankingService.
//
// Variable de module (pas de contexte React) : c'est un simple drapeau partagé entre
// plusieurs services indépendants, pas un état d'affichage — le composant n'a jamais besoin
// de le lire directement, seulement les services eux-mêmes.
let demoModeActive = false;

export function isDemoMode() {
  return demoModeActive;
}

export function markDemoMode() {
  demoModeActive = true;
}

/**
 * Distingue une vraie panne réseau (serveur injoignable / CORS, error.response absent) d'une
 * erreur métier renvoyée PAR le serveur (ex. 400/404/409 — celle-ci prouve au contraire que le
 * serveur est bien joignable, donc ne doit jamais déclencher le mode démo).
 */
export function isUnreachableError(error) {
  return !error?.response;
}
