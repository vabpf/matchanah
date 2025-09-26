import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';

export const useOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create order
  const createOrder = async (orderData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await orderService.createOrder({
        ...orderData,
        userId: user?.uid,
        userEmail: user?.email
      });

      if (result.success) {
        // Refresh orders list
        await fetchUserOrders();
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorMsg = 'Lỗi khi tạo đơn hàng';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user orders
  const fetchUserOrders = useCallback(async (filters = {}) => {
    if (!isAuthenticated || !user) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await orderService.getUserOrders(user.uid, filters);

      if (result.success) {
        setOrders(result.data);
        
        // Cache orders data
        localStorage.setItem(`userOrders_${user.uid}`, JSON.stringify({
          data: result.data,
          timestamp: Date.now()
        }));
        
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorMsg = 'Lỗi khi tải danh sách đơn hàng';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  // Fetch all orders (admin only)
  const fetchAllOrders = useCallback(async (filters = {}) => {
    console.log('📦 fetchAllOrders called for user:', user);
    
    if (!user?.isAdmin) {
      console.log('❌ User is not admin, rejecting access');
      return { success: false, error: 'Không có quyền truy cập' };
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Calling orderService.getAllOrders...');
      const result = await orderService.getAllOrders(filters);
      console.log('📝 getAllOrders result:', result);

      if (result.success) {
        setOrders(result.data);
        
        // Cache admin orders data
        localStorage.setItem('adminOrders', JSON.stringify({
          data: result.data,
          timestamp: Date.now()
        }));
        
        return result;
      } else {
        console.log('❌ getAllOrders failed:', result.error);
        setError(result.error);
        return result;
      }
    } catch (err) {
      console.log('💥 getAllOrders exception:', err);
      const errorMsg = 'Lỗi khi tải danh sách đơn hàng';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Get single order
  const fetchOrder = async (orderId) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await orderService.getOrder(orderId);

      if (result.success) {
        // Cache single order
        localStorage.setItem(`order_${orderId}`, JSON.stringify({
          data: result.data,
          timestamp: Date.now()
        }));
        
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorMsg = 'Lỗi khi tải thông tin đơn hàng';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Update order status (admin only)
  const updateOrderStatus = async (orderId, status, notes = '') => {
    if (!user?.isAdmin) {
      return { success: false, error: 'Không có quyền truy cập' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await orderService.updateOrderStatus(orderId, status, notes);

      if (result.success) {
        // Refresh orders list
        await fetchAllOrders();
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorMsg = 'Lỗi khi cập nhật trạng thái đơn hàng';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId, reason = '') => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await orderService.cancelOrder(orderId, reason);

      if (result.success) {
        // Refresh orders list
        if (user?.isAdmin) {
          await fetchAllOrders();
        } else {
          await fetchUserOrders();
        }
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorMsg = 'Lỗi khi hủy đơn hàng';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Get order statistics (admin only)
  const fetchOrderStats = useCallback(async () => {
    if (!user?.isAdmin) {
      return;
    }

    try {
      const result = await orderService.getOrderStats();

      if (result.success) {
        setOrderStats(result.data);
        
        // Cache stats
        localStorage.setItem('orderStats', JSON.stringify({
          data: result.data,
          timestamp: Date.now()
        }));
        
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorMsg = 'Lỗi khi tải thống kê đơn hàng';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [user]);

  // Load cached data on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      // Load cached user orders
      const cacheKey = user.isAdmin ? 'adminOrders' : `userOrders_${user.uid}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          // Use cached data if less than 5 minutes old
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            setOrders(data);
          }
        } catch (err) {
          console.error('Error loading cached orders:', err);
        }
      }

      // Load cached stats for admin
      if (user.isAdmin) {
        const statsCache = localStorage.getItem('orderStats');
        if (statsCache) {
          try {
            const { data, timestamp } = JSON.parse(statsCache);
            if (Date.now() - timestamp < 5 * 60 * 1000) {
              setOrderStats(data);
            }
          } catch (err) {
            console.error('Error loading cached stats:', err);
          }
        }
      }
    }
  }, [user, isAuthenticated]);

  // Auto-fetch orders when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.isAdmin) {
        fetchAllOrders();
        fetchOrderStats();
      } else {
        fetchUserOrders();
      }
    }
  }, [user, isAuthenticated, fetchAllOrders, fetchUserOrders, fetchOrderStats]);

  return {
    orders,
    orderStats,
    isLoading,
    error,
    createOrder,
    fetchUserOrders,
    fetchAllOrders,
    fetchOrder,
    updateOrderStatus,
    cancelOrder,
    fetchOrderStats
  };
};