import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <Header />
      <main className="not-found-main">
        <section className="not-found-content">
          <div className="container">
            <div className="not-found-text">
              <h1>404</h1>
              <h2>Trang không tồn tại</h2>
              <p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
              <Link to="/" className="hero-cta-button">
                Về trang chủ
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
