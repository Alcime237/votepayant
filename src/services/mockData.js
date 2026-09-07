// Données de démonstration — utilisées UNIQUEMENT quand demoMode.js a détecté que le backend
// est injoignable (voir candidateService/campaignService/rankingService). Purement
// illustratif : ces candidats, points et dates n'existent pas côté serveur.
import chantImg from '../Assets/chant.jpg';
import rapImg from '../Assets/rap.jpg';
import danseImg from '../Assets/danse.webp';

// Une photo générique par discipline (même image pour chaque candidat démo de la discipline) :
// on n'a pas de vraies photos individuelles à afficher hors ligne, autant assumer clairement
// un style "placeholder" plutôt que de faire semblant d'avoir des photos uniques par personne.
const DEMO_PHOTOS = { CHANT: chantImg, RAP: rapImg, DANSE: danseImg };

// [nom complet, points] par discipline, du plus soutenu au moins soutenu — sert à la fois à
// peupler les listes de candidats et le classement "Verdict final" de chaque discipline.
const DEMO_ROSTER = {
  CHANT: [
    ['Awa Ndiaye', 380],
    ['Moussa Diallo', 210],
    ['Fatou Sarr', 95],
  ],
  RAP: [
    ['Ibrahima Fall', 340],
    ['Aïssatou Ba', 180],
    ['Cheikh Gueye', 60],
  ],
  DANSE: [
    ['Mariama Diop', 300],
    ['Ousmane Sy', 150],
    ['Bineta Cissé', 40],
  ],
};

// Styles de danse fictifs, uniquement pour varier l'affichage des cartes candidat en DANSE
// (voir DanseDemiFinale.jsx, qui affiche candidate.style quand il est présent).
const DEMO_DANCE_STYLES = ['Sabar', 'Hip-hop', 'Afro'];

// Reproduit le seuil de couleur du backend (RankingEntryResponse.ColorTier), pour que le
// classement global de démonstration (page Vote/hub, non scopé à une discipline) ait des
// couleurs de barre cohérentes avec le reste de l'app plutôt que toutes grises.
function colorTierForPercentage(percentage) {
  if (percentage >= 50) return 'VERT';
  if (percentage >= 10) return 'ORANGE';
  if (percentage >= 1) return 'ROUGE';
  return 'GRIS';
}

function buildCandidates(category) {
  return DEMO_ROSTER[category].map(([fullName], i) => ({
    id: `demo-${category.toLowerCase()}-${i + 1}`,
    fullName,
    nationality: 'Sénégalaise',
    category,
    photoUrl: DEMO_PHOTOS[category],
    style: category === 'DANSE' ? DEMO_DANCE_STYLES[i % DEMO_DANCE_STYLES.length] : null,
  }));
}

// Candidats de démonstration par discipline — consommé par candidateService en repli.
export const MOCK_CANDIDATES = {
  CHANT: buildCandidates('CHANT'),
  RAP: buildCandidates('RAP'),
  DANSE: buildCandidates('DANSE'),
};

// Classement global de démonstration (toutes disciplines confondues, comme le backend réel) —
// RankingChart recalcule lui-même le pourcentage/la couleur quand il est scopé à une seule
// discipline (prop `category`), donc percentage/colorTier ici ne servent qu'à la vue globale.
const allEntries = Object.values(MOCK_CANDIDATES).flat();
const totalDemoPoints = Object.values(DEMO_ROSTER)
  .flat()
  .reduce((sum, [, points]) => sum + points, 0);

export const MOCK_RANKING = allEntries.map((candidate) => {
  const points = DEMO_ROSTER[candidate.category].find(([name]) => name === candidate.fullName)[1];
  const percentage = (points * 100) / totalDemoPoints;
  return {
    candidateId: candidate.id,
    fullName: candidate.fullName,
    category: candidate.category,
    photoUrl: candidate.photoUrl,
    points,
    percentage,
    colorTier: colorTierForPercentage(percentage),
  };
});

// Statut de campagne de démonstration : toujours "active", avec une échéance recalculée à
// chaque appel (5 jours dans le futur) pour que le compte à rebours reste crédible quel que
// soit le moment où la page de démonstration est consultée.
export function buildMockCampaignStatus() {
  const now = new Date();
  return {
    active: true,
    campaignId: 'demo-campaign',
    endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    serverTime: now.toISOString(),
    phase: 'AUDITION',
  };
}

// Résultats finaux de démonstration (page Vote, tableau "Résultats" par catégorie) — même
// forme que CategoryResultResponse/CandidateResultEntry côté backend (voir ResultsQueryService),
// avec un nombre de qualifiés fictif (2) pour illustrer le rendu du badge "Qualifié·e".
const DEMO_QUALIFIERS_PER_CATEGORY = 2;

export const MOCK_RESULTS = ['RAP', 'CHANT', 'DANSE'].map((category) => {
  const roster = DEMO_ROSTER[category];
  const totalPoints = roster.reduce((sum, [, points]) => sum + points, 0);
  const candidates = buildCandidates(category);

  return {
    category,
    qualifiersPerCategory: DEMO_QUALIFIERS_PER_CATEGORY,
    totalPoints,
    results: roster.map(([fullName, points], i) => ({
      candidateId: candidates[i].id,
      fullName,
      photoUrl: candidates[i].photoUrl,
      points,
      percentage: totalPoints === 0 ? 0 : (points * 100) / totalPoints,
      rank: i + 1,
      qualified: i < DEMO_QUALIFIERS_PER_CATEGORY,
    })),
  };
});
