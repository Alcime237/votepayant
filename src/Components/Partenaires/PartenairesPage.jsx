import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PartenairesPage.css'; // Nous créerons ce fichier CSS

const API_BASE_URL = "http://localhost:8080";

const PartenairesPage = () => {
  const [partenaires, setPartenaires] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartenaires = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/partenaire`);
        setPartenaires(response.data);
      } catch (error) {
        console.error("Error fetching partenaires:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartenaires();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Chargement...</div>;
  }

  return (
    <div className="partenaires-container">
      <h1 className="partenaires-title">Nos Partenaires</h1>
      <div className="partenaires-grid">
        {partenaires.map(partenaire => (
          <div key={partenaire.id} className="partenaire-card">
            <img
              src={`${API_BASE_URL}/partenaire/photo/${partenaire.id}`}
              alt={partenaire.nomPartenaire}
              className="partenaire-image"
            />
            <h3 className="partenaire-name">{partenaire.nomPartenaire}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartenairesPage;