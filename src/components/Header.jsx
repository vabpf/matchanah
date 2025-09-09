import React from 'react';
import Navigation from './Navigation';
import matchanhaLogo from '../assets/images/matchanah-logo.svg';

const Header = () => {
  return (
    <header className="floating-header">
      <div className="header-container">
        <div className="logo-section">
          <img 
            src={matchanhaLogo} 
            alt="Matchanah" 
            className="logo"
          />
          <span className="brand-name">Matchanah</span>
        </div>
        <Navigation />
      </div>
    </header>
  );
};

export default Header;
