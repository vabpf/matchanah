import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import payOSService from '../services/payosService';
import orderService from '../services/orderService';
import Loading from '../components/Loading';
import Toast from '../components/Toast';
import '../styles/payment.css';

const PaymentReturn = () => {
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Add toast notification
  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  // Remove toast notification
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    const handlePaymentReturn = async () => {
      try {
        console.log('🔥 Payment return page loaded');
        console.log('🔍 URL search params:', Object.fromEntries(searchParams.entries()));

        // Parse return URL parameters
        const returnData = payOSService.parseReturnUrl(searchParams);
        console.log('📊 Parsed return data:', returnData);

        // Check if payment was cancelled
        if (returnData.cancel) {
          setPaymentStatus('cancelled');
          setError('Thanh toán đã bị hủy bởi người dùng');
          addToast('Thanh toán đã bị hủy', 'warning');
          setLoading(false);
          return;
        }

        // Get stored payment data
        const storedPaymentData = localStorage.getItem('pendingPayment');
        if (!storedPaymentData) {
          throw new Error('Không tìm thấy thông tin thanh toán');
        }

        const pendingPayment = JSON.parse(storedPaymentData);
        console.log('📋 Stored payment data:', pendingPayment);

        // Validate return data
        const validation = payOSService.validatePaymentReturn(returnData, pendingPayment);
        if (!validation.valid) {
          throw new Error(`Dữ liệu thanh toán không hợp lệ: ${validation.error}`);
        }

        // Get order code from either return data or stored data
        const orderCode = returnData.orderCode || pendingPayment.orderCode;
        if (!orderCode) {
          throw new Error('Không tìm thấy mã đơn hàng');
        }

        console.log('🔍 Verifying payment status for order:', orderCode);

        // Verify payment status with PayOS
        const paymentVerification = await payOSService.verifyPaymentStatus(orderCode);
        console.log('✅ Payment verification result:', paymentVerification);

        if (!paymentVerification.success) {
          throw new Error(paymentVerification.error || 'Không thể xác minh trạng thái thanh toán');
        }

        const verifiedPayment = paymentVerification.data;

        // Check if payment was successful
        const isPaymentSuccessful = returnData.success || 
                                   verifiedPayment.status === 'PAID' || 
                                   verifiedPayment.status === 'paid';

        console.log('💳 Payment successful?', isPaymentSuccessful);

        if (!isPaymentSuccessful) {
          setPaymentStatus('failed');
          setError('Thanh toán không thành công');
          addToast('Thanh toán thất bại', 'error');
          setLoading(false);
          return;
        }

        // Get the order ID from stored checkout data
        const checkoutData = localStorage.getItem('checkoutData');
        let orderId = null;

        if (checkoutData) {
          const checkout = JSON.parse(checkoutData);
          orderId = checkout.orderId;
          console.log('📦 Found order ID from checkout:', orderId);
        }

        // If we have an order ID, update the existing order
        if (orderId) {
          console.log('📝 Updating existing order status...');
          
          // Mark order as paid using the new method
          const payosData = {
            orderCode: orderCode,
            transactionId: verifiedPayment.transactionId || returnData.id,
            amount: verifiedPayment.amount || returnData.amount,
            additionalDetails: {
              paymentReturnData: returnData,
              verificationData: verifiedPayment
            }
          };

          const orderUpdate = await orderService.markOrderAsPaid(orderId, payosData);

          if (!orderUpdate.success) {
            console.error('❌ Failed to update order:', orderUpdate.error);
            throw new Error('Không thể cập nhật trạng thái đơn hàng');
          }

          // Get updated order data
          const orderResult = await orderService.getOrder(orderId);
          if (orderResult.success) {
            setOrderData(orderResult.data);
          }
        } else {
          console.log('🔍 No order ID found in checkout data, trying to find by order code...');
          
          // Try to find the order by orderCode
          const orderByCodeResult = await orderService.getOrderByCode(orderCode);
          
          if (orderByCodeResult.success) {
            console.log('✅ Found order by code, updating status...');
            
            const foundOrderId = orderByCodeResult.data.id;
            
            // Mark order as paid using the new method
            const payosData = {
              orderCode: orderCode,
              transactionId: verifiedPayment.transactionId || returnData.id,
              amount: verifiedPayment.amount || returnData.amount,
              additionalDetails: {
                paymentReturnData: returnData,
                verificationData: verifiedPayment
              }
            };

            const orderUpdate = await orderService.markOrderAsPaid(foundOrderId, payosData);

            if (orderUpdate.success) {
              setOrderData({
                ...orderByCodeResult.data,
                status: 'Thanh toán thành công',
                paymentMethod: 'PayOS',
                paymentId: verifiedPayment.transactionId || returnData.id,
                orderCode: orderCode.toString(),
                paidAt: new Date().toISOString()
              });
            } else {
              console.error('❌ Failed to update found order:', orderUpdate.error);
              throw new Error('Không thể cập nhật trạng thái đơn hàng');
            }
          } else {
            console.log('⚠️ No order found by code, creating minimal order data for display');
            
            // Create a minimal order data for display
            setOrderData({
              orderCode: orderCode,
              orderNumber: orderCode,
              status: 'Thanh toán thành công',
              paymentMethod: 'PayOS',
              paymentId: verifiedPayment.transactionId || returnData.id,
              total: verifiedPayment.amount || returnData.amount,
              paidAt: new Date().toISOString()
            });
          }
        }

        // Set success status
        setPaymentStatus('success');
        addToast('Thanh toán thành công!', 'success');

        // Clean up stored data
        payOSService.cleanupPaymentData();
        localStorage.removeItem('checkoutData');

        console.log('🎉 Payment processing completed successfully');

      } catch (error) {
        console.error('💥 Payment return error:', error);
        setError(error.message);
        setPaymentStatus('error');
        addToast(error.message, 'error', 5000);
      } finally {
        setLoading(false);
      }
    };

    handlePaymentReturn();
  }, [searchParams]);

  // Handle redirect actions
  const handleViewOrder = () => {
    if (orderData?.id) {
      navigate(`/order/${orderData.id}`);
    } else {
      navigate('/order-history');
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="payment-return-container">
        <div className="payment-return-card">
          <Loading size="large" />
          <p className="loading-text">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-return-container">
      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <div className="payment-return-card">
        {paymentStatus === 'success' && (
          <>
            <div className="success-icon">
              <div className="checkmark">
                <div className="checkmark-circle"></div>
                <div className="checkmark-stem"></div>
                <div className="checkmark-kick"></div>
              </div>
            </div>
            
            <h1 className="payment-title">Thanh toán thành công!</h1>
            <p className="payment-subtitle">
              Cảm ơn bạn đã mua hàng tại Matchanah
            </p>

            {orderData && (
              <div className="payment-details">
                <div className="detail-row">
                  <span className="detail-label">Mã đơn hàng:</span>
                  <span className="detail-value">#{orderData.orderCode || orderData.orderNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Trạng thái:</span>
                  <span className="detail-value status-success">{orderData.status}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phương thức thanh toán:</span>
                  <span className="detail-value">{orderData.paymentMethod}</span>
                </div>
                {orderData.total && (
                  <div className="detail-row">
                    <span className="detail-label">Tổng tiền:</span>
                    <span className="detail-value price">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(orderData.total)}
                    </span>
                  </div>
                )}
                {orderData.paymentId && (
                  <div className="detail-row">
                    <span className="detail-label">Mã giao dịch:</span>
                    <span className="detail-value">{orderData.paymentId}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Thời gian thanh toán:</span>
                  <span className="detail-value">
                    {orderData.paidAt ? new Date(orderData.paidAt).toLocaleString('vi-VN') : 'Vừa xong'}
                  </span>
                </div>
              </div>
            )}

            <div className="action-buttons">
              <button 
                className="btn btn-primary"
                onClick={handleViewOrder}
              >
                Xem đơn hàng
              </button>
              <button 
                className="btn btn-outline"
                onClick={handleContinueShopping}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </>
        )}

        {paymentStatus === 'cancelled' && (
          <>
            <div className="warning-icon">⚠️</div>
            <h1 className="payment-title">Thanh toán đã hủy</h1>
            <p className="payment-subtitle">
              Bạn đã hủy quá trình thanh toán
            </p>
            <div className="action-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/cart')}
              >
                Quay lại giỏ hàng
              </button>
              <button 
                className="btn btn-outline"
                onClick={handleBackToHome}
              >
                Về trang chủ
              </button>
            </div>
          </>
        )}

        {(paymentStatus === 'failed' || paymentStatus === 'error') && (
          <>
            <div className="error-icon">❌</div>
            <h1 className="payment-title">Thanh toán thất bại</h1>
            <p className="payment-subtitle">
              {error || 'Đã xảy ra lỗi trong quá trình thanh toán'}
            </p>
            <div className="action-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/cart')}
              >
                Thử lại thanh toán
              </button>
              <button 
                className="btn btn-outline"
                onClick={handleBackToHome}
              >
                Về trang chủ
              </button>
            </div>
          </>
        )}

        <div className="help-text">
          <p>
            Nếu bạn có bất kỳ câu hỏi nào, vui lòng{' '}
            <button 
              className="link-button"
              onClick={() => navigate('/contact')}
            >
              liên hệ với chúng tôi
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentReturn;
