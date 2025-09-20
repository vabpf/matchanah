import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getProductById } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = getProductById(id);

  if (!product) {
    return (
      <div className="product-detail-page">
        <Header />
        <main className="product-detail-main">
          <section className="product-detail-content">
            <div className="container">
              <h1>Sản phẩm không tồn tại</h1>
              <p>Xin lỗi, sản phẩm bạn đang tìm kiếm không tồn tại.</p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-detail-page">
      <Header />
      <main className="product-detail-main">
        <section className="product-detail-content">
          <div className="container">
            <div className="product-detail-grid">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h1>{product.name}</h1>
                <div className="product-price">
                  <span className="current-price">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="original-price">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
                <p className="product-description">{product.description}</p>
                <button onClick={handleAddToCart} className="hero-cta-button">
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
