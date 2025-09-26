# Firebase Setup Guide for Matchanah

## ✅ Completed Setup

Your Firebase integration is now ready! Here's what has been configured:

### 🔧 Configuration Files
- **Firebase Config**: `src/config/firebase.js` - Main Firebase initialization
- **App Config**: `src/config/config.js` - Environment configuration management
- **Environment**: `.env` and `.env.example` - Firebase credentials

### 📦 Services Implemented
- **Authentication Service**: `src/services/authService.js`
  - User registration, login, logout
  - Password reset and profile management
  - Real-time auth state monitoring

- **Product Service**: `src/services/productService.js`
  - Product CRUD operations
  - Image upload/management
  - Search and filtering
  - Category management
  - Real-time product updates

- **Order Service**: `src/services/orderService.js`
  - Order creation and management
  - Payment processing
  - Order status tracking
  - Order statistics
  - Real-time order updates

## 🚀 Next Steps

### 1. Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `matchanah-6688`
3. Enable these services:

#### Authentication
- Go to Authentication > Sign-in method
- Enable Email/Password authentication
- Optionally enable Google, Facebook, etc.

#### Firestore Database
- Go to Firestore Database
- Create database in production or test mode
- Set up security rules (see below)

#### Storage
- Go to Storage
- Get started with default settings
- Configure security rules for image uploads

### 2. Security Rules

#### Firestore Rules (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are readable by all, writable by admins only
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Orders are readable/writable by the user who created them
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Order items follow the same rules as orders
    match /orderItems/{itemId} {
      allow read, write: if request.auth != null &&
        (get(/databases/$(database)/documents/orders/$(resource.data.orderId)).data.userId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Categories are readable by all, writable by admins
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

#### Storage Rules (`storage.rules`)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Product images
    match /products/{productId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
        get(/databases/$(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // User profile images
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Sample Data Structure

#### Users Collection
```javascript
// /users/{userId}
{
  email: "user@example.com",
  displayName: "John Doe",
  firstName: "John",
  lastName: "Doe",
  phone: "+1234567890",
  role: "customer", // or "admin"
  isActive: true,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Products Collection
```javascript
// /products/{productId}
{
  name: "Premium Matcha Powder",
  description: "High-quality ceremonial grade matcha...",
  price: 29.99,
  category: "matcha-powders",
  images: ["url1", "url2"],
  tags: ["organic", "ceremonial", "premium"],
  stock: 100,
  featured: true,
  isActive: true,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Orders Collection
```javascript
// /orders/{orderId}
{
  userId: "user123",
  orderNumber: "ORD-123456789",
  status: "pending", // pending, paid, processing, shipped, delivered, cancelled
  total: 89.97,
  subtotal: 79.98,
  shipping: 9.99,
  tax: 0,
  paymentMethod: "card",
  paymentId: "payment123",
  shippingAddress: {
    street: "123 Main St",
    city: "City",
    state: "State",
    zipCode: "12345",
    country: "Country"
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 4. Usage Examples

#### Using Auth Service
```javascript
import authService from '../services/authService';

// Register
const result = await authService.register(email, password, {
  displayName: 'John Doe',
  firstName: 'John',
  lastName: 'Doe'
});

// Login
const loginResult = await authService.login(email, password);

// Listen to auth changes
authService.onAuthStateChanged((user) => {
  if (user) {
    console.log('User logged in:', user);
  } else {
    console.log('User logged out');
  }
});
```

#### Using Product Service
```javascript
import productService from '../services/productService';

// Get all products
const products = await productService.getProducts();

// Search products
const searchResults = await productService.searchProducts('matcha');

// Get featured products
const featured = await productService.getFeaturedProducts(6);
```

#### Using Order Service
```javascript
import orderService from '../services/orderService';

// Create order
const orderData = {
  userId: 'user123',
  items: [
    {
      productId: 'prod1',
      productName: 'Matcha Powder',
      quantity: 2,
      price: 29.99
    }
  ],
  total: 59.98,
  shippingAddress: { /* address object */ }
};

const order = await orderService.createOrder(orderData);
```

## 🔒 Security Notes

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use environment variables** - All Firebase config is loaded from environment
3. **Implement proper validation** - Validate data before sending to Firebase
4. **Set up proper security rules** - Control who can read/write data
5. **Monitor usage** - Keep an eye on Firebase usage and costs

## 🎯 Ready to Use!

Your Firebase setup is complete and ready for development. The services are designed to work with your existing React components and can be easily integrated into your e-commerce flow.