# votepayant — Sénégal Talent Show

Frontend React (Create React App) de l'application de vote payant du **Sénégal Talent Show** :
pages publiques, vote par discipline (Chant, Rap, Danse), classement en direct, résultats par
catégorie et inscription des candidats. Il parle à l'API Spring Boot du dossier `backend/` du
dépôt complet (`SenegalTalentshow`).

## Démarrage

```bash
cp .env.example .env   # REACT_APP_API_URL (par défaut http://localhost:8080)
npm install
npm start              # http://localhost:3000
```

L'origine du frontend (`http://localhost:3000` en local) doit figurer dans `CORS_ALLOWED_ORIGINS`
côté backend.

| Commande | Rôle |
|---|---|
| `npm start` | serveur de développement |
| `npm test` | tests (Jest + Testing Library) — `CI=true npx react-scripts test --watchAll=false` pour un run unique |
| `npm run build` | build de production dans `build/` |

## Organisation du code

- `src/services/` — **toute** la couche API : `apiClient` (axios unique, timeout, messages d'erreur
  lisibles), `candidateService`, `campaignService`, `voteOrderService`, `rankingService` (SSE),
  `resultsService`, `partnerService`, `touchpayWidget`.
- `src/hooks/` — `useCampaignStatus` (statut du vote + compte à rebours calé sur l'horloge du
  serveur), `useVotePayment` (parcours de paiement : création de commande → widget → suivi du
  statut), `useDemoMode`.
- `src/Components/DisciplineVotePage/` — page de vote d'une discipline. `ChantDemiFinale`,
  `RapDemiFinale` et `DanseDemiFinale` n'en sont que de fines configurations (titre, écran de
  chargement, variante d'affichage).
- `src/Components/VoteModal/` — fenêtre de vote en 2 étapes (quantité → paiement), partagée.
- `src/Components/RankingChart/`, `FinalResultsBoard/` — classement en direct (SSE) et résultats
  définitifs par catégorie.
- `src/constants/voteRules.js` — règle de vote affichée : **200 FCFA = 5 points**. Le montant et
  les points réellement appliqués sont toujours recalculés côté serveur.
- Les rubriques « Joker » (`Joker*`) sont désactivées : leurs routes sont commentées dans
  `AppPublic.js`.

## Comportements à connaître

- **Mode démonstration** : si le serveur est injoignable, l'app affiche des candidats et des points
  fictifs (`services/mockData.js`) avec un bandeau d'avertissement visible ; elle retente le
  serveur toutes les 30 s et repasse en mode réel dès qu'il répond.
- **Paiement** : seul le webhook serveur-à-serveur du backend confirme un vote. Le front crée la
  commande, ouvre le widget MyTouchPoint (`touchpayWidget.js`) puis interroge le statut de la
  commande. L'intégration de bout en bout dépend de la documentation technique MyTouchPoint
  (voir `DEMANDE-MYTOUCHPOINT.md` à la racine du dépôt complet).
- Le numéro de téléphone accepte les formats usuels (`77 123 45 67`, `+221 77…`) et est normalisé
  en 9 chiffres avant envoi.
