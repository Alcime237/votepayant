import axios from 'axios';

// URL de base de l'API : vient de la variable d'environnement REACT_APP_API_URL (lue au
// build par Create React App), avec un repli sur le backend local par défaut si absente.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Client axios unique partagé par tous les services (candidateService, voteOrderService, ...)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur de réponse : axios remonte un message générique "Network Error" aussi bien
// quand le backend est simplement éteint que quand une requête est bloquée par CORS — ce qui
// rendait le bug du bouton "Voter" très difficile à diagnostiquer (voir section 8.1). On
// enrichit ici chaque erreur avec un champ `friendlyMessage` explicite et actionnable, que les
// écrans peuvent afficher directement au lieu du message technique brut d'axios.
apiClient.interceptors.response.use(
  // Sur une réponse réussie, on ne touche à rien
  (response) => response,
  (error) => {
    if (!error.response) {
      // Aucune réponse HTTP reçue du tout : soit le serveur est injoignable (arrêté, mauvais
      // port), soit la requête a été bloquée par le navigateur avant même d'atteindre le
      // serveur (origine CORS non autorisée) — axios ne permet pas de distinguer les deux cas
      // de façon fiable, donc le message couvre les deux causes les plus probables.
      error.friendlyMessage =
        `Impossible de joindre le serveur (${API_BASE_URL}). Vérifiez que le backend est ` +
        'démarré, ou que son adresse REACT_APP_API_URL correspond bien à celle configurée ' +
        "côté serveur (CORS_ALLOWED_ORIGINS) pour l'origine de cette page.";
    } else if (error.response.status >= 500) {
      // Le serveur a répondu mais a rencontré une erreur interne
      error.friendlyMessage = "Le serveur a rencontré une erreur. Merci de réessayer dans un instant.";
    } else {
      // Erreur HTTP 4xx "normale" (validation, conflit, etc.) : on privilégie le message
      // métier renvoyé par le backend (champ `detail`) quand il existe, sinon le statut brut.
      error.friendlyMessage = error.response.data?.detail || `Erreur (${error.response.status}).`;
    }
    // On relance l'erreur enrichie pour que le code appelant garde le contrôle (try/catch)
    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default apiClient;
