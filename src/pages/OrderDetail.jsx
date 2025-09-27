import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import OrderProgressBar from '../components/OrderProgressBar';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';

const OrderDetail = () => {
  const { orderId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { fetchOrder, cancelOrder } = useOrders();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if redirected from payment success
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      setShowPaymentSuccess(true);
      // Remove the payment parameter from URL after 5 seconds
      setTimeout(() => {
        navigate(`/orders/${orderId}`, { replace: true });
        setShowPaymentSuccess(false);
      }, 5000);
    }

    if (orderId) {
      loadOrderDetail();
    }
  }, [orderId, isAuthenticated, navigate, searchParams]);

  const loadOrderDetail = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to get from cache first
      const cached = localStorage.getItem(`order_${orderId}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Use cached data if less than 2 minutes old
        if (Date.now() - timestamp < 2 * 60 * 1000) {
          setOrder(data);
          setIsLoading(false);
          return;
        }
      }

      // Fetch from server
      const result = await fetchOrder(orderId);
      
      if (result.success) {
        setOrder(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Lỗi khi tải thông tin đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    let date;
    if (dateString.toDate && typeof dateString.toDate === 'function') {
      date = dateString.toDate();
    } else if (dateString.seconds) {
      date = new Date(dateString.seconds * 1000);
    } else {
      date = new Date(dateString);
    }
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      processing: 'Đang xử lý',
      shipped: 'Đang vận chuyển',
      delivered: 'Đã giao hàng',
      cancelled: 'Đã hủy',
      refunded: 'Đã hoàn tiền'
    };
    return statusMap[status] || status;
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    const reason = prompt('Lý do hủy đơn hàng (tùy chọn):') || '';
    
    const result = await cancelOrder(orderId, reason);
    
    if (result.success) {
      alert('Đơn hàng đã được hủy thành công');
      // Reload order detail
      loadOrderDetail();
    } else {
      alert('Lỗi khi hủy đơn hàng: ' + result.error);
    }
  };

  const canCancelOrder = () => {
    if (!order) return false;
    return order.status === 'pending' || order.status === 'confirmed';
  };

  const getPaymentMethodText = (method) => {
    return method === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản qua VietQR';
  };

  if (!isAuthenticated) {
    return <Loading />;
  }

  if (isLoading) {
    return (
      <div className="order-detail-page">
        <Header />
        <main className="order-detail-main">
          <div className="container">
            <Loading />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-detail-page">
        <Header />
        <main className="order-detail-main">
          <div className="container">
            <div className="error-message">
              <h2>Không tìm thấy đơn hàng</h2>
              <p>{error || 'Đơn hàng không tồn tại hoặc bạn không có quyền truy cập.'}</p>
              <Link to="/orders" className="hero-cta-button">
                Quay lại lịch sử đơn hàng
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <Header />
      <main className="order-detail-main">
        <section className="order-detail-content">
          <div className="container">
            {/* Payment Success Banner */}
            {showPaymentSuccess && (
              <div className="payment-success-banner">
                <div className="success-content">
                  <span className="success-icon">🎉</span>
                  <div className="success-text">
                    <h3>Thanh toán thành công!</h3>
                    <p>Đơn hàng của bạn đã được thanh toán và đang được xử lý.</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="order-header">
              <div className="order-info">
                <h1>Chi tiết đơn hàng #{order.orderNumber}</h1>
                <p className="order-date">Đặt ngày: {formatDate(order.createdAt)}</p>
              </div>
              <div className="order-actions">
                <button onClick={loadOrderDetail} className="refresh-btn">
                  Cập nhật
                </button>
                {canCancelOrder() && (
                  <button onClick={handleCancelOrder} className="cancel-order-btn">
                    Hủy đơn hàng
                  </button>
                )}
              </div>
            </div>

            {/* Order Progress */}
            <div className="order-progress-section">
              <h2>Tiến độ đơn hàng</h2>
              <OrderProgressBar currentStatus={order.status} />
            </div>

            <div className="order-details-grid">
              {/* Order Items */}
              <div className="order-items-section">
                <h2>Sản phẩm đã đặt</h2>
                <div className="order-items">
                  {order.items && order.items.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="item-image">
                        <img src={item.productImage} alt={item.productName} />
                      </div>
                      <div className="item-details">
                        <h3>{item.productName}</h3>
                        <p>Đơn giá: {formatPrice(item.price)}</p>
                        <p>Số lượng: {item.quantity}</p>
                      </div>
                      <div className="item-total">
                        {formatPrice(item.total)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="order-summary-section">
                <div className="summary-card">
                  <h2>Tóm tắt đơn hàng</h2>
                  <div className="summary-details">
                    <div className="summary-row">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(order.subtotal || order.total)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Phí vận chuyển:</span>
                      <span>{formatPrice(order.shippingCost || 0)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Thuế:</span>
                      <span>{formatPrice(order.tax || 0)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Tổng cộng:</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="shipping-card">
                  <h3>Thông tin giao hàng</h3>
                  <div className="shipping-details">
                    <p><strong>Người nhận:</strong> {order.shippingInfo?.receiverName}</p>
                    <p><strong>Điện thoại:</strong> {order.shippingInfo?.phone}</p>
                    <p><strong>Địa chỉ:</strong></p>
                    <p className="address-full">
                      {order.shippingInfo?.address}<br />
                      {order.shippingInfo?.ward}, {order.shippingInfo?.district}<br />
                      {order.shippingInfo?.province}
                    </p>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="payment-card">
                  <h3>Thông tin thanh toán</h3>
                  <p><strong>Phương thức:</strong> {getPaymentMethodText(order.paymentMethod)}</p>
                  {order.couponCode && (
                    <p><strong>Mã giảm giá:</strong> {order.couponCode}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="order-actions-bottom">
              <Link to="/orders" className="back-to-orders-btn">
                ← Quay lại lịch sử đơn hàng
              </Link>
              
              {order.status === 'delivered' && (
                <Link to="/products" className="reorder-btn">
                  Đặt lại đơn hàng
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;