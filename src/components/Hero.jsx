import React from 'react';
import heroImage from '../assets/images/hero.jpg';

const Hero = () => {
  return (
    <section className="hero-banner">
      <div className="hero-banner-container">
        <div className="hero-image-container">
          <img 
            src={heroImage} 
            alt="Matcha Đồ Uống Matcha Đóng Chai" 
            className="hero-banner-image"
            loading="lazy"
          />
          <div className="hero-gradient-overlay" />
          <div className="hero-black-overlay" />
          <div className="hero-text-container">
            <div className="hero-text">
              <h1 className="hero-main-title">
                Tạo nên hương <br />
                vị matcha của <br />
                riêng bạn
              </h1>
              <p className="hero-description">
                Matchanah cung cấp cho bạn giải pháp tuyệt vời thay thế cafein
              </p>
              <div className="hero-cta-buttons">
                <a href="#products" className="hero-cta-button">Mua ngay</a>
                <a href="#how-it-works" className="hero-cta-link">
                  <div className="span">Tìm hiểu thêm</div>
                  
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
