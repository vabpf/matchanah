import React from 'react';

const Hero = () => {
  return (
    <section className="hero-banner">
      <div className="hero-banner-container">
        <div className="hero-image-container">
          <img 
            src="../assets/images/hero-banner-image.jpg" 
            alt="Matcha Đồ Uống Matcha Đóng Chai" 
            className="hero-banner-image"
            loading="lazy"
          />
          <div className="hero-content-overlay">
            <div className="hero-text">
              <h2 className="hero-subtitle"></h2>
              <h1 className="hero-main-title">MATCHANAH DRINKS</h1>
              <p className="hero-description">
                Đồ uống matcha pha sẵn lạnh – sạch, ít đường,<br />
                năng lượng bền vững & hương vị tươi mát tự nhiên.
              </p>
              <a href="#find-your-matcha" className="hero-cta-button">Khám phá hương vị</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
