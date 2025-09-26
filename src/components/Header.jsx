import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import matchanhaLogo from '../assets/images/matchanah-logo.svg';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { getCartItemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close user menu when clicking outside
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
    };

    if (isUserMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success || result === undefined) {
      navigate('/');
      setIsUserMenuOpen(false);
    }
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

        {/* Desktop User & Cart Actions */}
        <div className="header-actions">
          {/* User Menu */}
          {isAuthenticated ? (
            <div className="user-menu-container">
              <button 
                className="user-menu-trigger"
                onClick={toggleUserMenu}
                aria-label="User menu"
              >
                <div className="user-avatar">
                  {user?.displayName 
                    ? user.displayName.charAt(0).toUpperCase() 
                    : user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-name desktop-only">
                  {user?.displayName || user?.email?.split('@')[0]}
                </span>
                <svg 
                  className={`dropdown-arrow ${isUserMenuOpen ? 'open' : ''}`}
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-avatar-large">
                      {user?.displayName 
                        ? user.displayName.charAt(0).toUpperCase() 
                        : user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="user-details">
                      <div className="user-name-full">
                        {user?.displayName || 'Người dùng'}
                      </div>
                      <div className="user-email">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <Link 
                    to="/account" 
                    className="dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21V19C20 17.9 19.1 17 18 17H6C4.9 17 4 17.9 4 19V21M16 7C16 9.2 14.2 11 12 11C9.8 11 8 9.2 8 7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Tài khoản của tôi
                  </Link>
                  
                  <Link 
                    to="/orders" 
                    className="dropdown-item"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 11H15M9 15H15M17 3H7C5.9 3 5 3.9 5 5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V5C19 3.9 18.1 3 17 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Đơn hàng
                  </Link>
                  
                  {user?.isAdmin && (
                    <Link 
                      to="/admin" 
                      className="dropdown-item admin-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Quản trị Admin
                    </Link>
                  )}
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 21H5C4.4 21 4 20.6 4 20V4C4 3.4 4.4 3 5 3H9M16 17L21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons desktop-only">
              <Link to="/login" className="login-button">
                Đăng nhập
              </Link>
              <Link to="/register" className="register-button">
                Đăng ký
              </Link>
            </div>
          )}

          {/* Desktop Cart Button */}
          <Link to="/cart" className="desktop-cart-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16 5 16H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13M9 13V17M11 13V17M13 13V17M15 13V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>
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
          
          {/* User section for mobile */}
          {isAuthenticated && (
            <div className="mobile-user-section">
              <div className="mobile-user-info">
                <div className="user-avatar">
                  {user?.displayName 
                    ? user.displayName.charAt(0).toUpperCase() 
                    : user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="user-details">
                  <div className="user-name">{user?.displayName || 'Người dùng'}</div>
                  <div className="user-email">{user?.email}</div>
                </div>
              </div>
            </div>
          )}
          
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
            
            {/* Mobile auth section */}
            {isAuthenticated ? (
              <>
                <li className="nav-divider"></li>
                <li className="nav-item">
                  <Link 
                    to="/account" 
                    className={`nav-link ${location.pathname === '/account' ? 'active' : ''}`}
                    onClick={toggleMobileMenu}
                  >
                    Tài khoản của tôi
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/orders" 
                    className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}
                    onClick={toggleMobileMenu}
                  >
                    Đơn hàng
                  </Link>
                </li>
                {user?.isAdmin && (
                  <li className="nav-item">
                    <Link 
                      to="/admin" 
                      className={`nav-link admin-nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                      onClick={toggleMobileMenu}
                    >
                      Quản trị Admin
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <button 
                    className="nav-link logout-button"
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu();
                    }}
                  >
                    Đăng xuất
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-divider"></li>
                <li className="nav-item">
                  <Link 
                    to="/login" 
                    className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                    onClick={toggleMobileMenu}
                  >
                    Đăng nhập
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/register" 
                    className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
                    onClick={toggleMobileMenu}
                  >
                    Đăng ký
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;