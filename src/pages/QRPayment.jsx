import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';
import payOSService from '../services/payosService';

import '../styles/payos-payment.css';

const QRPayment = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const [orderData, setOrderData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [configStatus, setConfigStatus] = useState(null);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [pollCount, setPollCount] = useState(0);

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
        
        // Check if user is logged in
        if (!user) {
          console.log('❌ User not authenticated, redirecting to login');
          navigate('/login');
          return;
        }
        
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

        // Create order in Firestore first
        console.log('💾 Creating order in Firestore...');
        const orderToCreate = {
          items: parsed.items,
          total: parsed.total,
          subtotal: parsed.total,
          shippingCost: 0,
          tax: 0,
          shippingInfo: parsed.shippingInfo,
          paymentMethod: 'PayOS',
          couponCode: parsed.couponCode || '',
          status: 'pending',
          notes: 'Chờ thanh toán PayOS',
          orderNumber: 'ORD-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
          userId: user?.uid,
          userEmail: user?.email
        };

        const orderResult = await createOrder(orderToCreate);
        
        if (!orderResult.success) {
          setError('Không thể tạo đơn hàng: ' + orderResult.error);
          setLoading(false);
          return;
        }

        console.log('✅ Order created in Firestore:', orderResult.data.orderId);
        setCreatedOrderId(orderResult.data.orderId);

        // Store checkout data with order ID for return processing
        const checkoutData = {
          ...parsed,
          orderId: orderResult.data.orderId,
          orderNumber: orderToCreate.orderNumber,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));

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

        // Create PayOS payment link with the created order data
        console.log('💳 Creating new PayOS payment link...');
        const result = await payOSService.createPaymentLink({
          ...parsed,
          orderId: orderResult.data.orderId,
          orderNumber: orderToCreate.orderNumber
        });
        
        if (result.success) {
          console.log('✅ PayOS payment created successfully:', {
            orderCode: result.data.orderCode,
            amount: result.data.amount,
            hasQR: !!result.data.qrCode,
            hasCheckout: !!result.data.checkoutUrl
          });
          
          setPaymentData(result.data);
          
          // Update stored payment data with order information
          const paymentDataWithOrder = {
            ...result.data,
            orderId: orderResult.data.orderId,
            orderNumber: orderToCreate.orderNumber,
            timestamp: new Date().toISOString()
          };
          
          // Store order data with payment info for return URL processing
          const orderWithPayment = {
            ...parsed,
            orderCode: result.data.orderCode,
            orderId: orderResult.data.orderId,
            orderNumber: orderToCreate.orderNumber,
            paymentMethod: 'PayOS',
            timestamp: new Date().toISOString()
          };
          localStorage.setItem('pendingOrder', JSON.stringify(orderWithPayment));
          
          // Start polling for payment status
          setTimeout(() => {
            startPaymentPolling(result.data.orderCode, orderResult.data.orderId);
          }, 2000); // Start polling after 2 seconds
          
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

    // Start payment status polling
    const startPaymentPolling = async (orderCode, orderId) => {
      if (isPolling) return;
      
      setIsPolling(true);
      console.log('🔄 Starting payment status polling...');
      
      try {
        const pollResult = await payOSService.pollPaymentStatus(orderCode, {
          maxAttempts: 60, // 5 minutes with 5-second intervals
          interval: 5000,
          onStatusChange: (statusData) => {
            console.log('📊 Payment status update:', statusData);
            setPollCount(prev => prev + 1);
            
            if (statusData.status === 'PAID' || statusData.status === 'paid') {
              setPaymentStatus('paid');
            }
          }
        });
        
        if (pollResult.success && pollResult.status === 'completed') {
          console.log('✅ Payment completed, processing order...');
          
          // Update order status in Firestore
          const payosData = {
            orderCode: orderCode,
            transactionId: pollResult.data.transactionId,
            amount: pollResult.data.amountPaid || pollResult.data.amount,
            additionalDetails: {
              pollResult: pollResult.data,
              transactions: pollResult.data.transactions
            }
          };

          const orderService = await import('../services/orderService');
          const updateResult = await orderService.default.markOrderAsPaid(orderId, payosData);
          
          if (updateResult.success) {
            console.log('✅ Order updated successfully');
            
            // Clean up and redirect
            payOSService.cleanupPaymentData();
            localStorage.removeItem('orderData');
            localStorage.removeItem('pendingOrder');
            
            // Redirect to order detail page
            navigate(`/orders/${orderId}?payment=success`);
          } else {
            console.error('❌ Failed to update order:', updateResult.error);
            setError('Thanh toán thành công nhưng không thể cập nhật đơn hàng');
          }
        } else if (pollResult.status === 'cancelled') {
          console.log('❌ Payment was cancelled');
          setPaymentStatus('cancelled');
          setError('Thanh toán đã bị hủy');
        } else if (pollResult.status === 'timeout') {
          console.log('⏰ Payment polling timeout');
          setError('Hết thời gian chờ. Vui lòng kiểm tra lại trạng thái thanh toán.');
        }
        
      } catch (error) {
        console.error('💥 Error during payment polling:', error);
        setError('Có lỗi khi kiểm tra trạng thái thanh toán');
      } finally {
        setIsPolling(false);
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
              <p>Đang tạo đơn hàng và khởi tạo PayOS thanh toán...</p>
              <small>Quá trình này có thể mất vài giây</small>
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
                    
                    {/* Payment Status Indicator */}
                    {isPolling && (
                      <div className="payment-status-indicator">
                        <div className="status-spinner"></div>
                        <p>
                          {paymentStatus === 'paid' 
                            ? '✅ Thanh toán thành công! Đang xử lý...' 
                            : `🔄 Đang chờ thanh toán... (${pollCount}/60)`
                          }
                        </p>
                        <small>Hệ thống sẽ tự động cập nhật khi thanh toán thành công</small>
                      </div>
                    )}
                    
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
                
                {/* Checkout URL Button */}
                {paymentData?.checkoutUrl && (
                  <div className="checkout-url-section">
                    <h4>💻 Hoặc thanh toán qua web:</h4>
                    <a 
                      href={paymentData.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="checkout-url-btn"
                    >
                      Mở trang thanh toán PayOS
                    </a>
                    <small>Bạn sẽ được chuyển về trang này sau khi thanh toán thành công</small>
                  </div>
                )}
                
                <div className="security-badge">
                  <span>🔒 Được bảo mật bởi PayOS</span>
                </div>
                <div className="support-info">
                  <p>Hỗ trợ khách hàng: support@matchanah.store</p>
                  <p>Hotline: +84 389822589</p>
                </div>
                
                {/* Debug Section - Remove in production */}
                {process.env.NODE_ENV === 'development' && paymentData?.orderCode && (
                  <div className="debug-section" style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    background: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: '#856404' }}>🧪 Debug Info (Development Only)</h4>
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>Order Code:</strong> {paymentData.orderCode}<br />
                      <strong>Amount:</strong> {paymentData.amount}<br />
                      <strong>Return URL:</strong> {new URL(window.location.origin + '/payment-return').href}
                    </div>
                    <button 
                      onClick={() => {
                        const returnUrl = `${window.location.origin}/payment-return?code=00&id=${paymentData.orderCode}&cancel=false&status=PAID&orderCode=${paymentData.orderCode}&success=true`;
                        window.open(returnUrl, '_blank');
                      }}
                      style={{
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '1rem'
                      }}
                    >
                      🧪 Simulate Successful Payment
                    </button>
                    <button 
                      onClick={() => {
                        const cancelUrl = `${window.location.origin}/payment-return?cancel=true&orderCode=${paymentData.orderCode}`;
                        window.open(cancelUrl, '_blank');
                      }}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      🧪 Simulate Cancelled Payment
                    </button>
                  </div>
                )}
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