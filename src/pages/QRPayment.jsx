import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { useCart } from '../context/CartContext';
import payOSService from '../services/payosService';

import '../styles/payos-payment.css';

const QRPayment = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [orderData, setOrderData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [configStatus, setConfigStatus] = useState(null);

  useEffect(() => {
    // Prevent double initialization in React StrictMode
    let isInitialized = false;
    
    const initializePayment = async () => {
      if (isInitialized) {
        console.log('⚠️ Payment already initialized, skipping...');
        return;
      }
      
      try {
        isInitialized = true;
        console.log('🚀 Initializing PayOS payment...');
        
        // Check PayOS configuration
        const status = payOSService.getConfigStatus();
        setConfigStatus(status);
        
        if (!status.configured) {
          setError('PayOS chưa được cấu hình. Vui lòng kiểm tra file .env');
          setLoading(false);
          return;
        }

        // Get order data from localStorage
        const stored = localStorage.getItem('orderData');
        if (!stored) {
          console.log('❌ No order data found, redirecting to cart');
          navigate('/cart');
          return;
        }

        const parsed = JSON.parse(stored);
        console.log('📦 Order data loaded:', parsed);
        setOrderData(parsed);

        // Check if payment already exists to prevent double creation
        const existingPayment = localStorage.getItem('pendingPayment');
        if (existingPayment) {
          try {
            const existing = JSON.parse(existingPayment);
            const timeDiff = new Date() - new Date(existing.timestamp);
            
            // If payment was created less than 5 minutes ago, reuse it
            if (timeDiff < 5 * 60 * 1000) {
              console.log('♻️ Reusing existing payment:', existing.orderCode);
              setPaymentData({
                orderCode: existing.orderCode,
                amount: existing.amount,
                description: existing.description,
                checkoutUrl: existing.checkoutUrl,
                qrCode: existing.qrCode,
                accountName: existing.accountName,
                accountNumber: existing.accountNumber
              });
              setLoading(false);
              return;
            } else {
              console.log('🧹 Clearing expired payment data');
              localStorage.removeItem('pendingPayment');
            }
          } catch (error) {
            console.log('🧹 Clearing invalid payment data');
            localStorage.removeItem('pendingPayment');
          }
        }

        // Create PayOS payment link
        console.log('💳 Creating new PayOS payment link...');
        const result = await payOSService.createPaymentLink(parsed);
        
        if (result.success) {
          console.log('✅ PayOS payment created successfully:', {
            orderCode: result.data.orderCode,
            amount: result.data.amount,
            hasQR: !!result.data.qrCode,
            hasCheckout: !!result.data.checkoutUrl
          });
          
          setPaymentData(result.data);
          
          // Store order data with payment info for return URL processing
          const orderWithPayment = {
            ...parsed,
            orderCode: result.data.orderCode,
            paymentMethod: 'PayOS',
            timestamp: new Date().toISOString()
          };
          localStorage.setItem('pendingOrder', JSON.stringify(orderWithPayment));
          
        } else {
          console.error('❌ Failed to create PayOS payment:', result.error);
          setError(result.error || 'Không thể tạo liên kết thanh toán PayOS');
        }

      } catch (err) {
        console.error('💥 Error initializing payment:', err);
        setError(err.message || 'Có lỗi xảy ra khi khởi tạo thanh toán');
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
    
    // Cleanup function to prevent memory leaks
    return () => {
      isInitialized = true;
    };
  }, [navigate]);

  const handleBackToCart = () => {
    navigate('/cart');
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log('📋 Copied to clipboard:', text);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const formatPrice = (price) => {
    return payOSService.formatPrice(price);
  };

  if (loading) {
    return (
      <div className="qr-payment-page">
        <Header />
        <main className="qr-payment-main">
          <div className="container">
            <div className="loading-container">
              <Loading />
              <p>Đang khởi tạo PayOS thanh toán...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !configStatus?.configured) {
    return (
      <div className="qr-payment-page">
        <Header />
        <main className="qr-payment-main">
          <div className="container">
            <div className="error-container">
              <h2>❌ Lỗi cấu hình PayOS</h2>
              <div className="error-details">
                <p><strong>Lỗi:</strong> {error}</p>
                {configStatus && (
                  <div className="config-status">
                    <h3>Trạng thái cấu hình:</h3>
                    <ul>
                      <li>Client ID: {configStatus.clientId ? '✅' : '❌'}</li>
                      <li>API Key: {configStatus.apiKey ? '✅' : '❌'}</li>
                      <li>Checksum Key: {configStatus.checksumKey ? '✅' : '❌'}</li>
                      <li>Environment: {configStatus.environment}</li>
                    </ul>
                  </div>
                )}
                <div className="fix-instructions">
                  <h3>Cách khắc phục:</h3>
                  <ol>
                    <li>Tạo file <code>.env</code> trong thư mục gốc</li>
                    <li>Thêm các biến môi trường PayOS:</li>
                    <pre>{`VITE_PAYOS_CLIENT_ID=your_client_id
VITE_PAYOS_API_KEY=your_api_key
VITE_PAYOS_CHECKSUM_KEY=your_checksum_key`}</pre>
                    <li>Khởi động lại ứng dụng</li>
                  </ol>
                </div>
              </div>
              <button onClick={handleBackToCart} className="back-btn">
                Quay lại giỏ hàng
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!orderData || !paymentData) {
    return (
      <div className="qr-payment-page">
        <Header />
        <main className="qr-payment-main">
          <div className="container">
            <div className="error-container">
              <h2>Không thể tạo thanh toán</h2>
              <p>Dữ liệu đơn hàng không hợp lệ hoặc PayOS không phản hồi.</p>
              <button onClick={handleBackToCart} className="back-btn">
                Quay lại giỏ hàng
              </button>
            </div>
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
            <div className="payos-payment-card">
              <div className="payment-header">
                <h1>💳 Thanh toán PayOS</h1>
              </div>

              {/* PayOS QR Code Section */}
              <div className="payos-qr-section">
                <div className="payment-items">
                  <h4>🛍️ Sản phẩm:</h4>
                  <div className="items-list">
                    {orderData.items.map((item, index) => (
                      <div key={index} className="payment-item">
                        <span className="item-name">{item.productName || item.name || 'Sản phẩm'}</span>
                        <span className="item-quantity">x {item.quantity}</span>
                        <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <h3>📱 Quét mã QR để thanh toán</h3>
                
                {paymentData?.qrCode ? (
                  <div className="qr-container">
                    <div className="qr-code-wrapper">
                      <img 
                        src={paymentData.qrCode.startsWith('data:') ? paymentData.qrCode : `data:image/png;base64,${paymentData.qrCode}`}
                        alt="PayOS QR Code" 
                        className="payos-qr-image"
                        onError={(e) => {
                          console.log('QR image error, trying alternative methods...');
                          console.log('QR Code data length:', paymentData.qrCode?.length);
                          console.log('QR Code starts with data:?', paymentData.qrCode?.startsWith('data:'));
                          
                          // If it's not base64 image data, it might be raw QR string - create a fallback
                          if (!paymentData.qrCode.startsWith('data:') && !e.target.src.includes('svg')) {
                            e.target.src = `data:image/svg+xml;base64,${btoa(`
                              <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
                                <rect width="256" height="256" fill="white" stroke="black" stroke-width="2"/>
                                <text x="128" y="100" text-anchor="middle" fill="black" font-size="14" font-family="monospace">
                                  QR Code Data:
                                </text>
                                <text x="128" y="130" text-anchor="middle" fill="black" font-size="10" font-family="monospace">
                                  ${paymentData.qrCode.substring(0, 30)}...
                                </text>
                                <text x="128" y="180" text-anchor="middle" fill="red" font-size="12">
                                  Please use banking app
                                </text>
                                <text x="128" y="200" text-anchor="middle" fill="red" font-size="12">
                                  to scan QR code
                                </text>
                              </svg>
                            `)}`;
                          }
                        }}
                      />
                    </div>
                    <p className="qr-instructions">
                      <strong>📲 Quét mã QR</strong> bằng ứng dụng ngân hàng để thanh toán nhanh chóng
                    </p>
                    
                    {/* Bank Transfer Details */}
                    {(paymentData.accountNumber || paymentData.accountName) && (
                      <div className="bank-transfer-details">
                        <h4>🏦 Hoặc chuyển khoản thủ công:</h4>
                        <div className="transfer-info">
                          {paymentData.accountName && (
                            <div className="info-row">
                              <span className="label">Tên tài khoản:</span>
                              <span className="value">{paymentData.accountName}</span>
                              <button 
                                onClick={() => copyToClipboard(paymentData.accountName)}
                                className="copy-btn"
                                title="Sao chép"
                              >
                                📋
                              </button>
                            </div>
                          )}
                          {paymentData.accountNumber && (
                            <div className="info-row">
                              <span className="label">Số tài khoản:</span>
                              <span className="value">{paymentData.accountNumber}</span>
                              <button 
                                onClick={() => copyToClipboard(paymentData.accountNumber)}
                                className="copy-btn"
                                title="Sao chép"
                              >
                                📋
                              </button>
                            </div>
                          )}
                          <div className="info-row">
                            <span className="label">Số tiền:</span>
                            <span className="value highlight">{formatPrice(paymentData.amount)}</span>
                            <button 
                              onClick={() => copyToClipboard(paymentData.amount.toString())}
                              className="copy-btn"
                              title="Sao chép"
                            >
                              📋
                            </button>
                          </div>
                          <div className="info-row">
                            <span className="label">Nội dung:</span>
                            <span className="value">{paymentData.description}</span>
                            <button 
                              onClick={() => copyToClipboard(paymentData.description)}
                              className="copy-btn"
                              title="Sao chép"
                            >
                              📋
                            </button>
                          </div>
                          {paymentData.bin && (
                            <div className="info-row">
                              <span className="label">Mã ngân hàng:</span>
                              <span className="value">{paymentData.bin}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="qr-placeholder">
                    <div className="qr-loading">
                      <div className="loading-spinner"></div>
                      <p>🔄 Đang tạo mã QR thanh toán...</p>
                      <small>Vui lòng đợi trong giây lát...</small>
                    </div>
                  </div>
                )}
                <div className="security-badge">
                  <span>🔒 Được bảo mật bởi PayOS</span>
                </div>
                <div className="support-info">
                  <p>Hỗ trợ khách hàng: support@matchanah.store</p>
                  <p>Hotline: +84 389822589</p>
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

export default QRPayment;