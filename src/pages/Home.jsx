import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import ProductSample from "../assets/images/product-sample.jpg"
import Footer from '../components/Footer';

const Home = () => {
  const benefits = [
    { icon: '🌿', title: 'Nguyên chất 100%', desc: 'Bột matcha nguyên chất từ những búp trà xanh tươi ngon nhất.' },
    { icon: '🇯🇵', title: 'Nhập khẩu từ Nhật Bản', desc: 'Nguồn gốc rõ ràng, đảm bảo chất lượng và hương vị tinh khiết.' },
    { icon: '✨', title: 'Giàu chất chống oxy hóa', desc: 'Hàm lượng EGCG cao, giúp tăng cường sức khỏe và sắc đẹp.' },
    { icon: '😋', title: 'Hương vị đậm đà', desc: 'Vị umami đặc trưng, hậu vị ngọt, mang lại trải nghiệm trà đạo đích thực.' },
    { icon: '🧑‍🍳', title: 'Đa dạng công dụng', desc: 'Lý tưởng để pha uống, làm bánh, hoặc chế biến các món ăn, thức uống sáng tạo.' },
    { icon: '🧘‍♀️', title: 'Hỗ trợ sức khỏe', desc: 'Tăng cường sự tập trung, thư giãn tinh thần và thúc đẩy trao đổi chất.' }
  ];

  return (
    <div className="home-page">
      <Header />
      <main>
        <Hero />

        {/* Featured Products Section */}
        <section className="featured-products" id="find-your-matcha">
          <div className="container">
            <h2 className="section-title">TOP SẢN PHẨM ĐƯỢC YÊU THÍCH</h2>
            <div className="product-carousel">
              <div className="featured-product-card">
                <div className="product-image">
                  <img src="/images/combo 1.png" alt="Hộp Matcha Hỗn Hợp" />
                  <span className="discount-badge">Tiết kiệm 10%</span>
                </div>
                <div className="product-details">
                  <div className="product-info">
                    <h3 className="product-title">Combo cơ bản dành cho người mới</h3>
                    <div className="product-price">
                      <span className="current-price">232.000₫</span>
                      <span className="original-price">258.000₫</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="featured-product-card">
                <div className="product-image">
                  <img src="/images/combo 2.png" alt="Hộp Matcha Kem" />
                  <span className="discount-badge">Tiết kiệm 10%</span>
                </div>
                <div className="product-details">
                  <div className="product-info">
                    <h3 className="product-title">Combo "Sơ cấp Matcha" - 2</h3>
                    <div className="product-price">
                      <span className="current-price">492.000₫</span>
                      <span className="original-price">547.000₫</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="featured-product-card">
                <div className="product-image">
                  <img src="/images/combo 3.png" alt="Hộp Matcha Trái Cây" />
                  <span className="discount-badge">Tiết kiệm 10%</span>
                </div>
                <div className="product-details">
                  <div className="product-info">
                    <h3 className="product-title">Combo "Bậc thầy Trà đạo" - 3</h3>
                    <div className="product-price">
                      <span className="current-price">698.000₫</span>
                      <span className="original-price">776.000₫</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marquee Section */}
        <section className="marquee-wrapper" aria-label="Những ưu điểm của matcha">
          <Marquee
            speed="fast"
            direction="left"
            items={[
              '100% bột matcha nguyên chất',
              'Nhập khẩu trực tiếp từ Uji, Kyoto',
              'Dụng cụ trà đạo truyền thống',
              'Hương vị umami đậm đà',
              'Tăng cường năng lượng & sự tập trung',
              'Trải nghiệm trà đạo đích thực',
              'Tuyệt vời để pha uống & làm bánh',
              'Chất lượng hảo hạng'
            ].map(text => (
              <span className="marquee-chip" key={text}>{text}</span>
            ))}
          />
        </section>

        {/* Benefits Grid */}
        <section className="benefits-section" aria-label="Lợi ích chính">
          <div className="container">
              <h2 className="section-title">VÌ SAO CHỌN MATCHANAH?</h2>
          </div>
          <div className="container benefits-grid">
            <div className="benefits-column">
              {benefits.slice(0, 3).map(item => (
                <div className="benefit-card" key={item.title}>
                  <span className="benefit-icon">{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="benefit-image">
              <img src={ProductSample} alt="Product Sample" loading="lazy" />
            </div>
            <div className="benefits-column">
              {benefits.slice(3, 6).map(item => (
                <div className="benefit-card" key={item.title}>
                  <span className="benefit-icon">{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works" aria-label="Cách pha matcha">
          <div className="container hiw-container">
            <div className="hiw-text">
              <h2>CÁCH PHA MATCHA TRUYỀN THỐNG</h2>
              <ol className="hiw-steps">
                <li><b>Làm nóng dụng cụ:</b> Tráng bát (chawan) và chổi (chasen) bằng nước nóng.</li>
                <li><b>Rây bột:</b> Dùng muỗng (chashaku) lấy khoảng 2g matcha, rây mịn vào bát để tránh vón cục.</li>
                <li><b>Thêm nước:</b> Rót khoảng 70ml nước nóng (75-80°C) vào bát.</li>
                <li><b>Đánh matcha:</b> Dùng chổi (chasen) đánh nhanh tay theo hình chữ W cho đến khi trà sủi bọt tăm nhỏ, mịn như kem.</li>
                <li><b>Thưởng thức:</b> Uống ngay khi còn nóng để cảm nhận trọn vẹn hương vị.</li>
              </ol>
              <a href="/products" className="hero-cta-button alt">Khám phá dụng cụ</a>
            </div>
            <div className="hiw-media">
              <img src="https://www.chopstickchronicles.com/wp-content/uploads/2023/08/how-to-make-matcha-5.jpg" alt="Các bước pha matcha truyền thống" loading="lazy" />
            </div>
          </div>
        </section>

        {/* Reviews Teaser */}
        <section className="reviews-teaser" aria-label="Khách hàng nói gì">
          <div className="container">
            <h2 className="section-title">ĐƯỢC TIN DÙNG BỞI NHỮNG NGƯỜI YÊU TRÀ ĐẠO</h2>
            <div className="reviews-row">
              {[
                { quote: 'Matcha ở đây rất thơm, vị đậm đà không bị đắng.', author: 'An • Sinh viên' },
                { quote: 'Dụng cụ đầy đủ, đẹp, dễ sử dụng cho người mới.', author: 'Bình • Nhân viên văn phòng' },
                { quote: 'Mình đã thử nhiều nơi, nhưng matcha ở đây là chuẩn vị Nhật nhất.', author: 'Chi • Barista' }
              ].map(r => (
                <div className="review-card" key={r.author}>
                  <p className="quote">“{r.quote}”</p>
                  <p className="author">{r.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="final-cta" aria-label="Kêu gọi hành động cuối trang">
          <div className="container final-cta-inner">
            <div className="hiw-media">
              <img src="https://hips.hearstapps.com/thepioneerwoman/wp-content/uploads/2018/05/matcha-panna-cotta-07.jpg" alt="Pha matcha" loading="lazy" />
            </div>
            <div className="final-cta-text">
              <h2>Trải nghiệm văn hoá Matcha Nhật Bản</h2>
              <p>Khám phá các dòng sản phẩm matcha cao cấp và bộ dụng cụ pha chế chuyên nghiệp của chúng tôi.</p>
              <a href="/products" className="hero-cta-button">XEM TẤT CẢ SẢN PHẨM</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;