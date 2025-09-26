import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useShipping } from '../hooks/useShipping';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { 
    shippingInfo, 
    updateShippingInfo, 
    saveShippingInfo, 
    validateShippingInfo 
  } = useShipping();
  const navigate = useNavigate();
  
  // State cho phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [saveShippingForLater, setSaveShippingForLater] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleInputChange = (field, value) => {
    updateShippingInfo({ [field]: value });
  };

  const validateForm = () => {
    const shippingValidation = validateShippingInfo();
    return shippingValidation.isValid && paymentMethod;
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      const shippingValidation = validateShippingInfo();
      if (!shippingValidation.isValid) {
        alert(shippingValidation.message);
        return;
      }
      if (!paymentMethod) {
        alert('Vui lòng chọn phương thức thanh toán');
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Save shipping info if user is authenticated and checkbox is checked
      if (isAuthenticated && saveShippingForLater) {
        await saveShippingInfo();
      }

      // Prepare order data with cart items converted to order format
      const orderItems = cartItems.map(item => ({
        productId: item.id,
        productName: item.name,
        productImage: item.image,
        quantity: item.quantity,
        price: item.price
      }));

      const orderData = {
        items: orderItems,
        total: getCartTotal(),
        shippingInfo,
        paymentMethod,
        couponCode
      };
      
      localStorage.setItem('orderData', JSON.stringify(orderData));
      
      if (paymentMethod === 'VietQR') {
        navigate('/qr-payment');
      } else {
        navigate('/checkout');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <Header />
        <main className="cart-main">
          <section className="cart-content">
            <div className="container">
              <h1>Giỏ hàng của bạn</h1>
              <div className="empty-cart">
                <p>Giỏ hàng của bạn đang trống</p>
                <Link to="/products" className="hero-cta-button">
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Header />
      <main className="cart-main">
        <section className="cart-content">
          <div className="container">
            {/* Thông tin giao hàng */}
            <div className="shipping-info-section">
              <h2 className="section-title">Thông tin giao hàng</h2>
              <div className="shipping-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Họ tên người nhận</label>
                    <input
                      type="text"
                      value={shippingInfo.receiverName}
                      onChange={(e) => handleInputChange('receiverName', e.target.value)}
                      placeholder="Nhập họ tên"
                    />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                      type="text"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Tỉnh / Thành phố</label>
                    <input
                      type="text"
                      value={shippingInfo.province}
                      onChange={(e) => handleInputChange('province', e.target.value)}
                      placeholder="Chọn tỉnh/thành phố"
                    />
                  </div>
                  <div className="form-group">
                    <label>Quận / Huyện</label>
                    <input
                      type="text"
                      value={shippingInfo.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      placeholder="Chọn quận/huyện"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Phường / Xã</label>
                    <input
                      type="text"
                      value={shippingInfo.ward}
                      onChange={(e) => handleInputChange('ward', e.target.value)}
                      placeholder="Chọn phường/xã"
                    />
                  </div>
                  <div className="form-group">
                    <label>Địa chỉ chi tiết</label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Nhập địa chỉ nhận hàng"
                    />
                  </div>
                </div>
                
                {isAuthenticated && (
                  <div className="form-row">
                    <div className="form-group save-shipping">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={saveShippingForLater}
                          onChange={(e) => setSaveShippingForLater(e.target.checked)}
                        />
                        <span>Lưu thông tin này cho lần mua hàng tiếp theo</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Danh sách sản phẩm và tổng cộng */}
            <div className="cart-layout">
              <div className="cart-items-section">
                <h2>Giỏ hàng của bạn</h2>
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p className="item-price">{formatPrice(item.price)}</p>
                      </div>
                      <div className="item-quantity">
                        <button 
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button 
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <div className="item-total">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="remove-item-btn"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="continue-shopping">
                  <Link to="/products" className="continue-shopping-btn">
                    ← Tiếp tục mua sắm
                  </Link>
                </div>
              </div>

              <div className="cart-summary-section">
                <div className="summary-card">
                  <h3 className="summary-title">Tổng cộng</h3>
                  <div className="total-price">
                    Tổng tiền: <strong>{formatPrice(getCartTotal())}</strong>
                  </div>
                  
                  <div className="payment-methods">
                    <h4>Phương thức thanh toán:</h4>
                    <div className="payment-options">
                      <label className="payment-option">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={paymentMethod === 'COD'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span>Thanh toán khi nhận hàng (COD)</span>
                      </label>
                      <label className="payment-option">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="VietQR"
                          checked={paymentMethod === 'VietQR'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span>Thanh toán qua VietQR</span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={!validateForm() || isProcessing}
                    className="checkout-btn"
                  >
                    {isProcessing 
                      ? 'Đang xử lý...' 
                      : paymentMethod === 'VietQR' 
                        ? 'Thanh toán qua VietQR' 
                        : 'Xác nhận đặt hàng'
                    }
                  </button>
                </div>

                <div className="coupon-card">
                  <h4>Mã giảm giá</h4>
                  <div className="coupon-input">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Nhập mã..."
                    />
                    <button className="apply-coupon-btn">Áp dụng</button>
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

export default CartPage;
