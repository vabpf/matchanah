import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const OrderSuccess = () => {
  const location = useLocation();
  const [orderInfo, setOrderInfo] = useState(null);
  const orderId = location.state?.orderId;

  useEffect(() => {
    // Lấy thông tin đơn hàng từ localStorage
    const lastOrder = localStorage.getItem('lastOrder');
    if (lastOrder) {
      try {
        const order = JSON.parse(lastOrder);
        setOrderInfo(order);
      } catch (err) {
        console.error('Error parsing order info:', err);
      }
    }
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="order-success-page">
      <Header />
      <main className="order-success-main">
        <section className="order-success-content">
          <div className="container">
            <div className="success-card">
              <div className="success-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <h1>Đặt hàng thành công!</h1>
              <p className="success-message">
                Cảm ơn bạn đã đặt hàng tại Matchanah. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
              </p>
              
              {orderId && (
                <div className="order-id">
                  <strong>Mã đơn hàng: #{orderId}</strong>
                </div>
              )}
              
              {orderInfo && (
                <div className="order-summary">
                  <h3>Thông tin đơn hàng</h3>
                  <div className="summary-details">
                    <div className="detail-row">
                      <span>Ngày đặt:</span>
                      <span>{formatDate(orderInfo.orderDate)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Tổng tiền:</span>
                      <span>{formatPrice(orderInfo.total)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Phương thức thanh toán:</span>
                      <span>
                        {orderInfo.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'VietQR'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>Địa chỉ giao hàng:</span>
                      <span>
                        {orderInfo.shippingInfo?.address}, {orderInfo.shippingInfo?.ward}, {orderInfo.shippingInfo?.district}, {orderInfo.shippingInfo?.province}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="next-steps">
                <h3>Các bước tiếp theo:</h3>
                <ul>
                  <li>Chúng tôi sẽ gửi email xác nhận đơn hàng cho bạn</li>
                  <li>Đơn hàng sẽ được xử lý trong vòng 1-2 ngày làm việc</li>
                  <li>Bạn sẽ nhận được thông báo khi đơn hàng được giao</li>
                  <li>Thời gian giao hàng dự kiến: 3-5 ngày làm việc</li>
                </ul>
              </div>
              
              <div className="action-buttons">
                <Link to="/products" className="continue-shopping-btn">
                  Tiếp tục mua sắm
                </Link>
                <Link to="/" className="home-btn">
                  Về trang chủ
                </Link>
              </div>
              
              <div className="contact-info">
                <p>
                  Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua:
                </p>
                <p>
                  Email: <a href="mailto:support@matchanah.com">support@matchanah.com</a><br/>
                  Điện thoại: <a href="tel:+84123456789">+84 123 456 789</a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;