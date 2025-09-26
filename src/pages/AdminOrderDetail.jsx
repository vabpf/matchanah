import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import OrderProgressBar from '../components/OrderProgressBar';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { fetchOrder, updateOrderStatus, cancelOrder } = useOrders();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/login');
      return;
    }

    if (orderId) {
      loadOrderDetail();
    }
  }, [orderId, isAuthenticated, user, navigate]);

  const loadOrderDetail = async () => {
    setIsLoading(true);
    setError(null);

    try {
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

  const handleStatusUpdate = async (newStatus) => {
    const notes = prompt('Ghi chú cho việc cập nhật trạng thái (tùy chọn):') || '';
    
    setUpdatingStatus(true);
    
    try {
      const result = await updateOrderStatus(orderId, newStatus, notes);
      
      if (result.success) {
        alert('Cập nhật trạng thái thành công');
        // Reload order detail
        loadOrderDetail();
      } else {
        alert('Lỗi: ' + result.error);
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    const reason = prompt('Lý do hủy đơn hàng:') || '';
    
    const result = await cancelOrder(orderId, reason);
    
    if (result.success) {
      alert('Đơn hàng đã được hủy thành công');
      loadOrderDetail();
    } else {
      alert('Lỗi khi hủy đơn hàng: ' + result.error);
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

  const getNextStatuses = (currentStatus) => {
    const statusFlow = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: ['refunded'],
      cancelled: [],
      refunded: []
    };
    return statusFlow[currentStatus] || [];
  };

  const getPaymentMethodText = (method) => {
    return method === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản qua VietQR';
  };

  if (!isAuthenticated || !user?.isAdmin) {
    return <Loading />;
  }

  if (isLoading) {
    return (
      <div className="admin-order-detail-page">
        <Header />
        <main className="admin-order-detail-main">
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
      <div className="admin-order-detail-page">
        <Header />
        <main className="admin-order-detail-main">
          <div className="container">
            <div className="error-message">
              <h2>Không tìm thấy đơn hàng</h2>
              <p>{error || 'Đơn hàng không tồn tại.'}</p>
              <button onClick={() => navigate('/admin/orders')} className="hero-cta-button">
                Quay lại danh sách đơn hàng
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-order-detail-page">
      <Header />
      <main className="admin-order-detail-main">
        <section className="admin-order-detail-content">
          <div className="container">
            <div className="admin-order-header">
              <div className="order-info">
                <h1>Chi tiết đơn hàng #{order.orderNumber}</h1>
                <p className="order-date">Đặt ngày: {formatDate(order.createdAt)}</p>
                <p className="customer-info">Khách hàng: {order.userEmail}</p>
              </div>
              <div className="admin-actions">
                <button onClick={loadOrderDetail} className="refresh-btn">
                  Cập nhật
                </button>
                <button 
                  onClick={() => navigate('/admin/orders')} 
                  className="back-btn"
                >
                  ← Quay lại
                </button>
              </div>
            </div>

            {/* Order Progress */}
            <div className="order-progress-section">
              <h2>Tiến độ đơn hàng</h2>
              <OrderProgressBar currentStatus={order.status} />
            </div>

            {/* Status Management */}
            <div className="status-management">
              <h2>Quản lý trạng thái</h2>
              <div className="status-controls">
                <div className="current-status">
                  <strong>Trạng thái hiện tại: </strong>
                  <span className={`status-badge status-${order.status}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                
                {getNextStatuses(order.status).length > 0 && (
                  <div className="status-actions">
                    <label>Cập nhật trạng thái:</label>
                    {getNextStatuses(order.status).map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(status)}
                        disabled={updatingStatus}
                        className={`status-btn status-btn-${status}`}
                      >
                        {updatingStatus ? 'Đang cập nhật...' : getStatusText(status)}
                      </button>
                    ))}
                  </div>
                )}
                
                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                  <button 
                    onClick={handleCancelOrder}
                    className="cancel-order-btn"
                  >
                    Hủy đơn hàng
                  </button>
                )}
              </div>
            </div>

            <div className="admin-order-details-grid">
              {/* Order Items */}
              <div className="order-items-section">
                <h2>Sản phẩm đã đặt</h2>
                <div className="order-items">
                  {order.items && order.items.map((item) => (
                    <div key={item.id} className="admin-order-item">
                      <div className="item-image">
                        <img src={item.productImage} alt={item.productName} />
                      </div>
                      <div className="item-details">
                        <h3>{item.productName}</h3>
                        <p>ID sản phẩm: {item.productId}</p>
                        <p>Đơn giá: {formatPrice(item.price)}</p>
                        <p>Số lượng: {item.quantity}</p>
                        <p>Thành tiền: {formatPrice(item.total)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="admin-order-summary">
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
                    {order.couponCode && (
                      <div className="summary-row">
                        <span>Mã giảm giá:</span>
                        <span>{order.couponCode}</span>
                      </div>
                    )}
                    <div className="summary-row total">
                      <span>Tổng cộng:</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="customer-card">
                  <h3>Thông tin khách hàng</h3>
                  <div className="customer-details">
                    <p><strong>Email:</strong> {order.userEmail}</p>
                    <p><strong>ID:</strong> {order.userId}</p>
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
                  {order.paymentId && (
                    <p><strong>Mã giao dịch:</strong> {order.paymentId}</p>
                  )}
                  {order.paidAt && (
                    <p><strong>Đã thanh toán:</strong> {formatDate(order.paidAt)}</p>
                  )}
                </div>

                {/* Order Timeline */}
                <div className="timeline-card">
                  <h3>Lịch sử đơn hàng</h3>
                  <div className="timeline">
                    <div className="timeline-item">
                      <span className="timeline-time">{formatDate(order.createdAt)}</span>
                      <span className="timeline-event">Đơn hàng được tạo</span>
                    </div>
                    {order.updatedAt && order.updatedAt !== order.createdAt && (
                      <div className="timeline-item">
                        <span className="timeline-time">{formatDate(order.updatedAt)}</span>
                        <span className="timeline-event">Cập nhật trạng thái</span>
                      </div>
                    )}
                    {order.cancelledAt && (
                      <div className="timeline-item">
                        <span className="timeline-time">{formatDate(order.cancelledAt)}</span>
                        <span className="timeline-event">Đơn hàng bị hủy</span>
                        {order.cancelReason && (
                          <span className="timeline-reason">Lý do: {order.cancelReason}</span>
                        )}
                      </div>
                    )}
                    {order.paidAt && (
                      <div className="timeline-item">
                        <span className="timeline-time">{formatDate(order.paidAt)}</span>
                        <span className="timeline-event">Thanh toán hoàn tất</span>
                      </div>
                    )}
                  </div>
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

export default AdminOrderDetail;