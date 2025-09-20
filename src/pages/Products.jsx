import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products, productCategories, getProductsByCategory, searchProducts } from '../data/products';
import ProductGrid from '../components/ProductGrid';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const Products = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // featured, price-low, price-high, name
  const [loading, setLoading] = useState(false);

  // Filter and search logic
  useEffect(() => {
    setLoading(true);
    
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      let results = [];
      
      if (searchQuery.trim()) {
        // If there's a search query, search all products
        results = searchProducts(searchQuery);
        if (activeCategory !== 'all') {
          results = results.filter(product => product.category === activeCategory);
        }
      } else {
        // If no search query, filter by category
        results = getProductsByCategory(activeCategory);
      }
      
      // Apply sorting
      results = sortProducts(results, sortBy);
      
      setFilteredProducts(results);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, sortBy]);

  const sortProducts = (products, sortType) => {
    const sorted = [...products];
    
    switch (sortType) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'featured':
      default:
        return sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
    }
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // Could add toast notification here
    console.log('Added to cart:', product.name);
  };

  const handleViewDetails = (product) => {
    navigate(`/products/${product.id}`);
  };

  const getEmptyMessage = () => {
    if (searchQuery.trim()) {
      return `Không tìm thấy sản phẩm nào cho "${searchQuery}".`;
    }
    return "Không có sản phẩm nào trong danh mục này.";
  };

  return (
    <div className="products-page">
      <Header />
      
      <main className="products-main">
        {/* Page Header */}
        <section className="products-header">
          <div className="container">
            <h1 className="page-title">Sản phẩm của chúng tôi</h1>
            <p className="page-subtitle">
              Khám phá bộ sưu tập matcha cao cấp từ Nhật Bản dành cho sinh viên
            </p>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="products-controls">
          <div className="container">
            <div className="controls-wrapper">
              {/* Search Bar */}
              <div className="search-section">
                <SearchBar 
                  onSearch={handleSearch}
                  placeholder="Tìm kiếm sản phẩm matcha..."
                  value={searchQuery}
                />
              </div>

              {/* Category Filters */}
              <div className="category-filters">
                {productCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="sort-section">
                <label htmlFor="sort-select">Sắp xếp theo:</label>
                <select 
                  id="sort-select"
                  value={sortBy} 
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="sort-select"
                >
                  <option value="featured">Nổi bật</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                  <option value="name">Tên A-Z</option>
                  <option value="rating">Đánh giá cao nhất</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="products-content">
          <div className="container">
            {searchQuery && (
              <div className="search-results-info">
                <p>
                  {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${filteredProducts.length} kết quả cho "${searchQuery}"`}
                </p>
              </div>
            )}
            
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
              emptyMessage={getEmptyMessage()}
            />
          </div>
        </section>

        {/* Featured Banner */}
        {!searchQuery && activeCategory === 'all' && (
          <section className="products-banner">
            <div className="container">
              <div className="banner-content">
                <h2>Giao hàng miễn phí</h2>
                <p>Tận hưởng giao hàng miễn phí toàn quốc với hóa đơn từ 99.000đ</p>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Products;
