import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';

const OrderHistory = () => {
  const { user, isAuthenticated } = useAuth();
  const { orders, isLoading, error, fetchUserOrders, cancelOrder } = useOrders();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Handle Firestore Timestamp or Date objects
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

  const getStatusClass = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled',
      refunded: 'status-refunded'
    };
    return statusClasses[status] || 'status-default';
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    const reason = prompt('Lý do hủy đơn hàng (tùy chọn):') || '';
    
    const result = await cancelOrder(orderId, reason);
    
    if (result.success) {
      alert('Đơn hàng đã được hủy thành công');
    } else {
      alert('Lỗi khi hủy đơn hàng: ' + result.error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUserOrders();
    setIsRefreshing(false);
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  const canCancelOrder = (order) => {
    return order.status === 'pending' || order.status === 'confirmed';
  };

  if (!isAuthenticated) {
    return <Loading />;
  }

  return (
    <div className="order-history-page">
      <Header />
      <main className="order-history-main">
        <section className="order-history-content">
          <div className="container">
            <div className="page-header">
              <h1>Lịch sử đơn hàng</h1>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="refresh-btn"
              >
                {isRefreshing ? 'Đang tải...' : 'Làm mới'}
              </button>
            </div>

            <div className="order-filters">
              <label>Lọc theo trạng thái:</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-filter"
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chờ xử lý</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipped">Đang vận chuyển</option>
                <option value="delivered">Đã giao hàng</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>

            {isLoading ? (
              <Loading />
            ) : error ? (
              <div className="error-message">
                <p>Lỗi: {error}</p>
                <button onClick={handleRefresh} className="retry-btn">
                  Thử lại
                </button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="empty-orders">
                <h3>Chưa có đơn hàng nào</h3>
                <p>Hãy khám phá các sản phẩm matcha tuyệt vời của chúng tôi!</p>
                <Link to="/products" className="hero-cta-button">
                  Mua sắm ngay
                </Link>
              </div>
            ) : (
              <div className="orders-list">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h3>Đơn hàng #{order.orderNumber}</h3>
                        <p className="order-date">
                          Đặt ngày: {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>

                    <div className="order-items">
                      {order.items && order.items.map((item) => (
                        <div key={item.id} className="order-item">
                          <div className="item-image">
                            <img src={item.productImage} alt={item.productName} />
                          </div>
                          <div className="item-details">
                            <h4>{item.productName}</h4>
                            <p>Số lượng: {item.quantity}</p>
                            <p>Đơn giá: {formatPrice(item.price)}</p>
                          </div>
                          <div className="item-total">
                            {formatPrice(item.total)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">
                        <strong>Tổng cộng: {formatPrice(order.total)}</strong>
                      </div>
                      <div className="order-actions">
                        <Link 
                          to={`/orders/${order.id}`} 
                          className="view-detail-btn"
                        >
                          Xem chi tiết
                        </Link>
                        {canCancelOrder(order) && (
                          <button 
                            onClick={() => handleCancelOrder(order.id)}
                            className="cancel-order-btn"
                          >
                            Hủy đơn hàng
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OrderHistory;