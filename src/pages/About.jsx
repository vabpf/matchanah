import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/about.css';

const About = () => {
  return (
    <div className="about-page">
      <Header />
      <main className="about-main">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <div className="about-hero-content">
              <h1 className="about-title">VỀ MATCHANAH</h1>
              <h2 className="about-subtitle">
                Chúng tôi nỗ lực mang đến cho thế hệ trẻ trải nghiệm matcha chất lượng cao nhất
              </h2>
              <div className="about-story">
                <p className="story-text">
                  Matchanah được thành lập vào năm 2025 bởi những tâm hồn yêu trà và tin vào giá trị sâu sắc mà matcha mang lại cho cuộc sống hiện đại của thế hệ trẻ. Với khả năng tăng cường tập trung, giảm căng thẳng công việc và học tập, nuôi dưỡng sự tĩnh tại, matcha không chỉ là một thức uống – mà là một lối sống, một nghi thức chăm sóc bản thân đầy ý nghĩa cho những người trẻ năng động.
                </p>
                <blockquote className="founder-quote">
                  <p>
                    "Chúng tôi yêu những gì mình làm – và luôn đồng hành cùng thế hệ trẻ trong hành trình trải nghiệm matcha, để tạo nên những thay đổi bền vững cho sức khỏe, tinh thần và phong cách sống hiện đại."
                  </p>
                  <cite>
                    <span className="founder-name">Đội ngũ sáng lập</span>
                    <span className="founder-title">Founders @ Matchanah</span>
                  </cite>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="core-values">
          <div className="container">
            <h2 className="section-title">Giá trị cốt lõi mà chúng tôi tin tưởng</h2>
            
            <div className="values-grid">
              <div className="value-item">
                <div className="value-icon">📚</div>
                <h3>Giáo dục người tiêu dùng</h3>
                <p>Giáo dục người trẻ về toàn bộ lợi ích sức khỏe của matcha—từ sự minh mẫn tinh thần đến đặc tính chống lão hóa, hỗ trợ hiệu quả trong công việc và học tập.</p>
              </div>
              
              <div className="value-item">
                <div className="value-icon">⚡</div>
                <h3>Đơn giản hóa quy trình</h3>
                <p>Cung cấp các bộ dụng cụ và công cụ pha matcha được tuyển chọn kỹ lưỡng, phù hợp với lịch trình bận rộn của cuộc sống hiện đại.</p>
              </div>
              
              <div className="value-item">
                <div className="value-icon">🌱</div>
                <h3>Khuyến khích sự chuyển đổi</h3>
                <p>Từ việc tiêu dùng thụ động sang các nghi thức có chủ đích, chú trọng sức khỏe và tinh thần tích cực trong cuộc sống hàng ngày.</p>
              </div>
              
              <div className="value-item">
                <div className="value-icon">⭐</div>
                <h3>Chất lượng cao</h3>
                <p>Chọn lọc những sản phẩm matcha chất lượng cao từ Nhật Bản với giá cả hợp lý, phù hợp với túi tiền của người trẻ.</p>
              </div>
              
              <div className="value-item">
                <div className="value-icon">😊</div>
                <h3>Sự hài lòng của khách hàng</h3>
                <p>Đặt sự hài lòng và trải nghiệm của khách hàng lên hàng đầu, hỗ trợ tư vấn 24/7 qua các kênh online.</p>
              </div>
              
              <div className="value-item">
                <div className="value-icon">💚</div>
                <h3>Cộng đồng người trẻ</h3>
                <p>Xây dựng cộng đồng người trẻ yêu matcha, chia sẻ kinh nghiệm và hỗ trợ lẫn nhau trong hành trình sống khỏe.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission">
          <div className="container">
            <div className="mission-content">
              <div className="mission-text">
                <h2 className="section-title">Sứ mệnh của chúng tôi</h2>
                <p>
                  Matchanah đang thực hiện sứ mệnh kết nối truyền thống Nhật Bản với xu hướng chăm sóc sức khỏe hiện đại của thế hệ trẻ bằng cách làm cho matcha dễ pha chế và dễ hiểu hơn về những lợi ích thực sự của nó. Trong khi người trẻ ngày nay tràn ngập các loại nước tăng lực và đồ uống chứa nhiều caffeine, ít ai biết rằng có một lựa chọn tốt hơn: một loại đồ uống giúp tỉnh táo mà không gây kích thích quá mức, hỗ trợ trao đổi chất và cung cấp nguồn dưỡng chất giàu chất chống oxy hóa.
                </p>
                
                <div className="mission-highlights">
                  <div className="highlight-item">
                    <div className="highlight-icon">🎯</div>
                    <h4>Chất lượng và Đa dạng</h4>
                    <p>Sản phẩm matcha chính hãng từ Nhật Bản</p>
                  </div>
                  
                  <div className="highlight-item">
                    <div className="highlight-icon">📖</div>
                    <h4>Hướng dẫn chuyên sâu</h4>
                    <p>Kiến thức và cách pha matcha chuẩn Nhật</p>
                  </div>
                  
                  <div className="highlight-item">
                    <div className="highlight-icon">🌍</div>
                    <h4>Phát triển bền vững</h4>
                    <p>Hỗ trợ lối sống khỏe mạnh cho sinh viên</p>
                  </div>
                  
                  <div className="highlight-item">
                    <div className="highlight-icon">👥</div>
                    <h4>Đội ngũ chuyên nghiệp</h4>
                    <p>Tư vấn và hỗ trợ tận tình</p>
                  </div>
                </div>
              </div>
              
              <div className="mission-image">
                <img src="/images/product-sample.jpg" alt="Matcha Matchanah" />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="about-cta">
          <div className="container">
            <div className="cta-content">
              <h2>Sẵn sàng tìm kiếm tách Matcha hoàn hảo của bạn?</h2>
              <p>
                Khám phá cửa hàng trực tuyến của chúng tôi hoặc liên hệ trực tiếp để cảm nhận trọn vẹn vẻ đẹp tinh túy mà thiên nhiên ban tặng qua từng tách matcha.
              </p>
              <div className="cta-buttons">
                <a href="/products" className="btn btn-primary">Mua hàng ngay</a>
                <a href="/contact" className="btn btn-secondary">Liên hệ tư vấn</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
