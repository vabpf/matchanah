import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
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
            <h1>Giỏ hàng của bạn</h1>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>{formatPrice(item.price)}</p>
                  </div>
                  <div className="item-quantity">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div className="item-total">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="remove-item">
                    Xóa
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h2>Tổng cộng: {formatPrice(getCartTotal())}</h2>
              <Link to="/checkout" className="hero-cta-button">
                Thanh toán
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
