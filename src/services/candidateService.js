import apiClient from './apiClient';

export async function getCandidatesByCategory(category) {
  const { data } = await apiClient.get('/api/candidates', { params: { category } });
  return data;
}

export async function getCandidateById(id) {
  const { data } = await apiClient.get(`/api/candidates/${id}`);
  return data;
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
