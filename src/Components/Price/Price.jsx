import React from "react";
import './price.scss'
import dividerImage from '../../Assets/recompense.jpg';

const Price = () => {
  return (
    <section className="image-divider-section" data-aos="fade-up">
      <img
        src={dividerImage}
        alt="Transition décorative"
        className="divider-image"
        loading="lazy"
      />
    </section>
  );
};

export default Price;