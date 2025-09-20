import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content-top page-width">
        <div className="footer-block__newsletter">
          <h2 className="newsletter_heading">Đăng ký để nhận những ưu đãi mới nhất từ Matchanah</h2>
          {/* <p className="newsletter_subheading">Hãy là người đầu tiên biết về sản phẩm mới, giảm giá độc quyền và tin tức.</p> */}
          <form method="post" action="#" id="ContactFooter" className="footer__newsletter newsletter-form">
            <div className="newsletter-form__field-wrapper">
              <div className="field">
                <input id="NewsletterForm" type="email" name="contact[email]" className="field__input" required placeholder="Nhập email của bạn" />
                <label htmlFor="NewsletterForm" className="field__label">Email</label>
                <button type="submit" className="newsletter-form__button field__button">Đăng ký</button>
              </div>
            </div>
          </form>
        </div>
        <div className="footer__blocks-wrapper">
          <div className="footer-block">
            <h2 className="footer-block__heading">Công ty</h2>
            <ul className="footer-block__details-content list-unstyled">
              <li><a href="/about" className="link">Về chúng tôi</a></li>
              <li><a href="/contact" className="link">Liên hệ</a></li>
            </ul>
          </div>
          <div className="footer-block">
            <h2 className="footer-block__heading">Hỗ trợ</h2>
            <ul className="footer-block__details-content list-unstyled">
              <li><a href="#" className="link">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="link">Chính sách vận chuyển</a></li>
              <li><a href="#" className="link">Chính sách hoàn trả</a></li>
            </ul>
          </div>
          <div className="footer-block">
            <h2 className="footer-block__heading">Liên hệ</h2>
            <div className="footer-block__details-content">
              <p>Email: info@matchanah.com</p>
              <p>Điện thoại: +123 456 7890</p>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__content-bottom">
        <div className="footer__content-bottom-wrapper page-width">
          <div className="footer__copyright">
            <small className="copyright__content">© 2025 Matchanah. All Rights Reserved.</small>
          </div>
          <div className="social_ico">
            <ul className="list-unstyled list-social">
              <li><a href="#" className="link list-social__link">Facebook</a></li>
              <li><a href="#" className="link list-social__link">Instagram</a></li>
              <li><a href="#" className="link list-social__link">Tiktok</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
