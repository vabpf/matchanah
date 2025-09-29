// Dụng cụ trà đạo và pha chế matcha - Tea Tools & Equipment
export const teaTools = [
  {
    id: 1,
    name: 'Ca đong định lượng',
    category: 'tea-tools',
    price: 19000,
    originalPrice: 19000,
    discount: 0,
    
    reviewCount: 20,
    image: 'https://chaloglass.vn/wp-content/uploads/ly-dong-nhua-chia-vach-co-quai-50ml-100ml-250ml-500ml-1.jpg',
  description: 'Ca đong 100ml giúp bạn đo lường chính xác nguyên liệu cho mọi công thức pha chế, đảm bảo tỷ lệ chuẩn và tiện lợi khi sử dụng.',
    inStock: true,
    featured: false,
    specifications: {
      capacity: '100ml',
      material: 'Nhựa thực phẩm',
      origin: 'Việt Nam'
    }
  },
  {
    id: 2,
    name: 'Cân tiểu ly',
    category: 'tea-tools',
    price: 139000,
    originalPrice: 139000,
    discount: 0,
    
    reviewCount: 15,
    image: 'https://i.postimg.cc/598RtcrP/1.png',
  description: 'Cân tiểu ly cho phép bạn cân chính xác từng gam nguyên liệu, phù hợp cho pha chế matcha, cà phê hoặc làm bánh tại nhà.',
    inStock: true,
    featured: false,
    specifications: {
      minWeight: '0.1g',
      maxWeight: '500g',
      material: 'Nhựa, điện tử',
      origin: 'Trung Quốc'
    }
  },
  {
    id: 3,
    name: 'Lọ Đựng Siro 250ml',
    category: 'tea-tools',
    price: 25000,
    originalPrice: 25000,
    discount: 0,
    
    reviewCount: 10,
    image: 'https://viettuantea.vn/wp-content/uploads/2020/09/7-Lo-dung-siro-680ml.jpg',
  description: 'Lọ đựng siro 250ml giúp bảo quản siro hoặc các loại sốt một cách ngăn nắp, dễ rót và tiện lợi khi pha chế đồ uống.',
    inStock: true,
    featured: false,
    specifications: {
      capacity: '250ml',
      material: 'Nhựa thực phẩm',
      origin: 'Việt Nam'
    }
  },
  {
    id: 4,
    name: 'Sữa tươi Mlekovita',
    category: 'tea-tools',
    price: 54000,
    originalPrice: 54000,
    discount: 0,
    
    reviewCount: 18,
    image: 'https://product.hstatic.net/1000107402/product/nguyenlieuphachesi.com_sua_tuoi_khong_duong_ba_lan_mlekovita_1_lit_1_ae5d068f797543df90af9691d41b3b41.jpg',
  description: 'Sữa tươi Mlekovita nguyên kem nhập khẩu từ châu Âu, mang đến vị sữa đậm đà, thơm ngon cho các món matcha latte và pha chế.',
    inStock: true,
    featured: false,
    specifications: {
      volume: '1L',
      type: 'Sữa tươi nguyên kem',
      origin: 'Ba Lan'
    }
  },
  {
    id: 5,
    name: 'Sữa yến mạch Oatside',
    category: 'tea-tools',
    price: 69000,
    originalPrice: 69000,
    discount: 0,
    
    reviewCount: 12,
    image: 'https://hachihachi.com.vn/Uploads/_6/productimage/8997240600041-(1).jpg',
  description: 'Sữa yến mạch Oatside thuần chay, vị mát lành, thích hợp cho người ăn chay hoặc muốn thay thế sữa động vật trong pha chế.',
    inStock: true,
    featured: false,
    specifications: {
      volume: '1L',
      type: 'Sữa yến mạch',
      origin: 'Singapore'
    }
  },
  {
    id: 6,
    name: 'Sữa đặc Sao Phương Nam',
    category: 'tea-tools',
    price: 49000,
    originalPrice: 49000,
    discount: 0,
    
    reviewCount: 14,
    image: 'https://vn-test-11.slatic.net/shop/e1fd34a8320d256cfbebfe0d2fab558c.jpeg',
  description: 'Sữa đặc Sao Phương Nam 380g béo ngậy, dễ tan, giúp tăng vị ngọt và độ sánh cho các loại đồ uống và món tráng miệng.',
    inStock: true,
    featured: false,
    specifications: {
      weight: '380g',
      type: 'Sữa đặc',
      origin: 'Việt Nam'
    }
  },
  {
    id: 7,
    name: 'Máy đánh tạo bọt',
    category: 'tea-tools',
    price: 249000,
    originalPrice: 249000,
    discount: 0,
    
    reviewCount: 22,
    image: 'https://bizweb.dktcdn.net/thumb/1024x1024/100/488/110/products/uni00936.jpg?v=1748660909103g',
  description: 'Máy tạo bọt giúp đánh bọt sữa nhanh chóng, tạo lớp bọt mịn và đều cho ly matcha latte hoặc cà phê thêm hấp dẫn.',
    inStock: true,
    featured: false,
    specifications: {
      power: 'Pin AA',
      material: 'Nhựa, inox',
      origin: 'Trung Quốc'
    }
  },
  {
    id: 8,
    name: 'Sữa Vinamilk',
    category: 'tea-tools',
    price: 59000,
    originalPrice: 59000,
    discount: 0,
    
    reviewCount: 16,
    image: 'https://images-handler.kamereo.vn/eyJidWNrZXQiOiJpbWFnZS1oYW5kbGVyLXByb2QiLCJrZXkiOiJzdXBwbGllci82NTQvUFJPRFVDVF9JTUFHRS9iYWUzNWI2YS0wZTBjLTRiMzktYTFjZC1iMzE0ZDJjNmExZDMucG5nIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo1MDAsImhlaWdodCI6NTAwLCJmaXQiOiJmaWxsIn19fQ==',
  description: 'Sữa tươi TH true Milk 1 lít được làm từ sữa nguyên chất tự nhiên, phù hợp cho pha chế matcha latte, trà sữa và các loại đồ uống khác.',
    inStock: true,
    featured: false,
    specifications: {
      volume: '1L',
      type: 'Sữa tươi',
      origin: 'Việt Nam'
    }
  },
  {
    id: 9,
    name: 'Rây lọc',
    category: 'tea-tools',
    price: 34000,
    originalPrice: 34000,
    discount: 0,
    
    reviewCount: 11,
    image: 'https://i.postimg.cc/VLRZjqmn/2.png',
  description: 'Ray lọc inox 10cm giúp lọc mịn bột matcha hoặc trà, loại bỏ cặn và vón cục, đảm bảo đồ uống luôn mịn màng và thơm ngon.',
    inStock: true,
    featured: false,
    specifications: {
      diameter: '10cm',
      material: 'Inox',
      origin: 'Việt Nam'
    }
  }
];