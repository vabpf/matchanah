// API service for product-related requests
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase.js';

class ProductService {
  constructor() {
    this.collectionName = 'products';
    this.categoriesCollection = 'categories';
  }

  // Get all products with optional filtering
  async getProducts(filters = {}) {
    try {
      let q = collection(db, this.collectionName);

      // Apply filters
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      if (filters.isActive !== undefined) {
        q = query(q, where('isActive', '==', filters.isActive));
      }
      if (filters.minPrice) {
        q = query(q, where('price', '>=', filters.minPrice));
      }
      if (filters.maxPrice) {
        q = query(q, where('price', '<=', filters.maxPrice));
      }

      // Apply ordering
      if (filters.orderBy) {
        q = query(q, orderBy(filters.orderBy, filters.orderDirection || 'asc'));
      }

      // Apply limit
      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      // Apply pagination
      if (filters.startAfter) {
        q = query(q, startAfter(filters.startAfter));
      }

      const querySnapshot = await getDocs(q);
      const products = [];

      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return {
        success: true,
        data: products
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get single product by ID
  async getProduct(productId) {
    try {
      const docRef = doc(db, this.collectionName, productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          success: true,
          data: {
            id: docSnap.id,
            ...docSnap.data()
          }
        };
      } else {
        return {
          success: false,
          error: 'Product not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search products by name or description
  async searchProducts(searchTerm, filters = {}) {
    try {
      // Note: Firestore doesn't support full-text search natively
      // For a production app, consider using Algolia or similar service
      const products = await this.getProducts(filters);
      
      if (products.success) {
        const filteredProducts = products.data.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.tags && product.tags.some(tag => 
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ))
        );

        return {
          success: true,
          data: filteredProducts
        };
      }

      return products;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get products by category
  async getProductsByCategory(category) {
    return this.getProducts({ category, isActive: true });
  }

  // Get featured products
  async getFeaturedProducts(limitCount = 8) {
    return this.getProducts({ 
      isActive: true, 
      featured: true, 
      limit: limitCount,
      orderBy: 'createdAt',
      orderDirection: 'desc'
    });
  }

  // Add new product (admin only)
  async addProduct(productData) {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      });

      return {
        success: true,
        data: {
          id: docRef.id,
          ...productData
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update product (admin only)
  async updateProduct(productId, productData) {
    try {
      const docRef = doc(db, this.collectionName, productId);
      await updateDoc(docRef, {
        ...productData,
        updatedAt: new Date()
      });

      return {
        success: true,
        message: 'Product updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete product (admin only)
  async deleteProduct(productId) {
    try {
      await deleteDoc(doc(db, this.collectionName, productId));
      return {
        success: true,
        message: 'Product deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload product image
  async uploadProductImage(file, productId) {
    try {
      const imageRef = ref(storage, `products/${productId}/${file.name}`);
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        success: true,
        data: {
          url: downloadURL,
          path: snapshot.ref.fullPath
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete product image
  async deleteProductImage(imagePath) {
    try {
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
      return {
        success: true,
        message: 'Image deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get product categories
  async getCategories() {
    try {
      const querySnapshot = await getDocs(collection(db, this.categoriesCollection));
      const categories = [];

      querySnapshot.forEach((doc) => {
        categories.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return {
        success: true,
        data: categories
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Listen to products in real-time
  onProductsSnapshot(callback, filters = {}) {
    let q = collection(db, this.collectionName);

    // Apply filters (similar to getProducts)
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.isActive !== undefined) {
      q = query(q, where('isActive', '==', filters.isActive));
    }

    return onSnapshot(q, (querySnapshot) => {
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(products);
    });
  }

  // Get related products
  async getRelatedProducts(productId, category, limitCount = 4) {
    try {
      let q = query(
        collection(db, this.collectionName),
        where('category', '==', category),
        where('isActive', '==', true),
        limit(limitCount + 1) // Get one extra to exclude current product
      );

      const querySnapshot = await getDocs(q);
      const products = [];

      querySnapshot.forEach((doc) => {
        if (doc.id !== productId) { // Exclude current product
          products.push({
            id: doc.id,
            ...doc.data()
          });
        }
      });

      return {
        success: true,
        data: products.slice(0, limitCount) // Ensure we return the requested limit
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new ProductService();
