import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

export const useShipping = () => {
  const { user, isAuthenticated } = useAuth();
  const [shippingInfo, setShippingInfo] = useState({
    receiverName: '',
    phone: '',
    address: '',
    province: '',
    district: '',
    ward: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load shipping info from user profile or localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      // Try to get from user profile first
      if (user.shippingInfo) {
        setShippingInfo({
          receiverName: user.shippingInfo.receiverName || user.displayName || '',
          phone: user.shippingInfo.phone || user.phone || '',
          address: user.shippingInfo.address || '',
          province: user.shippingInfo.province || '',
          district: user.shippingInfo.district || '',
          ward: user.shippingInfo.ward || ''
        });
      } else {
        // Fallback to basic user info
        setShippingInfo(prev => ({
          ...prev,
          receiverName: user.displayName || '',
          phone: user.phone || ''
        }));
      }
    } else {
      // Load from localStorage for guest users
      const cached = localStorage.getItem('guestShippingInfo');
      if (cached) {
        try {
          const parsedInfo = JSON.parse(cached);
          setShippingInfo(parsedInfo);
        } catch (err) {
          console.error('Error parsing cached shipping info:', err);
        }
      }
    }
  }, [user, isAuthenticated]);

  // Update shipping info
  const updateShippingInfo = (newInfo) => {
    const updatedInfo = { ...shippingInfo, ...newInfo };
    setShippingInfo(updatedInfo);

    if (!isAuthenticated) {
      // Save to localStorage for guest users
      localStorage.setItem('guestShippingInfo', JSON.stringify(updatedInfo));
    }
  };

  // Save shipping info to user profile
  const saveShippingInfo = async (infoToSave = null) => {
    if (!isAuthenticated || !user) {
      return { success: false, error: 'Bạn cần đăng nhập để lưu thông tin' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const shippingData = infoToSave || shippingInfo;
      const result = await authService.updateUserProfile({
        shippingInfo: shippingData
      });

      if (result.success) {
        return { success: true, message: 'Lưu thông tin giao hàng thành công' };
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorMsg = 'Lỗi khi lưu thông tin giao hàng';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Clear shipping info
  const clearShippingInfo = () => {
    setShippingInfo({
      receiverName: '',
      phone: '',
      address: '',
      province: '',
      district: '',
      ward: ''
    });

    if (!isAuthenticated) {
      localStorage.removeItem('guestShippingInfo');
    }
  };

  // Validate shipping info
  const validateShippingInfo = (info = null) => {
    const dataToValidate = info || shippingInfo;
    const required = ['receiverName', 'phone', 'address', 'province', 'district', 'ward'];
    
    for (const field of required) {
      if (!dataToValidate[field] || dataToValidate[field].trim() === '') {
        return {
          isValid: false,
          missingField: field,
          message: `Vui lòng nhập ${getFieldName(field)}`
        };
      }
    }

    return { isValid: true };
  };

  return {
    shippingInfo,
    isLoading,
    error,
    updateShippingInfo,
    saveShippingInfo,
    clearShippingInfo,
    validateShippingInfo
  };
};

// Helper function to get Vietnamese field names
const getFieldName = (field) => {
  const fieldNames = {
    receiverName: 'tên người nhận',
    phone: 'số điện thoại',
    address: 'địa chỉ chi tiết',
    province: 'tỉnh/thành phố',
    district: 'quận/huyện',
    ward: 'phường/xã'
  };
  return fieldNames[field] || field;
};