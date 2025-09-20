import React from 'react';
import ProductCard from './ProductCard';
import Loading from './Loading';

const ProductGrid = ({ 
  products, 
  loading = false, 
  onAddToCart, 
  onViewDetails,
  emptyMessage = "Không tìm thấy sản phẩm nào."
}) => {
  if (loading) {
    return (
      <div className="product-grid-loading">
        <Loading />
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="product-grid-empty">
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>Không có sản phẩm</h3>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-grid">
      <div className="grid-container">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
      
      {products.length > 0 && (
        <div className="grid-footer">
          <p className="product-count">
            Hiển thị {products.length} sản phẩm
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
