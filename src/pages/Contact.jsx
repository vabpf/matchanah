import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = () => {
  return (
    <div className="contact-page">
      <Header />
      <main className="contact-main">
        <section className="contact-header">
          <div className="container">
            <h1 className="page-title">Liên hệ với chúng tôi</h1>
            <p className="page-subtitle">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn
            </p>
          </div>
        </section>
        
        <section className="contact-content">
          <div className="container">
            <div className="contact-info">
              <h2>Thông tin liên hệ</h2>
              <p>Email: info@matchanah.vn</p>
              <p>Điện thoại: 0123 456 789</p>
              <p>Địa chỉ: Hà Nội, Việt Nam</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
