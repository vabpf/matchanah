import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <main>
        <Hero />
        

    {/* Featured Products Section */}
    <section className="featured-products" id="find-your-matcha">
          <div className="container">
      <h2 className="section-title">TOP SẢN PHẨM BÁN CHẠY</h2>
            <div className="product-carousel">
              <div className="product-card">
                <div className="product-image">
                  <img src="/api/placeholder/300/300" alt="Hộp Matcha Hỗn Hợp" />
                  <span className="discount-badge">Tiết kiệm 33%</span>
                </div>
                <div className="product-details">
                  <div className="product-rating">
                    ⭐⭐⭐⭐⭐
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">Combo Matcha Natsu full dụng cụ</h3>
                    <div className="product-price">
                      <span className="current-price">199.000₫</span>
                      <span className="original-price">300.000₫</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="product-card">
                <div className="product-image">
                  <img src="/api/placeholder/300/300" alt="Hộp Matcha Kem" />
                  <span className="discount-badge">Tiết kiệm 33%</span>
                </div>
                <div className="product-details">
                  <div className="product-rating">
                    ⭐⭐⭐⭐⭐
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">Combo 3 loại Matcha 200g</h3>
                    <div className="product-price">
                      <span className="current-price">199.000₫</span>
                      <span className="original-price">300.000₫</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="product-card">
                <div className="product-image">
                  <img src="/api/placeholder/300/300" alt="Hộp Matcha Trái Cây" />
                  <span className="discount-badge">Tiết kiệm 33%</span>
                </div>
                <div className="product-details">
                  <div className="product-rating">
                    ⭐⭐⭐⭐⭐
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">Combo Matcha Natsu kèm sữa</h3>
                    <div className="product-price">
                      <span className="current-price">199.000₫</span>
                      <span className="original-price">300.000₫</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Marquee Section (smooth infinite) */}
        <section className="marquee-wrapper" aria-label="Thông tin lợi ích đồ uống matcha đóng chai">
          <Marquee
            speed="fast"
            direction="left"
            items={[
              'Năng lượng êm – không gắt',
              'Ít đường < 3g / chai',
              'Dưới 35 kcal',
              '100% lá matcha Nhật Bản',
              'Pha lạnh – Giữ trọn L-Theanine',
              'Uống liền – Không cần dụng cụ',
              'Tỉnh táo tập trung',
              'Hương vị tự nhiên'
            ].map(text => (
              <span className="marquee-chip" key={text}>{text}</span>
            ))}
          />
        </section>
        {/* Benefits Grid */}
        <section className="benefits-section" aria-label="Lợi ích chính">
          <div className="container benefits-grid">
            {[
              { title: 'Năng lượng êm', desc: 'Caffeine kết hợp L-Theanine giúp tỉnh táo bền, không hồi hộp.' },
              { title: 'Ít đường', desc: 'Công thức cân bằng – giữ vị matcha nguyên bản, không quá ngọt.' },
              { title: 'Sẵn sàng uống', desc: 'Lắc nhẹ & thưởng thức – tiết kiệm thời gian pha chế.' },
              { title: 'Thành phần thật', desc: 'Không hương liệu tổng hợp. Không màu nhân tạo.' },
              { title: 'Tươi mát', desc: 'Ủ lạnh giữ hương lá trà và cấu trúc chất chống oxy hoá.' },
              { title: 'Tập trung sâu', desc: 'Phù hợp học tập, làm việc dài giờ hoặc trước khi tập luyện.' }
            ].map(item => (
              <div className="benefit-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works" aria-label="Cách thưởng thức">
          <div className="container hiw-container">
            <div className="hiw-text">
              <h2>Uống Matcha Đúng Chuẩn – Không Cần Dụng Cụ</h2>
              <ol className="hiw-steps">
                <li>Lắc nhẹ chai để tái phân bố matcha mịn.</li>
                <li>Ướp lạnh hoặc dùng với đá.</li>
                <li>Mở nắp & thưởng thức – vị thanh, mượt, hậu ngọt tự nhiên.</li>
              </ol>
              <a href="#find-your-matcha" className="hero-cta-button alt">Chọn Combo</a>
            </div>
            <div className="hiw-media">
              <img src="/api/placeholder/600/800" alt="Các bước sử dụng đồ uống matcha đóng chai" loading="lazy" />
            </div>
          </div>
        </section>

        {/* Reviews Teaser */}
        <section className="reviews-teaser" aria-label="Khách hàng nói gì">
          <div className="container">
            <h2 className="section-title small">Được yêu thích bởi sinh viên & người làm việc sáng tạo</h2>
            <div className="reviews-row">
              {[
                { quote: 'Uống trước lúc ôn thi – tỉnh mà không bị choáng.', author: 'Minh • FTU' },
                { quote: 'Vị thanh, không ngọt gắt. Tiện mang theo.', author: 'Linh • NEU' },
                { quote: 'Thay hoàn toàn cà phê buổi sáng của mình.', author: 'Huy • Designer' }
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
            <div className="final-cta-text">
              <h2>Sẵn sàng đổi thói quen caffeine?</h2>
              <p>Chuyển sang năng lượng xanh – nhẹ bụng, tập trung sâu, ít đường hơn.</p>
              <a href="#find-your-matcha" className="hero-cta-button">Bắt đầu với combo 6 chai</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
