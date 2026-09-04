import apiClient from './apiClient';
import { isDemoMode, isUnreachableError, markDemoMode } from './demoMode';
import { MOCK_CANDIDATES } from './mockData';

export async function getCandidatesByCategory(category) {
  // Backend déjà détecté injoignable (voir demoMode.js) : inutile de retenter un appel voué
  // à échouer, on part directement sur les données de démonstration de cette discipline.
  if (isDemoMode()) {
    return MOCK_CANDIDATES[category] || [];
  }

  try {
    const { data } = await apiClient.get('/api/candidates', { params: { category } });
    return data;
  } catch (error) {
    if (isUnreachableError(error)) {
      // Serveur injoignable (ex. aperçu Vercel sans backend relié) : on bascule en mode
      // démo pour cette discipline plutôt que de laisser la page vide/en erreur.
      markDemoMode();
      return MOCK_CANDIDATES[category] || [];
    }
    // Erreur métier (400/404/...) : le serveur est bien là, on la laisse remonter normalement.
    throw error;
  }
}

export async function getCandidateById(id) {
  if (isDemoMode()) {
    return Object.values(MOCK_CANDIDATES).flat().find((c) => c.id === id) || null;
  }

  try {
    const { data } = await apiClient.get(`/api/candidates/${id}`);
    return data;
  } catch (error) {
    if (isUnreachableError(error)) {
      markDemoMode();
      return Object.values(MOCK_CANDIDATES).flat().find((c) => c.id === id) || null;
    }
    throw error;
  }
}

// Inscription d'un candidat (section 6) : `formData` est un objet FormData (pas du JSON) car
// la requête transporte 3 fichiers image en plus des champs texte.
export async function registerCandidate(formData) {
  const { data } = await apiClient.post('/api/candidates/register', formData, {
    // Content-Type: undefined efface le défaut "application/json" de apiClient pour CET appel
    // précis — indispensable pour que le navigateur calcule lui-même l'en-tête multipart
    // correct (avec sa "boundary" aléatoire). Le fixer nous-mêmes à la main casserait l'upload
    // car il manquerait cette boundary que seul le navigateur sait générer.
    headers: { 'Content-Type': undefined },
  });
  return data;
}
