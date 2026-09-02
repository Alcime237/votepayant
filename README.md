# votepayant — Dakar Talent Show

Front-end de vote payant. Le design est conservé tel quel ; seule la couche d'accès aux
données a été reconstruite (Phase 3) pour parler au backend `../backend`.

## Configuration

```bash
cp .env.example .env   # REACT_APP_API_URL (par défaut http://localhost:8080)
npm install
npm start
```

## Où se trouve quoi

- `src/services/` : toute la couche API, centralisée (plus aucun `fetch`/`axios` en dur vers
  `localhost:8080` dans les composants) — `apiClient`, `candidateService`, `campaignService`,
  `voteOrderService`, `touchpayWidget`, `rankingService`.
- `src/Components/RankingChart/` : graphique de classement en direct (Phase 5), abonné au
  flux SSE du backend.

## État du paiement (dépend de la Phase 2 backend)

Le flux réel est câblé : création de commande → ouverture du widget MyTouchPoint
(`touchpayWidget.js`, reproduit tel quel depuis l'exemple `SATURN FITNESS...htm` fourni) →
polling du statut. **Tant que le webhook MyTouchPoint n'est pas implémenté côté backend
(Phase 2, en attente de la documentation technique), le statut reste PENDING indéfiniment** —
le polling se termine par un timeout attendu, pas une confirmation de paiement. Voir
`../backend/README.md` et `../DEMANDE-MYTOUCHPOINT.md`.

## Gaps connus hors périmètre des phases validées

- La page `/partenaires` appelle un endpoint `/partenaire` que le nouveau backend n'expose pas
  encore (jamais construit dans les phases 1-7) — elle affichera une liste vide tant que ce
  module n'est pas ajouté.
- Le champ `style` affiché sur les cartes de danse (ancien modèle) n'a pas d'équivalent dans
  l'entité `Candidate` actuelle (attributs génériques uniquement) — retiré de l'affichage.

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
