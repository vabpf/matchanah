import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import { useCart } from '../context/CartContext';
import matchanhaLogo from '../assets/images/matchanah-logo.svg';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getCartItemCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const cartItemCount = getCartItemCount();

  return (
    <header className={`floating-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Mobile Menu Button - Left */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Logo Section - Center on mobile, Left on desktop */}
        <div className="logo-section">
          <Link to="/" className="logo-link">
            <img 
              src={matchanhaLogo} 
              alt="Matchanah" 
              className="logo"
            />
            <span className="brand-name">Matchanah</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="desktop-navigation">
          <Navigation />
        </div>

        {/* Mobile Cart Button - Right */}
        <Link to="/cart" className="mobile-cart-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16 5 16H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13M9 13V17M11 13V17M13 13V17M15 13V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {cartItemCount > 0 && (
            <span className="cart-badge">{cartItemCount}</span>
          )}
        </Link>
      </div>

      {/* Mobile Navigation Overlay */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
        <nav className="navigation mobile-nav" onClick={(e) => e.stopPropagation()}>
          {/* Close button inside mobile menu */}
          <button 
            className="mobile-menu-close"
            onClick={toggleMobileMenu}
            aria-label="Close navigation menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <ul className="nav-list">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                onClick={toggleMobileMenu}
              >
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/products" 
                className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
                onClick={toggleMobileMenu}
              >
                Sản phẩm
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/about" 
                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                onClick={toggleMobileMenu}
              >
                Giới thiệu
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/faq" 
                className={`nav-link ${location.pathname === '/faq' ? 'active' : ''}`}
                onClick={toggleMobileMenu}
              >
                FAQ
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/contact" 
                className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
                onClick={toggleMobileMenu}
              >
                Liên hệ
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/cart" 
                className={`nav-link ${location.pathname === '/cart' ? 'active' : ''}`}
                onClick={toggleMobileMenu}
              >
                Giỏ hàng ({cartItemCount})
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
