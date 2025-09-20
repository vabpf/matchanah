import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="about-page">
      <Header />
      <main className="about-main">
        <section className="about-header">
          <div className="container">
            <h1 className="page-title">Giới thiệu về Matchanah</h1>
            <p className="page-subtitle">
              Câu chuyện về hành trình mang matcha Nhật Bản đến với sinh viên Việt Nam
            </p>
          </div>
        </section>
        
        <section className="about-content">
          <div className="container">
            <div className="about-text">
              <p>Matchanah được thành lập với sứ mệnh mang đến những sản phẩm matcha chất lượng cao từ Nhật Bản cho cộng đồng sinh viên Việt Nam.</p>
              <p>Chúng tôi tin rằng matcha không chỉ là một thức uống, mà còn là một phần của văn hóa và lối sống lành mạnh.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
