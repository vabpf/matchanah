import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      setIsLoading(true);
      setError(null);
      
      if (firebaseUser) {
        try {
          // Get additional user data from Firestore
          const userDataResult = await authService.getUserData(firebaseUser.uid);
          
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            emailVerified: firebaseUser.emailVerified,
            ...(userDataResult.success ? userDataResult.data : {})
          };
          
          console.log('🔑 User data loaded:', userData);
          console.log('👨‍💼 Is admin:', userData.isAdmin);
          
          setUser(userData);
          setIsAuthenticated(true);
          
          // Auto-navigate admin users after login
          if (userData.isAdmin && window.location.pathname === '/login') {
            console.log('🚀 Navigating admin to dashboard...');
            setTimeout(() => navigate('/admin'), 100);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          setError('Lỗi tải thông tin người dùng');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        // User state will be updated via the auth state listener
        return { success: true, user: result.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, userData = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.register(email, password, userData);
      
      if (result.success) {
        // User state will be updated via the auth state listener
        return { success: true, user: result.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.logout();
      
      if (!result.success) {
        setError(result.error);
      }
      
      // User state will be updated via the auth state listener
      return result;
    } catch (error) {
      const errorMessage = 'Đăng xuất thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedData) => {
    setError(null);
    
    try {
      const result = await authService.updateUserProfile(updatedData);
      
      if (result.success) {
        // Update local user state
        setUser(prevUser => ({ ...prevUser, ...updatedData }));
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Cập nhật thông tin thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const resetPassword = async (email) => {
    setError(null);
    
    try {
      const result = await authService.resetPassword(email);
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Gửi email đặt lại mật khẩu thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    setError(null);
    
    try {
      const result = await authService.changePassword(currentPassword, newPassword);
      
      if (!result.success) {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Đổi mật khẩu thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    changePassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
