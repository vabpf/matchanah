// Product data for Matchanah matcha website
import { matchaPowders } from './products/matchaPowders.js';
import { teaTools } from './products/teaTools.js';
import { teaCeremony } from './products/teaCeremony.js';
import { combos } from './products/combos.js';

// Kết hợp tất cả sản phẩm
export const products = [
  ...matchaPowders,
  ...teaTools,
  ...teaCeremony,
  ...combos
];

// Product categories for filtering
export const productCategories = [
  {
    id: 'all',
    name: 'Tất cả sản phẩm',
    slug: 'all'
  },
  {
    id: 'matcha-powder',
    name: 'Bột Matcha',
    slug: 'matcha-powder'
  },
  {
    id: 'tea-tools',
    name: 'Dụng cụ pha chế',
    slug: 'tea-tools'
  },
  {
    id: 'tea-ceremony',
    name: 'Dụng cụ trà đạo',
    slug: 'tea-ceremony'
  },
  {
    id: 'combo',
    name: 'Combo sản phẩm',
    slug: 'combo'
  }
];

// Helper functions
export const getFeaturedProducts = () => products.filter(product => product.featured);
export const getProductsByCategory = (category) => {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
};
export const getProductById = (id) => {
  // Xử lý cả string và number ID
  return products.find(product => 
    product.id === id || 
    product.id === parseInt(id) || 
    product.id === String(id)
  );
};
export const searchProducts = (query) => {
  return products.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase())
  );
};

// Export individual product arrays for specific use cases
export { matchaPowders, teaTools, teaCeremony, combos };
