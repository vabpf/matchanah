import React from 'react';

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul className="nav-list">
        <li className="nav-item">
          <a href="#home" className="nav-link">Trang chủ</a>
        </li>
        <li className="nav-item">
          <a href="#products" className="nav-link">Sản phẩm</a>
        </li>
        <li className="nav-item">
          <a href="#about" className="nav-link">Về chúng tôi</a>
        </li>
        <li className="nav-item">
          <a href="#contact" className="nav-link">Liên hệ</a>
        </li>
        <li className="nav-item">
          <a href="#cart" className="nav-link cart-link">Giỏ hàng (0)</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
