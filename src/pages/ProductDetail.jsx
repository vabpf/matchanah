import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProductById, products } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = getProductById(id);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  // Mock data for enhanced features
  const productImages = [
    product.image,
    product.image,
    product.image
  ];

  const preparationSteps = [
    {
      number: 1,
      title: "Chuẩn bị",
      description: "Cho 1 thìa cà phê bột matcha vào chén"
    },
    {
      number: 2,
      title: "Thêm nước",
      description: "Rót 60ml nước nóng 70-80°C vào chén"
    },
    {
      number: 3,
      title: "Đánh đều",
      description: "Dùng chasen đánh theo hình chữ M trong 20 giây"
    },
    {
      number: 4,
      title: "Thưởng thức",
      description: "Thêm nước hoặc sữa theo sở thích và thưởng thức"
    }
  ];

  const benefits = [
    {
      icon: "🌱",
      title: "100% Tự nhiên",
      description: "Không chất bảo quản, không đường nhân tạo"
    },
    {
      icon: "⚡",
      title: "Tăng năng lượng",
      description: "Cung cấp năng lượng bền vững không gây hồi hộp"
    },
    {
      icon: "🧠",
      title: "Tăng tập trung",
      description: "L-theanine giúp tăng khả năng tập trung"
    },
    {
      icon: "💚",
      title: "Chống oxy hóa",
      description: "Giàu catechin và EGCG tốt cho sức khỏe"
    }
  ];

  const comparisonData = [
    {
      name: "Matcha",
      logo: null,
      sugar: "<1g",
      calories: "<20cal",
      flavors: "9 hương vị",
      highlighted: true
    },
    {
      name: "Cà phê",
      logo: null,
      sugar: "16g",
      calories: "100 Cal",
      flavors: "Giới hạn",
      highlighted: false
    },
    {
      name: "Trà sữa",
      logo: null,
      sugar: "9g",
      calories: "40 Cal",
      flavors: "Trung bình",
      highlighted: false
    }
  ];

  // Get related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star">☆</span>);
    }

    return stars;
  };

  return (
    <div className="product-detail-page">
      <Header />
      <main className="product-detail-main">
        {/* Product Detail Section */}
        <section className="product-detail-content">
          <div className="container">
            <div className="product-detail-grid">
              {/* Product Images */}
              <div className="product-image-section">
                <div className="product-image-main">
                  <img src={productImages[activeImageIndex]} alt={product.name} />
                  <div className="product-badges">
                    {product.featured && (
                      <span className="badge new-badge">Nổi bật</span>
                    )}
                    {product.category === 'combo' && (
                      <span className="badge detail-combo-badge">Combo</span>
                    )}
                  </div>
                </div>
                <div className="product-thumbnails">
                  {productImages.map((image, index) => (
                    <div
                      key={index}
                      className={`thumbnail ${activeImageIndex === index ? 'active' : ''}`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="product-info-section">
                <h1 className="product-title">{product.name}</h1>
                
                <div className="product-rating-section">
                  <div className="product-rating">
                    <div className="stars">{renderStars(product.rating)}</div>
                    <span className="review-count">({product.reviewCount} đánh giá)</span>
                  </div>
                  <span className="based-on-reviews">Dựa trên {product.reviewCount} đánh giá</span>
                </div>

                <div className="product-price-section">
                  <div className="price-row">
                    <span className="current-price">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <>
                        <span className="original-price">{formatPrice(product.originalPrice)}</span>
                        <span className="discount-percentage">Giảm {product.discount}%</span>
                      </>
                    )}
                  </div>
                  <div className="shipping-info">
                    <a href="#">Phí vận chuyển</a> được tính khi thanh toán.
                  </div>
                </div>

                <div className="product-description">
                  {product.description}
                </div>

                {product.specifications && (
                  <div className="product-specifications">
                    <h3>Thông số sản phẩm</h3>
                    <div className="specs-grid">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="spec-row">
                          <span className="spec-label">
                            {key === 'origin' ? 'Xuất xứ' :
                             key === 'grade' ? 'Cấp độ' :
                             key === 'weight' ? 'Trọng lượng' :
                             key === 'color' ? 'Màu sắc' :
                             key === 'taste' ? 'Hương vị' : key}:
                          </span>
                          <span className="spec-value">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="product-actions">
                  <div className="quantity-section">
                    <span className="quantity-label">Số lượng:</span>
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn" 
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        −
                      </button>
                      <input 
                        type="number" 
                        className="quantity-input" 
                        value={quantity} 
                        readOnly 
                      />
                      <button 
                        className="quantity-btn" 
                        onClick={() => handleQuantityChange(1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="action-buttons">
                    <button onClick={handleAddToCart} className="add-to-cart-btn">
                      Thêm vào giỏ hàng
                    </button>
                    <button className="buy-now-btn">
                      Mua ngay
                    </button>
                  </div>
                </div>

                <div className="product-features">
                  <div className="features-grid">
                    <div className="feature-item">
                      <div className="feature-icon">🌱</div>
                      <div className="feature-text">100% Thuần chay</div>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">🚫</div>
                      <div className="feature-text">Không Gluten</div>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">🧬</div>
                      <div className="feature-text">Không GMO</div>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">🥛</div>
                      <div className="feature-text">Không sữa</div>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">🎨</div>
                      <div className="feature-text">Không màu nhân tạo</div>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">🌾</div>
                      <div className="feature-text">Không đậu nành</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Show additional sections only for matcha powder and combo products */}
        {(product.category === 'matcha-powder' || product.category === 'combo') && (
          <>
            {/* How to Make Section */}
            <section className="how-to-make-section">
              <div className="container">
                <h2>Cách pha Matcha</h2>
                <div className="preparation-steps">
                  {preparationSteps.map((step, index) => (
                    <div key={index} className="step-item">
                      <div className="step-number">{step.number}</div>
                      <h3 className="step-title">{step.title}</h3>
                      <p className="step-description">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Ingredients Section */}
            <section className="ingredients-section">
              <div className="container">
                <h2>Thành phần</h2>
                <div className="ingredients-content">
                  <div className="ingredients-text">
                    <h3>Matcha tinh khiết, mạnh mẽ</h3>
                    <p>Hương vị tuyệt vời!</p>
                    <p>Mỗi khẩu phần chứa dưới 20 calo và ít hơn 1 gram đường. Công thức của chúng tôi thuần chay, không gluten, không GMO và không có hương liệu nhân tạo.</p>
                  </div>
                  <div className="ingredients-image">
                    <img src={product.image} alt="Thành phần matcha" />
                  </div>
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits-section">
              <div className="container">
                <h2>Lợi ích tuyệt vời</h2>
                <p className="benefits-subtitle">Năng lượng sạch, tinh thần thư thái</p>
                <div className="detail-benefits-grid">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="benefit-item">
                      <div className="benefit-icon">{benefit.icon}</div>
                      <h3 className="benefit-title">{benefit.title}</h3>
                      <p className="benefit-description">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Comparison Section */}
            <section className="comparison-section">
              <div className="container">
                <h2>Luôn vượt trội hơn những sản phẩm khác</h2>
                <div className="comparison-grid">
                  {comparisonData.map((item, index) => (
                    <div key={index} className={`comparison-item ${item.highlighted ? 'highlighted' : ''}`}>
                      {item.logo ? (
                        <img src={item.logo} alt={item.name} className="comparison-logo" />
                      ) : (
                        <h3>{item.name}</h3>
                      )}
                      <div className="comparison-stats">
                        <div className="stat-item">
                          <span className="stat-label">Đường</span>
                          <span className="stat-value">{item.sugar}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Calo</span>
                          <span className="stat-value">{item.calories}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Hương vị</span>
                          <span className="stat-value">{item.flavors}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="related-products-section">
            <div className="container">
              <h2>Sản phẩm liên quan</h2>
              <div className="related-products-grid">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
