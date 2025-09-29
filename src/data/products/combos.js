// Combo sản phẩm matcha - Product Combos
export const combos = [
  {
    id: 'combo-1',
    name: 'Combo "Tập sự Matcha" - 1',
    category: 'combo',
    price: 232000,
    originalPrice: Math.round( (129000 + 129000) * 100 / 90 ), // giả sử 10% tiết kiệm
    discount: 10,
    reviewCount: 0,
    image: '/images/combo 1.png',
    description: 'Combo cơ bản dành cho người mới: Chổi Chasen + Bát Chawan.',
    inStock: true,
    featured: true,
    items: [
      'Bát Chawan',
      'Chổi Chasen'
    ],
    savings: (129000 + 129000) - 232000
  },
  {
    id: 'combo-2',
    name: 'Combo "Sơ cấp Matcha" - 2',
    category: 'combo',
    price: 492000,
    originalPrice: 547000,
    discount: 10,
    reviewCount: 0,
    image: '/images/combo 2.png',
    description: 'Combo sơ cấp gồm Matcha Haru 50g và dụng cụ cơ bản.',
    inStock: true,
    featured: true,
    items: [
      'Matcha Haru 50g',
      'Bát Chawan',
      'Chổi Chasen'
    ],
    savings: 547000 - 492000
  },
  {
    id: 'combo-3',
    name: 'Combo "Bậc thầy Trà đạo" - 3',
    category: 'combo',
    price: 698000,
    originalPrice: 776000,
    discount: 10,
    reviewCount: 0,
    image: '/images/combo 3.png',
    description: 'Combo đầy đủ cho người đam mê trà đạo với đầy đủ dụng cụ và matcha Haru 50g.',
    inStock: true,
    featured: true,
    items: [
      'Matcha Haru 50g',
      'Bát Chawan',
      'Chổi Chasen',
      'Muỗng Chashaku',
      'Đế gác chổi',
      'Ca đong định lượng',
      'Cân tiểu ly',
      'Rây lọc'
    ],
    savings: 776000 - 698000
  }
];