import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useShipping } from '../hooks/useShipping';

const Account = () => {
  const { user, logout, updateProfile } = useAuth();
  const { shippingInfo, updateShippingInfo, saveShippingInfo } = useShipping();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    phone: user?.phone || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || ''
  });

  const handleLogout = () => {
    logout();
  };

  const handleProfileUpdate = async () => {
    setIsSaving(true);
    
    try {
      const result = await updateProfile(profileData);
      
      if (result.success) {
        alert('Cập nhật thông tin thành công');
        setIsEditing(false);
      } else {
        alert('Lỗi: ' + result.error);
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveShipping = async () => {
    setIsSaving(true);
    
    try {
      const result = await saveShippingInfo();
      
      if (result.success) {
        alert('Lưu thông tin giao hàng thành công');
      } else {
        alert('Lỗi: ' + result.error);
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu thông tin giao hàng');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="account-page">
      <Header />
      <main className="account-main">
        <section className="account-content">
          <div className="container">
            <h1>Tài khoản của tôi</h1>
            {user ? (
              <div className="account-layout">
                <div className="account-sidebar">
                  <nav className="account-nav">
                    <ul>
                      <li>
                        <Link to="/account" className="nav-link active">
                          Thông tin tài khoản
                        </Link>
                      </li>
                      <li>
                        <Link to="/orders" className="nav-link">
                          Lịch sử đơn hàng
                        </Link>
                      </li>
                      {user.isAdmin && (
                        <li>
                          <Link to="/admin" className="nav-link admin-link">
                            Quản trị Admin
                          </Link>
                        </li>
                      )}
                      <li>
                        <button onClick={handleLogout} className="logout-btn">
                          Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>

                <div className="account-content-area">
                  {/* Profile Information */}
                  <div className="info-section">
                    <h2>Thông tin cá nhân</h2>
                    <div className="info-card">
                      {!isEditing ? (
                        <div className="profile-view">
                          <div className="info-row">
                            <label>Tên hiển thị:</label>
                            <span>{user.displayName || 'Chưa cập nhật'}</span>
                          </div>
                          <div className="info-row">
                            <label>Email:</label>
                            <span>{user.email}</span>
                          </div>
                          <div className="info-row">
                            <label>Họ:</label>
                            <span>{user.firstName || 'Chưa cập nhật'}</span>
                          </div>
                          <div className="info-row">
                            <label>Tên:</label>
                            <span>{user.lastName || 'Chưa cập nhật'}</span>
                          </div>
                          <div className="info-row">
                            <label>Số điện thoại:</label>
                            <span>{user.phone || 'Chưa cập nhật'}</span>
                          </div>
                          <button 
                            onClick={() => setIsEditing(true)} 
                            className="edit-btn"
                          >
                            Chỉnh sửa
                          </button>
                        </div>
                      ) : (
                        <div className="profile-edit">
                          <div className="form-group">
                            <label>Tên hiển thị:</label>
                            <input
                              type="text"
                              value={profileData.displayName}
                              onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                displayName: e.target.value
                              }))}
                            />
                          </div>
                          <div className="form-group">
                            <label>Họ:</label>
                            <input
                              type="text"
                              value={profileData.firstName}
                              onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                firstName: e.target.value
                              }))}
                            />
                          </div>
                          <div className="form-group">
                            <label>Tên:</label>
                            <input
                              type="text"
                              value={profileData.lastName}
                              onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                lastName: e.target.value
                              }))}
                            />
                          </div>
                          <div className="form-group">
                            <label>Số điện thoại:</label>
                            <input
                              type="text"
                              value={profileData.phone}
                              onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                phone: e.target.value
                              }))}
                            />
                          </div>
                          <div className="form-actions">
                            <button 
                              onClick={handleProfileUpdate} 
                              disabled={isSaving}
                              className="save-btn"
                            >
                              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                            <button 
                              onClick={() => {
                                setIsEditing(false);
                                setProfileData({
                                  displayName: user?.displayName || '',
                                  phone: user?.phone || '',
                                  firstName: user?.firstName || '',
                                  lastName: user?.lastName || ''
                                });
                              }} 
                              className="cancel-btn"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div className="info-section">
                    <h2>Thông tin giao hàng mặc định</h2>
                    <div className="info-card">
                      <div className="shipping-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label>Tên người nhận:</label>
                            <input
                              type="text"
                              value={shippingInfo.receiverName}
                              onChange={(e) => updateShippingInfo({ receiverName: e.target.value })}
                              placeholder="Nhập tên người nhận"
                            />
                          </div>
                          <div className="form-group">
                            <label>Số điện thoại:</label>
                            <input
                              type="text"
                              value={shippingInfo.phone}
                              onChange={(e) => updateShippingInfo({ phone: e.target.value })}
                              placeholder="Nhập số điện thoại"
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Tỉnh/Thành phố:</label>
                            <input
                              type="text"
                              value={shippingInfo.province}
                              onChange={(e) => updateShippingInfo({ province: e.target.value })}
                              placeholder="Nhập tỉnh/thành phố"
                            />
                          </div>
                          <div className="form-group">
                            <label>Quận/Huyện:</label>
                            <input
                              type="text"
                              value={shippingInfo.district}
                              onChange={(e) => updateShippingInfo({ district: e.target.value })}
                              placeholder="Nhập quận/huyện"
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Phường/Xã:</label>
                            <input
                              type="text"
                              value={shippingInfo.ward}
                              onChange={(e) => updateShippingInfo({ ward: e.target.value })}
                              placeholder="Nhập phường/xã"
                            />
                          </div>
                          <div className="form-group">
                            <label>Địa chỉ chi tiết:</label>
                            <input
                              type="text"
                              value={shippingInfo.address}
                              onChange={(e) => updateShippingInfo({ address: e.target.value })}
                              placeholder="Nhập địa chỉ chi tiết"
                            />
                          </div>
                        </div>

                        <button 
                          onClick={handleSaveShipping} 
                          disabled={isSaving}
                          className="save-shipping-btn"
                        >
                          {isSaving ? 'Đang lưu...' : 'Lưu thông tin giao hàng'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
