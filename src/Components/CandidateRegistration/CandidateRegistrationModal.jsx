// Parcours d'inscription candidat en 3 étapes (section 6 du brief), ouvert depuis le bouton
// "Candidat" de la Navbar (qui remplace l'ancien bouton "Ticket"). Chaque étape est une "face
// de carte" qui pivote en 3D (rotateY) pour passer à la suivante — voir candidateRegistrationModal.scss.
import React, { useEffect, useRef, useState } from 'react';
import { IoIosCloseCircle } from 'react-icons/io';
import { LuMic, LuMusic4, LuActivity, LuCheck, LuUpload, LuX, LuLoaderCircle } from 'react-icons/lu';
import { registerCandidate } from '../../services/candidateService';
// Distingue un serveur injoignable (mode démo) d'une vraie erreur d'inscription
import { isUnreachableError } from '../../services/demoMode';
import './candidateRegistrationModal.scss';

// Les 3 disciplines ouvertes à l'inscription publique — Joker exclu (section 6, comme
// côté backend CandidateService.REGISTRABLE_CATEGORIES). Icônes distinctes par discipline
// pour que les 3 boutons soient "désignés distinctement" comme demandé.
const DISCIPLINES = [
  { key: 'RAP', label: 'Rap', icon: LuMic, desc: 'Flow, plume, freestyle' },
  { key: 'CHANT', label: 'Chant', icon: LuMusic4, desc: 'Voix, interprétation' },
  { key: 'DANSE', label: 'Danse', icon: LuActivity, desc: 'Chorégraphie, énergie' },
];

// 3 créneaux photo distincts, un par étape de la compétition (section 6, étape 3) — la clé
// (ex. "audition") correspond exactement aux noms de champs attendus par le backend
// (photoAudition/photoDemiFinale/photoFinale, voir CandidateController.register).
const PHOTO_SLOTS = [
  { key: 'audition', fieldName: 'photoAudition', label: 'Photo — Audition' },
  { key: 'demiFinale', fieldName: 'photoDemiFinale', label: 'Photo — Demi-finale' },
  { key: 'finale', fieldName: 'photoFinale', label: 'Photo — Finale' },
];

// Limites d'upload alignées avec la validation serveur (CandidatePhotoStorage côté backend) :
// les valider aussi côté client évite d'attendre un aller-retour réseau pour un fichier trop
// lourd, et le message reste cohérent des deux côtés.
const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Vérifie un fichier photo et renvoie un message d'erreur clair, ou null si tout va bien.
function validatePhotoFile(file) {
  if (!file) {
    return 'Cette photo est obligatoire.';
  }
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return 'Format non supporté — utilisez une image JPEG, PNG ou WEBP.';
  }
  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    return 'Fichier trop lourd (5 Mo maximum) — choisissez une image plus légère.';
  }
  return null;
}

const CandidateRegistrationModal = ({ onClose }) => {
  // Étape affichée (1, 2 ou 3) et sens de la transition ('forward' au clic Suivant,
  // 'backward' au clic Retour) — le sens détermine quelle animation de flip est jouée.
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('forward');

  // --- Étape 1 : informations personnelles ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nationality, setNationality] = useState('');

  // --- Étape 2 : discipline unique ---
  const [discipline, setDiscipline] = useState(null);

  // --- Étape 3 : 3 photos --- (objets indexés par slot: { audition: File, ... })
  const [photos, setPhotos] = useState({});
  const [photoErrors, setPhotoErrors] = useState({});
  // URLs de prévisualisation générées localement (createObjectURL) — révoquées à leur
  // remplacement et au démontage du composant pour ne pas fuir de mémoire (voir useEffect plus bas).
  const [photoPreviews, setPhotoPreviews] = useState({});
  const previewsRef = useRef(photoPreviews);
  previewsRef.current = photoPreviews;

  // --- Soumission finale ---
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Nettoyage : révoque toutes les URLs de prévisualisation encore actives quand le composant
  // se démonte (fermeture de la modale), pour libérer la mémoire du navigateur.
  useEffect(() => {
    return () => {
      Object.values(previewsRef.current).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Validité de chaque étape — pilote l'activation du bouton "Suivant"/"Envoyer"
  const isStep1Valid = firstName.trim().length >= 2 && lastName.trim().length >= 2 && nationality.trim().length >= 2;
  const isStep2Valid = discipline !== null;
  const isStep3Valid = PHOTO_SLOTS.every((slot) => photos[slot.key] && !photoErrors[slot.key]);

  const goNext = () => {
    setDirection('forward');
    setStep((s) => Math.min(3, s + 1));
  };

  const goBack = () => {
    setDirection('backward');
    setStep((s) => Math.max(1, s - 1));
  };

  // Appelé au choix d'un fichier pour un des 3 créneaux photo : valide, remplace l'ancienne
  // prévisualisation par la nouvelle (en révoquant l'ancienne URL), et mémorise l'erreur
  // éventuelle sans jamais garder un fichier invalide dans `photos`.
  const handlePhotoChange = (slotKey, file) => {
    const error = validatePhotoFile(file);

    setPhotoPreviews((prev) => {
      if (prev[slotKey]) {
        URL.revokeObjectURL(prev[slotKey]);
      }
      const next = { ...prev };
      if (error) {
        delete next[slotKey];
      } else {
        next[slotKey] = URL.createObjectURL(file);
      }
      return next;
    });

    setPhotos((prev) => {
      const next = { ...prev };
      if (error) {
        delete next[slotKey];
      } else {
        next[slotKey] = file;
      }
      return next;
    });

    setPhotoErrors((prev) => ({ ...prev, [slotKey]: error }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      // multipart/form-data : seul format capable de transporter à la fois du texte et 3
      // fichiers dans une seule requête (voir candidateService.registerCandidate).
      const formData = new FormData();
      formData.append('firstName', firstName.trim());
      formData.append('lastName', lastName.trim());
      formData.append('nationality', nationality.trim());
      formData.append('category', discipline);
      PHOTO_SLOTS.forEach((slot) => formData.append(slot.fieldName, photos[slot.key]));

      await registerCandidate(formData);
      setSubmitSuccess(true);
    } catch (err) {
      if (isUnreachableError(err)) {
        // Serveur injoignable (ex. aperçu de démonstration sans backend relié) : message
        // honnête plutôt qu'une erreur technique — l'inscription n'a pas pu être enregistrée.
        setSubmitError("Mode démonstration : cette page n'est pas reliée à un serveur pour l'instant, l'inscription n'a pas pu être enregistrée.");
      } else {
        // friendlyMessage vient de l'intercepteur axios (apiClient.js) ; à défaut, le message
        // métier renvoyé par le backend (ex. "La discipline doit être Chant, Rap ou Danse.")
        setSubmitError(err.friendlyMessage || err.response?.data?.detail || err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="candidateModal__overlay" onClick={() => !submitting && onClose()}>
      <div className="candidateModal__content" onClick={(e) => e.stopPropagation()}>
        <IoIosCloseCircle
          className="candidateModal__closeIcon"
          onClick={() => !submitting && onClose()}
        />

        {submitSuccess ? (
          // État final : confirmation d'inscription, remplace tout le parcours en 3 étapes
          <div className="candidateModal__success">
            <LuCheck className="candidateModal__successIcon" />
            <h2>Inscription envoyée !</h2>
            <p>
              {firstName} {lastName} est inscrit·e en <strong>{DISCIPLINES.find((d) => d.key === discipline)?.label}</strong>.
              Le candidat apparaîtra dans la liste de vote de sa discipline.
            </p>
            <button className="candidateModal__submitBtn" onClick={onClose}>
              Fermer
            </button>
          </div>
        ) : (
          <>
            <h2 className="candidateModal__title">Inscription candidat</h2>

            {/* Indicateur de progression 1/3 → 2/3 → 3/3 */}
            <div className="candidateModal__progress">
              {[1, 2, 3].map((n) => (
                <span key={n} className={`candidateModal__progressDot ${n <= step ? 'is-active' : ''}`} />
              ))}
            </div>

            {/* Conteneur en perspective 3D : chaque étape est une "face" qui pivote pour
                s'installer (voir .candidateModal__face--forward/--backward dans le .scss) */}
            <div className="candidateModal__stage">
              <div key={step} className={`candidateModal__face candidateModal__face--${direction}`}>
                {step === 1 && (
                  <div className="candidateModal__step">
                    <h3>Étape 1 — Informations personnelles</h3>
                    <div className="candidateModal__field">
                      <label htmlFor="cand-firstName">Prénom</label>
                      <input
                        id="cand-firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Awa"
                      />
                    </div>
                    <div className="candidateModal__field">
                      <label htmlFor="cand-lastName">Nom</label>
                      <input
                        id="cand-lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Diop"
                      />
                    </div>
                    <div className="candidateModal__field">
                      <label htmlFor="cand-nationality">Nationalité</label>
                      <input
                        id="cand-nationality"
                        type="text"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        placeholder="Sénégalaise"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="candidateModal__step">
                    <h3>Étape 2 — Discipline</h3>
                    <p className="candidateModal__stepHint">Choisissez une seule discipline.</p>
                    <div className="candidateModal__disciplines">
                      {DISCIPLINES.map(({ key, label, desc, icon: Icon }) => (
                        <button
                          key={key}
                          type="button"
                          className={`candidateModal__disciplineBtn ${discipline === key ? 'is-selected' : ''}`}
                          onClick={() => setDiscipline(key)}
                        >
                          <Icon className="candidateModal__disciplineIcon" />
                          <span className="candidateModal__disciplineLabel">{label}</span>
                          <span className="candidateModal__disciplineDesc">{desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="candidateModal__step">
                    <h3>Étape 3 — Photos</h3>
                    <p className="candidateModal__stepHint">
                      Une photo par étape de la compétition. Formats acceptés : JPEG, PNG, WEBP —
                      5 Mo maximum par image. Merci de fournir des photos de bonne qualité,
                      nettes et pas trop lourdes.
                    </p>
                    <div className="candidateModal__photos">
                      {PHOTO_SLOTS.map((slot) => (
                        <label key={slot.key} className="candidateModal__photoSlot">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => handlePhotoChange(slot.key, e.target.files?.[0])}
                            hidden
                          />
                          <div className={`candidateModal__photoBox ${photoErrors[slot.key] ? 'has-error' : ''}`}>
                            {photoPreviews[slot.key] ? (
                              <img src={photoPreviews[slot.key]} alt={slot.label} />
                            ) : (
                              <LuUpload className="candidateModal__photoUploadIcon" />
                            )}
                          </div>
                          <span className="candidateModal__photoLabel">{slot.label}</span>
                          {photoErrors[slot.key] && (
                            <span className="candidateModal__photoError">
                              <LuX /> {photoErrors[slot.key]}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {submitError && <p className="candidateModal__submitError">{submitError}</p>}

            <div className="candidateModal__actions">
              {step > 1 && (
                <button type="button" className="candidateModal__backBtn" onClick={goBack} disabled={submitting}>
                  Retour
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  className="candidateModal__nextBtn"
                  onClick={goNext}
                  disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="button"
                  className="candidateModal__nextBtn"
                  onClick={handleSubmit}
                  disabled={!isStep3Valid || submitting}
                >
                  {submitting ? (
                    <>
                      <LuLoaderCircle className="candidateModal__spinnerIcon" /> Envoi...
                    </>
                  ) : (
                    "Envoyer l'inscription"
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CandidateRegistrationModal;
