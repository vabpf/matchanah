import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Clear errors when component mounts or when user starts typing
  useEffect(() => {
    clearError();
  }, []);

  useEffect(() => {
    if (formData.email || formData.password) {
      clearError();
      setFormErrors({});
    }
  }, [formData]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email không đúng định dạng';
    }
    
    if (!formData.password) {
      errors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Redirect to the page they were trying to visit, or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  };

  const getErrorMessage = (firebaseError) => {
    if (!firebaseError) return '';
    
    // Convert Firebase error messages to Vietnamese
    if (firebaseError.includes('user-not-found')) {
      return 'Không tìm thấy tài khoản với email này';
    } else if (firebaseError.includes('wrong-password')) {
      return 'Mật khẩu không đúng';
    } else if (firebaseError.includes('invalid-email')) {
      return 'Email không đúng định dạng';
    } else if (firebaseError.includes('user-disabled')) {
      return 'Tài khoản đã bị vô hiệu hóa';
    } else if (firebaseError.includes('too-many-requests')) {
      return 'Quá nhiều lần thử. Vui lòng thử lại sau';
    } else {
      return 'Đăng nhập thất bại. Vui lòng thử lại';
    }
  };

  return (
    <div className="login-page">
      <Header />
      <main className="login-main">
        <section className="login-content">
          <div className="container">
            <div className="login-form-container">
              <div className="form-header">
                <h1>Đăng nhập</h1>
                <p>Chào mừng bạn trở lại với Matchanah</p>
              </div>

              {error && (
                <div className="error-message">
                  {getErrorMessage(error)}
                </div>
              )}

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={formErrors.email ? 'error' : ''}
                    placeholder="Nhập email của bạn"
                    autoComplete="email"
                  />
                  {formErrors.email && (
                    <span className="field-error">{formErrors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    Mật khẩu <span className="required">*</span>
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={formErrors.password ? 'error' : ''}
                      placeholder="Nhập mật khẩu của bạn"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {formErrors.password && (
                    <span className="field-error">{formErrors.password}</span>
                  )}
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="hero-cta-button login-button"
                  >
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </button>
                </div>

                <div className="form-links">
                  <Link to="/forgot-password" className="forgot-password-link">
                    Quên mật khẩu?
                  </Link>
                </div>
              </form>

              <div className="form-footer">
                <p>
                  Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
