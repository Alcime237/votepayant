import React, { useState, useEffect } from 'react';
import './PartenairesPage.css';
import { getPartners } from '../../services/partnerService';

const PartenairesPage = () => {
  const [partenaires, setPartenaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartenaires = async () => {
      try {
        const data = await getPartners();
        setPartenaires(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPartenaires();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="partenaires-container">
        <p>Erreur: {error}</p>
      </div>
    );
  }

  const renderCard = (partenaire) => (
    <div key={partenaire.id} className="partenaire-card">
      {partenaire.logoUrl && (
        <img
          src={partenaire.logoUrl}
          alt={partenaire.name}
          className="partenaire-image"
        />
      )}
      <h3 className="partenaire-name">{partenaire.name}</h3>
    </div>
  );

  return (
    <div className="partenaires-container">
      <h1 className="partenaires-title">Nos Partenaires</h1>
      <p className="partenaires-subtitle">
        Ils rendent possible le Dakar Talent Show et accompagnent les talents jusqu'à la grande finale.
      </p>
      {partenaires.length === 0 ? (
        <p className="partenaires-empty">Aucun partenaire à afficher pour le moment.</p>
      ) : (
        <div className="partenaires-grid">
          {partenaires.map((partenaire) =>
            partenaire.websiteUrl ? (
              <a
                key={partenaire.id}
                href={partenaire.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="partenaire-card-link"
              >
                {renderCard(partenaire)}
              </a>
            ) : (
              renderCard(partenaire)
            )
          )}
        </div>
      )}
    </div>
  );
};

export default PartenairesPage;
