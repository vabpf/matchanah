import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const QRPayment = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [orderData, setOrderData] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Lấy dữ liệu đơn hàng từ localStorage
    const stored = localStorage.getItem('orderData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setOrderData(parsed);
        
        // Tạo dữ liệu QR giả lập
        const mockQRData = {
          orderId: 'ORD' + Date.now().toString().slice(-6).toUpperCase(),
          amount: parsed.total,
          qrBase64: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="200" fill="white"/>
              <rect x="20" y="20" width="160" height="160" fill="black"/>
              <rect x="30" y="30" width="140" height="140" fill="white"/>
              <text x="100" y="105" text-anchor="middle" font-family="Arial" font-size="12" fill="black">
                QR CODE
              </text>
              <text x="100" y="125" text-anchor="middle" font-family="Arial" font-size="8" fill="black">
                ${parsed.total.toLocaleString()}đ
              </text>
            </svg>
          `),
          receiverName: 'MATCHANAH STORE',
          accountNumber: '80001118546'
        };
        
        setQrData(mockQRData);
      } catch (err) {
        console.error('Lỗi parse order data:', err);
        navigate('/cart');
      }
    } else {
      navigate('/cart');
    }
    setLoading(false);
  }, [navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleConfirmPayment = async () => {
    setProcessing(true);
    
    try {
      // Simulate payment confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Lưu thông tin đơn hàng đã hoàn thành
      const completedOrder = {
        ...orderData,
        orderId: qrData.orderId,
        orderDate: new Date().toISOString(),
        status: 'PAID',
        paymentMethod: 'VietQR'
      };
      
      localStorage.setItem('lastOrder', JSON.stringify(completedOrder));
      
      // Xóa giỏ hàng và dữ liệu tạm thời
      clearCart();
      localStorage.removeItem('orderData');
      
      // Chuyển đến trang cảm ơn
      navigate('/order-success', { state: { orderId: qrData.orderId } });
      
    } catch (error) {
      console.error('Lỗi xác nhận thanh toán:', error);
      alert('Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng thử lại.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="qr-payment-page">
        <Header />
        <main className="qr-payment-main">
          <div className="container">
            <div className="loading-message">Đang tải mã QR...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!orderData || !qrData) {
    return (
      <div className="qr-payment-page">
        <Header />
        <main className="qr-payment-main">
          <div className="container">
            <div className="error-message">Không thể hiển thị mã QR</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="qr-payment-page">
      <Header />
      <main className="qr-payment-main">
        <section className="qr-payment-content">
          <div className="container">
            <div className="qr-payment-card">
              <h1>Thanh toán qua VietQR</h1>
              
              <div className="qr-info">
                <p>Vui lòng quét mã QR để thanh toán đơn hàng #{qrData.orderId}</p>
              </div>
              
              <div className="qr-code-container">
                <img
                  src={qrData.qrBase64}
                  alt="QR Code VietQR"
                  className="qr-code-image"
                />
              </div>
              
              <div className="payment-details">
                <div className="detail-row">
                  <span className="label">Số tiền:</span>
                  <span className="value">{formatPrice(qrData.amount)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Người nhận:</span>
                  <span className="value">{qrData.receiverName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Tài khoản nhận:</span>
                  <span className="value">{qrData.accountNumber}</span>
                </div>
              </div>
              
              <div className="payment-instructions">
                <h3>Hướng dẫn thanh toán:</h3>
                <ol>
                  <li>Mở ứng dụng ngân hàng trên điện thoại</li>
                  <li>Chọn tính năng quét mã QR</li>
                  <li>Quét mã QR bên trên</li>
                  <li>Xác nhận thông tin và thực hiện thanh toán</li>
                  <li>Nhấn "Tôi đã thanh toán" sau khi hoàn thành</li>
                </ol>
              </div>
              
              <div className="action-buttons">
                <button
                  onClick={handleConfirmPayment}
                  disabled={processing}
                  className="confirm-payment-btn"
                >
                  {processing ? 'Đang xử lý...' : 'Tôi đã thanh toán'}
                </button>
                
                <button
                  onClick={() => navigate('/cart')}
                  className="back-to-cart-btn"
                  disabled={processing}
                >
                  Quay lại giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default QRPayment;