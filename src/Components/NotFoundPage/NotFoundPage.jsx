import React from 'react';
import { Link } from 'react-router-dom';
import './notFoundPage.scss';

// Page affichée pour toute adresse inconnue : sans elle, l'application affichait une page vide
// entre la barre de navigation et le pied de page.
const NotFoundPage = () => (
  <section className="notFound container">
    <span className="eyebrow">Erreur 404</span>
    <h1>Cette page n'existe pas</h1>
    <p>L'adresse demandée est introuvable ou a été déplacée.</p>
    <div className="notFound__actions">
      <Link className="btn" to="/">Retour à l'accueil</Link>
      <Link className="btnGhost" to="/vote">Voter maintenant</Link>
    </div>
  </section>
);

export default NotFoundPage;
