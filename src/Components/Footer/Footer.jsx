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
          <div className="contact-item">
            <a href="https://wa.me/221785386225" className="social-link whatsapp">
              <FaPhone className="contact-icon" />
              <FaWhatsapp className="social-icon whatsapp" />
              <span>+221 78 538 62 25</span>
            </a>
          </div>
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <a href="mailto:dakartalentshow@gmail.com" className="social-link email">
              dakartalentshow@gmail.com
            </a>
          </div>

        </div>

        <div data-aos="fade-up" data-aos-duration="3000" className="footer-section social">
          <h3>Suivez-nous</h3>
          <div className="social-links">
            <a href="https://www.facebook.com/share/16d5VhcsCg/" className="social-link">
              <FaFacebookF className="social-icon" />
              <span>Facebook</span>
            </a>

            <a href="https://www.instagram.com/dakar_talent_show/" className="social-link">
              <FaInstagram className="social-icon" />
              <span>Instagram</span>
            </a>
            <a href="https://www.tiktok.com/@dakar_talent_show221?is_from_webapp=1&sender_device=pc" className="social-link">
              <FaTiktok className="social-icon" />
              <span>TikTok</span>
            </a>
            <a href="https://youtube.com/@dakartalentshow?si=kb4IcI94K8TKmety" className="social-link">
              <FaYoutube className="social-icon" />
              <span>YouTube</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Dakar Talent Show. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;