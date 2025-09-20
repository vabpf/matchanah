import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const Account = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="account-page">
      <Header />
      <main className="account-main">
        <section className="account-content">
          <div className="container">
            <h1>Tài khoản của tôi</h1>
            {user ? (
              <div className="user-info">
                <p>Tên: {user.name}</p>
                <p>Email: {user.email}</p>
                <button onClick={handleLogout} className="hero-cta-button">
                  Đăng xuất
                </button>
              </div>
            ) : (
              <p>Vui lòng đăng nhập để xem thông tin tài khoản.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
