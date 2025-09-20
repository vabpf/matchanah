// Product data for Matchanah matcha website
export const products = [
  // Sản phẩm riêng lẻ (Individual Products)
  {
    id: 1,
    name: "Bột Matcha Ceremonial Grade Premium",
    category: "individual",
    price: 299000,
    originalPrice: 349000,
    discount: 15,
    rating: 4.8,
    reviewCount: 124,
    image: "/src/assets/images/product-sample.jpg",
    description: "Bột matcha ceremonial grade cao cấp nhập khẩu từ Nhật Bản, thích hợp cho trà đạo truyền thống",
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: "Bột Matcha Culinary Grade",
    category: "individual",
    price: 199000,
    originalPrice: 229000,
    discount: 13,
    rating: 4.6,
    reviewCount: 89,
    image: "/src/assets/images/product-sample.jpg",
    description: "Bột matcha culinary grade chất lượng cao, hoàn hảo cho pha chế đồ uống và làm bánh",
    inStock: true,
    featured: true
  },
  {
    id: 3,
    name: "Matcha Latte Mix Premium",
    category: "individual",
    price: 159000,
    originalPrice: 179000,
    discount: 11,
    rating: 4.7,
    reviewCount: 156,
    image: "/src/assets/images/product-sample.jpg",
    description: "Hỗn hợp matcha latte sẵn sàng pha chế, hương vị đậm đà và béo ngậy",
    inStock: true,
    featured: false
  },
  {
    id: 4,
    name: "Bộ Dụng Cụ Pha Matcha Truyền Thống",
    category: "individual",
    price: 449000,
    originalPrice: 529000,
    discount: 15,
    rating: 4.9,
    reviewCount: 67,
    image: "/src/assets/images/product-sample.jpg",
    description: "Bộ dụng cụ pha matcha truyền thống gồm chawan, chasen và chashaku chính hãng từ Nhật Bản",
    inStock: true,
    featured: true
  },
  {
    id: 5,
    name: "Matcha Ice Cream Mix",
    category: "individual",
    price: 129000,
    originalPrice: 149000,
    discount: 13,
    rating: 4.5,
    reviewCount: 43,
    image: "/src/assets/images/product-sample.jpg",
    description: "Hỗn hợp làm kem matcha tại nhà, hương vị đặc trung và dễ dàng sử dụng",
    inStock: true,
    featured: false
  },
  {
    id: 6,
    name: "Matcha Cookie Mix",
    category: "individual",
    price: 99000,
    originalPrice: 119000,
    discount: 17,
    rating: 4.4,
    reviewCount: 78,
    image: "/src/assets/images/product-sample.jpg",
    description: "Hỗn hợp làm bánh quy matcha thơm ngon, dễ dàng thực hiện tại nhà",
    inStock: true,
    featured: false
  },

  // Combo sản phẩm (Product Combos)
  {
    id: 7,
    name: "Combo Matcha Starter Kit",
    category: "combo",
    price: 699000,
    originalPrice: 829000,
    discount: 16,
    rating: 4.8,
    reviewCount: 92,
    image: "/src/assets/images/product-sample.jpg",
    description: "Combo khởi đầu hoàn hảo gồm bột matcha ceremonial grade + bộ dụng cụ pha trà cơ bản",
    inStock: true,
    featured: true,
    items: [
      "Bột Matcha Ceremonial Grade Premium (30g)",
      "Chawan (chén pha matcha)",
      "Chasen (đũa tre đánh matcha)",
      "Hướng dẫn pha matcha chi tiết"
    ]
  },
  {
    id: 8,
    name: "Combo Matcha Professional",
    category: "combo",
    price: 999000,
    originalPrice: 1199000,
    discount: 17,
    rating: 4.9,
    reviewCount: 54,
    image: "/src/assets/images/product-sample.jpg",
    description: "Combo chuyên nghiệp với đầy đủ dụng cụ và matcha cao cấp cho người yêu trà đạo",
    inStock: true,
    featured: true,
    items: [
      "Bột Matcha Ceremonial Grade Premium (50g)",
      "Bộ dụng cụ pha matcha truyền thống đầy đủ",
      "Khăn lụa trà đạo",
      "Sách hướng dẫn trà đạo Nhật Bản"
    ]
  },
  {
    id: 9,
    name: "Combo Matcha Baking Set",
    category: "combo",
    price: 399000,
    originalPrice: 479000,
    discount: 17,
    rating: 4.6,
    reviewCount: 76,
    image: "/src/assets/images/product-sample.jpg",
    description: "Combo hoàn hảo cho việc làm bánh với matcha, gồm nhiều loại bột mix khác nhau",
    inStock: true,
    featured: false,
    items: [
      "Matcha Culinary Grade (100g)",
      "Matcha Cookie Mix (2 gói)",
      "Matcha Ice Cream Mix (1 gói)",
      "Công thức làm bánh matcha độc quyền"
    ]
  },
  {
    id: 10,
    name: "Combo Matcha Family Pack",
    category: "combo",
    price: 599000,
    originalPrice: 699000,
    discount: 14,
    rating: 4.7,
    reviewCount: 38,
    image: "/src/assets/images/product-sample.jpg",
    description: "Combo gia đình với đa dạng sản phẩm matcha cho mọi thành viên",
    inStock: true,
    featured: true,
    items: [
      "Matcha Ceremonial Grade (30g)",
      "Matcha Latte Mix (3 gói)",
      "Matcha Cookie Mix (2 gói)",
      "Cốc sứ cao cấp (2 chiếc)"
    ]
  },
  {
    id: 11,
    name: "Combo Matcha Gift Set",
    category: "combo",
    price: 799000,
    originalPrice: 949000,
    discount: 16,
    rating: 4.8,
    reviewCount: 29,
    image: "/src/assets/images/product-sample.jpg",
    description: "Combo quà tặng cao cấp trong hộp gỗ sang trọng, phù hợp làm quà biếu",
    inStock: true,
    featured: false,
    items: [
      "Matcha Ceremonial Grade Premium (50g)",
      "Bộ dụng cụ pha matcha mini",
      "Hộp gỗ cao cấp",
      "Thiệp chúc mừng đặc biệt"
    ]
  }
];

// Product categories for filtering
export const productCategories = [
  {
    id: 'all',
    name: 'Tất cả sản phẩm',
    slug: 'all'
  },
  {
    id: 'individual',
    name: 'Sản phẩm riêng lẻ',
    slug: 'individual'
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
export const getProductById = (id) => products.find(product => product.id === parseInt(id));
export const searchProducts = (query) => {
  return products.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase())
  );
};
