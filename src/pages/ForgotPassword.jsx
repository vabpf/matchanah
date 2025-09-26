import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Clear errors when component mounts or when user starts typing
  useEffect(() => {
    clearError();
  }, []);

  useEffect(() => {
    if (email) {
      clearError();
      setFormErrors({});
    }
  }, [email]);

  const validateForm = () => {
    const errors = {};
    
    if (!email.trim()) {
      errors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Email không đúng định dạng';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await resetPassword(email);
    
    if (result.success) {
      setEmailSent(true);
    }
  };

  const getErrorMessage = (firebaseError) => {
    if (!firebaseError) return '';
    
    // Convert Firebase error messages to Vietnamese
    if (firebaseError.includes('user-not-found')) {
      return 'Không tìm thấy tài khoản với email này';
    } else if (firebaseError.includes('invalid-email')) {
      return 'Email không đúng định dạng';
    } else if (firebaseError.includes('too-many-requests')) {
      return 'Quá nhiều yêu cầu. Vui lòng thử lại sau';
    } else {
      return 'Gửi email thất bại. Vui lòng thử lại';
    }
  };

  if (emailSent) {
    return (
      <div className="forgot-password-page">
        <Header />
        <main className="forgot-password-main">
          <section className="forgot-password-content">
            <div className="container">
              <div className="forgot-password-form-container">
                <div className="success-message">
                  <div className="success-icon">✅</div>
                  <h1>Email đã được gửi!</h1>
                  <p>
                    Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email{' '}
                    <strong>{email}</strong>
                  </p>
                  <p>
                    Vui lòng kiểm tra hộp thư (và cả thư mục spam) để làm theo hướng dẫn 
                    đặt lại mật khẩu.
                  </p>
                  
                  <div className="success-actions">
                    <Link to="/login" className="hero-cta-button">
                      Quay lại đăng nhập
                    </Link>
                    <button 
                      onClick={() => {
                        setEmailSent(false);
                        setEmail('');
                      }}
                      className="secondary-button"
                    >
                      Gửi lại email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="forgot-password-page">
      <Header />
      <main className="forgot-password-main">
        <section className="forgot-password-content">
          <div className="container">
            <div className="forgot-password-form-container">
              <div className="form-header">
                <h1>Quên mật khẩu?</h1>
                <p>
                  Nhập email của bạn và chúng tôi sẽ gửi liên kết 
                  để đặt lại mật khẩu
                </p>
              </div>

              {error && (
                <div className="error-message">
                  {getErrorMessage(error)}
                </div>
              )}

              <form onSubmit={handleSubmit} className="forgot-password-form">
                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={formErrors.email ? 'error' : ''}
                    placeholder="Nhập email của bạn"
                    autoComplete="email"
                  />
                  {formErrors.email && (
                    <span className="field-error">{formErrors.email}</span>
                  )}
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="hero-cta-button forgot-password-button"
                  >
                    {isLoading ? 'Đang gửi email...' : 'Gửi email đặt lại'}
                  </button>
                </div>
              </form>

              <div className="form-footer">
                <p>
                  Nhớ mật khẩu? <Link to="/login">Đăng nhập</Link>
                </p>
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

export default ForgotPassword;