import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { orders, orderStats, isLoading, error, fetchAllOrders, fetchOrderStats } = useOrders();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    console.log('🔐 AdminDashboard - Auth check:', { isAuthenticated, user });
    console.log('👨‍💼 Is admin:', user?.isAdmin);
    
    if (!isAuthenticated || !user?.isAdmin) {
      console.log('❌ Not authorized, redirecting to login...');
      navigate('/login');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchAllOrders(), fetchOrderStats()]);
    setIsRefreshing(false);
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
      year: 'numeric'
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

  if (!isAuthenticated || !user?.isAdmin) {
    return <Loading />;
  }

  return (
    <div className="admin-dashboard">
      <Header />
      <main className="admin-main">
        <section className="admin-content">
          <div className="container">
            <div className="admin-header">
              <h1>Bảng điều khiển Admin</h1>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="refresh-btn"
              >
                {isRefreshing ? 'Đang tải...' : 'Làm mới'}
              </button>
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
            ) : (
              <>
                {/* Statistics Cards */}
                {orderStats && (
                  <div className="stats-grid">
                    <div className="stat-card">
                      <h3>Tổng đơn hàng</h3>
                      <div className="stat-number">{orderStats.total}</div>
                    </div>
                    <div className="stat-card">
                      <h3>Chờ xử lý</h3>
                      <div className="stat-number pending">{orderStats.pending || 0}</div>
                    </div>
                    <div className="stat-card">
                      <h3>Đang xử lý</h3>
                      <div className="stat-number processing">
                        {(orderStats.confirmed || 0) + (orderStats.processing || 0)}
                      </div>
                    </div>
                    <div className="stat-card">
                      <h3>Đã giao hàng</h3>
                      <div className="stat-number delivered">{orderStats.delivered || 0}</div>
                    </div>
                    <div className="stat-card">
                      <h3>Tổng doanh thu</h3>
                      <div className="stat-number revenue">{formatPrice(orderStats.totalRevenue || 0)}</div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="quick-actions">
                  <h2>Thao tác nhanh</h2>
                  <div className="action-buttons">
                    <button 
                      onClick={() => navigate('/admin/orders')}
                      className="action-btn orders-btn"
                    >
                      Quản lý đơn hàng
                    </button>
                    <button 
                      onClick={() => navigate('/admin/products')}
                      className="action-btn products-btn"
                    >
                      Quản lý sản phẩm
                    </button>
                    <button 
                      onClick={() => navigate('/admin/users')}
                      className="action-btn users-btn"
                    >
                      Quản lý người dùng
                    </button>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="recent-orders">
                  <h2>Đơn hàng gần đây</h2>
                  {orders.length === 0 ? (
                    <p>Chưa có đơn hàng nào</p>
                  ) : (
                    <div className="orders-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Mã đơn hàng</th>
                            <th>Khách hàng</th>
                            <th>Ngày đặt</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 10).map((order) => (
                            <tr key={order.id}>
                              <td>
                                <strong>#{order.orderNumber}</strong>
                              </td>
                              <td>
                                <div className="customer-info">
                                  <div>{order.shippingInfo?.receiverName || 'N/A'}</div>
                                  <div className="customer-email">{order.userEmail}</div>
                                </div>
                              </td>
                              <td>{formatDate(order.createdAt)}</td>
                              <td>{formatPrice(order.total)}</td>
                              <td>
                                <span className={`status-badge ${getStatusClass(order.status)}`}>
                                  {getStatusText(order.status)}
                                </span>
                              </td>
                              <td>
                                <button
                                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                                  className="view-btn"
                                >
                                  Xem
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {orders.length > 10 && (
                        <div className="view-all">
                          <button 
                            onClick={() => navigate('/admin/orders')}
                            className="view-all-btn"
                          >
                            Xem tất cả đơn hàng ({orders.length})
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;