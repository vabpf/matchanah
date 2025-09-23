import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      comment: ''
    });
    alert('Cảm ơn bạn đã gửi tin nhắn! Chúng tôi sẽ phản hồi sớm nhất có thể.');
  };

  return (
    <div className="contact-page">
      <Header />
      <main className="contact-main">
        <section className="contact-header">
          <div className="container">
            <h1 className="contact-title">Liên hệ</h1>
          </div>
        </section>

        <section className="contact-content">
          <div className="container">
            <div className="contact-grid">
              {/* Contact Form */}
              <div className="contact-form-section">
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Tên</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="comment">Ghi chú</label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows="5"
                      value={formData.comment}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="submit-btn">
                    Gửi
                  </button>
                </form>
              </div>

              {/* Sidebar */}
              <div className="contact-sidebar">
                {/* FAQ Link */}
                <div className="faq-section">
                  <h3 className="section-title">Có câu hỏi?</h3>
                  <p>Tìm câu trả lời nhanh chóng trong phần câu hỏi thường gặp của chúng tôi.</p>
                  <a href="/faq" className="faq-link">Xem FAQ</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
