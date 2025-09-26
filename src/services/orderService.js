// API service for order processing
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
  onSnapshot,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

class OrderService {
  constructor() {
    this.ordersCollection = 'orders';
    this.orderItemsCollection = 'orderItems';
  }

  // Create new order
  async createOrder(orderData) {
    try {
      const result = await runTransaction(db, async (transaction) => {
        // Create order document
        const orderRef = doc(collection(db, this.ordersCollection));
        const orderId = orderRef.id;

        const order = {
          ...orderData,
          id: orderId,
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          orderNumber: this.generateOrderNumber()
        };

        transaction.set(orderRef, order);

        // Create order items
        if (orderData.items && orderData.items.length > 0) {
          for (const item of orderData.items) {
            const itemRef = doc(collection(db, this.orderItemsCollection));
            transaction.set(itemRef, {
              orderId: orderId,
              productId: item.productId,
              productName: item.productName,
              productImage: item.productImage,
              quantity: item.quantity,
              price: item.price,
              total: item.quantity * item.price,
              createdAt: serverTimestamp()
            });
          }
        }

        return orderId;
      });

      return {
        success: true,
        data: { orderId: result }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get order by ID
  async getOrder(orderId) {
    try {
      const orderDoc = await getDoc(doc(db, this.ordersCollection, orderId));
      
      if (!orderDoc.exists()) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      // Get order items
      const itemsQuery = query(
        collection(db, this.orderItemsCollection),
        where('orderId', '==', orderId)
      );
      const itemsSnapshot = await getDocs(itemsQuery);
      const items = [];

      itemsSnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return {
        success: true,
        data: {
          id: orderDoc.id,
          ...orderDoc.data(),
          items: items
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get orders for a user
  async getUserOrders(userId, filters = {}) {
    try {
      let q = query(
        collection(db, this.ordersCollection),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const querySnapshot = await getDocs(q);
      const orders = [];

      for (const orderDoc of querySnapshot.docs) {
        // Get items for each order
        const itemsQuery = query(
          collection(db, this.orderItemsCollection),
          where('orderId', '==', orderDoc.id)
        );
        const itemsSnapshot = await getDocs(itemsQuery);
        const items = [];

        itemsSnapshot.forEach((itemDoc) => {
          items.push({
            id: itemDoc.id,
            ...itemDoc.data()
          });
        });

        orders.push({
          id: orderDoc.id,
          ...orderDoc.data(),
          items: items
        });
      }

      return {
        success: true,
        data: orders
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get all orders (admin only)
  async getAllOrders(filters = {}) {
    try {
      console.log('🔥 orderService.getAllOrders called with filters:', filters);
      
      let q = collection(db, this.ordersCollection);

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters.orderBy) {
        q = query(q, orderBy(filters.orderBy, filters.orderDirection || 'desc'));
      } else {
        q = query(q, orderBy('createdAt', 'desc'));
      }

      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      console.log('📊 Executing Firestore query...');
      const querySnapshot = await getDocs(q);
      console.log('✅ Query successful, processing documents...');
      
      const orders = [];

      for (const orderDoc of querySnapshot.docs) {
        console.log('📄 Processing order:', orderDoc.id);
        
        // Get items for each order
        const itemsQuery = query(
          collection(db, this.orderItemsCollection),
          where('orderId', '==', orderDoc.id)
        );
        const itemsSnapshot = await getDocs(itemsQuery);
        const items = [];

        itemsSnapshot.forEach((itemDoc) => {
          items.push({
            id: itemDoc.id,
            ...itemDoc.data()
          });
        });

        orders.push({
          id: orderDoc.id,
          ...orderDoc.data(),
          items: items
        });
      }

      console.log('🎉 Successfully loaded', orders.length, 'orders');
      
      return {
        success: true,
        data: orders
      };
    } catch (error) {
      console.error('💥 getAllOrders error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update order status
  async updateOrderStatus(orderId, status, notes = '') {
    try {
      const orderRef = doc(db, this.ordersCollection, orderId);
      await updateDoc(orderRef, {
        status: status,
        updatedAt: serverTimestamp(),
        statusHistory: {
          status: status,
          timestamp: serverTimestamp(),
          notes: notes
        }
      });

      return {
        success: true,
        message: 'Order status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update order
  async updateOrder(orderId, orderData) {
    try {
      const orderRef = doc(db, this.ordersCollection, orderId);
      await updateDoc(orderRef, {
        ...orderData,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'Order updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Cancel order
  async cancelOrder(orderId, reason = '') {
    try {
      const orderRef = doc(db, this.ordersCollection, orderId);
      await updateDoc(orderRef, {
        status: 'cancelled',
        cancelReason: reason,
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'Order cancelled successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Process payment
  async processPayment(orderId, paymentData) {
    try {
      const orderRef = doc(db, this.ordersCollection, orderId);
      await updateDoc(orderRef, {
        status: 'paid',
        paymentMethod: paymentData.method,
        paymentId: paymentData.paymentId,
        paidAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'Payment processed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get order statistics (admin only)
  async getOrderStats(period = 'month') {
    try {
      // This is a simplified version
      // For production, consider using Cloud Functions or aggregation queries
      const orders = await this.getAllOrders();
      
      if (!orders.success) {
        return orders;
      }

      const now = new Date();
      const stats = {
        total: orders.data.length,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0
      };

      orders.data.forEach(order => {
        stats[order.status] = (stats[order.status] || 0) + 1;
        if (order.status !== 'cancelled') {
          stats.totalRevenue += order.total || 0;
        }
      });

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Listen to order updates in real-time
  onOrderSnapshot(orderId, callback) {
    const orderRef = doc(db, this.ordersCollection, orderId);
    return onSnapshot(orderRef, (doc) => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data()
        });
      }
    });
  }

  // Listen to user orders in real-time
  onUserOrdersSnapshot(userId, callback) {
    const q = query(
      collection(db, this.ordersCollection),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(orders);
    });
  }

  // Generate order number
  generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp.slice(-6)}${random}`;
  }

  // Calculate order total
  calculateOrderTotal(items, shippingCost = 0, tax = 0) {
    const subtotal = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    return {
      subtotal: subtotal,
      shipping: shippingCost,
      tax: tax,
      total: subtotal + shippingCost + tax
    };
  }
}

export default new OrderService();
