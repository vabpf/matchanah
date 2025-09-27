import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';

const Checkout = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Lấy dữ liệu đơn hàng từ localStorage
    const stored = localStorage.getItem('orderData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setOrderData(parsed);
      } catch (err) {
        console.error('Lỗi parse order data:', err);
        navigate('/cart');
      }
    } else {
      // Nếu không có dữ liệu đơn hàng, chuyển về giỏ hàng
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

  const generateOrderId = () => {
    return 'ORD' + Date.now().toString().slice(-6).toUpperCase();
  };

  const handleConfirmOrder = async () => {
    setProcessing(true);
    
    try {
      if (paymentMethod === 'VietQR') {
        // Chuyển đến trang thanh toán VietQR
        navigate('/qr-payment');
        return;
      }

      // COD payment - create order directly
      const orderToCreate = {
        items: orderData.items,
        total: orderData.total,
        subtotal: orderData.total,
        shippingCost: 0,
        tax: 0,
        shippingInfo: orderData.shippingInfo,
        paymentMethod: orderData.paymentMethod,
        couponCode: orderData.couponCode || '',
        status: 'pending',
        notes: '',
        orderNumber: 'ORD-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      };

      const result = await createOrder(orderToCreate);
      
      if (result.success) {
        clearCart();
        localStorage.removeItem('orderData');
        
        navigate('/order-success', { 
          state: { 
            orderId: result.data.orderId,
            orderNumber: orderToCreate.orderNumber
          } 
        });
      } else {
        throw new Error(result.error || 'Lỗi khi tạo đơn hàng');
      }
      
    } catch (error) {
      console.error('Lỗi xử lý đơn hàng:', error);
      alert('Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <Header />
        <main className="checkout-main">
          <div className="container">
            <div className="loading-message">Đang tải thông tin đơn hàng...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="checkout-page">
        <Header />
        <main className="checkout-main">
          <div className="container">
            <div className="error-message">Không tìm thấy thông tin đơn hàng</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { items, total, shippingInfo, paymentMethod } = orderData;

  return (
    <div className="checkout-page">
      <Header />
      <main className="checkout-main">
        <section className="checkout-content">
          <div className="container">
            <h1>Xác nhận đơn hàng</h1>
            
            <div className="checkout-layout">
              <div className="order-summary">
                <h2>Thông tin đơn hàng</h2>
                
                {/* Thông tin giao hàng */}
                <div className="section-card">
                  <h3>Thông tin giao hàng</h3>
                  <div className="shipping-details">
                    <p><strong>Người nhận:</strong> {shippingInfo.receiverName}</p>
                    <p><strong>Số điện thoại:</strong> {shippingInfo.phone}</p>
                    <p><strong>Địa chỉ:</strong> {shippingInfo.address}</p>
                    <p><strong>Phường/Xã:</strong> {shippingInfo.ward}</p>
                    <p><strong>Quận/Huyện:</strong> {shippingInfo.district}</p>
                    <p><strong>Tỉnh/Thành phố:</strong> {shippingInfo.province}</p>
                  </div>
                </div>
                
                {/* Phương thức thanh toán */}
                <div className="section-card">
                  <h3>Phương thức thanh toán</h3>
                  <p className="payment-method">
                    {paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Thanh toán qua VietQR'}
                  </p>
                </div>
                
                {/* Danh sách sản phẩm */}
                <div className="section-card">
                  <h3>Sản phẩm đã đặt</h3>
                  <div className="order-items">
                    {items.map((item) => (
                      <div key={item.id} className="order-item">
                        <div className="item-image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="item-info">
                          <h4>{item.name}</h4>
                          <p>Đơn giá: {formatPrice(item.price)}</p>
                          <p>Số lượng: {item.quantity}</p>
                        </div>
                        <div className="item-total">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="order-confirmation">
                <div className="confirmation-card">
                  <h3>Tổng đơn hàng</h3>
                  <div className="order-total">
                    <div className="total-row">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="total-row">
                      <span>Phí vận chuyển:</span>
                      <span>Miễn phí</span>
                    </div>
                    <div className="total-row final-total">
                      <span>Tổng cộng:</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleConfirmOrder}
                    disabled={processing}
                    className="confirm-order-btn"
                  >
                    {processing ? 'Đang xử lý...' : 
                     paymentMethod === 'VietQR' ? 'Thanh toán ngay' : 'Xác nhận đặt hàng'}
                  </button>
                  
                  <button
                    onClick={() => navigate('/cart')}
                    className="back-to-cart-btn"
                    disabled={processing}
                  >
                    Quay lại giỏ hàng
                  </button>
                </div>
                
                {paymentMethod === 'COD' && (
                  <div className="payment-note">
                    <h4>Lưu ý thanh toán COD:</h4>
                    <ul>
                      <li>Bạn sẽ thanh toán khi nhận hàng</li>
                      <li>Vui lòng chuẩn bị đủ tiền mặt</li>
                      <li>Kiểm tra kỹ sản phẩm trước khi thanh toán</li>
                    </ul>
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

export default Checkout;
