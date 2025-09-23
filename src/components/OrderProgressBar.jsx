import React from 'react';

const statusSteps = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

const statusLabels = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Xác nhận đơn hàng',
  SHIPPED: 'Trên đường giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã huỷ đơn',
};

const getCurrentStepIndex = (status) => {
  const idx = statusSteps.indexOf(status);
  return idx >= 0 ? idx : 0;
};

const OrderProgressBar = ({ status }) => {
  const currentIndex = getCurrentStepIndex(status);
  const stepCount = statusSteps.length - 1; // Không tính CANCELLED trong progress

  // Nếu đơn hàng bị hủy, hiển thị riêng
  if (status === 'CANCELLED') {
    return (
      <div className="order-progress-container">
        <div className="order-progress cancelled">
          <div className="order-step cancelled-step">
            <div className="circle"></div>
            <div className="label">{statusLabels.CANCELLED}</div>
          </div>
        </div>
      </div>
    );
  }

  const validSteps = statusSteps.filter(step => step !== 'CANCELLED');
  const validCurrentIndex = validSteps.indexOf(status);
  const actualIndex = validCurrentIndex >= 0 ? validCurrentIndex : 0;

  return (
    <div className="order-progress-container">
      <div className="order-progress">
        <div
          className="order-progress-fill"
          style={{
            width: `${(actualIndex / (validSteps.length - 1)) * 100}%`,
          }}
        ></div>

        {validSteps.map((step, idx) => (
          <div
            key={step}
            className={`order-step ${idx <= actualIndex ? 'active' : ''}`}
          >
            <div className="circle">
              {idx <= actualIndex && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div className="label">{statusLabels[step]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderProgressBar;