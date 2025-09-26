import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';

const AdminOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const { orders, isLoading, error, fetchAllOrders, updateOrderStatus } = useOrders();
  const navigate = useNavigate();
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllOrders({ 
      orderBy: sortBy, 
      orderDirection: sortDirection 
    });
    setIsRefreshing(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    
    const notes = prompt('Ghi chú cho việc cập nhật trạng thái (tùy chọn):') || '';
    
    try {
      const result = await updateOrderStatus(orderId, newStatus, notes);
      
      if (result.success) {
        alert('Cập nhật trạng thái thành công');
      } else {
        alert('Lỗi: ' + result.error);
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setUpdatingOrder(null);
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

  const filteredAndSortedOrders = orders
    .filter(order => {
      if (statusFilter === 'all') return true;
      return order.status === statusFilter;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle Firestore timestamps
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = aValue?.seconds ? aValue.seconds : (new Date(aValue)).getTime() / 1000;
        bValue = bValue?.seconds ? bValue.seconds : (new Date(bValue)).getTime() / 1000;
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (!isAuthenticated || !user?.isAdmin) {
    return <Loading />;
  }

  return (
    <div className="admin-orders-page">
      <Header />
      <main className="admin-orders-main">
        <section className="admin-orders-content">
          <div className="container">
            <div className="page-header">
              <h1>Quản lý đơn hàng</h1>
              <div className="header-actions">
                <button 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="refresh-btn"
                >
                  {isRefreshing ? 'Đang tải...' : 'Làm mới'}
                </button>
                <button 
                  onClick={() => navigate('/admin')}
                  className="back-btn"
                >
                  ← Quay lại Dashboard
                </button>
              </div>
            </div>

            <div className="filters-and-sorting">
              <div className="filters">
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

              <div className="sorting">
                <label>Sắp xếp theo:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-field"
                >
                  <option value="createdAt">Ngày tạo</option>
                  <option value="total">Tổng tiền</option>
                  <option value="status">Trạng thái</option>
                </select>
                <select 
                  value={sortDirection} 
                  onChange={(e) => setSortDirection(e.target.value)}
                  className="sort-direction"
                >
                  <option value="desc">Giảm dần</option>
                  <option value="asc">Tăng dần</option>
                </select>
              </div>
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
            ) : filteredAndSortedOrders.length === 0 ? (
              <div className="empty-orders">
                <h3>Không có đơn hàng nào</h3>
                <p>Chưa có đơn hàng nào phù hợp với bộ lọc đã chọn.</p>
              </div>
            ) : (
              <div className="orders-table-container">
                <table className="orders-table">
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
                    {filteredAndSortedOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong>#{order.orderNumber}</strong>
                        </td>
                        <td>
                          <div className="customer-info">
                            <div className="customer-name">
                              {order.shippingInfo?.receiverName || 'N/A'}
                            </div>
                            <div className="customer-email">{order.userEmail}</div>
                            <div className="customer-phone">
                              {order.shippingInfo?.phone || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td className="order-total">{formatPrice(order.total)}</td>
                        <td>
                          <span className={`status-badge ${getStatusClass(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => navigate(`/admin/orders/${order.id}`)}
                              className="view-btn"
                            >
                              Chi tiết
                            </button>
                            
                            {getNextStatuses(order.status).length > 0 && (
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleStatusChange(order.id, e.target.value);
                                    e.target.value = ''; // Reset select
                                  }
                                }}
                                disabled={updatingOrder === order.id}
                                className="status-update-select"
                              >
                                <option value="">Cập nhật trạng thái</option>
                                {getNextStatuses(order.status).map(status => (
                                  <option key={status} value={status}>
                                    {getStatusText(status)}
                                  </option>
                                ))}
                              </select>
                            )}
                            
                            {updatingOrder === order.id && (
                              <span className="updating-status">Đang cập nhật...</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="orders-summary">
              <p>Hiển thị {filteredAndSortedOrders.length} đơn hàng</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AdminOrders;