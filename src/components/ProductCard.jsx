import React, { useState } from 'react';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const [showAllItems, setShowAllItems] = useState(false);
  const [showTooltip, setShowTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

  const {
    id,
    name,
    price,
    originalPrice,
    discount,
    rating,
    reviewCount,
    image,
    description,
    inStock,
    category,
    items
  } = product;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

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
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }

    return stars;
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  const handleMouseEnter = (e, content) => {
    const rect = e.target.getBoundingClientRect();
    setShowTooltip({
      show: true,
      content,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleMouseLeave = () => {
    setShowTooltip({ show: false, content: '', x: 0, y: 0 });
  };

  const toggleItemsDisplay = (e) => {
    e.stopPropagation();
    setShowAllItems(!showAllItems);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="product-card" onClick={handleViewDetails}>
      <div className="product-image">
        <img src={image} alt={name} loading="lazy" />
        {discount > 0 && (
          <div className="discount-badge">
            -{discount}%
          </div>
        )}
        {!inStock && (
          <div className="out-of-stock-overlay">
            <span>Hết hàng</span>
          </div>
        )}
        {category === 'combo' && (
          <div className="combo-badge">
            Combo
          </div>
        )}
      </div>
      
      <div className="product-details">
        <div className="product-rating">
          <div className="stars">
            {renderStars(rating)}
          </div>
          <span className="review-count">({reviewCount} đánh giá)</span>
        </div>
        
        <div className="product-info">
          <h3 
            className="product-title"
            onMouseEnter={name.length > 50 ? (e) => handleMouseEnter(e, name) : undefined}
            onMouseLeave={name.length > 50 ? handleMouseLeave : undefined}
          >
            {truncateText(name, 50)}
          </h3>
          <div className="product-price">
            <span className="card-current-price">{formatPrice(price)}</span>
            {originalPrice && originalPrice > price && (
              <span className="card-original-price">{formatPrice(originalPrice)}</span>
            )}
          </div>
        </div>
        
        <p 
          className="product-description"
          onMouseEnter={description.length > 80 ? (e) => handleMouseEnter(e, description) : undefined}
          onMouseLeave={description.length > 80 ? handleMouseLeave : undefined}
        >
          {truncateText(description, 80)}
        </p>
        
        {category === 'combo' && items && (
          <div className="combo-items">
            <h4>Bao gồm:</h4>
            <ul>
              {(showAllItems ? items : items.slice(0, 2)).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
              {items.length > 2 && !showAllItems && (
                <li className="more-items">
                  <button 
                    className="show-more-btn" 
                    onClick={toggleItemsDisplay}
                  >
                    + {items.length - 2} sản phẩm khác
                  </button>
                </li>
              )}
              {showAllItems && items.length > 2 && (
                <li className="more-items">
                  <button 
                    className="show-less-btn" 
                    onClick={toggleItemsDisplay}
                  >
                    Thu gọn
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
        
        <div className="product-actions">
          <button 
            className={`add-to-cart-btn ${!inStock ? 'disabled' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={!inStock}
          >
            {inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
          </button>
        </div>
      </div>
      
      {/* Tooltip */}
      {showTooltip.show && (
        <div 
          className="product-tooltip"
          style={{
            position: 'fixed',
            left: showTooltip.x,
            top: showTooltip.y,
            transform: 'translateX(-50%)',
            zIndex: 1000
          }}
        >
          {showTooltip.content}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
