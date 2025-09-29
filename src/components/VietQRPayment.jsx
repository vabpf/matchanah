import React, { useState, useEffect } from 'react';
import payOSService from '../services/payosService';
import '../styles/vietqr-payment.css';

const VietQRPayment = ({ orderData, onSuccess, onCancel }) => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const result = await payOSService.createPaymentLink(orderData);
        if (result.success) {
          setPaymentData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderData) {
      initializePayment();
    }
  }, [orderData]);

  const handlePaymentConfirmation = () => {
    if (paymentData) {
      const success = payOSService.confirmManualPayment(paymentData.orderCode);
      if (success) {
        setPaymentConfirmed(true);
        if (onSuccess) {
          onSuccess(paymentData);
        }
      }
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Đã copy vào clipboard!');
    }).catch(() => {
      alert('Không thể copy. Vui lòng copy thủ công.');
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="vietqr-payment loading">
        <div className="loading-spinner"></div>
        <p>Đang tạo mã QR thanh toán...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vietqr-payment error">
        <h3>❌ Lỗi tạo thanh toán</h3>
        <p>{error}</p>
        <button onClick={handleCancel} className="cancel-btn">
          Quay lại
        </button>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="vietqr-payment error">
        <h3>❌ Không thể tạo thanh toán</h3>
        <button onClick={handleCancel} className="cancel-btn">
          Quay lại
        </button>
      </div>
    );
  }

  if (paymentConfirmed) {
    return (
      <div className="vietqr-payment success">
        <h3>✅ Đang xử lý thanh toán</h3>
        <p>Chuyển hướng sau vài giây...</p>
      </div>
    );
  }

  const { qrData } = paymentData;

  return (
    <div className="vietqr-payment">
      <div className="payment-header">
        <h2>💳 Thanh toán VietQR</h2>
        <div className="order-info">
          <p><strong>Đơn hàng:</strong> #{paymentData.orderCode}</p>
          <p><strong>Số tiền:</strong> <span className="amount">{formatPrice(paymentData.amount)}</span></p>
        </div>
      </div>

      <div className="qr-section">
        <div className="qr-code-container">
          <img 
            src={qrData.qrImageUrl} 
            alt="VietQR Payment Code" 
            className="qr-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="qr-fallback" style={{display: 'none'}}>
            <div className="qr-placeholder">
              📱 QR Code
            </div>
          </div>
        </div>

        <div className="payment-details">
          <h3>📋 Thông tin chuyển khoản</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Ngân hàng:</span>
              <span className="value">
                {qrData.bankName}
                <button 
                  onClick={() => copyToClipboard(qrData.bankName)}
                  className="copy-btn"
                  title="Copy"
                >
                  📋
                </button>
              </span>
            </div>

            <div className="detail-item">
              <span className="label">Số tài khoản:</span>
              <span className="value">
                {qrData.accountNumber}
                <button 
                  onClick={() => copyToClipboard(qrData.accountNumber)}
                  className="copy-btn"
                  title="Copy"
                >
                  📋
                </button>
              </span>
            </div>

            <div className="detail-item">
              <span className="label">Chủ tài khoản:</span>
              <span className="value">
                {qrData.accountName}
                <button 
                  onClick={() => copyToClipboard(qrData.accountName)}
                  className="copy-btn"
                  title="Copy"
                >
                  📋
                </button>
              </span>
            </div>

            <div className="detail-item highlight">
              <span className="label">Số tiền:</span>
              <span className="value amount">
                {formatPrice(qrData.amount)}
                <button 
                  onClick={() => copyToClipboard(qrData.amount.toString())}
                  className="copy-btn"
                  title="Copy"
                >
                  📋
                </button>
              </span>
            </div>

            <div className="detail-item highlight">
              <span className="label">Nội dung:</span>
              <span className="value">
                {qrData.addInfo}
                <button 
                  onClick={() => copyToClipboard(qrData.addInfo)}
                  className="copy-btn"
                  title="Copy"
                >
                  📋
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="instructions">
        <h3>📱 Hướng dẫn thanh toán</h3>
        <ol>
          <li>Mở ứng dụng ngân hàng trên điện thoại của bạn</li>
          <li>Chọn <strong>"Quét mã QR"</strong> hoặc <strong>"Chuyển khoản"</strong></li>
          <li>Quét mã QR hoặc nhập thông tin chuyển khoản ở trên</li>
          <li>Kiểm tra thông tin và xác nhận thanh toán</li>
          <li>Nhấn <strong>"Tôi đã thanh toán"</strong> sau khi hoàn thành</li>
        </ol>
      </div>

      <div className="action-buttons">
        <button 
          onClick={handlePaymentConfirmation}
          className="confirm-payment-btn"
          disabled={paymentConfirmed}
        >
          ✅ Tôi đã thanh toán
        </button>
        
        <button 
          onClick={handleCancel}
          className="cancel-payment-btn"
          disabled={paymentConfirmed}
        >
          ❌ Hủy thanh toán
        </button>
      </div>

      <div className="security-note">
        <p>🔒 Thanh toán được bảo mật qua hệ thống VietQR</p>
        <p>💬 Liên hệ hỗ trợ: support@matchanah.store</p>
      </div>
    </div>
  );
};

export default VietQRPayment;