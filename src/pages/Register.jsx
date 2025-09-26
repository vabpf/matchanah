import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Clear errors when component mounts or when user starts typing
  useEffect(() => {
    clearError();
  }, []);

  useEffect(() => {
    if (Object.keys(formData).some(key => formData[key])) {
      clearError();
      setFormErrors({});
    }
  }, [formData]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'Họ là bắt buộc';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Tên là bắt buộc';
    }
    
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
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      errors.phone = 'Số điện thoại không đúng định dạng';
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'Bạn phải đồng ý với điều khoản sử dụng';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const userData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      displayName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      phone: formData.phone.trim()
    };

    const result = await register(formData.email, formData.password, userData);
    
    if (result.success) {
      navigate('/', { 
        state: { 
          message: 'Đăng ký thành công! Chào mừng bạn đến với Matchanah!' 
        } 
      });
    }
  };

  const getErrorMessage = (firebaseError) => {
    if (!firebaseError) return '';
    
    // Convert Firebase error messages to Vietnamese
    if (firebaseError.includes('email-already-in-use')) {
      return 'Email này đã được sử dụng';
    } else if (firebaseError.includes('invalid-email')) {
      return 'Email không đúng định dạng';
    } else if (firebaseError.includes('operation-not-allowed')) {
      return 'Phương thức đăng ký này chưa được kích hoạt';
    } else if (firebaseError.includes('weak-password')) {
      return 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn';
    } else {
      return 'Đăng ký thất bại. Vui lòng thử lại';
    }
  };

  return (
    <div className="register-page">
      <Header />
      <main className="register-main">
        <section className="register-content">
          <div className="container">
            <div className="register-form-container">
              <div className="form-header">
                <h1>Đăng ký tài khoản</h1>
                <p>Tạo tài khoản để trải nghiệm matcha chất lượng cao</p>
              </div>

              {error && (
                <div className="error-message">
                  {getErrorMessage(error)}
                </div>
              )}

              <form onSubmit={handleSubmit} className="register-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">
                      Họ <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={formErrors.firstName ? 'error' : ''}
                      placeholder="Nhập họ của bạn"
                      autoComplete="given-name"
                    />
                    {formErrors.firstName && (
                      <span className="field-error">{formErrors.firstName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">
                      Tên <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={formErrors.lastName ? 'error' : ''}
                      placeholder="Nhập tên của bạn"
                      autoComplete="family-name"
                    />
                    {formErrors.lastName && (
                      <span className="field-error">{formErrors.lastName}</span>
                    )}
                  </div>
                </div>

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
                  <label htmlFor="phone">Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={formErrors.phone ? 'error' : ''}
                    placeholder="Nhập số điện thoại (không bắt buộc)"
                    autoComplete="tel"
                  />
                  {formErrors.phone && (
                    <span className="field-error">{formErrors.phone}</span>
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
                      placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                      autoComplete="new-password"
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

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    Xác nhận mật khẩu <span className="required">*</span>
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={formErrors.confirmPassword ? 'error' : ''}
                      placeholder="Nhập lại mật khẩu"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <span className="field-error">{formErrors.confirmPassword}</span>
                  )}
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className={formErrors.agreeToTerms ? 'error' : ''}
                    />
                    <span className="checkmark"></span>
                    Tôi đồng ý với{' '}
                    <Link to="/terms" target="_blank">điều khoản sử dụng</Link>{' '}
                    và{' '}
                    <Link to="/privacy" target="_blank">chính sách bảo mật</Link>
                    <span className="required">*</span>
                  </label>
                  {formErrors.agreeToTerms && (
                    <span className="field-error">{formErrors.agreeToTerms}</span>
                  )}
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="hero-cta-button register-button"
                  >
                    {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                  </button>
                </div>
              </form>

              <div className="form-footer">
                <p>
                  Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
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

export default Register;
