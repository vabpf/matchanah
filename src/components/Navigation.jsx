import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navigation = () => {
  const location = useLocation();
  const { getCartItemCount } = useCart();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const cartItemCount = getCartItemCount();

  return (
    <nav className="navigation desktop-nav">
      <ul className="nav-list">
        <li className="nav-item">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Trang chủ
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/products" 
            className={`nav-link ${isActive('/products') ? 'active' : ''}`}
          >
            Sản phẩm
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
          >
            Giới thiệu
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/faq" 
            className={`nav-link ${isActive('/faq') ? 'active' : ''}`}
          >
            FAQ
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/contact" 
            className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
          >
            Liên hệ
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
