import React, { useEffect } from 'react';
import './contactPage.scss';
import Aos from 'aos';
import 'aos/dist/aos.css';
import HeroSlider from '../HeroSlider/HeroSlider';
import AfricaSenegalMap from './AfricaSenegalMap';
import { FaPhone, FaEnvelope, FaFacebookF, FaWhatsapp, FaInstagram, FaTiktok, FaYoutube, FaMapMarkerAlt } from 'react-icons/fa';
import heroImg from '../../Assets/homeSlideFinale.jpg';

const SLIDES = [
  {
    image: heroImg,
    eyebrow: 'Contact',
    // Rebranding demandé : "Dakar Talent Show" devient "Sénégal Talent Show" partout dans l'app
    title: 'Parlons du Sénégal Talent Show',
    subtitle: "Une question sur le vote, un partenariat, la presse ? Notre équipe vous répond.",
  },
];

const ContactPage = () => {
  useEffect(() => {
    Aos.init({ duration: 900 });
  }, []);

  return (
    <div className="contact-page">
      <HeroSlider slides={SLIDES} height="52vh" />

      <div className="container contact-body">
        <div className="contact-grid">
          <div className="contact-card" data-aos="fade-up">
            <FaPhone className="contact-card__icon" />
            <h3>Téléphone</h3>
            <p className="justify">Disponible du lundi au samedi, pour toute question sur la compétition ou le vote.</p>
            <a href="tel:+221338601362" className="contact-card__value">+221 33 860 13 62</a>
          </div>

          {/* Même numéro officiel que la carte "Téléphone" ci-dessus, confirmé joignable
              sur WhatsApp — pas de numéro WhatsApp distinct pour l'instant. */}
          <div className="contact-card" data-aos="fade-up" data-aos-delay="100">
            <FaWhatsapp className="contact-card__icon whatsapp" />
            <h3>WhatsApp</h3>
            <p className="justify">Le canal le plus rapide pour joindre l'organisation en direct.</p>
            <a href="https://wa.me/221338601362" target="_blank" rel="noopener noreferrer" className="contact-card__value">Écrire sur WhatsApp</a>
          </div>

          <div className="contact-card" data-aos="fade-up" data-aos-delay="200">
            <FaEnvelope className="contact-card__icon" />
            <h3>Email</h3>
            <p className="justify">Presse, partenariats, candidatures : écrivez-nous, nous revenons vers vous rapidement.</p>
            <a href="mailto:senegaltalentshow@gmail.com" className="contact-card__value">senegaltalentshow@gmail.com</a>
          </div>
        </div>

        <div className="social-strip" data-aos="fade-up">
          <span className="social-strip__label">Suivez l'émission</span>
          <div className="social-strip__links">
            <a href="https://www.facebook.com/share/18BSdqfQ5y/" target="_blank" rel="noopener noreferrer"><FaFacebookF /> Facebook</a>
            <a href="https://www.instagram.com/senegal_talent_show?igsh=cXoyemhtYjlhdml2" target="_blank" rel="noopener noreferrer"><FaInstagram /> Instagram</a>
            <a href="https://www.tiktok.com/@senegal_talent_show221?_r=1&_t=ZS-98dF6ukv2Wq" target="_blank" rel="noopener noreferrer"><FaTiktok /> TikTok</a>
            <a href="https://www.youtube.com/@SenegalTalentShow" target="_blank" rel="noopener noreferrer"><FaYoutube /> YouTube</a>
          </div>
        </div>

        <section className="africaMap" data-aos="fade-up">
          <div className="africaMap__text">
            <span className="eyebrow">Où se déroule l'événement</span>
            {/* Ancien texte : "Depuis Dakar, pour tout le Sénégal" — remplacé pour ne plus
                citer Dakar comme ville d'origine, l'émission est repositionnée à l'échelle
                nationale du Sénégal (consigne : remplacer chaque occurrence de "Dakar"). */}
            <h2>Un événement national, ouvert à tout le Sénégal</h2>
            <p className="justify">
              {/* "capitale du Sénégal" supprimé : n'a plus de sens une fois "Dakar" retiré du texte */}
              Le Sénégal Talent Show est produit et diffusé au Sénégal, en Afrique de
              l'Ouest. Auditions, demi-finales et grande finale se déroulent sur place, avec un vote du
              public ouvert en ligne à tous, où que vous soyez.
            </p>
            <div className="africaMap__badge">
              {/* Badge de localisation : "Dakar, Sénégal" devient simplement "Sénégal" */}
              <FaMapMarkerAlt /> Sénégal
            </div>
          </div>

          <div className="africaMap__figure">
            <AfricaSenegalMap />
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
