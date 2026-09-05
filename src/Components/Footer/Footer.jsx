import React, {useEffect}  from 'react';
import { FaPhone, FaEnvelope, FaFacebookF, FaWhatsapp, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import './footer.scss';

import Aos from 'aos'
import 'aos/dist/aos.css'

const Footer = () => {

    useEffect(()=>{
            Aos.init({duration: 2000})
        }, [])

  return (
    <footer className="footer">
      <div className="footer-container">
        <div data-aos="fade-up" data-aos-duration="3000" className="footer-section contact-info">
          <h3>Contactez-nous</h3>
          {/* Numéro officiel unique (+221 33 860 13 62), utilisé à la fois pour l'appel
              direct et WhatsApp (confirmé joignable sur les deux canaux). */}
          <div className="contact-item">
            <a href="tel:+221338601362" className="social-link">
              <FaPhone className="contact-icon" />
              <span>+221 33 860 13 62</span>
            </a>
          </div>
          <div className="contact-item">
            <a href="https://wa.me/221338601362" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
              <FaWhatsapp className="social-icon whatsapp" />
              <span>WhatsApp</span>
            </a>
          </div>
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <a href="mailto:senegaltalentshow@gmail.com" className="social-link email">
              senegaltalentshow@gmail.com
            </a>
          </div>

        </div>

        <div data-aos="fade-up" data-aos-duration="3000" className="footer-section social">
          <h3>Suivez-nous</h3>
          <div className="social-links">
            <a href="https://www.facebook.com/share/18BSdqfQ5y/" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaFacebookF className="social-icon" />
              <span>Facebook</span>
            </a>

            <a href="https://www.instagram.com/senegal_talent_show?igsh=cXoyemhtYjlhdml2" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaInstagram className="social-icon" />
              <span>Instagram</span>
            </a>
            <a href="https://www.tiktok.com/@senegal_talent_show221?_r=1&_t=ZS-98dF6ukv2Wq" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaTiktok className="social-icon" />
              <span>TikTok</span>
            </a>
            <a href="https://www.youtube.com/@SenegalTalentShow" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaYoutube className="social-icon" />
              <span>YouTube</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        {/* "Dakar Talent Show" → "Sénégal Talent Show" dans le copyright du footer (global, sur toutes les pages) */}
        <p>&copy; {new Date().getFullYear()} Sénégal Talent Show. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;