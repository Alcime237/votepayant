import React from 'react';
import './documentPage.scss';

const DocumentPage = () => {
  const pdfUrl = process.env.PUBLIC_URL + '/documents/Apropos.pdf';

  return (
    <div className="document-page">
      <div className="pdf-container">
        <iframe
          src={pdfUrl}
          title="Règlement du Dakar Talent Show"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        >
          <p>Votre navigateur ne supporte pas les PDF.
          <a href={pdfUrl}>Télécharger le document</a></p>
        </iframe>

        <a
          href={pdfUrl}
          download="Reglement_Dakar_Talent_Show.pdf"
          className="download-btn"
        >
          Télécharger
        </a>
      </div>
    </div>
  );
};

export default DocumentPage;